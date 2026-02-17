'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star, Sparkles, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <nav className="absolute top-0 flex w-full items-center justify-between p-6 max-w-7xl">
        <div className="flex items-center gap-2 font-bold text-2xl">
          <Star className="h-8 w-8 text-primary fill-primary" />
          <span>Ek Bhavishya</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-primary">Login</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Sign Up</Button>
          </Link>
        </div>
      </nav>

      <main className="z-10 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="mb-4 rounded-full bg-white/10 p-4 backdrop-blur-md">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Welcome to <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Ek Bhavishya</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-400">
            The most advanced management system for modern astrology services.
            Manage your astrologers, sellers, courses, and customer relationships in one elegant cosmic platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-lg font-semibold">
              Admin Login
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="glass" className="h-12 px-8 text-lg font-semibold">
              Explore Demo
            </Button>
          </Link>
        </motion.div>
      </main>

      <footer className="absolute bottom-6 text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Ek Bhavishya. All rights reserved.
      </footer>
    </div>
  );
}
