'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

/* ================================================================== */
/*  LiDAR wave field — LED dot grid + scan sweep + magnetic cursor     */
/* ================================================================== */

function WaveField({ scrollRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let raf = 0;
        let w = 0, h = 0;
        let dots = [];
        const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
        let t = 0;
        let amp = 5;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            dots = [];
            const gap = 26;
            for (let y = gap / 2; y < h; y += gap)
                for (let x = gap / 2; x < w; x += gap)
                    dots.push({ x, y });
        };

        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.clientY < rect.top || e.clientY > rect.bottom) {
                mouse.tx = -9999;
                mouse.ty = -9999;
                return;
            }
            mouse.tx = e.clientX - rect.left;
            mouse.ty = e.clientY - rect.top;
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onMove, { passive: true });

        const draw = () => {
            t += 0.016;

            mouse.x += (mouse.tx - mouse.x) * 0.14;
            mouse.y += (mouse.ty - mouse.y) * 0.14;
            const targetAmp = 5 + (scrollRef.current || 0) * 26;
            amp += (targetAmp - amp) * 0.04;

            ctx.clearRect(0, 0, w, h);

            const scanY = ((t * 55) % (h + 260)) - 130;

            ctx.fillStyle = 'rgba(212,212,216,0.12)';
            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                const wave =
                    Math.sin(d.x * 0.006 + t * 1.1) *
                    Math.cos(d.y * 0.005 + t * 0.7);
                const wy = d.y + wave * amp;

                const dx = d.x - mouse.x;
                const dy = wy - mouse.y;
                const dist = Math.hypot(dx, dy) || 1;
                const influence = Math.max(0, 1 - dist / 190);
                const scan = Math.max(0, 1 - Math.abs(wy - scanY) / 80);

                const px = d.x + (dx / dist) * influence * influence * 14;
                const py = wy + (dy / dist) * influence * influence * 14;

                const size = 1.4 + influence * 1.8 + scan * 1.4;

                if (influence > 0.03) {
                    const a = 0.12 + influence * 0.75;
                    ctx.fillStyle = influence > 0.3
                        ? `rgba(163,230,53,${a})`
                        : `rgba(228,228,231,${a})`;
                } else if (scan > 0.06) {
                    ctx.fillStyle = `rgba(228,228,231,${0.12 + scan * 0.4})`;
                } else {
                    ctx.fillStyle = 'rgba(212,212,216,0.12)';
                }

                ctx.fillRect(px - size / 2, py - size / 2, size, size);
            }

            const band = ctx.createLinearGradient(0, scanY - 70, 0, scanY + 70);
            band.addColorStop(0, 'rgba(163,230,53,0)');
            band.addColorStop(0.5, 'rgba(163,230,53,0.045)');
            band.addColorStop(1, 'rgba(163,230,53,0)');
            ctx.fillStyle = band;
            ctx.fillRect(0, scanY - 70, w, 140);
            ctx.fillStyle = 'rgba(190,242,100,0.14)';
            ctx.fillRect(0, scanY - 0.5, w, 1);

            if (mouse.x > -100) {
                ctx.strokeStyle = 'rgba(163,230,53,0.22)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, mouse.y);
                ctx.lineTo(w, mouse.y);
                ctx.moveTo(mouse.x, 0);
                ctx.lineTo(mouse.x, h);
                ctx.stroke();

                ctx.strokeStyle = 'rgba(163,230,53,0.6)';
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = 'rgba(163,230,53,0.9)';
                ctx.fillRect(mouse.x - 1.5, mouse.y - 1.5, 3, 3);
            }

            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onMove);
        };
    }, [scrollRef]);

    return <canvas ref={canvasRef} className="absolute inset-0" />;
}

/* ================================================================== */
/*  Live telemetry — horizontal micro layout                          */
/* ================================================================== */

