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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useUpdateBlog } from "@/lib/hooks/use-blogs"

const blogSchema = z.object({
    title: z.string().min(2, "Title is required"),
    content: z.string().min(10, "Content is required"),
    authorName: z.string().min(2, "Author name is required"),
    authorEmail: z.string().min(2, "Author email is required"),
    status: z.enum(["Pending", "Approved", "Rejected"]),
})

type BlogFormValues = z.infer<typeof blogSchema>

interface EditBlogModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    blog: any
}

export function EditBlogModal({ open, onOpenChange, blog }: EditBlogModalProps) {
    const { mutate: updateBlog, isPending } = useUpdateBlog()

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            content: "",
            authorName: "",
            authorEmail: "",
            status: "Pending",
        },
    })

    useEffect(() => {
        if (blog && open) {
            console.log('[EditBlogModal] Blog data received:', blog)
            
            const authorName = blog.author?.personalDetails?.name || blog.author?.name || ""
            const authorEmail = blog.author?.personalDetails?.email || blog.author?.email || ""
            
            console.log('[EditBlogModal] Extracted author name:', authorName)
            console.log('[EditBlogModal] Extracted author email:', authorEmail)
            
            const formData = {
                title: blog.title || "",
                content: blog.content || "",
                authorName: authorName,
                authorEmail: authorEmail,
                status: blog.status || "Pending",
            }
            
            console.log('[EditBlogModal] Setting form data:', formData)
            
            form.reset(formData)
        }
    }, [blog, open, form])

    function onSubmit(data: BlogFormValues) {
        updateBlog(
            { blogId: blog._id, data },
            {
                onSuccess: () => {
                    onOpenChange(false)
                },
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Blog</DialogTitle>
                    <DialogDescription>
                        Update the blog post details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Blog title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Blog content"
                                            {...field}
                                            rows={6}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="authorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Author Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Author name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="authorEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Author Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Author email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Updating..." : "Update Blog"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
