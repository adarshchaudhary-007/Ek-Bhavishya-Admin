"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"

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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"

const users = [
    { label: "All Users", value: "all" },
    { label: "John Doe", value: "john" },
    { label: "Jane Smith", value: "jane" },
    { label: "Alice Johnson", value: "alice" },
] as const

const noticeSchema = z.object({
    title: z.string().min(2, "Title is required"),
    message: z.string().min(10, "Message is required"),
    users: z.array(z.string()).min(1, "Select at least one user or All"),
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
    const form = useForm<NoticeFormValues>({
        resolver: zodResolver(noticeSchema),
        defaultValues: {
            title: "",
            message: "",
            users: [],
            channels: {
                push: false,
                email: false,
                inApp: true,
            },
        },
    })

    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(data: NoticeFormValues) {
        setLoading(true);
        try {
            await api.post('/notices', data);
            toast.success("Notice Created & Sent Successfully");
            router.push('/admin/notices');
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create notice");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="users"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Target Users</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between",
                                                !field.value || field.value.length === 0 && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value && field.value.length > 0
                                                ? `${field.value.length} users selected`
                                                : "Select users"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search user..." />
                                        <CommandList>
                                            <CommandEmpty>No user found.</CommandEmpty>
                                            <CommandGroup>
                                                {users.map((user) => (
                                                    <CommandItem
                                                        value={user.label}
                                                        key={user.value}
                                                        onSelect={() => {
                                                            const current = field.value || []
                                                            const isSelected = current.includes(user.value)
                                                            if (isSelected) {
                                                                field.onChange(current.filter((val) => val !== user.value))
                                                            } else {
                                                                field.onChange([...current, user.value])
                                                            }
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value?.includes(user.value)
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {user.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Select users to receive this notice.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <FormLabel>Channels</FormLabel>
                    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
                                        <FormLabel>
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
                                        <FormLabel>
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
                                        <FormLabel>
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
                <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Create Notice"}</Button>
            </form>
        </Form>
    )
}
