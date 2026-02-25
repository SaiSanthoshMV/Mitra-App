// app/api/verify-email/send-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServerSupabase } from '@/lib/supabaseServer';

// Generate a random 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        console.log('🔵 Send OTP API called');

        // Check if user is authenticated
        const session = await getServerSession(authOptions);

        console.log('🔵 Session check:', {
            hasSession: !!session,
            email: session?.user?.email
        });

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in first.' },
                { status: 401 }
            );
        }

        const { collegeEmail } = await request.json();

        console.log('🔵 College email received:', collegeEmail);

        // Validate college email format
        if (!collegeEmail || typeof collegeEmail !== 'string') {
            return NextResponse.json(
                { error: 'College email is required' },
                { status: 400 }
            );
        }

        const trimmedEmail = collegeEmail.trim().toLowerCase();

        if (!trimmedEmail.endsWith('@kmit.edu.in')) {
            return NextResponse.json(
                { error: 'Email must be from @kmit.edu.in domain' },
                { status: 400 }
            );
        }

        // Check if college email is already used by another user
        const supabase = createServerSupabase();

        console.log('🔵 Checking for existing user with college email...');

        const { data: existingUser, error: existingUserError } = await supabase
            .from('users')
            .select('google_email')
            .eq('college_email', trimmedEmail)
            .neq('google_email', session.user.email)
            .maybeSingle();

        if (existingUserError) {
            console.error('❌ Error checking existing user:', existingUserError);
        }

        if (existingUser) {
            console.log('❌ College email already in use');
            return NextResponse.json(
                { error: 'This college email is already verified by another account' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        console.log('🔵 Generated OTP:', otp);
        console.log('🔵 Storing OTP in database...');

        // Store OTP in database
        const { error: upsertError } = await supabase
            .from('email_verifications')
            .upsert({
                google_email: session.user.email,
                college_email: trimmedEmail,
                otp: otp,
                expires_at: expiresAt.toISOString(),
                verified: false,
            }, {
                onConflict: 'google_email',
            });

        if (upsertError) {
            console.error('❌ Error storing OTP:', upsertError);
            console.error('❌ Full error details:', JSON.stringify(upsertError, null, 2));
            return NextResponse.json(
                { error: `Failed to generate verification code: ${upsertError.message || 'Database error'}` },
                { status: 500 }
            );
        }

        console.log('✅ OTP stored successfully');

        // Send OTP via email using Resend
        let emailSent = false;
        let emailError = null;

        try {
            const resendApiKey = process.env.RESEND_API_KEY;
            const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

            if (resendApiKey) {
                const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: fromEmail,
                        to: trimmedEmail,
                        subject: 'Your KMIT Verification Code',
                        html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                    .otp-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                                    .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace; }
                                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="header">
                                        <h1>🔐 Email Verification</h1>
                                        <p>KMIT Materials Platform</p>
                                    </div>
                                    <div class="content">
                                        <h2>Hello!</h2>
                                        <p>You requested a verification code to access the KMIT Materials upload feature.</p>
                                        
                                        <div class="otp-box">
                                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your verification code is:</p>
                                            <div class="otp-code">${otp}</div>
                                        </div>

                                        <p><strong>⏰ This code will expire in 10 minutes.</strong></p>
                                        
                                        <p>If you didn't request this code, you can safely ignore this email.</p>
                                        
                                        <div class="footer">
                                            <p>This is an automated message from KMIT Materials Platform</p>
                                            <p>Please do not reply to this email</p>
                                        </div>
                                    </div>
                                </div>
                            </body>
                            </html>
                        `,
                    }),
                });

                if (response.ok) {
                    emailSent = true;
                    console.log('✅ Email sent successfully via Resend');
                } else {
                    const errorData = await response.json();
                    console.error('❌ Resend API error:', errorData);
                    emailError = errorData;
                }
            } else {
                console.log('⚠️ RESEND_API_KEY not configured - showing OTP in console');
            }
        } catch (err) {
            console.error('❌ Error sending email:', err);
            emailError = err;
        }

        // Fallback: Display OTP in terminal if email sending failed or not configured
        if (!emailSent) {
            console.log('\n' + '='.repeat(70));
            console.log('🔐 VERIFICATION CODE (Email not sent - check console)');
            console.log('='.repeat(70));
            console.log(`📧 College Email: ${trimmedEmail}`);
            console.log(`🔑 OTP Code: ${otp}`);
            console.log(`⏰ Expires: ${expiresAt.toLocaleString()}`);
            console.log(`⏱️  Valid for: 10 minutes`);
            if (emailError) {
                console.log(`⚠️  Email Error: ${emailError}`);
            }
            console.log('='.repeat(70) + '\n');
        }

        console.log('✅ Send OTP completed successfully');

        return NextResponse.json({
            success: true,
            message: emailSent
                ? 'Verification code sent to your college email!'
                : 'Verification code generated! Check your terminal for the OTP.',
            emailSent,
            // In development, include OTP in response for testing
            ...(process.env.NODE_ENV === 'development' && {
                otp,
                dev_note: emailSent
                    ? 'Email sent! OTP also shown here for testing'
                    : 'Email not configured - OTP shown in terminal'
            }),
        });

    } catch (error) {
        console.error('❌ Send OTP error:', error);
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
