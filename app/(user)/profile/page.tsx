'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  const handleSave = async () => {
    try {
      console.log('Saving profile:', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Manage your profile information</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-linear-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <Button variant="outline">Change Avatar</Button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">Email Verification</p>
              <p className="text-sm text-slate-500">Your email is verified</p>
            </div>
            <div className="text-green-600">✓ Verified</div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">Phone Verification</p>
              <p className="text-sm text-slate-500">Your phone is verified</p>
            </div>
            <div className="text-green-600">✓ Verified</div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">KYC Verification</p>
              <p className="text-sm text-slate-500">Complete your KYC for full access</p>
            </div>
            <Button size="sm" variant="outline">
              Complete KYC
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
