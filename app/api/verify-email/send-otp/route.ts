// app/api/verify-email/send-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabaseServer';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        console.log('🔵 Send OTP API called');

        // Check if user is authenticated via NextAuth (Google OAuth)
        const session = await getServerSession(authOptions);

        console.log('🔵 Session check:', {
            hasSession: !!session,
            email: session?.user?.email
        });

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in with Google first.' },
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
        const serverSupabase = createServerSupabase();

        console.log('🔵 Checking for existing user with college email...');

        const { data: existingUser, error: existingUserError } = await serverSupabase
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

        console.log('🔵 Sending OTP via Supabase Auth...');

        // Send OTP via Supabase Auth - Force EMAIL OTP (6-digit code)
        const { error } = await supabase.auth.signInWithOtp({
            email: trimmedEmail,
            options: {
                shouldCreateUser: true,
                // Don't set emailRedirectTo - this prevents magic link
                data: {
                    // Store metadata that this is for verification only
                    verification_type: 'college_email',
                    google_email: session.user.email,
                }
            },
        });

        if (error) {
            console.error('❌ Supabase Auth OTP error:', error);
            return NextResponse.json(
                { error: 'Failed to send verification code. Please try again.' },
                { status: 500 }
            );
        }

        console.log('✅ OTP sent via Supabase Auth');

        // Store verification attempt in our custom table for tracking
        const { error: upsertError } = await serverSupabase
            .from('email_verifications')
            .upsert({
                google_email: session.user.email,
                college_email: trimmedEmail,
                otp: 'supabase_auth', // Placeholder - actual OTP managed by Supabase
                expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
                verified: false,
            }, {
                onConflict: 'google_email',
            });

        if (upsertError) {
            console.error('❌ Error storing verification record:', upsertError);
            // Continue anyway - OTP was sent
        }

        console.log('✅ Send OTP completed successfully');

        return NextResponse.json({
            success: true,
            message: 'Verification code sent to your college email!',
            emailSent: true,
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
