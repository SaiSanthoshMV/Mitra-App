// app/materials/upload/page.tsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabaseServer';
import UploadClient from './UploadClient';
import CollegeEmailVerification from '@/components/CollegeEmailVerification';

export default async function UploadPage() {
    // STEP 4: Upload Page Access Control

    // Check for authenticated session
    const session = await getServerSession(authOptions);

    // If NOT logged in → redirect to materials page (they'll see login option there)
    if (!session || !session.user?.email) {
        redirect('/materials');
    }

    const googleEmail = session.user.email;

    // Fetch user verification status from database
    const supabase = createServerSupabase();

    const { data: user, error } = await supabase
        .from('users')
        .select('is_verified, college_email')
        .eq('google_email', googleEmail)
        .single();

    // Debug logging
    console.log('Upload Page Debug:', {
        googleEmail,
        user,
        error: error?.message,
        hasUser: !!user,
        isVerified: user?.is_verified
    });

    // If user record doesn't exist, create it now (fallback)
    if (error || !user) {
        console.log('User record not found, creating...');

        const { error: createError } = await supabase
            .from('users')
            .insert({
                google_email: googleEmail,
                is_verified: false,
            })
            .select('is_verified, college_email')
            .single();

        if (createError) {
            console.error('Error creating user record:', createError);
            // Show verification screen anyway
            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <CollegeEmailVerification />
                </div>
            );
        }

        // Use the newly created user
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <CollegeEmailVerification />
            </div>
        );
    }

    // If logged in BUT is_verified = false → Show verification screen
    if (!user.is_verified) {
        console.log('User not verified, showing verification screen');
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <CollegeEmailVerification />
            </div>
        );
    }

    // If is_verified = true → Show upload form
    console.log('User verified, showing upload form');
    return <UploadClient userEmail={user.college_email || googleEmail} />;
}
