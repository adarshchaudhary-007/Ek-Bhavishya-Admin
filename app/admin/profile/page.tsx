"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Lock, Camera, Save, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAdminProfile, useUpdateAdminProfile, useChangeAdminPassword } from '@/lib/hooks/use-admin'

export default function AdminProfilePage() {
    const { data: profileResponse, isLoading: isLoadingProfile } = useAdminProfile()
    const updateProfileMutation = useUpdateAdminProfile()
    const changePasswordMutation = useChangeAdminPassword()

    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const admin = profileResponse?.admin || profileResponse?.data || profileResponse || {}

    const [profileForm, setProfileForm] = useState({
        name: '',
        email: ''
    })

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // Sync profile form with fetched data
    useEffect(() => {
        if (admin?.name || admin?.email) {
            setProfileForm({
                name: admin.name || '',
                email: admin.email || ''
            })
        }
    }, [admin?.name, admin?.email])

    const handleProfileUpdate = () => {
        updateProfileMutation.mutate(
            { name: profileForm.name, email: profileForm.email },
            {
                onSuccess: () => {
                    setIsEditingProfile(false)
                },
            }
        )
    }

    const handlePasswordChange = () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error('All password fields are required')
            return
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long')
            return
        }

        changePasswordMutation.mutate(
            {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            },
            {
                onSuccess: () => {
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                    setIsChangingPassword(false)
                },
            }
        )
    }

    const handleCancelEdit = () => {
        setProfileForm({
            name: admin?.name || '',
            email: admin?.email || ''
        })
        setIsEditingProfile(false)
    }

    const handleCancelPasswordChange = () => {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setIsChangingPassword(false)
    }

    if (isLoadingProfile) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Profile Settings</h2>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            <Separator />

            {/* Profile Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        Update your personal information and profile picture
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="" alt={admin?.name} />
                            <AvatarFallback className="text-2xl bg-primary/10">
                                {(admin?.name || 'A').split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm" disabled>
                                <Camera className="h-4 w-4 mr-2" />
                                Change Photo
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG or GIF. Max size 2MB
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Profile Form */}
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={isEditingProfile ? profileForm.name : (admin?.name || '')}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    disabled={!isEditingProfile}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={isEditingProfile ? profileForm.email : (admin?.email || '')}
                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                    disabled={!isEditingProfile}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                value={admin?.role || 'Admin'}
                                disabled
                                className="bg-muted"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            {!isEditingProfile ? (
                                <Button onClick={() => setIsEditingProfile(true)}>
                                    Edit Profile
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={handleProfileUpdate} disabled={updateProfileMutation.isPending}>
                                        {updateProfileMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        Save Changes
                                    </Button>
                                    <Button variant="outline" onClick={handleCancelEdit} disabled={updateProfileMutation.isPending}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Update your password to keep your account secure
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isChangingPassword ? (
                        <Button onClick={() => setIsChangingPassword(true)}>
                            Change Password
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    placeholder="Enter new password (min 8 characters)"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button onClick={handlePasswordChange} disabled={changePasswordMutation.isPending}>
                                    {changePasswordMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Update Password
                                </Button>
                                <Button variant="outline" onClick={handleCancelPasswordChange} disabled={changePasswordMutation.isPending}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Account Information
                    </CardTitle>
                    <CardDescription>
                        View your account details and status
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label className="text-muted-foreground">Account Status</Label>
                            <p className="text-sm font-medium mt-1">Active</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Role</Label>
                            <p className="text-sm font-medium mt-1 capitalize">{admin?.role || 'admin'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Account ID</Label>
                            <p className="text-sm font-medium mt-1 font-mono">{admin?._id || admin?.id || '—'}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Member Since</Label>
                            <p className="text-sm font-medium mt-1">
                                {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
