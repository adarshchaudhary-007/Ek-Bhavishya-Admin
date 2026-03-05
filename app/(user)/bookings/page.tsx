'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

export default function BookingsPage() {
  const bookings = [
    {
      id: '1',
      service: 'Vedic Astrology Reading',
      astrologer: 'Rajesh Kumar',
      date: '2024-03-10',
      time: '10:00 AM',
      status: 'confirmed',
      amount: 500,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Bookings
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Manage your astrology service bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            No bookings yet. Browse astrologers to make a booking.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{booking.service}</p>
                    <p className="text-slate-600 dark:text-slate-300 mb-3">
                      with {booking.astrologer}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} className="text-slate-400" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg mb-2">₹{booking.amount}</p>
                    <Badge className="bg-green-600">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Join Session
                  </Button>
                  <Button size="sm" variant="outline">
                    Reschedule
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
