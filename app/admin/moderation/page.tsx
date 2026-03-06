'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Eye, FileText, GraduationCap, Wand2, Store, Star, Clock, AlertTriangle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

// Hooks
import { useProducts, useApproveProduct, useRejectProduct } from '@/lib/hooks/use-products';
import { useBlogs, useApproveBlog, useRejectBlog } from '@/lib/hooks/use-blogs';
import { useAllCourses, useApproveCourse, useRejectCourse } from '@/lib/hooks/use-courses';
import { useRemedies, useApproveRemedy, useRejectRemedy } from '@/lib/hooks/use-remedies';
import { useSellers, useApproveSeller, useRejectSeller } from '@/lib/hooks/use-sellers';

interface PendingItem {
    _id: string;
    title: string;
    subtitle: string;
    type: 'blog' | 'course' | 'remedy' | 'product' | 'review' | 'seller';
    submittedAt: string;
    submittedBy: string;
    originalItem?: any;
}

const MOCK_PENDING: PendingItem[] = [
    { _id: 'rev1', title: '5★ Review for Pandit Rajesh Kumar', subtitle: '"Absolutely amazing reading!"', type: 'review', submittedAt: '2026-03-05T14:00:00Z', submittedBy: 'Rahul Sharma' },
];

const typeConfig = {
    blog: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Blog' },
    course: { icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Course' },
    remedy: { icon: Wand2, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Remedy' },
    product: { icon: Store, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Product' },
    review: { icon: Star, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Review' },
    seller: { icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Seller' },
};

export default function ModerationPage() {
    const [mockItems, setMockItems] = useState<PendingItem[]>(MOCK_PENDING);

    // Queries
    const { data: productsData } = useProducts({ status: 'Draft' });
    const { data: blogsData } = useBlogs({ status: 'Pending' } as any);
    const { data: coursesData } = useAllCourses();
    const { data: remediesData } = useRemedies({ status: 'Pending' } as any);
    const { data: sellersData } = useSellers();

    // Mutations
    const approveProduct = useApproveProduct();
    const rejectProduct = useRejectProduct();

    const approveBlog = useApproveBlog();
    const rejectBlog = useRejectBlog();

    const approveCourse = useApproveCourse();
    const rejectCourse = useRejectCourse();

    const approveRemedy = useApproveRemedy();
    const rejectRemedy = useRejectRemedy();

    const approveSeller = useApproveSeller();
    const rejectSeller = useRejectSeller();

    // Mapping Data
    const pendingProducts: PendingItem[] = (productsData?.products || [])
        .filter((p: any) => !p.is_verified)
        .map((p: any) => ({
            _id: p._id,
            title: p.product_name,
            subtitle: `Product, ₹${p.selling_price.toLocaleString('en-IN')}`,
            type: 'product',
            submittedAt: p.createdAt || new Date().toISOString(),
            submittedBy: p.seller_id?.business_name || p.seller_id?.fullname || 'Unknown Seller',
            originalItem: p
        }));

    const pendingBlogs: PendingItem[] = (blogsData?.data || [])
        .filter((b: any) => b.status === 'Pending')
        .map((b: any) => ({
            _id: b._id,
            title: b.title,
            subtitle: `Blog Post`,
            type: 'blog',
            submittedAt: b.createdAt || new Date().toISOString(),
            submittedBy: b.author?.personalDetails?.name || b.author?.name || 'Unknown Author',
            originalItem: b
        }));

    const pendingCourses: PendingItem[] = (coursesData?.data || [])
        .filter((c: any) => c.status === 'Pending')
        .map((c: any) => ({
            _id: c._id,
            title: c.title,
            subtitle: `Course, ₹${c.price}`,
            type: 'course',
            submittedAt: c.createdAt || new Date().toISOString(),
            submittedBy: c.instructor || 'Unknown Instructor',
            originalItem: c
        }));

    const pendingRemedies: PendingItem[] = (remediesData?.data || remediesData?.remedies || [])
        .filter((r: any) => r.status === 'Pending')
        .map((r: any) => ({
            _id: r._id,
            title: r.title,
            subtitle: `Remedy, ₹${r.price}`,
            type: 'remedy',
            submittedAt: r.createdAt || new Date().toISOString(),
            submittedBy: r.astrologer_id?.name || 'Unknown Astrologer',
            originalItem: r
        }));

    const pendingSellers: PendingItem[] = (sellersData?.data || sellersData?.sellers || [])
        .filter((s: any) => s.status === 'Pending' || (!s.is_verified && s.status !== 'Rejected' && s.status !== 'Blocked' && !s.is_approved))
        .map((s: any) => ({
            _id: s._id,
            title: s.business_name || s.fullname,
            subtitle: `Seller Account`,
            type: 'seller',
            submittedAt: s.createdAt || new Date().toISOString(),
            submittedBy: s.fullname,
            originalItem: s
        }));

    const items = [
        ...pendingProducts,
        ...pendingBlogs,
        ...pendingCourses,
        ...pendingRemedies,
        ...pendingSellers,
        ...mockItems
    ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const handleApprove = async (item: PendingItem) => {
        try {
            switch (item.type) {
                case 'product': await approveProduct.mutateAsync(item._id); break;
                case 'blog': await approveBlog.mutateAsync(item._id); break;
                case 'course': await approveCourse.mutateAsync(item._id); break;
                case 'remedy': await approveRemedy.mutateAsync(item._id); break;
                case 'seller': await approveSeller.mutateAsync(item._id); break;
                default:
                    setMockItems(prev => prev.filter(i => i._id !== item._id));
                    toast.success(`${item.type} approved`);
                    return;
            }
            toast.success(`${item.type} approved successfully!`);
        } catch (error) { toast.error(`Failed to approve ${item.type}`); }
    };

    const handleReject = async (item: PendingItem) => {
        try {
            const reason = 'Rejected by Admin';
            switch (item.type) {
                case 'product': await rejectProduct.mutateAsync({ id: item._id, reason }); break;
                case 'blog': await rejectBlog.mutateAsync({ blogId: item._id, reason }); break;
                case 'course': await rejectCourse.mutateAsync({ id: item._id, rejectionReason: reason }); break;
                case 'remedy': await rejectRemedy.mutateAsync({ remedyId: item._id, reason }); break;
                case 'seller': await rejectSeller.mutateAsync(item._id); break;
                default:
                    setMockItems(prev => prev.filter(i => i._id !== item._id));
                    toast.success(`${item.type} rejected`);
                    return;
            }
            toast.success(`${item.type} rejected successfully!`);
        } catch (error) { toast.error(`Failed to reject ${item.type}`); }
    };

    const typeCount = (type: string) => items.filter(i => i.type === type).length;

    // Check loading state broadly
    const isLoading = false;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Content Moderation</h2>
                    <p className="text-muted-foreground text-sm">Unified queue for all platform approvals (Products, Blogs, Courses, Remedies, Sellers).</p>
                </div>
                {items.length > 0 && (
                    <Badge variant="destructive" className="text-sm px-3 py-1">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" /> {items.length} Pending
                    </Badge>
                )}
            </div>

            {/* Type Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {Object.entries(typeConfig).map(([type, config]) => {
                    const count = typeCount(type);
                    const Icon = config.icon;
                    return (
                        <div key={type} className={`${config.bg} rounded-lg p-3 text-center`}>
                            <Icon className={`h-4 w-4 mx-auto ${config.color} mb-1`} />
                            <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
                            <p className={`text-[11px] font-medium ${config.color}`}>{config.label}s</p>
                        </div>
                    );
                })}
            </div>

            {items.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
                        <h3 className="text-lg font-bold">All Clear!</h3>
                        <p className="text-sm text-muted-foreground">No pending items to moderate right now.</p>
                    </CardContent>
                </Card>
            ) : (
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="all">All ({items.length})</TabsTrigger>
                        {Object.entries(typeConfig).map(([type, config]) => {
                            const count = typeCount(type);
                            if (count === 0) return null;
                            return <TabsTrigger key={type} value={type}>{config.label}s ({count})</TabsTrigger>;
                        })}
                    </TabsList>

                    {['all', ...Object.keys(typeConfig)].map(tab => (
                        <TabsContent key={tab} value={tab} className="space-y-3">
                            {items.filter(i => tab === 'all' || i.type === tab).map(item => {
                                const config = typeConfig[item.type as keyof typeof typeConfig];
                                const Icon = config.icon;
                                return (
                                    <Card key={item._id} className="overflow-hidden">
                                        <div className={`flex items-center px-4 py-3 border-b ${config.bg}`}>
                                            <Icon className={`h-4 w-4 ${config.color} mr-2`} />
                                            <Badge variant="outline" className={`text-[10px] ${config.color} border-current`}>{config.label}</Badge>
                                            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {new Date(item.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                        <CardContent className="flex items-center justify-between py-3">
                                            <div>
                                                <p className="font-semibold text-sm">{item.title}</p>
                                                <p className="text-xs text-muted-foreground">{item.subtitle} · by {item.submittedBy}</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 ml-4">
                                                <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(item)}>
                                                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                                                </Button>
                                                <Button variant="destructive" size="sm" className="h-8 text-xs" onClick={() => handleReject(item)}>
                                                    <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    );
}
