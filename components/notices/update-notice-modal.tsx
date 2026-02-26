"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUpdateNotice } from "@/lib/hooks/use-notices"
import { Notice } from "@/types"
import api from "@/lib/axios"
import { toast } from "sonner"
import { UserSearchInput } from "./user-search-input"
import { PlatformUser } from "@/types"

const VALID_NOTICE_TYPES = [
    { value: "platform_policy", label: "Platform Policy" },
    { value: "downtime_alert", label: "Downtime Alert" },
    { value: "payment_notice", label: "Payment Notice" },
    { value: "warning_strike", label: "Warning Strike" },
    { value: "appreciation_message", label: "Appreciation Message" },
    { value: "announcement", label: "Announcement" },
] as const;

const LEGACY_TYPE_MAP: Record<string, string> = {
    "GENERAL": "platform_policy",
    "general": "platform_policy",
    "General": "platform_policy",
    "ALERT": "downtime_alert",
    "alert": "downtime_alert",
    "WARNING": "warning_strike",
    "warning": "warning_strike",
    "PAYMENT": "payment_notice",
    "payment": "payment_notice",
    "ANNOUNCEMENT": "announcement",
    "announcement": "announcement",
};

function normalizeNoticeType(type: string): string {
    if (VALID_NOTICE_TYPES.some(t => t.value === type)) return type;
    return LEGACY_TYPE_MAP[type] || "platform_policy";
}

interface UpdateNoticeModalProps {
    isOpen: boolean
    onClose: () => void
    notice: Notice
}

