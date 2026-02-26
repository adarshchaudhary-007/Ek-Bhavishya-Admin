"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="relative inline-flex h-9 w-16 items-center rounded-full bg-muted">
                <div className="h-7 w-7 rounded-full bg-background shadow-sm" />
            </div>
        )
    }

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative inline-flex h-9 w-16 items-center rounded-full bg-gradient-to-r from-amber-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 transition-all duration-300 hover:shadow-md border-2 border-transparent hover:border-primary/20"
            aria-label="Toggle theme"
        >
            {/* Track background with gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-50 via-orange-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900 opacity-50" />
            
            {/* Toggle circle */}
            <div
                className={`relative h-7 w-7 rounded-full bg-white dark:bg-slate-900 shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center border-2 ${
                    isDark 
                        ? 'translate-x-8 border-blue-400/30' 
                        : 'translate-x-1 border-amber-400/30'
                }`}
            >
                {/* Sun icon - visible in light mode */}
                <Sun 
                    className={`h-4 w-4 text-amber-500 absolute transition-all duration-300 ${
                        isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                    }`}
                />
                
                {/* Moon icon - visible in dark mode */}
                <Moon 
                    className={`h-4 w-4 text-blue-400 absolute transition-all duration-300 ${
                        isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                    }`}
                />
            </div>

            {/* Background icons for visual effect */}
            <Sun className={`absolute left-2 h-3.5 w-3.5 text-amber-400/40 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
            <Moon className={`absolute right-2 h-3.5 w-3.5 text-blue-300/40 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`} />
        </button>
    )
}
