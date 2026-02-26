"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useCreateAdminCourse, useUpdateAdminCourse } from "@/lib/hooks/use-courses"

const moduleSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, "Module title is required"),
    description: z.string(),
    videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    duration: z.string().optional(),
    order: z.number().int().min(0),
})

const courseSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    instructor: z.string().min(2, "Instructor name is required"),
    thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    tags: z.array(z.string()).default([]),
    isFeatured: z.boolean().default(false),
    modules: z.array(moduleSchema),
})

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
    initialData?: CourseFormValues & { _id: string };
}

export function CourseForm(props: CourseFormProps) {
    const { initialData } = props;
    const router = useRouter();

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            category: initialData?.category || "",
            level: initialData?.level || "Beginner",
            instructor: (initialData as any)?.instructor || "",
            thumbnail: initialData?.thumbnail || "",
            tags: initialData?.tags || [],
            isFeatured: initialData?.isFeatured || false,
            modules: initialData?.modules?.map((m, i) => ({
                ...m,
                order: m.order ?? i,
                duration: m.duration?.toString() || "0" // Keep as string for input, convert on submit
            })) || [
                    { title: "Introduction", description: "", videoUrl: "", duration: "10", order: 0 }
                ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "modules",
    })

    const { mutate: createCourse, isPending: isCreating } = useCreateAdminCourse();
    const { mutate: updateCourse, isPending: isUpdating } = useUpdateAdminCourse();

    async function onSubmit(data: CourseFormValues) {
        const formattedData: any = {
            ...data,
            tags: Array.isArray(data.tags) ? data.tags : [],
            modules: data.modules.map((m, i) => ({
                ...m,
                order: i,
                duration: typeof m.duration === 'string' ? parseInt(m.duration) || 0 : m.duration
            }))
        };

        if (initialData) {
            updateCourse({ id: initialData._id, ...formattedData }, {
                onSuccess: () => {
                    router.push('/admin/admin-courses');
                    router.refresh();
                }
            });
        } else {
            createCourse(formattedData, {
                onSuccess: () => {
                    router.push('/admin/admin-courses');
                    router.refresh();
                }
            });
        }
    }

    const isLoadingSubmit = isCreating || isUpdating;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control as any}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Advanced Vedic Astrology" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Course description..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="instructor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instructor Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Dr. Ramesh Kumar" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control as any}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Astrology" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control as any}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Level</FormLabel>
                                            <FormControl>
                                                <select
                                                    className="w-full p-2 border rounded-md bg-transparent"
                                                    {...field}
                                                >
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control as any}
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as any}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="mt-1"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Featured Course</FormLabel>
                                            <FormDescription>
                                                This course will be highlighted on the platform.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Modules</CardTitle>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ title: "", description: "", videoUrl: "", duration: "10", order: fields.length })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Module
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md relative">
                                    <div className="grid gap-4 flex-1">
                                        <FormField
                                            control={form.control as any}
                                            name={`modules.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Module Title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control as any}
                                                name={`modules.${index}.videoUrl`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Video URL" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control as any}
                                                name={`modules.${index}.duration`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Duration (e.g. 10m)" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isLoadingSubmit}>
                        {isLoadingSubmit ? "Saving..." : props.initialData ? "Update Course" : "Create Course"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