function Telemetry({ mouseRef }) {
    const xRef = useRef(null);
    const yRef = useRef(null);
    const tRef = useRef(null);
    const sRef = useRef(null);

    useEffect(() => {
        let raf = 0;
        const loop = () => {
            const m = mouseRef.current;
            if (xRef.current) {
                const xv = (m.x * 100).toFixed(1);
                const yv = (m.y * 100).toFixed(1);
                const deg = ((Math.atan2(m.y, m.x) * 180) / Math.PI).toFixed(1);
                xRef.current.textContent = `${xv >= 0 ? '+' : ''}${xv}`;
                yRef.current.textContent = `${yv >= 0 ? '+' : ''}${yv}`;
                tRef.current.textContent = `${deg >= 0 ? '+' : ''}${deg}°`;
                sRef.current.textContent = m.isInside ? 'LOCK' : 'STANDBY';
                sRef.current.style.color = m.isInside ? '#a3e635' : '#52525b';
            }
            raf = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(raf);
    }, [mouseRef]);

    return (
        <div className="pointer-events-none flex flex-wrap items-center gap-6 border border-white/10 bg-black/40 px-4 py-2.5 font-mono text-[11px] tracking-wider backdrop-blur-md">
            <span ref={sRef} className="text-[10px] uppercase text-zinc-500">STANDBY</span>
            <div className="flex gap-4 text-zinc-400">
                <span>X: <span ref={xRef} className="text-zinc-200">+000.0</span></span>
                <span>Y: <span ref={yRef} className="text-zinc-200">+000.0</span></span>
                <span>θ: <span ref={tRef} className="text-zinc-200">+000.0°</span></span>
            </div>
            <span className="hidden text-[10px] text-zinc-600 sm:inline">SERVO LOOP · 5 KHz</span>
        </div>
    );
}

/* ================================================================== */
/*  Kinetic headline — letter-by-letter reveal                         */
/* ================================================================== */

const letterContainer = (delay) => ({
    hidden: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: delay } },
});

