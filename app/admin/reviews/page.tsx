'use client';

import { useState } from 'react';
import { MOCK_REVIEWS, Review } from '@/lib/mock-data/reviews';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Search, Eye, Star, CheckCircle, XCircle, EyeOff, Flag, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const filtered = reviews.filter(r => {
        const matchFilter =
            filter === 'all' ||
            (filter === 'pending' && !r.isApproved && !r.isFlagged) ||
            (filter === 'approved' && r.isApproved) ||
            (filter === 'flagged' && r.isFlagged) ||
            (filter === 'hidden' && !r.isVisible);
        const matchSearch = search === '' ||
            r.user.name.toLowerCase().includes(search.toLowerCase()) ||
            r.astrologer.name.toLowerCase().includes(search.toLowerCase()) ||
            r.comment.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const handleApprove = (id: string) => {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: true, isVisible: true, isFlagged: false } : r));
        toast.success('Review approved and now visible');
    };

    const handleHide = (id: string) => {
        setReviews(prev => prev.map(r => r._id === id ? { ...r, isVisible: false } : r));
        toast.success('Review hidden from public');
    };

    const handleDelete = (id: string) => {
        setReviews(prev => prev.filter(r => r._id !== id));
        setSelectedReview(null);
        toast.success('Review deleted');
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                ))}
                <span className="text-xs font-bold ml-1">{rating}.0</span>
            </div>
        );
    };

    const pendingCount = reviews.filter(r => !r.isApproved && !r.isFlagged).length;
    const flaggedCount = reviews.filter(r => r.isFlagged).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reviews & Ratings</h2>
                    <p className="text-muted-foreground text-sm">Moderate astrologer reviews — approve, hide, or remove inappropriate content.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Refreshing...')}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">{reviews.length}</p>
                    <p className="text-[11px] font-medium text-blue-600">Total Reviews</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
                    <p className="text-[11px] font-medium text-amber-600">Pending Approval</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-700">{flaggedCount}</p>
                    <p className="text-[11px] font-medium text-red-600">Flagged</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-700">{(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)}</p>
                    <p className="text-[11px] font-medium text-emerald-600">Avg Rating</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by user, astrologer, or content..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reviews</SelectItem>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Astrologer</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="max-w-[300px]">Comment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No reviews found</TableCell></TableRow>
                        ) : filtered.map(review => (
                            <TableRow key={review._id} className={review.isFlagged ? 'bg-red-50/50' : ''}>
                                <TableCell>
                                    <p className="font-medium text-sm">{review.user.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{review.user.email}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium text-sm">{review.astrologer.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{review.astrologer.specializations.join(', ')}</p>
                                </TableCell>
                                <TableCell>{renderStars(review.rating)}</TableCell>
                                <TableCell className="max-w-[300px]">
                                    <p className="text-xs truncate" title={review.comment}>{review.comment}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        {review.isFlagged && <Badge variant="destructive" className="text-[10px] w-fit"><Flag className="h-2.5 w-2.5 mr-0.5" />Flagged</Badge>}
                                        {review.isApproved ? <Badge variant="success" className="text-[10px] w-fit">Approved</Badge> : !review.isFlagged && <Badge variant="secondary" className="text-[10px] w-fit">Pending</Badge>}
                                        {!review.isVisible && <Badge variant="outline" className="text-[10px] w-fit"><EyeOff className="h-2.5 w-2.5 mr-0.5" />Hidden</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('en-IN')}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedReview(review)} title="View Details">
                                            <Eye className="h-3.5 w-3.5" />
                                        </Button>
                                        {!review.isApproved && (
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-600" onClick={() => handleApprove(review._id)} title="Approve">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                        {review.isVisible && (
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-amber-600" onClick={() => handleHide(review._id)} title="Hide">
                                                <EyeOff className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Review Detail Modal */}
            {selectedReview && (
                <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" /> Review Details
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">User</p>
                                    <p className="font-semibold text-sm">{selectedReview.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{selectedReview.user.email}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Astrologer</p>
                                    <p className="font-semibold text-sm">{selectedReview.astrologer.name}</p>
                                    <p className="text-xs text-muted-foreground">{selectedReview.astrologer.specializations.join(', ')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {renderStars(selectedReview.rating)}
                                {selectedReview.isFlagged && <Badge variant="destructive" className="text-[10px]"><Flag className="h-2.5 w-2.5 mr-0.5" />Flagged</Badge>}
                                {selectedReview.isApproved ? <Badge variant="success" className="text-[10px]">Approved</Badge> : <Badge variant="secondary" className="text-[10px]">Pending</Badge>}
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Comment</p>
                                <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-lg">{selectedReview.comment}</p>
                            </div>

                            {selectedReview.flagReason && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-[10px] uppercase tracking-widest text-red-800 font-bold mb-1">Flag Reason</p>
                                    <p className="text-sm text-red-700">{selectedReview.flagReason}</p>
                                </div>
                            )}

                            {selectedReview.adminNotes && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <p className="text-[10px] uppercase tracking-widest text-amber-800 font-bold mb-1">Admin Notes</p>
                                    <p className="text-sm text-amber-700">{selectedReview.adminNotes}</p>
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">Submitted on {new Date(selectedReview.createdAt).toLocaleString('en-IN')}</p>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            {!selectedReview.isApproved && (
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { handleApprove(selectedReview._id); setSelectedReview({ ...selectedReview, isApproved: true, isVisible: true, isFlagged: false }); }}>
                                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => { handleHide(selectedReview._id); setSelectedReview({ ...selectedReview, isVisible: false }); }}>
                                <EyeOff className="h-4 w-4 mr-1" /> Hide
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(selectedReview._id)}>
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
