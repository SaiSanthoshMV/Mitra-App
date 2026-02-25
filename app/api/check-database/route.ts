// app/api/check-database/route.ts
// Quick database check endpoint

import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseServer';

export async function GET() {
    try {
        const supabase = createServerSupabase();

        const results: any = {
            timestamp: new Date().toISOString(),
            checks: {},
            errors: []
        };

        // Check users table
        try {
            const { data: users, error: usersError } = await supabase
                .from('users')
                .select('*')
                .limit(1);

            results.checks.users = {
                exists: !usersError,
                error: usersError?.message,
                sampleData: users
            };
        } catch (e) {
            results.checks.users = {
                exists: false,
                error: e instanceof Error ? e.message : 'Unknown error'
            };
        }

        // Check email_verifications table
        try {
            const { data: verifications, error: verificationsError } = await supabase
                .from('email_verifications')
                .select('*')
                .limit(1);

            results.checks.email_verifications = {
                exists: !verificationsError,
                error: verificationsError?.message,
                sampleData: verifications
            };
        } catch (e) {
            results.checks.email_verifications = {
                exists: false,
                error: e instanceof Error ? e.message : 'Unknown error'
            };
        }

        // Check environment variables
        results.checks.environment = {
            NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            NODE_ENV: process.env.NODE_ENV
        };

        return NextResponse.json(results, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
