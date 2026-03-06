'use client';

import { useState } from 'react';
import { MOCK_WALLET_TRANSACTIONS, MOCK_WITHDRAWALS, WalletTransaction, WithdrawalRequest } from '@/lib/mock-data/wallet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Search, Wallet, ArrowUpRight, ArrowDownLeft, IndianRupee, CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WalletPage() {
    const [transactions] = useState<WalletTransaction[]>(
        MOCK_WALLET_TRANSACTIONS.filter((t: any) => t.reason !== 'refund' && t.reason !== 'referral')
    );
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(MOCK_WITHDRAWALS);
    const [search, setSearch] = useState('');
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
    const [adminComment, setAdminComment] = useState('');

    const handleApproveWithdrawal = (id: string) => {
        setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status: 'Approved' as const, adminComments: adminComment || 'Approved by admin' } : w));
        toast.success('Withdrawal approved');
        setSelectedWithdrawal(null);
        setAdminComment('');
    };

    const handleRejectWithdrawal = (id: string) => {
        if (!adminComment.trim()) { toast.error('Please provide a reason for rejection'); return; }
        setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status: 'Rejected' as const, adminComments: adminComment } : w));
        toast.success('Withdrawal rejected');
        setSelectedWithdrawal(null);
        setAdminComment('');
    };

    const handleProcessWithdrawal = (id: string) => {
        setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status: 'Processed' as const, processedAt: new Date().toISOString() } : w));
        toast.success('Withdrawal marked as processed');
        setSelectedWithdrawal(null);
    };

    const totalCredits = transactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
    const totalDebits = transactions.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending');
    const pendingAmount = pendingWithdrawals.reduce((a, w) => a + w.amount, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Wallet & Withdrawals</h2>
                    <p className="text-muted-foreground text-sm">Manage user wallets, view transactions, and process astrologer withdrawals.</p>
                </div>
                <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <ArrowDownLeft className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                    <p className="text-xl font-bold text-emerald-700">₹{totalCredits.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] font-medium text-emerald-600">Total Credits</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                    <ArrowUpRight className="h-4 w-4 mx-auto text-red-600 mb-1" />
                    <p className="text-xl font-bold text-red-700">₹{totalDebits.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] font-medium text-red-600">Total Debits</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <Clock className="h-4 w-4 mx-auto text-amber-600 mb-1" />
                    <p className="text-xl font-bold text-amber-700">{pendingWithdrawals.length}</p>
                    <p className="text-[11px] font-medium text-amber-600">Pending Withdrawals</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <IndianRupee className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <p className="text-xl font-bold text-purple-700">₹{pendingAmount.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] font-medium text-purple-600">Pending Amount</p>
                </div>
            </div>

            <Tabs defaultValue="withdrawals" className="w-full">
                <TabsList>
                    <TabsTrigger value="withdrawals">Withdrawal Requests {pendingWithdrawals.length > 0 && <Badge variant="destructive" className="ml-1 text-[10px] h-4 px-1">{pendingWithdrawals.length}</Badge>}</TabsTrigger>
                    <TabsTrigger value="transactions">User Transactions</TabsTrigger>
                </TabsList>

                {/* Withdrawals Tab */}
                <TabsContent value="withdrawals">
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Astrologer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Bank Details</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawals.map(w => (
                                    <TableRow key={w._id} className={w.status === 'Pending' ? 'bg-amber-50/30' : ''}>
                                        <TableCell>
                                            <p className="font-medium text-sm">{w.astrologer.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{w.astrologer.email}</p>
                                        </TableCell>
                                        <TableCell className="font-bold text-sm">₹{w.amount.toLocaleString('en-IN')}</TableCell>
                                        <TableCell>
                                            <p className="text-xs">{w.astrologer.bankDetails.bankName}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono">{w.astrologer.bankDetails.accountNumber}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={w.status === 'Pending' ? 'secondary' : w.status === 'Approved' ? 'default' : w.status === 'Processed' ? 'success' : 'destructive'} className="text-[10px]">
                                                {w.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{new Date(w.createdAt).toLocaleDateString('en-IN')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => { setSelectedWithdrawal(w); setAdminComment(w.adminComments || ''); }}>
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions">
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Balance After</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map(t => (
                                    <TableRow key={t._id}>
                                        <TableCell className="font-medium text-sm">{t.user.name}</TableCell>
                                        <TableCell>
                                            {t.type === 'credit' ? (
                                                <Badge variant="success" className="text-[10px]"><ArrowDownLeft className="h-2.5 w-2.5 mr-0.5" />Credit</Badge>
                                            ) : (
                                                <Badge variant="destructive" className="text-[10px]"><ArrowUpRight className="h-2.5 w-2.5 mr-0.5" />Debit</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className={`font-bold text-sm ${t.type === 'credit' ? 'text-emerald-700' : 'text-red-700'}`}>
                                            {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                                        </TableCell>
                                        <TableCell><Badge variant="outline" className="text-[10px] capitalize">{t.reason}</Badge></TableCell>
                                        <TableCell className="text-xs max-w-[200px] truncate">{t.description}</TableCell>
                                        <TableCell className="font-semibold text-sm">₹{t.balanceAfter.toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString('en-IN')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Withdrawal Detail Dialog */}
            {selectedWithdrawal && (
                <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" /> Withdrawal Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-3">
                                <p className="font-semibold">{selectedWithdrawal.astrologer.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedWithdrawal.astrologer.email}</p>
                            </div>

                            <div className="bg-emerald-50 rounded-lg p-4 text-center">
                                <p className="text-3xl font-bold text-emerald-700">₹{selectedWithdrawal.amount.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-emerald-600">Requested Amount</p>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-3">
                                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1 flex items-center gap-1"><Building2 className="h-3 w-3" /> Bank Details</h4>
                                <p className="text-sm font-semibold">{selectedWithdrawal.astrologer.bankDetails.accountHolderName}</p>
                                <p className="text-xs text-blue-700">{selectedWithdrawal.astrologer.bankDetails.bankName}</p>
                                <p className="text-xs font-mono text-blue-600">A/C: {selectedWithdrawal.astrologer.bankDetails.accountNumber} · IFSC: {selectedWithdrawal.astrologer.bankDetails.ifscCode}</p>
                            </div>

                            {selectedWithdrawal.adminComments && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <p className="text-[10px] uppercase tracking-widest text-amber-800 font-bold">Admin Comments</p>
                                    <p className="text-sm text-amber-700">{selectedWithdrawal.adminComments}</p>
                                </div>
                            )}

                            {selectedWithdrawal.status === 'Pending' && (
                                <div className="space-y-2">
                                    <Label>Admin Comment</Label>
                                    <Textarea value={adminComment} onChange={e => setAdminComment(e.target.value)} placeholder="Add a comment (required for rejection)..." rows={3} />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            {selectedWithdrawal.status === 'Pending' && (
                                <>
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApproveWithdrawal(selectedWithdrawal._id)}>
                                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleRejectWithdrawal(selectedWithdrawal._id)}>
                                        <XCircle className="h-4 w-4 mr-1" /> Reject
                                    </Button>
                                </>
                            )}
                            {selectedWithdrawal.status === 'Approved' && (
                                <Button size="sm" onClick={() => handleProcessWithdrawal(selectedWithdrawal._id)}>
                                    <CheckCircle className="h-4 w-4 mr-1" /> Mark as Processed
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