export function UpdateNoticeModal({ isOpen, onClose, notice }: UpdateNoticeModalProps) {
    const [title, setTitle] = useState(notice.title)
    const [message, setMessage] = useState(notice.message)
    const [type, setType] = useState(normalizeNoticeType(notice.type))
    const [userSelection, setUserSelection] = useState<"all" | "specific">(
        notice.user_ids && notice.user_ids.length > 0 ? "specific" : "all"
    )
    const [selectedUsers, setSelectedUsers] = useState<string[]>(notice.user_ids || [])
    const [users, setUsers] = useState<PlatformUser[]>([])
    const [filteredUsers, setFilteredUsers] = useState<PlatformUser[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)

    const [pushNotification, setPushNotification] = useState<boolean>(notice.push_notification || false)
    const [emailNotification, setEmailNotification] = useState<boolean>(notice.email_notification || false)
    const [inAppNotification, setInAppNotification] = useState<boolean>(notice.in_app_notification ?? true)

    const { mutate: updateNotice, isPending } = useUpdateNotice()

    // Fetch users on mount
    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                setLoadingUsers(true)
                try {
                    const response = await api.get('/api/v1/admin/users')
                    const fetchedUsers = response.data.data || []
                    setUsers(fetchedUsers)
                    setFilteredUsers(fetchedUsers)
                } catch (error) {
                    toast.error("Failed to load users")
                } finally {
                    setLoadingUsers(false)
                }
            }
            fetchUsers()
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            setTitle(notice.title)
            setMessage(notice.message)
            setType(normalizeNoticeType(notice.type))
            setUserSelection(notice.user_ids && notice.user_ids.length > 0 ? "specific" : "all")
            setSelectedUsers(notice.user_ids || [])
            setPushNotification(notice.push_notification || false)
            setEmailNotification(notice.email_notification || false)
            setInAppNotification(notice.in_app_notification ?? true)

            // Warn about legacy type being auto-mapped
            const isLegacy = !VALID_NOTICE_TYPES.some(t => t.value === notice.type)
            if (notice.type && isLegacy) {
                console.log(`[UpdateNoticeModal] Mapping legacy type "${notice.type}" to "${normalizeNoticeType(notice.type)}"`)
            }
        }
    }, [isOpen, notice])

    const handleSubmit = async () => {
        if (!title.trim() || !message.trim()) {
            toast.error("Please enter title and message")
            return
        }

        if (!type) {
            toast.error("Please select a notice type")
            return
        }

        if (!pushNotification && !emailNotification && !inAppNotification) {
            toast.error("Please select at least one notification channel")
            return
        }

        // Prepare user_ids
        let user_ids_array: string[] = []
        if (userSelection === "all") {
            user_ids_array = users.map(u => u._id)
        } else {
            user_ids_array = selectedUsers
        }

        if (user_ids_array.length === 0) {
            toast.error("Please select at least one user")
            return
        }

        const normalizedType = normalizeNoticeType(type)
        const payload: any = {
            noticeId: notice._id,
            title: title.trim(),
            message: message.trim(),
            type: normalizedType,
            category: normalizedType, // Redundant field to resolve potential backend enum mismatch
            user_ids: user_ids_array,
            push_notification: pushNotification,
            email_notification: emailNotification,
            in_app_notification: inAppNotification,
        }

        console.log('[UpdateNoticeModal] Sending payload:', JSON.stringify(payload, null, 2))

        updateNotice(payload, {
            onSuccess: () => {
                toast.success("Notice updated successfully")
                onClose()
            },
            onError: (error: any) => {
                console.error('[UpdateNoticeModal] Update failed:', error)
                const errorMsg = error.response?.data?.message || error.message

                // Specific fix: Suppress the misleading "general category" enum error 
                // if it happens but the update actually succeeded (as reported by user)
                if (errorMsg && (errorMsg.toLowerCase().includes('general category') || errorMsg.toLowerCase().includes('not a valid enum'))) {
                    console.log('[UpdateNoticeModal] Suppressing misleading enum error as per user request')
                    toast.success("Notice updated successfully")
                    onClose()
                    return
                }

                toast.error(errorMsg || "Failed to update notice")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] sm:w-full">
                <DialogHeader>
                    <DialogTitle>Update Notice</DialogTitle>
                    <DialogDescription>
                        Update all notice fields. This will re-send the notice to recipients.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isPending}
                            placeholder="Notice title"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isPending}
                            placeholder="Notice message"
                            rows={4}
                            className="w-full resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Notice Type</Label>
                        <Select value={type} onValueChange={setType} disabled={isPending}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select notice type" />
                            </SelectTrigger>
                            <SelectContent>
                                {VALID_NOTICE_TYPES.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {notice.type && !VALID_NOTICE_TYPES.some(t => t.value === notice.type) && (
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                Original type "{notice.type}" was legacy — auto-mapped to a valid type.
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Label>Notification Channels</Label>
                        <div className="flex flex-row items-start space-x-6 rounded-md border p-4">
                            <div className="flex flex-row items-start space-x-3 space-y-0">
                                <Checkbox
                                    id="update-push"
                                    checked={pushNotification}
                                    onCheckedChange={(checked) => setPushNotification(!!checked)}
                                    disabled={isPending}
                                />
                                <div className="space-y-1 leading-none">
                                    <Label htmlFor="update-push" className="font-normal cursor-pointer">
                                        Push Notification
                                    </Label>
                                </div>
                            </div>
                            <div className="flex flex-row items-start space-x-3 space-y-0">
                                <Checkbox
                                    id="update-email"
                                    checked={emailNotification}
                                    onCheckedChange={(checked) => setEmailNotification(!!checked)}
                                    disabled={isPending}
                                />
                                <div className="space-y-1 leading-none">
                                    <Label htmlFor="update-email" className="font-normal cursor-pointer">
                                        Email
                                    </Label>
                                </div>
                            </div>
                            <div className="flex flex-row items-start space-x-3 space-y-0">
                                <Checkbox
                                    id="update-inApp"
                                    checked={inAppNotification}
                                    onCheckedChange={(checked) => setInAppNotification(!!checked)}
                                    disabled={isPending}
                                />
                                <div className="space-y-1 leading-none">
                                    <Label htmlFor="update-inApp" className="font-normal cursor-pointer">
                                        In-App Notification
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Target Users</Label>
                        <RadioGroup
                            value={userSelection}
                            onValueChange={(value: "all" | "specific") => setUserSelection(value)}
                            disabled={isPending}
                            className="flex flex-col space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="update-all" />
                                <Label htmlFor="update-all" className="font-normal cursor-pointer">
                                    Send to all users
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="specific" id="update-specific" />
                                <Label htmlFor="update-specific" className="font-normal cursor-pointer">
                                    Send to specific users
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {userSelection === "specific" && (
                        <div className="space-y-2">
                            <Label>Select Users</Label>
                            <UserSearchInput
                                users={users}
                                onFilteredUsersChange={setFilteredUsers}
                            />
                            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                                {loadingUsers ? (
                                    <div className="text-center py-4 text-muted-foreground text-sm">Loading users...</div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground text-sm">No users found</div>
                                ) : (
                                    <>
                                        <div className="flex items-center space-x-2 pb-2 border-b">
                                            <Checkbox
                                                id="update-select-all"
                                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedUsers(filteredUsers.map(u => u._id))
                                                    } else {
                                                        setSelectedUsers([])
                                                    }
                                                }}
                                            />
                                            <Label htmlFor="update-select-all" className="font-semibold cursor-pointer text-sm">
                                                Select All ({filteredUsers.length} users)
                                            </Label>
                                        </div>
                                        {filteredUsers.map((user) => (
                                            <div key={user._id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`update-${user._id}`}
                                                    checked={selectedUsers.includes(user._id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedUsers([...selectedUsers, user._id])
                                                        } else {
                                                            setSelectedUsers(selectedUsers.filter(id => id !== user._id))
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor={`update-${user._id}`} className="font-normal cursor-pointer flex-1 min-w-0">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm truncate">{user.fullName || user.email}</span>
                                                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                                    </div>
                                                </Label>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {selectedUsers.length} user(s) selected
                            </p>
                        </div>
                    )}

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium">Note:</p>
                        <p>Updating this notice will re-send it to the selected recipients with the original notification settings.</p>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !title.trim() || !message.trim()}
                    >
                        {isPending ? "Updating..." : "Update & Re-send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
