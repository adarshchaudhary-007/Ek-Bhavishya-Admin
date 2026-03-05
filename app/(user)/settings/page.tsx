'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    calls: true,
    messages: true,
    courses: true,
    promotions: false,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Manage your account preferences</p>
      </div>

      {/* Theme Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control what notifications you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Call Notifications</Label>
              <p className="text-sm text-slate-500">Get notified about incoming calls</p>
            </div>
            <Checkbox
              checked={notifications.calls}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, calls: checked === true })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Message Notifications</Label>
              <p className="text-sm text-slate-500">Get notified about new messages</p>
            </div>
            <Checkbox
              checked={notifications.messages}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, messages: checked === true })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Course Notifications</Label>
              <p className="text-sm text-slate-500">Get notified about course updates</p>
            </div>
            <Checkbox
              checked={notifications.courses}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, courses: checked === true })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Promotional Emails</Label>
              <p className="text-sm text-slate-500">Receive special offers and promotions</p>
            </div>
            <Checkbox
              checked={notifications.promotions}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, promotions: checked === true })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Active Sessions
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Blocked Users
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            Deactivate Account
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account Permanently
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
