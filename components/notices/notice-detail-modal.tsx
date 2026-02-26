"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useNoticeDetail, useNoticeNotifications } from "@/lib/hooks/use-notices"
import { LoadingSpinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface NoticeDetailModalProps {
    isOpen: boolean
    onClose: () => void
    noticeId: string
}

export function NoticeDetailModal({ isOpen, onClose, noticeId }: NoticeDetailModalProps) {
    const [activeTab, setActiveTab] = useState("details")

    const { data: noticeData, isLoading: noticeLoading } = useNoticeDetail(noticeId, isOpen)

    // Fetch all users to cross-reference with notice.user_ids
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/api/v1/admin/users')
            return response.data.data || []
        },
        enabled: isOpen && activeTab === "recipients"
    })

    // Only fetch notifications when the notifications tab is active
    const { data: notificationsData, isLoading: notificationsLoading } = useNoticeNotifications(
        noticeId,
        { page: 1, limit: 100 },
        isOpen && activeTab === "notifications"
    )

    const notice = noticeData?.data

    // Filter users that were targeted by this notice
    const targetedUsers = users?.filter((u: any) => notice?.user_ids?.includes(u._id)) || []

    const exportRecipients = () => {
        if (!targetedUsers.length) return

        const headers = ["User ID", "Name", "Email"]
        const csvContent = [
            headers.join(","),
            ...targetedUsers.map((u: any) => `"${u._id}","${u.fullName || ''}","${u.email}"`)
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `notice_${noticeId}_recipients.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                <DialogHeader>
                    <DialogTitle>Notice Details</DialogTitle>
                    <DialogDescription>
                        View notice information and delivery status
                    </DialogDescription>
                </DialogHeader>

                {noticeLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <LoadingSpinner className="h-8 w-8" />
                    </div>
                ) : notice ? (
                    <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="recipients">Recipients ({notice.user_ids?.length || 0})</TabsTrigger>
                            <TabsTrigger value="notifications">Delivery Status ({notice.sentCount || 0})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                            {/* Title */}
                            <div className="border-b pb-4">
                                <h3 className="font-semibold mb-2">Title</h3>
                                <p className="text-sm">{notice.title}</p>
                            </div>

                            {/* Message */}
                            <div className="border-b pb-4">
                                <h3 className="font-semibold mb-2">Message</h3>
                                <p className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded">{notice.message}</p>
                            </div>

                            {/* Type */}
                            <div className="border-b pb-4">
                                <h3 className="font-semibold mb-2">Type</h3>
                                <Badge variant="outline">{notice.type}</Badge>
                            </div>

                            {/* Notification Channels */}
                            <div className="border-b pb-4">
                                <h3 className="font-semibold mb-2">Notification Channels</h3>
                                <div className="flex gap-2">
                                    {notice.email_notification && <Badge>Email</Badge>}
                                    {notice.push_notification && <Badge>Push</Badge>}
                                    {notice.in_app_notification && <Badge>In-App</Badge>}
                                </div>
                            </div>

                            {/* Recipients */}
                            <div className="border-b pb-4">
                                <h3 className="font-semibold mb-2">Recipients</h3>
                                <p className="text-sm text-gray-600">Sent to {notice.user_ids?.length || 0} users</p>
                            </div>

                            {/* Schedule */}
                            {notice.schedule_send && (
                                <div className="border-b pb-4">
                                    <h3 className="font-semibold mb-2">Scheduled Send</h3>
                                    <p className="text-sm">{new Date(notice.schedule_send).toLocaleString()}</p>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="text-sm text-gray-500">
                                <p>Created: {new Date(notice.createdAt).toLocaleString()}</p>
                                {notice.updatedAt && (
                                    <p>Updated: {new Date(notice.updatedAt).toLocaleString()}</p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="recipients" className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Targeted Recipients List</h3>
                                <Button size="sm" variant="outline" onClick={exportRecipients} disabled={targetedUsers.length === 0}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>

                            {usersLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <LoadingSpinner className="h-6 w-6" />
                                </div>
                            ) : targetedUsers.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Email</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {targetedUsers.map((user: any) => (
                                                <TableRow key={user._id}>
                                                    <TableCell className="font-medium truncate max-w-[150px]" title={user.fullName || "N/A"}>
                                                        {user.fullName || "N/A"}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-gray-500">
                                                        {user.email}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400 border border-dashed rounded-lg">
                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p>No recipient data found for this notice IDs.</p>
                                    <p className="text-xs">The notice might have been sent to users who are no longer in the system.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="notifications" className="space-y-4">
                            {notificationsLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <LoadingSpinner className="h-6 w-6" />
                                </div>
                            ) : notificationsData?.data && notificationsData.data.length > 0 ? (
                                <>
                                    <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700 mb-2">
                                        These records show the actual transmission status from the service provider.
                                    </div>
                                    <div className="border rounded-lg">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>User ID</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Sent At</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {notificationsData.data.map((notification) => (
                                                    <TableRow key={notification._id}>
                                                        <TableCell className="font-mono text-xs max-w-[120px] truncate" title={notification.user_id}>
                                                            {notification.user_id}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="capitalize">{notification.delivery_type}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    notification.delivery_status === "delivered" || notification.delivery_status === "sent"
                                                                        ? "default"
                                                                        : notification.delivery_status === "failed"
                                                                            ? "destructive"
                                                                            : "secondary"
                                                                }
                                                                className="capitalize"
                                                            >
                                                                {notification.delivery_status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-xs">
                                                            {new Date(notification.sent_at).toLocaleString()}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
                                    <p>No live delivery status records found.</p>
                                    <p className="text-xs mt-2 max-w-[400px] mx-auto">
                                        Note: Delivery records are generated asynchronously. If the notice was just sent or scheduled,
                                        records might appear after a short delay. Tracking may also be disabled for certain channels.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        Notice not found
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
