"use client"

import { useState, useEffect } from 'react'
import { Search, FileText, Users, Store, Star, BookOpen, Bell, TrendingUp, X, Edit, Trash2, CheckCircle, XCircle, UserX, Ban } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface SearchResult {
    id: string
    title: string
    description: string
    category: string
    icon: React.ElementType
    path: string
    keywords: string[]
}

const searchablePages: SearchResult[] = [
    // Dashboard
    { id: '1', title: 'Dashboard', description: 'Overview and analytics', category: 'Navigation', icon: TrendingUp, path: '/admin', keywords: ['home', 'overview', 'stats', 'analytics'] },
    
    // Users
    { id: '2', title: 'Users', description: 'Manage platform users', category: 'Navigation', icon: Users, path: '/admin/users', keywords: ['users', 'customers', 'clients'] },
    { id: '3', title: 'Block User', description: 'Block or unblock users', category: 'Actions', icon: Ban, path: '/admin/users', keywords: ['block', 'ban', 'suspend user'] },
    
    // Astrologers
    { id: '4', title: 'Astrologers', description: 'Manage astrologers', category: 'Navigation', icon: Star, path: '/admin/astrologers', keywords: ['astrologers', 'consultants'] },
    { id: '5', title: 'Suspend Astrologer', description: 'Suspend astrologer accounts', category: 'Actions', icon: UserX, path: '/admin/astrologers', keywords: ['suspend', 'ban astrologer'] },
    
    // Sellers
    { id: '6', title: 'Sellers', description: 'Manage sellers', category: 'Navigation', icon: Store, path: '/admin/sellers', keywords: ['sellers', 'vendors', 'merchants'] },
    { id: '7', title: 'Approve Seller', description: 'Approve or reject sellers', category: 'Actions', icon: CheckCircle, path: '/admin/sellers', keywords: ['approve', 'verify seller'] },
    
    // Blogs
    { id: '8', title: 'Blogs', description: 'Manage blog posts', category: 'Navigation', icon: FileText, path: '/admin/blogs', keywords: ['blogs', 'posts', 'articles'] },
    { id: '9', title: 'Approve Blog', description: 'Approve or reject blogs', category: 'Actions', icon: CheckCircle, path: '/admin/blogs', keywords: ['approve blog', 'verify blog'] },
    { id: '10', title: 'Reject Blog', description: 'Reject blog posts', category: 'Actions', icon: XCircle, path: '/admin/blogs', keywords: ['reject blog', 'decline blog'] },
    
    // Courses
    { id: '11', title: 'Courses', description: 'Manage courses', category: 'Navigation', icon: BookOpen, path: '/admin/courses', keywords: ['courses', 'classes', 'training'] },
    { id: '12', title: 'Create Course', description: 'Add new course', category: 'Actions', icon: BookOpen, path: '/admin/courses/new', keywords: ['create course', 'add course', 'new course'] },
    
    // Notices
    { id: '13', title: 'Notices', description: 'Manage notifications', category: 'Navigation', icon: Bell, path: '/admin/notices', keywords: ['notices', 'notifications', 'announcements'] },
    { id: '14', title: 'Create Notice', description: 'Send new notice', category: 'Actions', icon: Bell, path: '/admin/notices/new', keywords: ['create notice', 'send notice', 'new notice'] },
    { id: '15', title: 'Update Notice', description: 'Edit existing notice', category: 'Actions', icon: Edit, path: '/admin/notices', keywords: ['update notice', 'edit notice', 'modify notice'] },
    { id: '16', title: 'Delete Notice', description: 'Remove notice', category: 'Actions', icon: Trash2, path: '/admin/notices', keywords: ['delete notice', 'remove notice'] },
    
    // Reports
    { id: '17', title: 'Reports', description: 'View reports', category: 'Navigation', icon: FileText, path: '/admin/reports', keywords: ['reports', 'analytics', 'statistics'] },
    
    // Calls
    { id: '18', title: 'Calls', description: 'View call history', category: 'Navigation', icon: Users, path: '/admin/calls', keywords: ['calls', 'consultations', 'sessions'] },
    
    // Profile
    { id: '19', title: 'Profile', description: 'Manage your profile', category: 'Settings', icon: Users, path: '/admin/profile', keywords: ['profile', 'account', 'settings'] },
]

export function GlobalSearch() {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const router = useRouter()

    // Keyboard shortcut to open search
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    // Filter results based on search
    useEffect(() => {
        if (search.length === 0) {
            setResults(searchablePages.slice(0, 8))
        } else {
            const searchLower = search.toLowerCase()
            const filtered = searchablePages.filter((page) =>
                page.title.toLowerCase().includes(searchLower) ||
                page.description.toLowerCase().includes(searchLower) ||
                page.category.toLowerCase().includes(searchLower) ||
                page.keywords.some(keyword => keyword.includes(searchLower))
            )
            setResults(filtered)
        }
        setSelectedIndex(0)
    }, [search])

    // Keyboard navigation
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % results.length)
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
            } else if (e.key === 'Enter' && results[selectedIndex]) {
                e.preventDefault()
                handleNavigate(results[selectedIndex].path)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, results, selectedIndex])

    const handleNavigate = (path: string) => {
        setOpen(false)
        setSearch('')
        setTimeout(() => {
            router.push(path)
        }, 100)
    }

    return (
        <>
            <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search... (Ctrl+K)"
                    className="w-[200px] lg:w-[300px] h-9 pl-8 pr-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                    onClick={() => setOpen(true)}
                    readOnly
                />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 max-w-2xl">
                    {/* Search Input */}
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                        <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                            placeholder="Search admin panel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="shrink-0 p-1 hover:bg-accent rounded"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto p-2">
                        {results.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No results found.
                            </div>
                        ) : (
                            <>
                                {['Navigation', 'Actions', 'Settings'].map((category) => {
                                    const categoryResults = results.filter((r) => r.category === category)
                                    if (categoryResults.length === 0) return null

                                    return (
                                        <div key={category} className="mb-4">
                                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                {category}
                                            </div>
                                            <div className="space-y-1">
                                                {categoryResults.map((result, idx) => {
                                                    const Icon = result.icon
                                                    const globalIndex = results.indexOf(result)
                                                    const isSelected = globalIndex === selectedIndex

                                                    return (
                                                        <div
                                                            key={result.id}
                                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
                                                                isSelected
                                                                    ? 'bg-accent text-accent-foreground'
                                                                    : 'hover:bg-accent/50'
                                                            }`}
                                                            onClick={() => handleNavigate(result.path)}
                                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        >
                                                            <Icon className="h-4 w-4 shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm truncate">
                                                                    {result.title}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {result.description}
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground shrink-0">
                                                                {result.category}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-2 text-xs text-muted-foreground flex items-center justify-center gap-4">
                        <span>
                            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-muted border rounded">↑↓</kbd> Navigate
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-muted border rounded">Enter</kbd> Select
                        </span>
                        <span>
                            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-muted border rounded">Esc</kbd> Close
                        </span>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
