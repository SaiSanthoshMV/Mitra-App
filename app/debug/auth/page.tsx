// app/debug/auth/page.tsx
// TEMPORARY DEBUG PAGE - Remove after testing

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabaseServer';

export default async function DebugAuthPage() {
    const session = await getServerSession(authOptions);

    let userData = null;
    let userError = null;
    let allUsers = null;

    if (session?.user?.email) {
        const supabase = createServerSupabase();

        // Try to fetch specific user
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('google_email', session.user.email)
            .maybeSingle();

        userData = data;
        userError = error;

        // Fetch all users (for debugging)
        const { data: allUsersData } = await supabase
            .from('users')
            .select('*')
            .limit(10);

        allUsers = allUsersData;
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">🔍 Auth Debug Page</h1>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Session Info</h2>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">User Record</h2>
                    {userError && (
                        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-4">
                            <p className="text-red-700 dark:text-red-200">
                                Error: {userError.message}
                            </p>
                        </div>
                    )}
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
                        {JSON.stringify(userData, null, 2)}
                    </pre>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">All Users (Last 10)</h2>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
                        {JSON.stringify(allUsers, null, 2)}
                    </pre>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
                    <ul className="space-y-2">
                        <li>✅ NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : '❌ Missing'}</li>
                        <li>✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : '❌ Missing'}</li>
                        <li>✅ SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : '⚠️ Missing (using anon key)'}</li>
                        <li>✅ GOOGLE_CLIENT_ID: {process.env.GOOGLE_CLIENT_ID ? 'Set' : '❌ Missing'}</li>
                        <li>✅ NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'Set' : '❌ Missing'}</li>
                    </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">📝 Instructions</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Check if session exists and has your email</li>
                        <li>Check if user record exists in database</li>
                        <li>If user record is null, there&apos;s a database issue</li>
                        <li>Check environment variables are set correctly</li>
                        <li>Check server console for any error messages</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
