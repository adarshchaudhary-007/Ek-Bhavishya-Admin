'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Star, Play, ShoppingCart, ArrowLeft, Lock, Check, AudioLines, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface Chapter {
  title: string;
  page?: number;
  duration?: number;
}

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
  pages?: number;
  language: string;
  publishedYear: number;
  chapters: Chapter[];
  isPurchased?: boolean;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/v1/user/books/${bookId}`);
        setBook(res.data?.data || res.data);
        setPurchased(res.data?.data?.isPurchased || false);
      } catch {
        toast.error('Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      await api.post(`/api/v1/user/books/${bookId}/purchase`, {});
      setPurchased(true);
      toast.success('Book purchased successfully!');
    } catch {
      toast.error('Failed to purchase book');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <button onClick={() => router.push('/books')} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Books
        </button>
        <div className="bg-gray-100 rounded-xl h-96 animate-pulse" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <p className="text-gray-700 font-medium">Book not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/books')}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Books
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 md:p-8">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-full bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl aspect-[3/4] flex items-center justify-center text-white shadow-lg">
              <BookOpen className="w-20 h-20 opacity-30" />
            </div>

            {purchased ? (
              <Button
                onClick={() => router.push(`/books/${bookId}/read`)}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white h-11 gap-2 rounded-xl"
              >
                <Play className="w-4 h-4" /> Start Reading
              </Button>
            ) : (
              <Button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white h-11 gap-2 rounded-xl"
              >
                <ShoppingCart className="w-4 h-4" />
                {book.isFree ? 'Add to Library' : `Buy for ₹${book.price}`}
              </Button>
            )}

            {book.isFree && (
              <div className="text-center mt-3 text-emerald-600 font-semibold text-sm">FREE BOOK</div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-lg text-emerald-600 font-medium">by {book.author}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-gray-900">{(Number(book.rating) || 0).toFixed(1)}</span>
                <span className="text-sm text-gray-600">({book.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl">
                {book.type === 'Audio' ? (
                  <AudioLines className="w-5 h-5 text-emerald-600" />
                ) : (
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                )}
                <span className="font-semibold text-gray-900">{book.type}</span>
              </div>
              <div className="text-sm text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-xl">
                {book.category}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">About This Book</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-[11px] font-semibold uppercase text-emerald-600">Language</p>
                <p className="text-gray-900 font-bold">{book.language}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-[11px] font-semibold uppercase text-emerald-600">Published</p>
                <p className="text-gray-900 font-bold">{book.publishedYear}</p>
              </div>
              {book.pages && (
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase text-emerald-600">Pages</p>
                  <p className="text-gray-900 font-bold">{book.pages}</p>
                </div>
              )}
            </div>

            {book.chapters && book.chapters.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Table of Contents</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {book.chapters.map((chapter, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                      <span className="font-medium text-gray-900">{chapter.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-emerald-600">
                          {chapter.page && `p. ${chapter.page}`}
                          {chapter.duration && `${chapter.duration} min`}
                        </span>
                        {!purchased && <Lock className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {purchased && (
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" /> Features Available
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {['Read Online', 'Download', 'Bookmarks', 'Highlight Text', 'Add Notes', 'Share Progress'].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-emerald-700">
                      <Check className="w-4 h-4 text-green-600" /> {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
