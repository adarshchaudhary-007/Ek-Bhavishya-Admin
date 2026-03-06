'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, User, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';

const categories = ['All', 'Astrology', 'Horoscope', 'Vastu', 'Numerology', 'Tarot', 'Remedies'];

export default function BlogsPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/user/blogs', { params: { search, page: 1, limit: 20 } });
      const data = res.data;
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setItems(list);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter((b: any) => b.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blogs & Articles</h1>
        <p className="text-emerald-600 text-sm mt-1">Explore astrology wisdom and cosmic insights</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-emerald-500" />
        <input
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="h-40 bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b: any) => (
            <div
              key={b._id}
              className="rounded-xl border border-gray-100 bg-white overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => router.push(`/blogs/${b._id}`)}
            >
              <div className="h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-emerald-300" />
              </div>
              <div className="p-4">
                {b.category && (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {b.category}
                  </span>
                )}
                <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {b.excerpt || b.content?.substring(0, 100) || 'Click to read more...'}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{b.author?.personalDetails?.name || 'Ek Bhavishya'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">No blogs found</p>
          <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
