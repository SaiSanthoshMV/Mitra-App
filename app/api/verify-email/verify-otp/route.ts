// app/api/verify-email/verify-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabaseServer';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
    try {
        // Check if user is authenticated via NextAuth
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in first.' },
                { status: 401 }
            );
        }

        const { collegeEmail, otp } = await request.json();

        // Validate inputs
        if (!collegeEmail || !otp) {
            return NextResponse.json(
                { error: 'College email and OTP are required' },
                { status: 400 }
            );
        }

        const trimmedEmail = collegeEmail.trim().toLowerCase();
        const trimmedOTP = otp.trim();

        if (trimmedOTP.length !== 6) {
            return NextResponse.json(
                { error: 'OTP must be 6 digits' },
                { status: 400 }
            );
        }

        console.log('🔵 Verifying OTP via Supabase Auth...');

        // Verify OTP using Supabase Auth
        const { data, error } = await supabase.auth.verifyOtp({
            email: trimmedEmail,
            token: trimmedOTP,
            type: 'email',
        });

        if (error) {
            console.error('❌ Supabase Auth verification error:', error);
            return NextResponse.json(
                { error: 'Invalid or expired verification code. Please try again.' },
                { status: 400 }
            );
        }

        if (!data) {
            return NextResponse.json(
                { error: 'Verification failed. Please request a new code.' },
                { status: 400 }
            );
        }

        console.log('✅ OTP verified successfully');

        // Update our custom users table
        const serverSupabase = createServerSupabase();

        // Mark verification as complete in email_verifications table
        const { error: updateVerificationError } = await serverSupabase
            .from('email_verifications')
            .update({ verified: true })
            .eq('google_email', session.user.email)
            .eq('college_email', trimmedEmail);

        if (updateVerificationError) {
            console.error('⚠️ Error updating verification record:', updateVerificationError);
            // Continue anyway - main verification succeeded
        }

        // Update user record with verified college email
        const { error: updateUserError } = await serverSupabase
            .from('users')
            .update({
                college_email: trimmedEmail,
                is_verified: true,
            })
            .eq('google_email', session.user.email);

        if (updateUserError) {
            console.error('❌ Error updating user:', updateUserError);
            return NextResponse.json(
                { error: 'Failed to update user verification status' },
                { status: 500 }
            );
        }

        console.log('✅ User verification completed');

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully! You can now upload materials.',
        });

    } catch (error) {
        console.error('❌ Verify OTP error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
