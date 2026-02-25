// app/api/verify-email/verify-otp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServerSupabase } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
    try {
        // Check if user is authenticated
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

        // Verify OTP from database
        const supabase = createServerSupabase();

        const { data: verification, error: fetchError } = await supabase
            .from('email_verifications')
            .select('*')
            .eq('google_email', session.user.email)
            .eq('college_email', trimmedEmail)
            .single();

        if (fetchError || !verification) {
            return NextResponse.json(
                { error: 'No verification request found. Please request a new OTP.' },
                { status: 404 }
            );
        }

        // Check if already verified
        if (verification.verified) {
            return NextResponse.json(
                { error: 'Email already verified' },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        const expiresAt = new Date(verification.expires_at);
        if (expiresAt < new Date()) {
            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (verification.otp !== trimmedOTP) {
            return NextResponse.json(
                { error: 'Invalid OTP. Please check and try again.' },
                { status: 400 }
            );
        }

        // Mark verification as complete
        const { error: updateVerificationError } = await supabase
            .from('email_verifications')
            .update({ verified: true })
            .eq('google_email', session.user.email);

        if (updateVerificationError) {
            console.error('Error updating verification:', updateVerificationError);
            return NextResponse.json(
                { error: 'Failed to complete verification' },
                { status: 500 }
            );
        }

        // Update user record
        const { error: updateUserError } = await supabase
            .from('users')
            .update({
                college_email: trimmedEmail,
                is_verified: true,
            })
            .eq('google_email', session.user.email);

        if (updateUserError) {
            console.error('Error updating user:', updateUserError);
            return NextResponse.json(
                { error: 'Failed to update user verification status' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully! You can now upload materials.',
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
