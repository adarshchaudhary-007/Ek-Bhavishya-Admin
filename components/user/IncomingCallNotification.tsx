'use client';

import { useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff, Volume2 } from 'lucide-react';

interface IncomingCallNotificationProps {
  callerName: string;
  callerType: 'astrologer' | 'user';
  callType: 'audio' | 'video';
  onAccept?: () => void;
  onDecline?: () => void;
  isVisible?: boolean;
}

export function IncomingCallNotification({
  callerName,
  callerType,
  callType,
  onAccept,
  onDecline,
  isVisible = true,
}: IncomingCallNotificationProps) {
  const [ringing, setRinging] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  const handleAccept = () => {
    setRinging(false);
    onAccept?.();
  };

  const handleDecline = useCallback(() => {
    setRinging(false);
    onDecline?.();
  }, [onDecline]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, handleDecline]);

  if (!isVisible || !ringing) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm mx-4 overflow-hidden">
        <div className="bg-linear-to-r from-emerald-500 to-blue-600 text-white p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl mx-auto mb-4">
            {callerType === 'astrologer' ? '🧙' : '👤'}
          </div>
          <h2 className="text-2xl font-bold mb-2">{callerName}</h2>
          <p className="text-emerald-100 flex items-center justify-center gap-2">
            <Volume2 size={16} className="animate-pulse" />
            Incoming {callType} call...
          </p>
          <div className="mt-4 text-3xl font-bold">{timeLeft}s</div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDecline}
              variant="destructive"
              size="lg"
              className="flex items-center justify-center gap-2"
            >
              <PhoneOff size={20} />
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
              size="lg"
            >
              <Phone size={20} />
              Accept
            </Button>
          </div>
          <p className="text-center text-sm text-slate-500">
            {callType === 'video' ? '📹 Video Call' : '🎙️ Audio Call'}
          </p>
        </div>
      </Card>
    </div>
  );
}
