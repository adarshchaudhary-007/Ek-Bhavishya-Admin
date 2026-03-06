'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MessageSquare, Video, Star, Clock, Globe, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAstrologerProfile } from '@/lib/hooks/use-user-app';

export default function AstrologerProfilePage() {
  const params = useParams();
  const astrologerId = params.astrologerId as string;
  const router = useRouter();
  const { data: astrologer, isLoading, isError } = useAstrologerProfile(astrologerId ?? '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Users className="w-8 h-8 text-emerald-600 animate-pulse" />
      </div>
    );
  }

  if (isError || !astrologer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">Failed to load astrologer profile.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const pd = astrologer.personalDetails;
  const isOnline = astrologer.availability?.currentStatus === 'online';
  const isBusy = astrologer.availability?.currentStatus === 'busy';
  const rating = astrologer.ratings?.average ?? 0;
  const reviewCount = astrologer.ratings?.count ?? 0;

  const statusColor = isOnline
    ? 'bg-green-500'
    : isBusy
    ? 'bg-yellow-500'
    : 'bg-gray-400';
  const statusLabel = isOnline ? 'Online' : isBusy ? 'In Session' : 'Offline';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Astrologers
      </button>

      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {pd?.profileImage ? (
                <img
                  src={pd.profileImage}
                  alt={pd.pseudonym ?? 'Astrologer'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-3xl shadow-md">
                  {(pd?.pseudonym ?? 'A').charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${statusColor}`}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pd?.pseudonym ?? 'Astrologer'}
                </h1>
                <Badge
                  variant="secondary"
                  className={`text-xs ${isOnline ? 'bg-green-100 text-green-700' : isBusy ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  {statusLabel}
                </Badge>
              </div>

              {/* Rating */}
              {reviewCount > 0 && (
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
                </div>
              )}

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2">
                {pd?.experience && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Clock className="w-3 h-3" />
                    {pd.experience} yrs exp
                  </Badge>
                )}
                {(pd?.languages ?? []).map((lang) => (
                  <Badge key={lang} variant="outline" className="gap-1 text-xs">
                    <Globe className="w-3 h-3" />
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-5">
          {/* About */}
          {pd?.about && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{pd.about}</p>
            </div>
          )}

          {/* Skills */}
          {(pd?.skills ?? []).length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {(pd?.skills ?? []).map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-0"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {astrologer.pricing && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Rates (per minute)
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Chat', icon: MessageSquare, value: astrologer.pricing.chat },
                  { label: 'Call', icon: Phone, value: astrologer.pricing.call },
                  { label: 'Video', icon: Video, value: astrologer.pricing.video },
                ].map(({ label, icon: Icon, value }) => (
                  <div
                    key={label}
                    className="text-center rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4"
                  >
                    <Icon className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="font-bold text-emerald-600">₹{value ?? '—'}/min</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          disabled={!astrologer.availability?.isChatAvailable}
          onClick={() => router.push(`/chat?astrologerId=${astrologer._id}`)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          disabled={!astrologer.availability?.isCallAvailable}
          onClick={() => router.push(`/calls?astrologerId=${astrologer._id}`)}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          disabled={!astrologer.availability?.isVideoAvailable}
          onClick={() => router.push(`/calls?astrologerId=${astrologer._id}&type=video`)}
        >
          <Video className="w-4 h-4 mr-2" />
          Video
        </Button>
      </div>
    </div>
  );
}
