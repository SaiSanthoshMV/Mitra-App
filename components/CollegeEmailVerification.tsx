// components/CollegeEmailVerification.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

interface VerificationStep {
    step: 'input' | 'otp' | 'success';
    message?: string;
}

export default function CollegeEmailVerification() {
    const [collegeEmail, setCollegeEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [verificationStep, setVerificationStep] = useState<VerificationStep>({ step: 'input' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Validate college email format
    const validateEmail = (email: string): boolean => {
        const trimmedEmail = email.trim().toLowerCase();
        return trimmedEmail.endsWith('@kmit.edu.in') && trimmedEmail.includes('@');
    };

    // Handle sending verification OTP
    const handleSendOTP = async () => {
        setError('');

        // Validate email format
        if (!validateEmail(collegeEmail)) {
            setError('Please enter a valid @kmit.edu.in email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/verify-email/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ collegeEmail: collegeEmail.trim().toLowerCase() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setVerificationStep({
                step: 'otp',
                message: 'Verification code sent to your email!'
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOTP = async () => {
        setError('');

        if (!otp.trim() || otp.trim().length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/verify-email/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collegeEmail: collegeEmail.trim().toLowerCase(),
                    otp: otp.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid OTP');
            }

            setVerificationStep({ step: 'success', message: 'Email verified successfully!' });

            // Reload page after 2 seconds to update session
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Render based on verification step
    if (verificationStep.step === 'success') {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl">Email Verified!</CardTitle>
                    <CardDescription>
                        Your college email has been successfully verified. Redirecting...
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (verificationStep.step === 'otp') {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
                    <CardDescription>
                        A 6-digit code has been sent to <strong>{collegeEmail}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {verificationStep.message && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                    {verificationStep.message}
                                </p>
                            </div>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                ⏰ The code will expire in 10 minutes. Check your inbox and spam folder.
                            </p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="otp">6-Digit OTP</Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            className="text-center text-2xl tracking-widest"
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otp.length !== 6}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify OTP'
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => {
                            setVerificationStep({ step: 'input' });
                            setOtp('');
                            setError('');
                        }}
                        className="w-full"
                        disabled={isLoading}
                    >
                        Change Email
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Default: Email input step
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Verify Your College Email</CardTitle>
                <CardDescription>
                    To upload materials, please verify your KMIT college email address
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="collegeEmail">College Email</Label>
                    <Input
                        id="collegeEmail"
                        type="email"
                        placeholder="your.name@kmit.edu.in"
                        value={collegeEmail}
                        onChange={(e) => setCollegeEmail(e.target.value)}
                        disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                        Must be a valid @kmit.edu.in email address
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {verificationStep.message && !error && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                        <CheckCircle2 className="w-4 h-4" />
                        {verificationStep.message}
                    </div>
                )}

                <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || !collegeEmail.trim()}
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending OTP...
                        </>
                    ) : (
                        <>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Verification Code
                        </>
                    )}
                </Button>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Why verify?</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Ensures only KMIT students can upload materials</li>
                        <li>• Protects the quality of shared resources</li>
                        <li>• One-time verification process</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
