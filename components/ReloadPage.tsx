"use client";

import React from 'react'

function ReloadPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[10vh] text-center">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                We encountered an issue loading the resources. Please try refreshing the page.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="
                    inline-flex items-center gap-2 px-6 py-3
                    rounded-full font-medium
                    bg-white/70 dark:bg-slate-800/60
                    border border-cyan-400 dark:border-cyan-500
                    text-slate-700 dark:text-slate-200
                    backdrop-blur-md shadow-md
                    hover:bg-cyan-500 hover:text-white hover:shadow-lg
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900
                    "
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reload Page
            </button>
        </div>
    )
}

export default ReloadPage