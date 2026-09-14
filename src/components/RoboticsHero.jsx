'use client';

import React from 'react';

const SPLINE_URL =
    'https://my.spline.design/nexbotrobotcharacterconcept-1SRoHllWH0hyS39jN1zCWFEX/';

export default function RawModelHero() {
    return (
        <main className="relative h-screen w-full overflow-hidden bg-[#E5E5E5]">
            <iframe
                src={SPLINE_URL}
                title="Nexbot robotics 3D model"
                className="h-full w-full border-0 pointer-events-auto"
                allow="fullscreen"
            />

            {/* Radial corner gradient to completely cover the badge */}
            <div
                className="pointer-events-none absolute bottom-0 right-0 z-20 h-28 w-80"
                style={{
                    background:
                        'radial-gradient(ellipse at bottom right, #E5E5E5 0%, #E5E5E5 60%, rgba(229, 229, 229, 0.85) 80%, transparent 100%)',
                }}
            />
        </main>
    );
}