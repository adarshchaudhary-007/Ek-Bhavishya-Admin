"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useUpdateAstrologer } from "@/lib/hooks/use-astrologers"

const astrologerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    experience: z.number().min(0, "Experience must be positive"),
    languages: z.string().min(2, "Languages are required"),
    skills: z.string().min(2, "Skills are required"),
    callRate: z.number().min(0, "Call rate must be positive"),
    chatRate: z.number().min(0, "Chat rate must be positive"),
    videoRate: z.number().min(0, "Video rate must be positive"),
})

type AstrologerFormValues = z.infer<typeof astrologerSchema>

interface EditAstrologerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    astrologer: any
}

export function EditAstrologerModal({ open, onOpenChange, astrologer }: EditAstrologerModalProps) {
    const { mutate: updateAstrologer, isPending } = useUpdateAstrologer()

    const form = useForm<AstrologerFormValues>({
        resolver: zodResolver(astrologerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            experience: 0,
            languages: "",
            skills: "",
            callRate: 0,
            chatRate: 0,
            videoRate: 0,
        },
    })

    useEffect(() => {
        if (astrologer && open) {
            const personalDetails = astrologer.personalDetails || {}
            const pricing = astrologer.pricing || {}
            
            form.reset({
                name: personalDetails.name || "",
                email: personalDetails.email || "",
                phone: personalDetails.phone || "",
                experience: personalDetails.experience || 0,
                languages: Array.isArray(personalDetails.languages) ? personalDetails.languages.join(", ") : personalDetails.languages || "",
                skills: Array.isArray(personalDetails.skills) ? personalDetails.skills.join(", ") : personalDetails.skills || "",
                callRate: pricing.call || 0,
                chatRate: pricing.chat || 0,
                videoRate: pricing.video || 0,
            })
        }
    }, [astrologer, open, form])

    function onSubmit(data: AstrologerFormValues) {
        // Backend expects flat structure with callPrice, chatPrice, videoPrice
        const updateData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            experience: data.experience,
            languages: data.languages.split(",").map(l => l.trim()),
            skills: data.skills.split(",").map(s => s.trim()),
            callPrice: data.callRate,
            chatPrice: data.chatRate,
            videoPrice: data.videoRate,
        }

        console.log('[EditAstrologerModal] Submitting astrologer update:', updateData)

        updateAstrologer(
            { id: astrologer._id, data: updateData },
            {
                onSuccess: (response) => {
                    console.log('[EditAstrologerModal] Update successful:', response)
                    onOpenChange(false)
                },
                onError: (error) => {
                    console.error('[EditAstrologerModal] Update failed:', error)
                }
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Astrologer</DialogTitle>
                    <DialogDescription>
                        Update the astrologer profile details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Astrologer name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email address" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone number" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Experience (years)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Years of experience"
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="languages"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Languages (comma-separated)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., English, Hindi, Tamil" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Skills (comma-separated)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g., Vedic Astrology, Tarot Reading"
                                            {...field}
                                            rows={2}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="callRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Call Rate</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Rate"
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="chatRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chat Rate</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Rate"
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="videoRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video Rate</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Rate"
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Updating..." : "Update Astrologer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
