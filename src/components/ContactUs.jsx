'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function ContactSection() {
    const [focusedField, setFocusedField] = useState(null);

    return (
        <section id="contact" className="relative w-full bg-[#0A0A0A] text-zinc-100 py-32 md:py-48 overflow-hidden">
            {/* Subtle background ambient line grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:64px_64px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                    {/* Left Column: Typographic Focal Point */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                                Initiate Inquiry
                            </p>

                            <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-[0.95] text-white">
                                LET’S BUILD <br />
                                <span className="text-zinc-600 font-light italic">THE FUTURE</span> <br />
                                TOGETHER.
                            </h2>

                            <p className="mt-8 text-base text-zinc-400 leading-relaxed max-w-md font-sans">
                                Deploying specialized robotics hardware or custom telemetry stacks? Reach out directly to our engineering core.
                            </p>
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/10 font-mono text-xs text-zinc-500 space-y-2">
                            <p className="text-zinc-400">DIRECT LINES</p>
                            <p>hello@robotics.studio</p>
                            <p>+1 (800) 482-9012</p>
                        </div>
                    </div>

                    {/* Right Column: Minimalist Editorial Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-12">

                            {/* Input Field: Name */}
                            <div className="relative group">
                                <label
                                    htmlFor="name"
                                    className={`block font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${focusedField === 'name' ? 'text-lime-400' : 'text-zinc-500'
                                        }`}
                                >
                                    01 // What is your name?
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Jane Doe"
                                    className="w-full bg-transparent border-b border-white/15 pt-4 pb-3 text-xl md:text-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-lime-400 transition-colors duration-300"
                                />
                            </div>

                            {/* Input Field: Email */}
                            <div className="relative group">
                                <label
                                    htmlFor="email"
                                    className={`block font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${focusedField === 'email' ? 'text-lime-400' : 'text-zinc-500'
                                        }`}
                                >
                                    02 // Your email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="jane@company.com"
                                    className="w-full bg-transparent border-b border-white/15 pt-4 pb-3 text-xl md:text-2xl text-white placeholder-zinc-700 focus:outline-none focus:border-lime-400 transition-colors duration-300"
                                />
                            </div>

                            {/* Input Field: Project Scope */}
                            <div className="relative group">
                                <label
                                    htmlFor="message"
                                    className={`block font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${focusedField === 'message' ? 'text-lime-400' : 'text-zinc-500'
                                        }`}
                                >
                                    03 // Project requirements & timeframe
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    required
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Tell us about your kinematics or hardware deployment requirements..."
                                    className="w-full bg-transparent border-b border-white/15 pt-4 pb-3 text-lg md:text-xl text-white placeholder-zinc-700 focus:outline-none focus:border-lime-400 transition-colors duration-300 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 flex justify-end">
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative inline-flex items-center gap-4 border border-white/20 bg-white/5 hover:bg-white hover:text-black px-8 py-5 text-sm font-mono uppercase tracking-widest text-white transition-all duration-300"
                                >
                                    <span>Transmit Message</span>
                                    <ArrowUpRight className="h-4 w-4 text-lime-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-black" />
                                </motion.button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}