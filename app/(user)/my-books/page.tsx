'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Play, MoreVertical, Trash2, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

interface BookPurchase {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    type: string;
    rating: number;
  };
  purchaseDate: string;
  readingProgress?: { currentPage: number; percentage: number };
  listeningProgress?: { currentTime: number; percentage: number };
}

export default function MyBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<BookPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'digital' | 'audio'>('all');

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = { page: '1', limit: '20' };
        if (filter !== 'all') params.type = filter === 'digital' ? 'Digital' : 'Audio';

        const res = await api.get('/api/v1/user/books/my-books', { params });
        setBooks(res.data?.data || []);
      } catch {
        console.error('Error fetching books');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBooks();
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            My Library
          </h1>
          <p className="text-emerald-600 mt-1">Your collection of purchased books and audiobooks</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['all', 'digital', 'audio'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50'
              }`}
            >
              {f === 'all' ? 'All Books' : f === 'digital' ? 'Digital Books' : 'Audiobooks'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Sparkles className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <p className="text-gray-600 text-lg font-medium">No books in your library</p>
          <p className="text-gray-500 text-sm mt-1">Browse and purchase books to get started</p>
          <Button
            onClick={() => router.push('/books')}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Browse Books
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {books.map(purchase => (
            <div
              key={purchase._id}
              className="bg-white rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-lg p-3 text-white mt-1">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{purchase.book.title}</h3>
                      <p className="text-sm text-gray-600">{purchase.book.author}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                          {purchase.book.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          ⭐ {(Number(purchase.book.rating) || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Purchased {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(purchase.readingProgress || purchase.listeningProgress) && (
                    <div className="ml-12 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-600 font-medium">
                          {purchase.readingProgress ? 'Reading' : 'Listening'} Progress
                        </span>
                        <span className="text-gray-900 font-bold">
                          {Math.round(purchase.readingProgress?.percentage || purchase.listeningProgress?.percentage || 0)}%
                        </span>
                      </div>
                      <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.round(purchase.readingProgress?.percentage || purchase.listeningProgress?.percentage || 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => router.push(`/books/${purchase.book._id}/read`)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> Read
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
