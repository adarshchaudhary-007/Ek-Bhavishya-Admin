'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface CallTimerProps {
  startTime?: number; // Unix timestamp in seconds
  isActive?: boolean;
  format?: 'compact' | 'full'; // compact: "5:32", full: "5 minutes 32 seconds"
}

function formatDuration(seconds: number, format: 'compact' | 'full' = 'compact') {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (format === 'compact') {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // full format
  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);

  return parts.join(' ');
}

export function CallTimer({
  startTime,
  isActive = true,
  format = 'compact',
}: CallTimerProps) {
  const [nowSeconds, setNowSeconds] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      setNowSeconds(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const elapsed = startTime && nowSeconds ? Math.max(0, nowSeconds - startTime) : 0;

  const displayTime = formatDuration(elapsed, format);

  return (
    <div className="flex items-center gap-2 text-lg font-semibold">
      <Clock size={20} className="text-blue-500" />
      <span>{displayTime}</span>
    </div>
  );
}

export function CallTimerCard({
  startTime,
  isActive = true,
  format = 'full',
  className,
}: CallTimerProps & { className?: string }) {
  return (
    <Card className={`p-4 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 ${className}`}>
      <CallTimer startTime={startTime} isActive={isActive} format={format} />
    </Card>
  );
}
