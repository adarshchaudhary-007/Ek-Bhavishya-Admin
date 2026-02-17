"use client"

import { NoticeForm } from "@/components/notices/notice-form"

export default function NewNoticePage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Notice</h3>
                <p className="text-sm text-muted-foreground">
                    Send a new notice to users via Push, Email, or In-App.
                </p>
            </div>
            <NoticeForm />
        </div>
    )
}
