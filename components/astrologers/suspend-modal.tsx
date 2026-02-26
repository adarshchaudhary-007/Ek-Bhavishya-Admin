"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSuspendAstrologer } from "@/lib/hooks/use-astrologers"

const suspendSchema = z.object({
    suspensionReason: z.string().min(1, "Suspension reason is required"),
    suspendDays: z.number().min(1, "Suspension days must be at least 1"),
})

type SuspendFormValues = z.infer<typeof suspendSchema>

interface SuspendAstrologerModalProps {
    isOpen: boolean
    onClose: () => void
    astrologerId: string
    astrologerName: string
}

export function SuspendAstrologerModal({
    isOpen,
    onClose,
    astrologerId,
    astrologerName,
}: SuspendAstrologerModalProps) {
    const { mutate: suspendAstrologer, isPending } = useSuspendAstrologer()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SuspendFormValues>({
        resolver: zodResolver(suspendSchema),
        defaultValues: {
            suspensionReason: "",
            suspendDays: 1,
        },
    })

    const onSubmit = (data: SuspendFormValues) => {
        suspendAstrologer(
            {
                id: astrologerId,
                suspensionReason: data.suspensionReason,
                suspendDays: data.suspendDays,
            },
            {
                onSuccess: () => {
                    reset()
                    onClose()
                },
            }
        )
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Suspend Astrologer</DialogTitle>
                    <DialogDescription>
                        Suspend {astrologerName} from providing services
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="suspensionReason">Suspension Reason</Label>
                        <Textarea
                            id="suspensionReason"
                            placeholder="Explain why this astrologer is being suspended..."
                            {...register("suspensionReason")}
                            disabled={isPending}
                            rows={4}
                        />
                        {errors.suspensionReason && (
                            <p className="text-sm text-red-500">
                                {errors.suspensionReason.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="suspendDays">Suspension Days</Label>
                        <Input
                            id="suspendDays"
                            type="number"
                            min="1"
                            placeholder="Number of days"
                            {...register("suspendDays", { valueAsNumber: true })}
                            disabled={isPending}
                        />
                        {errors.suspendDays && (
                            <p className="text-sm text-red-500">
                                {errors.suspendDays.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending}
                        >
                            {isPending ? "Suspending..." : "Suspend Astrologer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
