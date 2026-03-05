'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Search, Star, Sparkles } from 'lucide-react';
import { useUserRemedies } from '@/lib/hooks/use-user-app';
import { UserRemedy } from '@/types';

const remedyEmojis = ['🔮', '🌙', '✨', '🎋', '💎', '🕉️', '🔥', '🌿', '💫', '⭐'];

export default function RemediesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const { data: remedies = [], isLoading, isError } = useUserRemedies();

  const filteredRemedies = remedies.filter((remedy: UserRemedy) => {
    const matchesSearch =
      remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remedy.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'budget' && remedy.price < 500) ||
      (priceFilter === 'moderate' && remedy.price >= 500 && remedy.price < 1500) ||
      (priceFilter === 'premium' && remedy.price >= 1500);

    return matchesSearch && matchesPrice;
  });

  const getRemedyEmoji = (index: number) => remedyEmojis[index % remedyEmojis.length];
  const totalSpent = remedies.reduce((sum: number, r: UserRemedy) => sum + (r.bookings?.length || 0) * r.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Astrology Remedies</h1>
        </div>
        <p className="text-gray-600">Discover personalized remedies for your astrological needs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Available Remedies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{remedies.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {remedies.reduce((sum: number, r: UserRemedy) => sum + (r.bookings?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">₹{totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search remedies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'budget', 'moderate', 'premium'].map(filter => (
            <button
              key={filter}
              onClick={() => setPriceFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                priceFilter === filter
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'budget' ? 'Under ₹500' : filter === 'moderate' ? '₹500-₹1500' : '₹1500+'}
            </button>
          ))}
        </div>
      </div>

      {/* Remedies Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
          </div>
          <p className="text-gray-500 mt-2">Loading remedies...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-600">Failed to load remedies. Please retry.</div>
      ) : filteredRemedies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No remedies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRemedies.map((remedy: UserRemedy, index: number) => (
            <Card
              key={remedy._id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => router.push(`/remedies/${remedy._id}`)}
            >
              {/* Image/Emoji Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 h-40 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                {getRemedyEmoji(index)}
              </div>

              {/* Content */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{remedy.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.5 (120 reviews)</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full shrink-0 transition-colors">
                    <Heart size={20} className="text-gray-400 hover:text-red-600" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Category Badge */}
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">
                  {remedy.category || 'Remedy'}
                </Badge>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {remedy.description}
                </p>

                {/* Astrologer & Likes */}
                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
                  <span>By {remedy.astrologer || 'Expert'}</span>
                  <span className="flex items-center gap-1">❤️ {remedy.likes || 0}</span>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{remedy.price}</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/remedies/${remedy._id}/book`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
