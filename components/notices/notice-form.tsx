"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { useCreateNotice } from "@/lib/hooks/use-notices"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { toast } from "sonner"

const noticeSchema = z.object({
    title: z.string().min(2, "Title is required"),
    message: z.string().min(10, "Message is required"),
    type: z.enum(["platform_policy", "downtime_alert", "payment_notice", "warning_strike", "appreciation_message"]),
    userSelection: z.enum(["all", "specific"]),
    selectedUsers: z.array(z.string()).optional(),
    channels: z.object({
        push: z.boolean(),
        email: z.boolean(),
        inApp: z.boolean(),
    }).refine((data) => data.push || data.email || data.inApp, {
        message: "At least one channel must be selected",
        path: ["inApp"]
    }),
    scheduleDate: z.date().optional(),
})

type NoticeFormValues = z.infer<typeof noticeSchema>

export function NoticeForm() {
    const [users, setUsers] = useState<Array<{ _id: string; fullName?: string; email: string }>>([])
    const [loadingUsers, setLoadingUsers] = useState(false)

    const form = useForm<NoticeFormValues>({
        resolver: zodResolver(noticeSchema),
        defaultValues: {
            title: "",
            message: "",
            type: "platform_policy",
            userSelection: "all",
            selectedUsers: [],
            channels: {
                push: false,
                email: false,
                inApp: true,
            },
        },
    })

    const router = useRouter()
    const { mutate: createNotice, isPending } = useCreateNotice()

    // Fetch users on mount
    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true)
            try {
                const response = await api.get('/api/v1/admin/users')
                setUsers(response.data.data || [])
            } catch (error) {
                toast.error("Failed to load users")
            } finally {
                setLoadingUsers(false)
            }
        }
        fetchUsers()
    }, [])

    // Load duplicate data from sessionStorage if available
    useEffect(() => {
        const duplicateData = sessionStorage.getItem('duplicateNotice')
        if (duplicateData) {
            try {
                const data = JSON.parse(duplicateData)
                form.reset({
                    title: data.title || "",
                    message: data.message || "",
                    type: data.type || "platform_policy",
                    userSelection: data.user_ids && data.user_ids.length > 0 ? "specific" : "all",
                    selectedUsers: data.user_ids || [],
                    channels: {
                        push: data.push_notification || false,
                        email: data.email_notification || false,
                        inApp: data.in_app_notification || true,
                    },
                })
                sessionStorage.removeItem('duplicateNotice')
            } catch (error) {
                console.error('Failed to parse duplicate data:', error)
            }
        }
    }, [form])

    async function onSubmit(data: NoticeFormValues) {
        // Transform form data to API request format
        let user_ids: string[] = [];
        
        if (data.userSelection === "all") {
            user_ids = users.map(u => u._id);
        } else if (data.userSelection === "specific") {
            user_ids = data.selectedUsers || [];
        }

        if (user_ids.length === 0) {
            toast.error("Please select at least one user");
            return;
        }

        const requestData = {
            title: data.title,
            message: data.message,
            type: data.type,
            user_ids: user_ids,
            email_notification: data.channels.email,
            push_notification: data.channels.push,
            in_app_notification: data.channels.inApp,
            schedule_send: data.scheduleDate ? data.scheduleDate.toISOString() : null,
        }

        createNotice(requestData, {
            onSuccess: () => {
                router.push('/admin/notices')
                router.refresh()
            },
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Notice title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type your message here."
                                    {...field}
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notice Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select notice type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="platform_policy">Platform Policy</SelectItem>
                                    <SelectItem value="downtime_alert">Downtime Alert</SelectItem>
                                    <SelectItem value="payment_notice">Payment Notice</SelectItem>
                                    <SelectItem value="warning_strike">Warning Strike</SelectItem>
                                    <SelectItem value="appreciation_message">Appreciation Message</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select the type of notice you want to send.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="userSelection"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Target Users</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all" />
                                        <Label htmlFor="all" className="font-normal cursor-pointer">
                                            Send to all users
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="specific" id="specific" />
                                        <Label htmlFor="specific" className="font-normal cursor-pointer">
                                            Send to specific users
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.watch("userSelection") === "specific" && (
                    <FormField
                        control={form.control}
                        name="selectedUsers"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Users</FormLabel>
                                <div className="border rounded-md p-4 max-h-64 overflow-y-auto space-y-2">
                                    {loadingUsers ? (
                                        <div className="text-center py-4 text-muted-foreground">Loading users...</div>
                                    ) : users.length === 0 ? (
                                        <div className="text-center py-4 text-muted-foreground">No users found</div>
                                    ) : (
                                        <>
                                            <div className="flex items-center space-x-2 pb-2 border-b">
                                                <Checkbox
                                                    id="select-all"
                                                    checked={field.value?.length === users.length}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            field.onChange(users.map(u => u._id))
                                                        } else {
                                                            field.onChange([])
                                                        }
                                                    }}
                                                />
                                                <Label htmlFor="select-all" className="font-semibold cursor-pointer">
                                                    Select All ({users.length} users)
                                                </Label>
                                            </div>
                                            {users.map((user) => (
                                                <div key={user._id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={user._id}
                                                        checked={field.value?.includes(user._id)}
                                                        onCheckedChange={(checked) => {
                                                            const currentValue = field.value || []
                                                            const newValue = checked
                                                                ? [...currentValue, user._id]
                                                                : currentValue.filter((id) => id !== user._id)
                                                            field.onChange(newValue)
                                                        }}
                                                    />
                                                    <Label htmlFor={user._id} className="font-normal cursor-pointer flex-1">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm">{user.fullName || user.email}</span>
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </Label>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                <FormDescription>
                                    {field.value?.length || 0} user(s) selected
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="space-y-4">
                    <FormLabel>Notification Channels</FormLabel>
                    <div className="flex flex-row items-start space-x-6 rounded-md border p-4">
                        <FormField
                            control={form.control}
                            name="channels.push"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-normal">
                                            Push Notification
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="channels.email"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-normal">
                                            Email
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="channels.inApp"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-normal">
                                            In-App Notification
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    {form.formState.errors.channels && (
                        <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.channels.message || form.formState.errors.channels.root?.message}
                        </p>
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="scheduleDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Schedule Send (Optional)</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date()
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Leave blank to send immediately.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Sending..." : "Create Notice"}
                </Button>
            </form>
        </Form>
    )
}
