// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createServerSupabase } from '@/lib/supabaseServer';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // STEP 1: Allow ANY Google account (no domain restriction)
            // This is for IDENTITY only
            const email = user.email || '';

            if (!email) {
                console.error('No email provided in OAuth');
                return false;
            }

            console.log('OAuth Sign In:', { email });

            // STEP 3: Create user record on first login
            try {
                const supabase = createServerSupabase();

                // Check if user exists
                const { data: existingUser, error: fetchError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('google_email', email)
                    .maybeSingle();

                console.log('Existing user check:', {
                    exists: !!existingUser,
                    error: fetchError?.message
                });

                // If user doesn't exist, create new record
                if (!existingUser) {
                    console.log('Creating new user record for:', email);

                    const { data: newUser, error: insertError } = await supabase
                        .from('users')
                        .insert({
                            google_email: email,
                            is_verified: false,
                        })
                        .select()
                        .single();

                    if (insertError) {
                        console.error('Error creating user record:', insertError);
                    } else {
                        console.log('User record created successfully:', newUser);
                    }
                }
            } catch (error) {
                console.error('Error in signIn callback:', error);
                // Continue sign-in even if DB operation fails
            }

            return true;
        },
        async session({ session, token }) {
            // Add user info to session including verification status
            if (session.user) {
                session.user.email = token.email as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.collegeEmail = token.collegeEmail as string | null;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
            }

            // Fetch latest verification status from DB
            if (token.email) {
                try {
                    const supabase = createServerSupabase();
                    const { data: userData } = await supabase
                        .from('users')
                        .select('is_verified, college_email')
                        .eq('google_email', token.email)
                        .single();

                    if (userData) {
                        token.isVerified = userData.is_verified;
                        token.collegeEmail = userData.college_email;
                    }
                } catch (error) {
                    console.error('Error fetching user verification status:', error);
                }
            }

            return token;
        },
    },
    pages: {
        signIn: '/materials', // Redirect to materials page on sign in
        error: '/materials', // Redirect to materials page on error
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
