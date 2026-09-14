'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const navigation = [
    { label: 'Technology', href: '#technology' },
    { label: 'Research', href: '#research' },
    { label: 'Applications', href: '#applications' },
    { label: 'Specs', href: '#specs' },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navRef = useRef(null);

    // Prevent background scrolling when mobile menu is active
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Close mobile menu on Escape key press and desktop resize
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };

        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Close menu when clicking outside of the navbar container
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileMenuOpen]);

    return (
        <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-8 sm:pt-6">
            {/* Floating Glass Container */}
            <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-black/[0.08] bg-[#E5E5E5]/50 px-5 py-3 backdrop-blur-xl shadow-sm transition-all duration-300 sm:px-8">

                {/* Brand Logo */}
                <a href="#top" className="group flex items-center gap-2.5" aria-label="NEXBOT Home">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-105">
                        <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <span className="text-sm font-semibold tracking-tighter text-black">
                        NEX<span className="text-black/40">BOT</span>
                    </span>
                </a>

                {/* Desktop Navigation Links */}
                <nav className="hidden items-center gap-8 md:flex" aria-label="Main Navigation">
                    {navigation.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-xs font-medium text-black/60 transition-colors duration-200 hover:text-black"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA Button */}
                <div className="hidden items-center gap-4 md:flex">
                    <a
                        href="#contact"
                        className="group flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-zinc-800"
                    >
                        Inquire
                        <ArrowUpRight
                            size={14}
                            strokeWidth={1.75}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black transition-colors hover:bg-black/10 md:hidden"
                    aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-navigation"
                >
                    {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        id="mobile-navigation"
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-black/[0.08] bg-[#E5E5E5]/90 p-6 backdrop-blur-2xl shadow-lg md:hidden"
                    >
                        <nav className="flex flex-col gap-4" aria-label="Mobile Navigation">
                            {navigation.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm font-medium text-black/70 transition-colors hover:text-black"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="pt-2">
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between rounded-full bg-black px-5 py-3 text-xs font-medium text-white"
                                >
                                    Inquire
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}