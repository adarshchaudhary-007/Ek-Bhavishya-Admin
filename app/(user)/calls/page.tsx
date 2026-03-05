'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PhoneMissed, Star, Clock, Video, Phone as PhoneIcon } from 'lucide-react';
import { useState } from 'react';
import { AgoraCallSession, RatingReviewModal } from '@/components/user';

const mockCalls = [
  {
    id: '1',
    astrologerName: 'Rajesh Kumar',
    duration: '15 mins',
    date: '2024-03-04 10:30 AM',
    status: 'completed',
    type: 'video',
    amount: '120',
    rating: 5,
  },
  {
    id: '2',
    astrologerName: 'Priya Sharma',
    duration: '10 mins',
    date: '2024-03-03 2:15 PM',
    status: 'completed',
    type: 'audio',
    amount: '80',
    rating: 4,
  },
];


export default function CallsPage() {
  const [activeTab, setActiveTab] = useState('history');
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleEndCall = () => {
    setActiveCallId(null);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    console.log('Call rated:', { rating, review, callId: activeCallId });
    setShowRatingModal(false);
    setActiveCallId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Calls
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Manage your astrology calls and sessions</p>
      </div>

      {/* Active Call Modal */}
      {/* Active Call Session Dialog */}
      <Dialog open={!!activeCallId} onOpenChange={() => setActiveCallId(null)}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Live Call Session</DialogTitle>
          </DialogHeader>
          {activeCallId && (
            <AgoraCallSession
              channelName={`astro-call-${activeCallId}`}
              userName="You"
              remoteUserName="Astrologer"
              onCallEnd={handleEndCall}
              layout="picture-in-picture"
              showQualityDetails={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <RatingReviewModal
        open={showRatingModal}
        onOpenChange={setShowRatingModal}
        onSubmit={handleRatingSubmit}
        astrologerName="Astrologer Name"
        callDuration="15 mins"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">2</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Total Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">25 mins</div>
            <p className="text-xs text-slate-500 mt-1">Total time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">₹200</div>
            <p className="text-xs text-slate-500 mt-1">On calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">⭐ 4.5</div>
            <p className="text-xs text-slate-500 mt-1">Based on 2 calls</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock size={16} />
                History ({mockCalls.length})
              </TabsTrigger>
              <TabsTrigger value="disputes" className="flex items-center gap-2">
                <PhoneMissed size={16} />
                Disputes (0)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-6">
              <div className="space-y-4">
                {mockCalls.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    No call history yet
                  </div>
                ) : (
                  mockCalls.map((call) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                          {call.type === 'video' ? (
                            <Video size={20} />
                          ) : (
                            <PhoneIcon size={20} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{call.astrologerName}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Badge variant="outline" className="text-xs">
                              {call.type.charAt(0).toUpperCase() + call.type.slice(1)}
                            </Badge>
                            <span>{call.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-semibold">{call.duration}</p>
                          <p className="text-sm text-slate-500">₹{call.amount}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < call.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-300'
                              }
                            />
                          ))}
                        </div>
                        <Button size="sm" variant="outline">
                          Call Again
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="disputes" className="mt-6">
              <div className="text-center py-12 text-slate-500">
                No disputes reported
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
