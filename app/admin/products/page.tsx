'use client';

import { useState } from 'react';
import {
    useProducts,
    useDeleteProduct
} from '@/lib/hooks/use-products';
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
    DialogFooter,
} from '@/components/ui/dialog';
import { RefreshCw, Search, Eye, Package, Store, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types';

const PRODUCT_CATEGORIES = [
    'Gemstones',
    'Rudraksha',
    'Pooja Items',
    'Yantra',
    'Crystals',
    'Vastu Items',
    'Other'
];

export default function ProductsPage() {
    const [filter, setFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Fetch dynamic products
    const { data: productsData, isLoading, refetch } = useProducts({
        search: search || undefined,
        status: filter !== 'all' ? filter : undefined,
    });

    const deleteMutation = useDeleteProduct();

    // The user requested to KEEP LISTED PRODUCTS ONLY in this page.
    const products = productsData?.products?.filter(p => p.is_verified) || [];

    const filteredProducts = products.filter(p => {
        const matchCategory = categoryFilter === 'all' || p.category_id?.name === categoryFilter;
        return matchCategory;
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteMutation.mutateAsync(id);
            setSelectedProduct(null);
            toast.success('Product deleted successfully');
        } catch (error) { toast.error('Failed to delete product'); }
    };

    const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Listed Products</h2>
                    <p className="text-muted-foreground text-sm">View and manage verified seller products listed on the platform.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Package className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <p className="text-2xl font-bold text-blue-700">{products.length}</p>
                    <p className="text-[11px] font-medium text-blue-600">Total Listed Products</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <ShieldCheck className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                    <p className="text-2xl font-bold text-emerald-700">{products.length - outOfStockCount}</p>
                    <p className="text-[11px] font-medium text-emerald-600">In Stock</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                    <ShieldOff className="h-4 w-4 mx-auto text-red-600 mb-1" />
                    <p className="text-2xl font-bold text-red-700">{outOfStockCount}</p>
                    <p className="text-[11px] font-medium text-red-600">Out of Stock</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {PRODUCT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Seller</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground opacity-50"><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" /> Loading products...</TableCell></TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>
                        ) : filteredProducts.map(product => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <p className="font-semibold text-sm max-w-[200px] truncate">{product.product_name}</p>
                                    <p className="text-[10px] text-muted-foreground">{product.status}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm flex items-center gap-1"><Store className="h-3 w-3 text-muted-foreground" />{product.seller_id?.business_name || 'Personal Seller'}</p>
                                    <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{product.seller_id?.fullname}</p>
                                </TableCell>
                                <TableCell><Badge variant="outline" className="text-[10px]">{product.category_id?.name || 'N/A'}</Badge></TableCell>
                                <TableCell>
                                    <p className="font-bold text-sm">₹{product.selling_price.toLocaleString('en-IN')}</p>
                                    {product.base_price > product.selling_price && <p className="text-[10px] text-muted-foreground line-through">₹{product.base_price.toLocaleString('en-IN')}</p>}
                                </TableCell>
                                <TableCell>
                                    <span className={`text-sm font-bold ${product.stock_count === 0 ? 'text-red-600' : product.stock_count < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                        {product.stock_count}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details" onClick={() => setSelectedProduct(product)}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700" title="Delete" onClick={() => handleDelete(product._id)} disabled={deleteMutation.isPending}><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> {selectedProduct.product_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="success" className="text-xs"><ShieldCheck className="h-3 w-3 mr-0.5" />Verified</Badge>
                                <Badge variant="outline" className="text-xs">{selectedProduct.category_id?.name}</Badge>
                                <Badge variant={selectedProduct.status === 'Published' ? 'default' : selectedProduct.status === 'Out of Stock' ? 'destructive' : 'secondary'} className="text-xs font-bold">{selectedProduct.status}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-0.5">Seller Business</p>
                                    <p className="text-sm font-semibold flex items-center gap-1"><Store className="h-3.5 w-3.5" />{selectedProduct.seller_id?.business_name || 'N/A'}</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-0.5">Seller Name</p>
                                    <p className="text-sm font-semibold">{selectedProduct.seller_id?.fullname || 'N/A'}</p>
                                </div>
                            </div>

                            <p className="text-sm leading-relaxed text-muted-foreground border-l-2 pl-3 py-1 italic">{selectedProduct.description}</p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100/50">
                                    <p className="text-xl font-black text-emerald-700">₹{selectedProduct.selling_price.toLocaleString('en-IN')}</p>
                                    {selectedProduct.base_price > selectedProduct.selling_price && <p className="text-xs text-muted-foreground line-through decoration-red-400">₹{selectedProduct.base_price.toLocaleString('en-IN')}</p>}
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Selling Price</p>
                                </div>
                                <div className={`rounded-lg p-3 text-center border ${selectedProduct.stock_count === 0 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                                    <p className={`text-xl font-black ${selectedProduct.stock_count === 0 ? 'text-red-700' : 'text-blue-700'}`}>{selectedProduct.stock_count}</p>
                                    <p className={`text-[10px] font-bold uppercase ${selectedProduct.stock_count === 0 ? 'text-red-600' : 'text-blue-600'}`}>Available Stock</p>
                                </div>
                            </div>

                            {selectedProduct.images && selectedProduct.images.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto py-2">
                                    {selectedProduct.images.map((img, idx) => (
                                        <img key={idx} src={img} alt="Product" className="h-16 w-16 object-cover rounded border" />
                                    ))}
                                </div>
                            )}
                        </div>
                        <DialogFooter className="border-t pt-4">
                            <Button variant="destructive" className="w-full" onClick={() => handleDelete(selectedProduct._id)} disabled={deleteMutation.isPending}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Product from Marketplace
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
