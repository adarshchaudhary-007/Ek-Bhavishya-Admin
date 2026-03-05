import { ReactNode } from 'react';
import UserLayout from '@/components/layout/UserLayout';

export default function UserRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