const letterVariant = {
    hidden: { y: '115%' },
    show: { y: '0%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

function KineticLine({ text, delay, outlined = false }) {
    return (
        <motion.span
            variants={letterContainer(delay)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="block"
            style={outlined ? { WebkitTextStroke: '1.5px rgba(228,228,231,0.85)', color: 'transparent' } : undefined}
        >
            {text.split('').map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden align-bottom">
                    <motion.span variants={letterVariant} className="inline-block will-change-transform">
                        {ch}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}

/* ================================================================== */
/*  Hover-expanding spec row                                           */
/* ================================================================== */

const SPECS = [
    { index: '01', title: 'Kinematic Control', value: '0.2 ms', desc: 'Sub-millisecond servo loops closing at 5 kHz across every actuator joint — no overshoot, no drift.' },
    { index: '02', title: 'Spatial Mapping', value: '40 Hz', desc: 'LiDAR-fused SLAM builds continuous 3D geometry of dynamic environments in real time.' },
    { index: '03', title: 'Autonomy Stack', value: '99.99%', desc: 'Onboard neural planning with redundant fault-tolerant feedback for critical operations.' },
];

function SpecRow({ index, title, value, desc }) {
    return (
        <div className="group cursor-default border-t border-white/10 py-3.5 transition-colors duration-300 last:border-b hover:bg-white/[0.03]">
            <div className="flex items-baseline justify-between gap-6 px-1">
                <div className="flex items-baseline gap-6">
                    <span className="font-mono text-xs text-zinc-600 transition-colors duration-300 group-hover:text-lime-400">
                        {index}
                    </span>
                    <h3 className="text-base font-medium tracking-tight text-zinc-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white md:text-lg">
                        {title}
                    </h3>
                </div>
                <span className="font-mono text-xs text-zinc-500 transition-colors duration-300 group-hover:text-lime-300">
                    {value}
                </span>
            </div>
            <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                    <p className="max-w-md pl-10 pt-2 text-xs leading-relaxed text-zinc-500">
                        {desc}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ================================================================== */
/*  Section                                                            */
/* ================================================================== */

const MARQUEE_ITEMS = ['PRECISION', 'AUTONOMY', 'CONTROL', 'TELEMETRY', 'SLAM', '5 KHz SERVO'];

export default function ParticleSection() {
    const containerRef = useRef(null);
    const scrollRef = useRef(0);
    const mouseRef = useRef({ x: 0, y: 0, isInside: false });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });
    const railScale = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        scrollRef.current = v;
    });

    useEffect(() => {
        const onMove = (e) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouseRef.current.isInside = true;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    return (
        <section ref={containerRef} id="technology" className="relative min-h-[140vh] w-full bg-[#0A0A0A] text-zinc-200">
            <style>{`
                @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                .animate-marquee { animation: marquee 24s linear infinite; }
                @keyframes spin-slow { to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 16s linear infinite; }
                @keyframes scroll-hint { 0%,100% { transform: scaleY(0.3); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } }
                .animate-scroll-hint { animation: scroll-hint 1.8s ease-in-out infinite; }
            `}</style>

            {/* ---------- sticky stage ---------- */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <WaveField scrollRef={scrollRef} />

                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    }}
                />

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.75)_100%)]" />

                <motion.div
                    style={{ scaleY: railScale }}
                    className="absolute left-5 top-1/2 h-24 w-px -translate-y-1/2 bg-lime-400/80 origin-top sm:left-8"
                />
                <div className="absolute left-5 top-1/2 h-24 w-px -translate-y-1/2 bg-white/10 sm:left-8" />

                <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
                    <div className="relative">
                        <svg viewBox="0 0 100 100" className="h-16 w-16 animate-spin-slow sm:h-20 sm:w-20">
                            <defs>
                                <path id="badge-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                            </defs>
                            <text className="fill-zinc-500 font-mono text-[8px] uppercase" style={{ letterSpacing: '2.6px' }}>
                                <textPath href="#badge-circle">
                                    precision motion · systems · est 2026 ·
                                </textPath>
                            </text>
                        </svg>
                        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400" />
                    </div>
                </div>

                <div className="absolute bottom-6 left-5 flex items-center gap-3 sm:left-8">
                    <div className="h-8 w-px animate-scroll-hint bg-lime-400/70" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Scroll</span>
                </div>
            </div>

            {/* ---------- content overlay ---------- */}
            <div className="pointer-events-none relative z-10 -mt-[100vh] mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-20 sm:px-12">

                {/* ===== 1 · headline ===== */}
                <div className="pt-[12vh]">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="pointer-events-auto mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                        02 — Robotics / Motion Systems
                    </motion.p>

                    <h1 className="pointer-events-auto text-[10vw] font-bold leading-[0.9] tracking-tighter sm:text-[7vw]">
                        <KineticLine text="MOTION," delay={0.1} />
                        <KineticLine text="PERFECTED." delay={0.35} outlined />
                    </h1>

                    <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            viewport={{ once: true }}
                            className="pointer-events-auto max-w-sm font-mono text-[11px] leading-relaxed tracking-wider text-zinc-500"
                        >
                            {'>'} servo loops closed at 5 kHz<br />
                            {'>'} zero overshoot. zero drift.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            viewport={{ once: true }}
                            className="pointer-events-auto"
                        >
                            <Telemetry mouseRef={mouseRef} />
                        </motion.div>
                    </div>
                </div>

                {/* ===== 2 · specs ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: '-50px' }}
                    className="pointer-events-auto max-w-2xl"
                >
                    <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                        / Capabilities
                    </p>
                    {SPECS.map((s) => (
                        <SpecRow key={s.index} {...s} />
                    ))}
                </motion.div>

                {/* ===== 3 · marquee + CTA ===== */}
                <div className="pointer-events-auto space-y-10">
                    <div className="overflow-hidden border-y border-white/10 py-3">
                        <div className="animate-marquee flex w-max items-center gap-8">
                            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                                <span key={i} className="flex items-center gap-8">
                                    <span className="font-mono text-xs uppercase tracking-[0.35em] text-zinc-400">
                                        {item}
                                    </span>
                                    <span className="text-xs text-lime-400/70">✦</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <a
                            href="#contact"
                            className="group inline-flex items-center gap-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
                        >
                            <span className="relative">
                                Start a project
                                <span className="absolute -bottom-1 left-0 h-px w-0 bg-lime-400 transition-all duration-500 group-hover:w-full" />
                            </span>
                            <ArrowUpRight
                                className="h-6 w-6 text-zinc-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-lime-400 sm:h-7 sm:w-7"
                            />
                        </a>
                        <div className="font-mono text-[11px] tracking-wider text-zinc-600">
                            <p>hello@robotics.studio</p>
                            <p className="mt-0.5 flex items-center gap-1.5">
                                <ArrowDown className="h-3 w-3" /> availability · Q3 2026
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}