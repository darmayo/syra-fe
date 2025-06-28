import React, { useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function HomePage() {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/';
        }
    }, []);

    const handleGoogleSignIn = () => {
        window.location.href = `${API_BASE_URL}/api/auth/login`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <img
                src="/Logo Image.png"
                alt="SYRA Logo"
                className="w-24 h-24 mb-8"
            />
            <h1 className="text-3xl font-bold mb-6 text-gray-900">SYRA - Secure Your Realm Always</h1>
            <button
                onClick={handleGoogleSignIn}
                className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-medium text-lg shadow-lg hover:bg-blue-50 transition"
            >
                <svg className="w-6 h-6" viewBox="0 0 48 48">
                    <g>
                        <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 32.6 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-17.5 0-1.4-.1-2.7-.5-3.5z" />
                        <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 5.1 29.6 3 24 3c-7.5 0-14 4.1-17.7 10.2z" />
                        <path fill="#FBBC05" d="M24 45c5.2 0 9.9-1.7 13.5-4.7l-6.2-5.1C29.7 36.5 27 37.5 24 37.5c-6.1 0-11.2-4.1-13-9.6l-7 5.4C7.9 41.2 15.4 45 24 45z" />
                        <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-4.6 0-8.4-3.8-8.4-8.5s3.8-8.5 8.4-8.5c2.5 0 4.7.9 6.3 2.4l6.2-6.2C36.7 7.1 30.7 4 24 4c-9.9 0-18 8.1-18 18s8.1 18 18 18c8.6 0 15.8-6.1 17.7-14.2z" />
                    </g>
                </svg>
                Sign in with Google
            </button>
        </div>
    );
}