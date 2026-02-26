// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToR2 } from '@/lib/r2Client';
import { createServerSupabase } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
    try {
        // STEP 8: Connect Upload Logic - Check authentication & verification
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized. Please log in first.' },
                { status: 401 }
            );
        }

        const googleEmail = session.user.email;

        // Fetch user verification status
        const supabase = createServerSupabase();

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('is_verified, college_email')
            .eq('google_email', googleEmail)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user is verified
        if (!user.is_verified) {
            return NextResponse.json(
                { error: 'Please verify your college email before uploading materials' },
                { status: 403 }
            );
        }

        // Parse form data
        const formData = await request.formData();

        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const subject = formData.get('subject') as string;
        const semester = formData.get('semester') as string;

        // Validate required fields
        if (!file || !title || !subject || !semester) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF, PPT, DOC, and DOCX files are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (10MB limit for better experience)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File size exceeds 10 MB limit' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `materials/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to R2
        const fileUrl = await uploadToR2(buffer, fileName, file.type);

        // Save metadata to Supabase with verified college email
        const { data, error: dbError } = await supabase
            .from('study_materials')
            .insert({
                title: title.trim(),
                subject: subject.trim(),
                semester: semester,
                file_url: fileUrl,
                uploaded_by: user.college_email, // Use verified college email
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            // Note: In production, you might want to delete the R2 file if DB insert fails
            throw new Error('Failed to save material metadata: ' + dbError.message);
        }

        return NextResponse.json({
            success: true,
            message: 'Material uploaded successfully',
            data: data,
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
                success: false,
            },
            { status: 500 }
        );
    }
}
