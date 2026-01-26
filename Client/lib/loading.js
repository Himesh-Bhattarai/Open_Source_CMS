import React, { useState, useEffect } from 'react';

export default function LoadingScreen() {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        // Flip animation for F (up to down)
        const flipInterval = setInterval(() => {
            setIsFlipped(prev => !prev);
        }, 2000);

        return () => {
            clearInterval(flipInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
            {/* Logo Container */}
            <div className="mb-6">
                <div className="relative w-16 h-16 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center">
                    {/* C - Static */}
                    <span className="absolute left-4 text-2xl font-bold text-white">
                        C
                    </span>

                    {/* F - Flipping up to down */}
                    <span
                        className="absolute right-4 text-2xl font-bold text-white transition-transform duration-300"
                        style={{
                            transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
                        }}
                    >
                        F
                    </span>
                </div>
            </div>

            {/* Website Name */}
            <h1 className="text-xl font-semibold text-white">
                Content Flow
            </h1>
        </div>
    );
}

