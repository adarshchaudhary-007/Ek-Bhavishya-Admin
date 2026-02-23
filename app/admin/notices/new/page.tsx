"use client"

import { NoticeForm } from "@/components/notices/notice-form"
import { BackButton } from "@/components/ui/back-button"

export default function NewNoticePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Create Notice</h3>
                    <p className="text-sm text-muted-foreground">
                        Send a new notice to users via Push, Email, or In-App.
                    </p>
                </div>
                <BackButton fallbackUrl="/admin/notices" />
            </div>
            <NoticeForm />
        </div>
    )
}
