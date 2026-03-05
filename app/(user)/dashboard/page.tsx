'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', calls: 4, courses: 2, remedies: 1 },
  { month: 'Feb', calls: 3, courses: 1, remedies: 2 },
  { month: 'Mar', calls: 2, courses: 3, remedies: 1 },
  { month: 'Apr', calls: 5, courses: 2, remedies: 3 },
];

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your astrology services, courses, and bookings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Active Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">0</div>
              <p className="text-xs text-slate-500 mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <p className="text-xs text-slate-500 mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">₹0</div>
              <p className="text-xs text-slate-500 mt-1">Available for use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">0</div>
              <p className="text-xs text-slate-500 mt-1">Total bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Browse Astrologers
          </Button>
          <Button size="lg" variant="outline">
            View Courses
          </Button>
          <Button size="lg" variant="outline">
            Book Remedies
          </Button>
          <Button size="lg" variant="outline">
            My Wallet
          </Button>
        </div>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Your activity for the last 4 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" fill="#10b981" />
                <Bar dataKey="courses" fill="#3b82f6" />
                <Bar dataKey="remedies" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
