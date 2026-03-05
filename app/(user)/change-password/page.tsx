'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/user/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password changed successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to change password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Change Password
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Update your account password</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
          <CardDescription>
            Enter your current password and set a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current"
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="new">New Password</Label>
            <Input
              id="new"
              type="password"
              placeholder="Enter new password (min 8 characters)"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
            <p className="text-xs text-slate-500 mt-2">
              Password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and symbols
            </p>
          </div>

          <div>
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
              Password Requirements:
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
              <li>✓ At least 8 characters long</li>
              <li>✓ Contains uppercase letters (A-Z)</li>
              <li>✓ Contains lowercase letters (a-z)</li>
              <li>✓ Contains numbers (0-9)</li>
              <li>✓ Contains special characters (!@#$%^&*)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
