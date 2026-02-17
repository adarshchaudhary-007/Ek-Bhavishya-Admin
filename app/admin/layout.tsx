import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Astro Admin | Dashboard',
    description: 'Admin dashboard overview',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
