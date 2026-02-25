// types/next-auth.d.ts
// TypeScript definitions for NextAuth session

import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            email: string;
            name?: string | null;
            image?: string | null;
            isVerified?: boolean;
            collegeEmail?: string | null;
        };
    }

    interface User {
        email: string;
        isVerified?: boolean;
        collegeEmail?: string | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        email?: string;
        isVerified?: boolean;
        collegeEmail?: string | null;
    }
}
