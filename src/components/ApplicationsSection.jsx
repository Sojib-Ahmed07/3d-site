'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ================================================================== */
/*  Fluid Wave Motion Field — Visual Canvas Background               */
/* ================================================================== */

function DistortionCanvas({ activeIndex }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let width = 0;
        let height = 0;
        let time = 0;

        const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const onPointerMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        const draw = () => {
            time += 0.008;

            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            ctx.clearRect(0, 0, width, height);

            // Dynamic grid lines based on active item index
            const cols = 8;
            const rows = 5;
            const cellW = width / cols;
            const cellH = height / rows;

            ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.lineWidth = 1;

            for (let i = 0; i <= cols; i++) {
                ctx.beginPath();
                for (let j = 0; j <= rows * 10; j++) {
                    const y = (j / (rows * 10)) * height;
                    const dx = i * cellW - mouse.x;
                    const dy = y - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    const influence = Math.max(0, 1 - dist / 280);

                    const shiftX =
                        Math.sin(y * 0.01 + time + activeIndex) * 12 * (1 + influence * 2) +
                        (dx / (dist || 1)) * influence * -35;

                    const x = i * cellW + shiftX;

                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            for (let j = 0; j <= rows; j++) {
                ctx.beginPath();
                for (let i = 0; i <= cols * 10; i++) {
                    const x = (i / (cols * 10)) * width;
                    const dx = x - mouse.x;
                    const dy = j * cellH - mouse.y;
                    const dist = Math.hypot(dx, dy);
                    const influence = Math.max(0, 1 - dist / 280);

                    const shiftY =
                        Math.cos(x * 0.01 + time * 1.2 + activeIndex) * 12 * (1 + influence * 2) +
                        (dy / (dist || 1)) * influence * -35;

                    const y = j * cellH + shiftY;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove);
        };
    }, [activeIndex]);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

/* ================================================================== */
/*  Applications / Deployments Showcase Component                      */
/* ================================================================== */

const DEPLOYMENTS = [
    {
        title: 'Autonomous Logistics',
        field: 'HIGH-DENSITY FULFILLMENT',
        statement:
            'Multi-agent trajectory synthesis coordinating autonomous platforms across high-density logistics facilities with sub-millimeter position lock.',
        impact: 'Sub-millisecond routing across 1,200kg payloads.',
    },
    {
        title: 'Spatial Mapping',
        field: 'TACTICAL RECONNAISSANCE',
        statement:
            'LiDAR-fused neural SLAM generating continuous 3D spatial geometry in degraded, non-permissive dynamic environments.',
        impact: 'Real-time volumetric mesh output at 40Hz.',
    },
    {
        title: 'Micro-Actuation',
        field: 'SURGICAL INSTRUMENTATION',
        statement:
            'Closed-loop force feedback with active tremor cancellation, giving surgeons direct haptic simulation at micro-scale accuracy.',
        impact: 'Sub-millisecond actuator loops closed at 5 kHz.',
    },
];

export default function ApplicationsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="applications" className="relative w-full bg-[#E5E5E5] text-[#0A0A0A] py-32 md:py-48 overflow-hidden select-none">
            {/* Background Canvas Distortion System */}
            <DistortionCanvas activeIndex={activeIndex} />

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">

                {/* Header Composition */}
                <div className="max-w-3xl mb-24 md:mb-36">
                    <p className="font-mono text-xs tracking-widest text-black/40 uppercase mb-4">
                        Applications — Deployment Matrix
                    </p>
                    <h2 className="text-[8vw] sm:text-[5vw] font-bold leading-[0.92] tracking-tighter text-[#0A0A0A]">
                        ENGINEERED FOR EXTREMES.
                    </h2>
                </div>

                {/* Interactive Editorial Row Stack */}
                <div className="space-y-0 border-t border-black/15">
                    {DEPLOYMENTS.map((item, index) => {
                        const isActive = activeIndex === index;

                        return (
                            <div
                                key={item.title}
                                onMouseEnter={() => setActiveIndex(index)}
                                className="group cursor-pointer border-b border-black/15 py-10 md:py-14 transition-colors duration-500"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 items-baseline gap-6 md:gap-8">

                                    {/* Field Domain */}
                                    <div className="md:col-span-3">
                                        <span className="font-mono text-xs uppercase tracking-widest text-black/40 transition-colors duration-300 group-hover:text-black">
                                            {item.field}
                                        </span>
                                    </div>

                                    {/* Deployment Title */}
                                    <div className="md:col-span-6">
                                        <h3
                                            className={`text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight transition-all duration-500 ${isActive
                                                    ? 'text-[#0A0A0A] md:translate-x-3'
                                                    : 'text-black/30 group-hover:text-black/70'
                                                }`}
                                        >
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* Action indicator line */}
                                    <div className="hidden md:flex md:col-span-3 justify-end items-center">
                                        <motion.div
                                            animate={{
                                                width: isActive ? 48 : 0,
                                                opacity: isActive ? 1 : 0,
                                            }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="h-px bg-black"
                                        />
                                    </div>
                                </div>

                                {/* Expandable Detail Area */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-8 md:pt-12 text-sm">
                                                <div className="md:col-start-4 md:col-span-5">
                                                    <p className="text-black/70 leading-relaxed font-sans text-base md:text-lg">
                                                        {item.statement}
                                                    </p>
                                                </div>
                                                <div className="md:col-span-3 flex flex-col justify-end">
                                                    <p className="font-mono text-xs text-black/50 tracking-wide">
                                                        {item.impact}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Statement */}
                <div className="mt-20 md:mt-32 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs font-mono text-black/40 border-t border-black/10 pt-8">
                    <span>KINEMATIC PLATFORM — V4 ARCHITECTURE</span>
                    <span>ALL SYSTEMS OPERATING WITHIN NOMINAL TOLERANCE</span>
                </div>

            </div>
        </section>
    );
}