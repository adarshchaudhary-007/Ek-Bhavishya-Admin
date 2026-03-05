'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MicOff } from 'lucide-react';

interface LocalVideoPreviewProps {
  videoTrack?: unknown;
  isMuted?: boolean;
  isVideoOn?: boolean;
  userName?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showUserLabel?: boolean;
}

const sizeClasses = {
  small: 'w-24 h-24',
  medium: 'w-40 h-40',
  large: 'w-full h-64',
};

export function LocalVideoPreview({
  videoTrack,
  isMuted = false,
  isVideoOn = true,
  userName = 'You',
  size = 'small',
  className = '',
  showUserLabel = true,
}: LocalVideoPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoTrack || !containerRef.current || !isVideoOn) return;

    // Play the local video track
    const playFunction = async () => {
      try {
        const container = containerRef.current;
        if (!container) return;
        await (videoTrack as { play: (container: HTMLDivElement) => Promise<void> }).play(container);
      } catch (error) {
        console.error('Failed to play local video:', error);
      }
    };

    playFunction();

    return () => {
      try {
        (videoTrack as { stop?: () => void }).stop?.();
      } catch (error) {
        console.error('Error stopping local video:', error);
      }
    };
  }, [videoTrack, isVideoOn]);

  return (
    <Card
      className={`relative overflow-hidden bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 ${sizeClasses[size]} ${className}`}
    >
      {/* Video Container */}
      <div
        ref={containerRef}
        className="w-full h-full bg-slate-900"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1)', // Mirror the local video
        }}
      >
        {/* Fallback Avatar when video is off */}
        {!isVideoOn && (
          <div className="w-full h-full flex items-center justify-center bg-blue-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Badges */}
      <div className="absolute top-2 left-2 z-10">
        {isMuted && (
          <Badge variant="destructive" className="flex items-center gap-1 text-xs">
            <MicOff size={12} />
            Muted
          </Badge>
        )}
      </div>

      {/* User Label */}
      {showUserLabel && (
        <div className="absolute bottom-2 left-2 text-white font-medium text-xs bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
          {userName}
        </div>
      )}

      {/* Recording/Live Indicator */}
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Recording" />
      </div>
    </Card>
  );
}

interface PictureInPictureLayoutProps {
  localVideoTrack?: unknown;
  isMuted?: boolean;
  isVideoOn?: boolean;
  userName?: string;
  remoteUserName?: string;
  remoteVideoElement?: React.ReactNode;
}

export function PictureInPictureLayout({
  localVideoTrack,
  isMuted = false,
  isVideoOn = true,
  userName = 'You',
  remoteUserName = 'Astrologer',
  remoteVideoElement,
}: PictureInPictureLayoutProps) {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
      {/* Main Remote Video */}
      <div className="w-full h-full">
        {remoteVideoElement || (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-4xl font-bold text-white">
                  {remoteUserName.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-white font-medium">{remoteUserName}</p>
              <p className="text-slate-400 text-sm mt-1">Waiting for connection...</p>
            </div>
          </div>
        )}
      </div>

      {/* Picture-in-Picture Local Video */}
      <div className="absolute bottom-4 right-4 z-20">
        <LocalVideoPreview
          videoTrack={localVideoTrack}
          isMuted={isMuted}
          isVideoOn={isVideoOn}
          userName={userName}
          size="small"
          showUserLabel={false}
        />
      </div>

      {/* Remote User Label */}
      <div className="absolute top-4 left-4 text-white font-medium text-sm bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
        {remoteUserName}
      </div>

      {/* Connection Status */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-white text-sm bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Connected
      </div>
    </div>
  );
}
