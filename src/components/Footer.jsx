'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end end'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-40, 0]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer
            ref={containerRef}
            className="relative w-full bg-[#E5E5E5] text-[#0A0A0A] pt-24 pb-8 overflow-hidden border-t border-black/10"
        >
            <div className="mx-auto max-w-7xl px-6 sm:px-12">
                {/* Primary Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start mb-16 md:mb-24">

                    {/* Navigation / Sitemap */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-8 font-mono text-xs uppercase tracking-widest text-black/60">
                        <div className="space-y-4">
                            <p className="text-black/30 mb-6">Index</p>
                            <a href="#technology" className="block hover:text-black transition-colors">Technology</a>
                            <a href="#research" className="block hover:text-black transition-colors">Research</a>
                            <a href="#applications" className="block hover:text-black transition-colors">Applications</a>
                            <a href="#specs" className="block hover:text-black transition-colors">Specifications</a>
                        </div>
                        <div className="space-y-4">
                            <p className="text-black/30 mb-6">Socials</p>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block hover:text-black transition-colors">GitHub</a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block hover:text-black transition-colors">LinkedIn</a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="block hover:text-black transition-colors">X / Twitter</a>
                        </div>
                    </div>

                    {/* Operational Details */}
                    <div className="md:col-span-4 font-mono text-xs text-black/50 space-y-4">
                        <p className="text-black/30 uppercase tracking-widest mb-6">Headquarters</p>
                        <p className="leading-relaxed text-black/80">
                            NEXBOT Kinetic Systems Ltd.<br />
                            792 Robotics Way, Suite 400<br />
                            San Francisco, CA 94107
                        </p>
                    </div>

                    {/* Scroll to top interactive action */}
                    <div className="md:col-span-3 flex md:justify-end items-start">
                        <button
                            onClick={scrollToTop}
                            className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-black/60 hover:text-black transition-colors"
                            aria-label="Back to top"
                        >
                            <span>Back to Top</span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-black/5 transition-transform group-hover:-translate-y-1 group-hover:bg-black group-hover:text-white">
                                <ArrowUp size={14} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Massive Architectural Typography Centerpiece */}
                <motion.div style={{ y }} className="relative select-none pt-4">
                    <h1
                        className="text-[17vw] font-bold leading-[0.8] tracking-tighter text-center text-[#0A0A0A]"
                        style={{
                            WebkitTextStroke: '1px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        NEXBOT
                    </h1>
                </motion.div>

                {/* Legal & Copyright */}
                <div className="mt-8 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-black/40">
                    <p>© {new Date().getFullYear()} NEXBOT Inc. All rights reserved.</p>
                    <p>SERVO FREQUENCY · 5.0 KHz STABLE</p>
                </div>
            </div>
        </footer>
    );
}