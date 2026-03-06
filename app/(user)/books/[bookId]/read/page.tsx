'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Play, Pause, Volume2, SkipBack, SkipForward, Bookmark, MessageSquare, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

interface BookAccess {
  type: 'digital' | 'audio';
  url: string;
  chapters?: Array<{ title: string; url: string }>;
}

export default function BookReaderPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const [bookAccess, setBookAccess] = useState<BookAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchBookAccess = async () => {
      try {
        const res = await api.get(`/api/v1/user/books/${bookId}/access`, { params: { accessType: 'digital' } });
        setBookAccess(res.data?.data || null);
      } catch {
        console.error('Error fetching book access');
      } finally {
        setLoading(false);
      }
    };
    fetchBookAccess();
  }, [bookId]);

  const updateProgress = async () => {
    try {
      await api.put(`/api/v1/user/book-purchases/${bookId}/reading-progress`, {
        currentPage,
        percentage: progress,
      });
    } catch {
      console.error('Error updating progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <BookOpen className="w-12 h-12 text-emerald-600 mx-auto animate-spin" />
          <p className="text-gray-500 font-medium">Loading book...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/my-books')}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </button>
        <h1 className="text-xl font-bold">Book Reader</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bookmark className="w-5 h-5 text-emerald-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-emerald-600" />
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-200 overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
          <div className="text-center space-y-3">
            <BookOpen className="w-16 h-16 text-emerald-500 mx-auto opacity-50" />
            <p className="text-emerald-400 font-medium">Book Preview Area</p>
            <p className="text-white/50 text-sm max-w-xs">
              PDF or book content viewer would be displayed here
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-emerald-600 font-medium text-sm">Reading Progress</span>
            <span className="text-gray-900 font-bold">{Math.round(progress)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            onMouseUp={updateProgress}
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer accent-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-medium text-sm">Current Page:</label>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            onBlur={updateProgress}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 w-20 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Button onClick={updateProgress} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            Save
          </Button>
        </div>
      </div>

      {bookAccess?.type === 'audio' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Audiobook Player</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-gray-900 font-medium">Now Playing</p>
                <p className="text-emerald-600 text-sm">Chapter 1: Introduction</p>
              </div>
              <span className="text-gray-500 text-sm">12:45 / 45:30</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="28"
              className="w-full h-2 bg-gray-200 rounded-full cursor-pointer accent-emerald-500"
            />
            <div className="flex items-center justify-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <SkipBack className="w-5 h-5 text-emerald-600" />
              </button>
              <button className="p-4 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-colors">
                <Play className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <SkipForward className="w-5 h-5 text-emerald-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors ml-auto">
                <Volume2 className="w-5 h-5 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h3 className="font-bold text-gray-900">Quick Notes</h3>
        <textarea
          placeholder="Add notes about this book..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          rows={3}
        />
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Save Note</Button>
      </div>
    </div>
  );
}
