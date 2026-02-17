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

const moduleSchema = z.object({
    title: z.string().min(1, "Module title is required"),
    description: z.string(),
    videoUrl: z.string().url("Must be a valid URL"),
    duration: z.string(),
})

const courseSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(0, "Price must be positive"),
    thumbnail: z.any().optional(), // For file upload handling later
    modules: z.array(moduleSchema),
})

type CourseFormValues = {
    title: string;
    description: string;
    price: number;
    thumbnail?: any;
    modules: {
        title: string;
        description: string;
        videoUrl: string;
        duration: string;
    }[];
};

interface CourseFormProps {
    initialData?: CourseFormValues & { id: string };
}

export function CourseForm(props: CourseFormProps) {
    const { initialData } = props;
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: initialData || {
            title: "",
            description: "",
            price: 0,
            modules: [
                { title: "Introduction", description: "", videoUrl: "", duration: "" }
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "modules",
    })

    async function onSubmit(data: CourseFormValues) {
        setLoading(true);
        try {
            if (initialData) {
                await api.put(`/courses/${initialData.id}`, data);
                toast.success("Course updated successfully");
            } else {
                await api.post('/courses', data);
                toast.success("Course created successfully");
            }
            router.push('/admin/courses');
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

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
                                control={form.control}
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
                                control={form.control}
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
                                control={form.control}
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
                            <FormItem>
                                <FormLabel>Thumbnail</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/*" />
                                </FormControl>
                                <FormDescription>Upload a course thumbnail image.</FormDescription>
                            </FormItem>
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Modules</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", description: "", videoUrl: "", duration: "" })}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Module
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start border p-4 rounded-md relative">
                                    <div className="grid gap-4 flex-1">
                                        <FormField
                                            control={form.control}
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
                                                control={form.control}
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
                                                control={form.control}
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
                    <Button type="submit" size="lg" disabled={loading}>
                        {loading ? "Saving..." : props.initialData ? "Update Course" : "Create Course"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
