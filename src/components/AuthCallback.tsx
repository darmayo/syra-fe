import React, { useEffect } from 'react';

export function AuthCallback() {
    useEffect(() => {
        // Example: token is returned as ?token=... or #token=...
        const params = new URLSearchParams(window.location.search);
        let token = params.get('token');

        // If token is in hash (e.g., #access_token=...), parse it
        if (!token && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            token = hashParams.get('access_token') || hashParams.get('token');
        }

        if (token) {
            localStorage.setItem('token', token);
            window.location.replace('/');
        } else {
            // Optionally show an error or redirect to login
            window.location.replace('/');
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Signing you in...
                </h2>
                <p className="text-sm text-gray-600">
                    Please wait while we complete your authentication.
                </p>
            </div>
        </div>
    );
}