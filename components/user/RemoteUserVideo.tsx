'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoOff, MicOff } from 'lucide-react';

interface RemoteUserVideoProps {
  uid: number; // Agora UID
  userName?: string;
  audioTrack?: unknown;
  videoTrack?: unknown;
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
  className?: string;
}

export function RemoteUserVideo({
  uid,
  userName = `User ${uid}`,
  videoTrack,
  isAudioEnabled = true,
  isVideoEnabled = true,
  className = '',
}: RemoteUserVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoTrack || !containerRef.current) return;

    // Play the remote video track in the container
    const playFunction = async () => {
      try {
        const container = containerRef.current;
        if (!container) return;
        await (videoTrack as { play: (container: HTMLDivElement) => Promise<void> }).play(container);
      } catch (error) {
        console.error(`Failed to play video for user ${uid}:`, error);
      }
    };

    playFunction();

    return () => {
      // Stop the video track when unmounting
      try {
        (videoTrack as { stop?: () => void }).stop?.();
      } catch (error) {
        console.error('Error stopping video track:', error);
      }
    };
  }, [videoTrack, uid]);

  return (
    <Card className={`relative w-full h-full overflow-hidden bg-slate-900 ${className}`}>
      {/* Video Container */}
      <div
        ref={containerRef}
        className="w-full h-full bg-slate-900"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Fallback Avatar when video is disabled */}
        {!videoTrack && (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-white font-medium">{userName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Badges */}
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        {!isVideoEnabled && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <VideoOff size={14} />
            Video Off
          </Badge>
        )}
        {!isAudioEnabled && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <MicOff size={14} />
            Muted
          </Badge>
        )}
      </div>

      {/* User Name */}
      <div className="absolute bottom-3 left-3 text-white font-medium text-sm bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
        {userName}
      </div>

      {/* Connection Quality Indicator (optional) */}
      <div className="absolute top-3 right-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg" title="Connected" />
      </div>
    </Card>
  );
}

interface RemoteUserGridProps {
  remoteUsers?: Array<{
    uid: number;
    name: string;
    videoTrack?: unknown;
    audioTrack?: unknown;
    isAudioEnabled?: boolean;
    isVideoEnabled?: boolean;
  }>;
  gridCols?: 1 | 2 | 3 | 4;
  maxHeight?: string;
}

export function RemoteUserGrid({
  remoteUsers = [],
  gridCols = remoteUsers.length <= 1 ? 1 : remoteUsers.length <= 4 ? 2 : 3,
  maxHeight = 'max-h-96',
}: RemoteUserGridProps) {
  if (remoteUsers.length === 0) {
    return (
      <Card className="w-full h-32 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-dashed">
        <p className="text-slate-500 dark:text-slate-400">No other participants</p>
      </Card>
    );
  }

  const gridClassName = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[gridCols];

  return (
    <div className={`grid ${gridClassName} gap-3 ${maxHeight} overflow-y-auto`}>
      {remoteUsers.map((user) => (
        <RemoteUserVideo
          key={user.uid}
          uid={user.uid}
          userName={user.name}
          videoTrack={user.videoTrack}
          audioTrack={user.audioTrack}
          isAudioEnabled={user.isAudioEnabled ?? true}
          isVideoEnabled={user.isVideoEnabled ?? true}
          className="rounded-lg border border-slate-200 dark:border-slate-700 h-24 sm:h-32"
        />
      ))}
    </div>
  );
}
