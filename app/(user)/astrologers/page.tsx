'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Phone, MessageSquare, Video, Star, Clock, Users, Globe } from 'lucide-react';
import { useUserAstrologers } from '@/lib/hooks/use-user-app';
import { UserAstrologer } from '@/types';

export default function AstrologersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('all');
  const { data: astrologers = [], isLoading, isError } = useUserAstrologers();

  const allSkills = Array.from(
    new Set(astrologers.flatMap((a: UserAstrologer) => a.personalDetails?.skills || []))
  );

  const filteredAstrologers = astrologers.filter((a: UserAstrologer) => {
    const name = a.personalDetails?.pseudonym || '';
    const skills = a.personalDetails?.skills || [];
    const about = a.personalDetails?.about || '';

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      about.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSkill = selectedSkill === 'all' || skills.includes(selectedSkill);
    const matchesAvailable = !availableOnly || a.availability?.currentStatus === 'online';

    return matchesSearch && matchesSkill && matchesAvailable;
  });

  const onlineCount = astrologers.filter(
    (a: UserAstrologer) => a.availability?.currentStatus === 'online'
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find Your Astrologer</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Connect with expert astrologers for guidance &bull; {onlineCount} online now
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, skill, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setAvailableOnly(false)}
          className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
            !availableOnly
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All ({astrologers.length})
        </button>
        <button
          onClick={() => setAvailableOnly(true)}
          className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
            availableOnly
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Online ({onlineCount})
        </button>
        {allSkills.slice(0, 6).map((skill) => (
          <button
            key={skill}
            onClick={() => setSelectedSkill(selectedSkill === skill ? 'all' : skill)}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${
              selectedSkill === skill
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Found {filteredAstrologers.length} astrologer{filteredAstrologers.length !== 1 ? 's' : ''}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Users className="w-8 h-8 text-emerald-600 animate-pulse mx-auto" />
          <p className="text-gray-500 mt-2">Loading astrologers...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-600">
          Failed to load astrologers. Please retry.
        </div>
      ) : filteredAstrologers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No astrologers found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstrologers.map((astrologer: UserAstrologer) => {
            const pd = astrologer.personalDetails;
            const isOnline = astrologer.availability?.currentStatus === 'online';
            const rating = astrologer.ratings?.average || 0;
            const reviewCount = astrologer.ratings?.count || 0;
            const skills = pd?.skills || [];
            const languages = pd?.languages || [];
            const chatPrice = astrologer.pricing?.chat;
            const callPrice = astrologer.pricing?.call;

            return (
              <Card
                key={astrologer._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header with profile */}
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 p-4 border-b">
                  <div className="flex items-start gap-3">
                    {pd?.profileImage ? (
                      <img
                        src={pd.profileImage}
                        alt={pd.pseudonym || 'Astrologer'}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                        {(pd?.pseudonym || '?').charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                          {pd?.pseudonym || 'Astrologer'}
                        </h3>
                        <div
                          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                            isOnline ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {pd?.about || 'Experienced astrologer'}
                      </p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {skills.slice(0, 3).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-0"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Rating & Experience */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500">({reviewCount})</span>
                    </div>
                    {pd?.experience && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {pd.experience}y exp
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  {languages.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Globe className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{languages.join(', ')}</span>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Chat</p>
                      <p className="text-sm font-bold text-emerald-600">₹{chatPrice}/min</p>
                    </div>
                    <div className="border-x border-gray-200 dark:border-gray-700">
                      <p className="text-[10px] text-gray-500 uppercase">Call</p>
                      <p className="text-sm font-bold text-emerald-600">₹{callPrice}/min</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase">Video</p>
                      <p className="text-sm font-bold text-emerald-600">
                        ₹{astrologer.pricing?.video}/min
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/chat?astrologerId=${astrologer._id}`)}
                      disabled={!astrologer.availability?.isChatAvailable}
                      className="bg-emerald-600 hover:bg-emerald-700 h-9"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/calls?astrologerId=${astrologer._id}`)}
                      disabled={!astrologer.availability?.isCallAvailable}
                      variant="outline"
                      className="h-9"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/calls?astrologerId=${astrologer._id}&type=video`)}
                      disabled={!astrologer.availability?.isVideoAvailable}
                      variant="outline"
                      className="h-9"
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>

                  <button
                    onClick={() => router.push(`/astrologers/${astrologer._id}`)}
                    className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                  >
                    View Full Profile →
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

