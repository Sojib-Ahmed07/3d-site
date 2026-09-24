'use client';

import React from 'react';

const SPLINE_URL =
    'https://my.spline.design/nexbotrobotcharacterconcept-1SRoHllWH0hyS39jN1zCWFEX/';

const MOBILE_ROBOT_VIDEO_URL =
    'https://res.cloudinary.com/da8gaio3l/video/upload/v1790228699/From_Klickpin.com-_Side_hustle_ideas_that_are_trending_right_now_and_still_timeless_enough_to_save_for_later_for_people_who_want_stylish_ideas_on_g0ueln.mp4';

export default function RawModelHero() {
    return (
        <main className="relative h-screen w-full overflow-hidden bg-[#E5E5E5]">
            {/* Desktop View: Spline 3D Canvas */}
            <div className="hidden h-full w-full md:block">
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
            </div>

            {/* Mobile View: Loop Video + Overlay CTA */}
            <div className="relative block h-full w-full md:hidden">
                <video
                    src={MOBILE_ROBOT_VIDEO_URL}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                />

                {/* Light vignette overlay to improve button readability */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Floating Contact CTA Button */}
                <div className="absolute bottom-10 left-1/2 z-20 w-full -translate-x-1/2 px-6 text-center">
                    <a
                        href="#contact"
                        className="inline-flex items-center justify-center rounded-full bg-white/90 px-6 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg backdrop-blur-md transition-all active:scale-95"
                    >
                        Get in Touch
                        <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </main>
    );
}