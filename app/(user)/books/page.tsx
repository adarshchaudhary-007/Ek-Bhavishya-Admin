'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Sparkles, Filter, AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  type: string;
  isFree: boolean;
  price?: number;
  rating: number;
  reviewCount: number;
  coverImage?: string;
  isPurchased?: boolean;
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Astrology', 'Palmistry', 'Vastu', 'Numerology', 'Tarot', 'Spirituality', 'Wellness'];
  const types = ['Digital', 'Audio', 'Both'];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = { page: page.toString(), limit: '12' };
      if (searchTerm) params.search = searchTerm;
      if (selectedType) params.type = selectedType;
      if (selectedCategory) params.category = selectedCategory;

      const res = await api.get('/api/v1/user/books', { params });
      setBooks(res.data?.data || []);
      setTotalPages(res.data?.pagination?.pages || 1);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchBooks();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedType, selectedCategory]);

  useEffect(() => {
    fetchBooks();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            Astrology Books & Knowledge
          </h1>
          <p className="text-emerald-600 mt-1">Expand your cosmic wisdom with our curated collection</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-emerald-400" />
          <input
            placeholder="Search books, authors, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Book Type
            </p>
            <div className="flex gap-2 flex-wrap">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedType === type
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  )}
                >
                  {type === 'Digital' && <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />}
                  {type === 'Audio' && <AudioLines className="w-3.5 h-3.5 inline mr-1.5" />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600 mb-2">Category</p>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-emerald-200 text-emerald-700 hover:border-emerald-400'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
            <p className="text-emerald-600 text-lg font-medium">No books found</p>
            <p className="text-emerald-500 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {books.map(book => (
              <button
                key={book._id}
                onClick={() => router.push(`/books/${book._id}`)}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all text-left"
              >
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 h-40 flex items-center justify-center text-white">
                  <BookOpen className="w-12 h-12 opacity-30" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">{book.title}</h3>
                  <p className="text-[11px] text-emerald-600">{book.author}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-yellow-500 font-semibold">★ {(Number(book.rating) || 0).toFixed(1)}</span>
                    <span className="text-emerald-500">({book.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      {book.type}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {book.isFree ? 'Free' : `₹${book.price}`}
                    </span>
                  </div>
                  {book.isPurchased && (
                    <div className="text-[11px] font-semibold text-white bg-emerald-600 rounded px-2 py-1 text-center">
                      ✓ In Your Library
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-9 h-9 rounded-lg font-medium text-sm',
                  page === p
                    ? 'bg-emerald-600 text-white'
                    : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
