'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Wifi, WifiOff, Signal } from 'lucide-react';

export type NetworkQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor' | 'unknown';

interface CallQualityIndicatorProps {
  quality?: NetworkQuality;
  latency?: number; // in milliseconds
  packetLoss?: number; // in percentage
  bitrate?: number; // in kbps
  showDetails?: boolean;
  className?: string;
}

function getQualityColor(quality: NetworkQuality) {
  switch (quality) {
    case 'excellent':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'good':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'fair':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'poor':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'very-poor':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
  }
}

function getQualityIcon(quality: NetworkQuality) {
  switch (quality) {
    case 'excellent':
    case 'good':
      return <Signal size={16} className="animate-pulse" />;
    case 'fair':
      return <Signal size={16} />;
    case 'poor':
    case 'very-poor':
      return <WifiOff size={16} />;
    default:
      return <Wifi size={16} />;
  }
}

function getQualityLabel(quality: NetworkQuality) {
  const labels: Record<NetworkQuality, string> = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    'very-poor': 'Very Poor',
    unknown: 'Unknown',
  };
  return labels[quality] || 'Unknown';
}

export function CallQualityIndicator({
  quality = 'unknown',
  latency,
  packetLoss,
  bitrate,
  showDetails = false,
  className = '',
}: CallQualityIndicatorProps) {
  if (!showDetails) {
    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-2 ${getQualityColor(quality)} border-0 ${className}`}
      >
        {getQualityIcon(quality)}
        {getQualityLabel(quality)}
      </Badge>
    );
  }

  // Show detailed stats
  return (
    <Card className={`p-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="space-y-3">
        {/* Quality Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Connection Quality</span>
          <Badge
            className={`flex items-center gap-2 ${getQualityColor(quality)} border-0`}
          >
            {getQualityIcon(quality)}
            {getQualityLabel(quality)}
          </Badge>
        </div>

        {/* Warnings for poor quality */}
        {(quality === 'poor' || quality === 'very-poor') && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">
              Network connection is unstable. Audio or video may be affected.
            </p>
          </div>
        )}

        {/* Detailed Stats */}
        <div className="space-y-2 text-sm">
          {latency !== undefined && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Latency</span>
              <span className={latency > 150 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-slate-800 dark:text-slate-200'}>
                {latency}ms
              </span>
            </div>
          )}

          {packetLoss !== undefined && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Packet Loss</span>
              <span className={packetLoss > 5 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-slate-800 dark:text-slate-200'}>
                {packetLoss.toFixed(1)}%
              </span>
            </div>
          )}

          {bitrate !== undefined && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Bitrate</span>
              <span className="text-slate-800 dark:text-slate-200">
                {bitrate > 1000 ? (bitrate / 1000).toFixed(1) + ' Mbps' : bitrate + ' kbps'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface CallStatsProps {
  startTime?: number; // Unix timestamp in seconds
  callCount?: number;
  totalCallDuration?: number; // in seconds
  averageCallDuration?: number; // in seconds
}

export function CallStats({
  startTime,
  callCount = 0,
  totalCallDuration = 0,
  averageCallDuration = 0,
}: CallStatsProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      setElapsed(Math.max(0, now - startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
      <Card className="p-3 bg-slate-50 dark:bg-slate-900">
        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Current Duration</div>
        <div className="font-semibold text-slate-900 dark:text-slate-100">{formatDuration(elapsed)}</div>
      </Card>

      <Card className="p-3 bg-slate-50 dark:bg-slate-900">
        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Calls</div>
        <div className="font-semibold text-slate-900 dark:text-slate-100">{callCount}</div>
      </Card>

      <Card className="p-3 bg-slate-50 dark:bg-slate-900">
        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Duration</div>
        <div className="font-semibold text-slate-900 dark:text-slate-100">{formatDuration(totalCallDuration)}</div>
      </Card>

      <Card className="p-3 bg-slate-50 dark:bg-slate-900">
        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Duration</div>
        <div className="font-semibold text-slate-900 dark:text-slate-100">{formatDuration(averageCallDuration)}</div>
      </Card>
    </div>
  );
}
