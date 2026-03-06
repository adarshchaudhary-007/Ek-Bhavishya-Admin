'use client';

import { useState } from 'react';
import { MOCK_BOOKS, BOOK_CATEGORIES, Book } from '@/lib/mock-data/books';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Search, BookOpen, Star, Sparkles, Plus, Edit, Trash2, Eye, IndianRupee, Users, FileText, Headphones } from 'lucide-react';
import { toast } from 'sonner';

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const filtered = books.filter(b => {
        const matchCategory = categoryFilter === 'all' || b.category === categoryFilter;
        const matchSearch = search === '' ||
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    const handleDelete = (id: string) => {
        setBooks(prev => prev.filter(b => b._id !== id));
        toast.success('Book deleted');
    };

    const handleToggleStatus = (id: string) => {
        setBooks(prev => prev.map(b => {
            if (b._id !== id) return b;
            const newStatus = b.status === 'Active' ? 'Inactive' : 'Active';
            return { ...b, status: newStatus as Book['status'] };
        }));
        toast.success('Book status updated');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Books</h2>
                    <p className="text-muted-foreground text-sm">Manage digital and audio books for users.</p>
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.info('Create book form coming soon')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Book
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <BookOpen className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <p className="text-2xl font-bold text-blue-700">{books.length}</p>
                    <p className="text-[11px] font-medium text-blue-600">Total Books</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <Users className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                    <p className="text-2xl font-bold text-emerald-700">{books.reduce((a, b) => a + b.purchaseCount, 0).toLocaleString()}</p>
                    <p className="text-[11px] font-medium text-emerald-600">Total Purchases</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <Sparkles className="h-4 w-4 mx-auto text-amber-600 mb-1" />
                    <p className="text-2xl font-bold text-amber-700">{books.filter(b => b.isFeatured).length}</p>
                    <p className="text-[11px] font-medium text-amber-600">Featured</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <Star className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <p className="text-2xl font-bold text-purple-700">{(books.filter(b => b.rating > 0).reduce((a, b) => a + b.rating, 0) / books.filter(b => b.rating > 0).length).toFixed(1)}</p>
                    <p className="text-[11px] font-medium text-purple-600">Avg Rating</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by title or author..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {BOOK_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Books Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Purchases</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map(book => (
                            <TableRow key={book._id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {book.isFeatured && <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                                        <div>
                                            <p className="font-medium text-sm">{book.title}</p>
                                            <p className="text-[10px] text-muted-foreground">by {book.author}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant="outline" className="text-[10px]">{book.category}</Badge></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {book.type === 'Digital' || book.type === 'Both' ? <FileText className="h-3 w-3 text-blue-500" /> : null}
                                        {book.type === 'Audio' || book.type === 'Both' ? <Headphones className="h-3 w-3 text-purple-500" /> : null}
                                        <span className="text-xs">{book.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-sm">{book.isFree ? <Badge variant="success" className="text-[10px]">Free</Badge> : `₹${book.price}`}</TableCell>
                                <TableCell className="text-sm">{book.purchaseCount.toLocaleString()}</TableCell>
                                <TableCell>
                                    {book.rating > 0 ? (
                                        <div className="flex items-center gap-0.5">
                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-bold">{book.rating}</span>
                                        </div>
                                    ) : <span className="text-xs text-muted-foreground">—</span>}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={book.status === 'Active' ? 'success' : book.status === 'Coming Soon' ? 'default' : 'secondary'} className="text-[10px]">{book.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedBook(book)}><Eye className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggleStatus(book._id)}><Edit className="h-3.5 w-3.5" /></Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600" onClick={() => handleDelete(book._id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Book Detail Modal */}
            {selectedBook && (
                <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> {selectedBook.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant={selectedBook.status === 'Active' ? 'success' : 'secondary'} className="text-xs">{selectedBook.status}</Badge>
                                <Badge variant="outline" className="text-xs">{selectedBook.category}</Badge>
                                <Badge variant="outline" className="text-xs">{selectedBook.type}</Badge>
                                {selectedBook.isFeatured && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300"><Sparkles className="h-3 w-3 mr-0.5 fill-amber-500" />Featured</Badge>}
                                {selectedBook.isFree && <Badge variant="success" className="text-xs">Free</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">by <span className="font-semibold text-foreground">{selectedBook.author}</span></p>
                            <p className="text-sm leading-relaxed">{selectedBook.description}</p>

                            <Separator />

                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold text-emerald-700">{selectedBook.isFree ? 'Free' : `₹${selectedBook.price}`}</p>
                                    <p className="text-[10px] text-emerald-600">Price</p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold text-blue-700">{selectedBook.purchaseCount.toLocaleString()}</p>
                                    <p className="text-[10px] text-blue-600">Purchases</p>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-3 text-center">
                                    <p className="text-lg font-bold text-amber-700">{selectedBook.rating > 0 ? selectedBook.rating : '—'}</p>
                                    <p className="text-[10px] text-amber-600">Rating</p>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground space-y-0.5">
                                {selectedBook.totalPages && <p>Pages: {selectedBook.totalPages}</p>}
                                {selectedBook.duration && <p>Duration: {selectedBook.duration}</p>}
                                <p>Language: {selectedBook.language}</p>
                                {selectedBook.isbn && <p>ISBN: {selectedBook.isbn}</p>}
                                <p>Created: {new Date(selectedBook.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
