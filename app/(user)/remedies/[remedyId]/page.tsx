'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Video, 
  MessageCircle, 
  Sparkles,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react';
import { useRemedyDetail, useRemedyAstrologers } from '@/lib/hooks/use-user-app';

export default function RemedyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const remedyId = params.remedyId as string;
  
  const [sortBy, setSortBy] = useState('rating');
  const [page] = useState(1);
  const limit = 10;

  const { data: remedy, isLoading: remedyLoading } = useRemedyDetail(remedyId);
  const { data: astrologersData, isLoading: astrologersLoading } = useRemedyAstrologers(
    remedyId,
    { sortBy, page, limit }
  );

  if (remedyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-emerald-600 animate-pulse mx-auto" />
          <p className="text-gray-600 mt-4">Loading remedy details...</p>
        </div>
      </div>
    );
  }

  if (!remedy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Remedy not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const astrologers = astrologersData?.astrologers ?? [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Remedies
      </Button>

      {/* Remedy Header */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 h-80 flex items-center justify-center text-8xl">
            {remedy.image ? (
              <img 
                src={remedy.image} 
                alt={remedy.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              '🔮'
            )}
          </div>

          {/* Details Section */}
          <CardContent className="pt-6 space-y-4">
            <div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 mb-2">
                {remedy.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{remedy.title}</h1>
              {remedy.is_featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{remedy.description}</p>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-semibold">{remedy.duration_minutes || 30} mins</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Starting Price</p>
                  <p className="font-semibold text-emerald-600">₹{remedy.base_price}</p>
                </div>
              </div>
            </div>

            {/* Delivery Type */}
            <div className="flex items-center gap-2 pt-2">
              {remedy.delivery_type === 'live_video' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Live Video
                </Badge>
              )}
              {remedy.delivery_type === 'consultation' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  Consultation
                </Badge>
              )}
              {remedy.delivery_type === 'report' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Report
                </Badge>
              )}
            </div>

            {/* Tags */}
            {remedy.tags && remedy.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {remedy.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-gray-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Specializations */}
      {remedy.specializations && remedy.specializations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Available Specializations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {remedy.specializations.map((spec, idx) => (
                <Card key={idx} className="border-emerald-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg mb-1">{spec.name}</h3>
                    {spec.description && (
                      <p className="text-sm text-gray-600 mb-3">{spec.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-bold text-xl">₹{spec.price}</span>
                      {spec.duration_minutes && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {spec.duration_minutes} min
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Astrologers Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Available Astrologers ({astrologers.length})
            </CardTitle>
            
            {/* Sort Options */}
            <div className="flex gap-2">
              {['rating', 'price', 'experience'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    sortBy === option
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option === 'rating' ? 'Top Rated' : option === 'price' ? 'Best Price' : 'Experience'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {astrologersLoading ? (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse mx-auto" />
              <p className="text-gray-500 mt-2">Loading astrologers...</p>
            </div>
          ) : astrologers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No astrologers available for this remedy</p>
            </div>
          ) : (
            <div className="space-y-4">
              {astrologers.map((service) => {
                const astrologer = service.astrologer_id;
                const isOnline = astrologer?.systemStatus?.isOnline ?? false;
                const rating = service.metrics?.average_rating ?? 0;
                const reviews = service.metrics?.total_reviews ?? 0;
                const price = service.custom_pricing?.my_price ?? remedy.base_price;
                const experience = astrologer?.personalDetails?.experience?.years_experience ?? 0;

                return (
                  <Card key={service._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center text-2xl font-bold text-emerald-700">
                            {astrologer?.personalDetails?.profileImage ? (
                              <img
                                src={astrologer.personalDetails.profileImage}
                                alt={astrologer.personalDetails.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              astrologer?.personalDetails?.name?.charAt(0).toUpperCase() ?? 'A'
                            )}
                          </div>
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {astrologer?.personalDetails?.name ?? 'Unknown Astrologer'}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                {rating > 0 && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{rating.toFixed(1)}</span>
                                    <span className="text-gray-500">({reviews})</span>
                                  </div>
                                )}
                                {experience > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {experience}+ years exp
                                  </Badge>
                                )}
                                {isOnline && (
                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                    Online
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-emerald-600">₹{price}</p>
                              <p className="text-xs text-gray-500">per session</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => router.push(`/remedies/${remedyId}/book?astrologerId=${service._id}`)}
                              className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                            >
                              Book Now
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/astrologers/${astrologer._id}`)}
                              className="flex items-center gap-2"
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination Info */}
          {astrologersData?.pagination && astrologersData.pagination.totalPages > 1 && (
            <div className="text-center text-sm text-gray-500 mt-4">
              Page {astrologersData.pagination.page} of {astrologersData.pagination.totalPages}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
