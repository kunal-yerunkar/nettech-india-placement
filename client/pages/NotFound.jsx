import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full"></div>
                        <AlertCircle className="w-24 h-24 text-red-400 relative" />
                    </div>
                </div>

                {/* 404 Text */}
                <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-4">
                    404
                </h1>

                {/* Description */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Page Not Found
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        Go to Home
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-12 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-gray-400">
                        If you believe this is an error, please{' '}
                        <a href="/contact" className="text-blue-400 hover:text-blue-300 font-semibold">
                            contact us
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
