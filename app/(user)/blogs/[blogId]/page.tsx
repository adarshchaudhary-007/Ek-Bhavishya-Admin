'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.blogId as string;
  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/v1/user/blogs/${blogId}`);
        const data = res.data;
        setBlog(data?.data || data?.blog || data || null);
      } catch (e: any) {
        toast.error(e.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };
    if (blogId) load();
  }, [blogId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Blog not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/blogs')}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.push('/blogs')}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{blog.title}</h1>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{blog.author?.personalDetails?.name || 'Ek Bhavishya'}</span>
          </div>
          {blog.createdAt && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {blog.image && (
        <img
          src={typeof blog.image === 'string' ? blog.image.trim() : blog.image}
          alt={blog.title}
          className="max-h-72 rounded-lg border border-gray-200 object-cover w-full"
        />
      )}

      <div className="prose prose-sm text-gray-700 max-w-none">
        {blog.content}
      </div>
    </div>
  );
}
