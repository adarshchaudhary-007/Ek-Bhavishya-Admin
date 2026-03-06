'use client';

import { useState } from 'react';
import { MOCK_ORDERS, Order, ORDER_STATUSES } from '@/lib/mock-data/orders';
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
import { RefreshCw, Search, Eye, Package, Truck, IndianRupee, MapPin, Clock, XCircle, RotateCcw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusVariant = (s: string) => {
    if (['Delivered'].includes(s)) return 'success';
    if (['Cancelled', 'Failed', 'Refund Initiated', 'Refunded'].includes(s)) return 'destructive';
    if (['Shipped', 'Out for Delivery'].includes(s)) return 'default';
    return 'secondary';
};

const paymentVariant = (s: string) => {
    if (s === 'Paid') return 'success';
    if (s === 'Failed' || s === 'Refunded') return 'destructive';
    return 'secondary';
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const filtered = orders.filter(o => {
        const matchStatus = statusFilter === 'all' || o.order_status === statusFilter;
        const matchSearch = search === '' ||
            o.orderId.toLowerCase().includes(search.toLowerCase()) ||
            o.user.name.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const handleStatusChange = (orderId: string, newStatus: string) => {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, order_status: newStatus } : o));
        toast.success(`Order status updated to "${newStatus}"`);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground text-sm">Manage customer orders, track shipments, and process refunds.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.info('Refreshing...')}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: 'Total Orders', value: orders.length, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Pending', value: orders.filter(o => o.order_status === 'Pending').length, color: 'bg-amber-50 text-amber-700' },
                    { label: 'Processing', value: orders.filter(o => ['Processing', 'Confirmed', 'Packed'].includes(o.order_status)).length, color: 'bg-purple-50 text-purple-700' },
                    { label: 'Shipped', value: orders.filter(o => ['Shipped', 'Out for Delivery'].includes(o.order_status)).length, color: 'bg-cyan-50 text-cyan-700' },
                    { label: 'Refund Queue', value: orders.filter(o => o.order_status === 'Refund Initiated').length, color: 'bg-red-50 text-red-700' },
                ].map(stat => (
                    <div key={stat.label} className={`rounded-lg p-3 text-center ${stat.color}`}>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-[11px] font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by Order ID or Customer..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Orders Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No orders found</TableCell></TableRow>
                        ) : filtered.map(order => (
                            <TableRow key={order._id}>
                                <TableCell className="font-mono text-xs font-bold">{order.orderId}</TableCell>
                                <TableCell>
                                    <p className="font-medium text-sm">{order.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{order.user.phone}</p>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                                </TableCell>
                                <TableCell className="font-semibold text-sm">₹{order.finalAmount.toLocaleString('en-IN')}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <Badge variant={paymentVariant(order.payment_status) as any} className="text-[10px] w-fit">{order.payment_status}</Badge>
                                        <span className="text-[10px] text-muted-foreground">{order.payment_method}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusVariant(order.order_status) as any} className="text-[10px] font-bold">{order.order_status}</Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" /> {selectedOrder.orderId}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-5">
                            {/* Status Bar */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Badge variant={statusVariant(selectedOrder.order_status) as any} className="text-xs">{selectedOrder.order_status}</Badge>
                                    <Badge variant={paymentVariant(selectedOrder.payment_status) as any} className="text-xs">{selectedOrder.payment_status} ({selectedOrder.payment_method})</Badge>
                                </div>
                                <Select value={selectedOrder.order_status} onValueChange={v => { handleStatusChange(selectedOrder._id, v); setSelectedOrder({ ...selectedOrder, order_status: v }); }}>
                                    <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            {/* Customer & Seller */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Customer</h4>
                                    <p className="font-semibold text-sm">{selectedOrder.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{selectedOrder.user.email}</p>
                                    <p className="text-xs text-muted-foreground">{selectedOrder.user.phone}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Seller</h4>
                                    <p className="font-semibold text-sm">{selectedOrder.seller.businessName}</p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-blue-50 rounded-lg p-3">
                                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Shipping Address</h4>
                                <p className="text-sm text-blue-700">{selectedOrder.shippingAddress.name}</p>
                                <p className="text-xs text-blue-600">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} — {selectedOrder.shippingAddress.pincode}</p>
                                <p className="text-xs text-blue-600">{selectedOrder.shippingAddress.phone}</p>
                            </div>

                            {/* Tracking */}
                            {selectedOrder.tracking?.trackingId && (
                                <div className="bg-cyan-50 rounded-lg p-3">
                                    <h4 className="text-xs font-bold text-cyan-800 uppercase tracking-widest mb-1 flex items-center gap-1"><Truck className="h-3 w-3" /> Tracking</h4>
                                    <p className="text-sm font-mono text-cyan-700">{selectedOrder.tracking.trackingId}</p>
                                    <p className="text-xs text-cyan-600">Courier: {selectedOrder.tracking.courier} · ETA: {selectedOrder.tracking.estimatedDelivery}</p>
                                </div>
                            )}

                            <Separator />

                            {/* Items */}
                            <div>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Order Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items.map(item => (
                                        <div key={item._id} className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2">
                                            <div>
                                                <p className="text-sm font-semibold">{item.product.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.product.price.toLocaleString('en-IN')}</p>
                                            </div>
                                            <span className="text-sm font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-emerald-50 rounded-lg p-3">
                                <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span></div>
                                <div className="flex justify-between text-sm"><span>Shipping</span><span>₹{selectedOrder.shippingCharge.toLocaleString('en-IN')}</span></div>
                                {selectedOrder.discount > 0 && <div className="flex justify-between text-sm text-green-700"><span>Discount</span><span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span></div>}
                                <Separator className="my-1" />
                                <div className="flex justify-between text-base font-bold text-emerald-800"><span>Total</span><span>₹{selectedOrder.finalAmount.toLocaleString('en-IN')}</span></div>
                            </div>

                            {/* Cancellation */}
                            {selectedOrder.cancellationReason && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Cancellation</h4>
                                    {selectedOrder.cancelledBy && <p className="text-xs text-red-600 mb-0.5">Cancelled by: {selectedOrder.cancelledBy}</p>}
                                    <p className="text-sm text-red-700">{selectedOrder.cancellationReason}</p>
                                    {selectedOrder.refundAmount && <p className="text-sm font-bold text-red-800 mt-1">Refund: ₹{selectedOrder.refundAmount.toLocaleString('en-IN')}</p>}
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Placed: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated: {new Date(selectedOrder.updatedAt).toLocaleString('en-IN')}</span>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2 pt-2">
                                {selectedOrder.order_status === 'Pending' && (
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { handleStatusChange(selectedOrder._id, 'Confirmed'); setSelectedOrder({ ...selectedOrder, order_status: 'Confirmed' }); }}>
                                        <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                                    </Button>
                                )}
                                {['Pending', 'Confirmed', 'Processing'].includes(selectedOrder.order_status) && (
                                    <Button size="sm" variant="destructive" onClick={() => { handleStatusChange(selectedOrder._id, 'Cancelled'); setSelectedOrder({ ...selectedOrder, order_status: 'Cancelled' }); }}>
                                        <XCircle className="h-4 w-4 mr-1" /> Cancel
                                    </Button>
                                )}
                                {selectedOrder.order_status === 'Refund Initiated' && (
                                    <Button size="sm" variant="outline" onClick={() => { handleStatusChange(selectedOrder._id, 'Refunded'); setSelectedOrder({ ...selectedOrder, order_status: 'Refunded' }); }}>
                                        <RotateCcw className="h-4 w-4 mr-1" /> Process Refund
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
