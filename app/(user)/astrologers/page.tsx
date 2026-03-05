'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Phone, Video, Star, MapPin, Clock, Users } from 'lucide-react';
import { useUserAstrologers } from '@/lib/hooks/use-user-app';
import { UserAstrologer } from '@/types';

export default function AstrologersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState('all');
  const { data: astrologers = [], isLoading, isError } = useUserAstrologers();

  const specialities = Array.from(new Set(astrologers.map((a: UserAstrologer) => a.speciality || 'General')));

  const filteredAstrologers = astrologers.filter((a: UserAstrologer) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.speciality.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpeciality = selectedSpeciality === 'all' || a.speciality === selectedSpeciality;
    const matchesOnline = !onlineOnly || a.isOnline;

    return matchesSearch && matchesSpeciality && matchesOnline;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Your Astrologer</h1>
        <p className="text-gray-600 mt-1">Connect with expert astrologers for guidance - Call, Video, or Chat</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or speciality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setOnlineOnly(false)}
          className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
            !onlineOnly
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Astrologers
        </button>
        <button
          onClick={() => setOnlineOnly(true)}
          className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
            onlineOnly
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Online Now
        </button>
        {specialities.slice(0, 5).map(spec => (
          <button
            key={spec}
            onClick={() => setSelectedSpeciality(selectedSpeciality === spec ? 'all' : spec)}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${
              selectedSpeciality === spec
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Found {filteredAstrologers.length} astrologer{filteredAstrologers.length !== 1 ? 's' : ''}
      </div>

      {/* Astrologers Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <Users className="w-8 h-8 text-emerald-600 animate-pulse" />
          </div>
          <p className="text-gray-500 mt-2">Loading astrologers...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-600">Failed to load astrologers. Please retry.</div>
      ) : filteredAstrologers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No astrologers found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstrologers.map((astrologer: UserAstrologer) => (
            <Card
              key={astrologer._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header with Status */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{astrologer.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium mt-1">{astrologer.speciality || 'Astrologer'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        astrologer.isOnline ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-xs text-gray-500 mt-1">
                      {astrologer.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4 space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(astrologer.rating || 4)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {astrologer.rating || 4.5} ({astrologer.reviews || 120} reviews)
                  </span>
                </div>

                {/* Info Grid */}
                <div className="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{astrologer.experience || 10}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{(astrologer.languages || ['Hindi', 'English']).join(', ')}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {astrologer.bio || 'Expert in providing astrological guidance and remedies'}
                </p>

                {/* Price */}
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Starting from</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ₹{astrologer.callRate || 25}/min
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    onClick={() => router.push(`/calls?astrologerId=${astrologer._id}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 h-10"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="hidden sm:inline">Call</span>
                  </Button>
                  <Button
                    onClick={() => router.push(`/chat?astrologerId=${astrologer._id}`)}
                    variant="outline"
                    className="flex items-center gap-2 h-10"
                  >
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Chat</span>
                  </Button>
                </div>

                {/* View Profile Link */}
                <button
                  onClick={() => router.push(`/astrologers/${astrologer._id}`)}
                  className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  View Full Profile →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstrologers.map((astrologer: UserAstrologer) => (
            <Card key={astrologer._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{astrologer.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default" className="bg-yellow-600">
                        ⭐ {astrologer.rating.toFixed(1)}
                      </Badge>
                      {astrologer.isAvailable ? (
                        <Badge className="bg-green-600">Available</Badge>
                      ) : (
                        <Badge variant="secondary">Busy</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-2">
                    {astrologer.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {astrologer.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{astrologer.expertise.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-emerald-600">
                    ₹{astrologer.pricePerMinute}/min
                  </span>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  View Profile & Call
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
