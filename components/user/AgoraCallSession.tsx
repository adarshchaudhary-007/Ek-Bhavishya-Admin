'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAgora } from '@/hooks/useAgora';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import {
  CallControls,
  CallTimer,
  LocalVideoPreview,
  PictureInPictureLayout,
  CallQualityIndicator,
} from './index';

export interface AgoraCallSessionProps {
  channelName: string;
  token?: string;
  appId?: string;
  userName?: string;
  remoteUserName?: string;
  onCallEnd?: () => void;
  onError?: (error: Error) => void;
  showQualityDetails?: boolean;
  layout?: 'picture-in-picture' | 'grid';
}

export function AgoraCallSession({
  channelName,
  token,
  appId,
  userName = 'You',
  remoteUserName = 'Astrologer',
  onCallEnd,
  onError,
  showQualityDetails = false,
  layout = 'picture-in-picture',
}: AgoraCallSessionProps) {
  const {
    isJoined,
    isLoading,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    localVideoTrack,
    remoteUsers,
    error,
    join,
    leave,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
  } = useAgora({
    appId: appId || process.env.NEXT_PUBLIC_AGORA_APP_ID!,
    channelName,
    token,
  });

  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const startCall = useCallback(async () => {
    await join();
  }, [join]);

  // Auto-join on mount
  useEffect(() => {
    if (appId || process.env.NEXT_PUBLIC_AGORA_APP_ID) {
      void startCall();
    }
  }, [appId, startCall]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      onError?.(new Error(error));
    }
  }, [error, onError]);

  const handleEndCall = useCallback(async () => {
    try {
      await leave();
      toast.success('The call has been disconnected.');
      onCallEnd?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to end call');
      toast.error(error.message);
    }
  }, [leave, onCallEnd]);

  if (!isJoined && !isLoading) {
    return (
      <Card className="p-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-red-600 dark:text-red-400 mt-1 shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Unable to Join Call</h3>
            <p className="text-red-800 dark:text-red-200 text-sm mb-4">
              {error || 'Failed to connect to the call. Please check your network and try again.'}
            </p>
            <Button onClick={() => void startCall()} disabled={isLoading} size="sm">
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Container */}
      {layout === 'picture-in-picture' && isJoined ? (
        <div className="bg-slate-900 rounded-lg overflow-hidden aspect-video w-full">
          <PictureInPictureLayout
            localVideoTrack={isVideoEnabled ? localVideoTrack : undefined}
            isMuted={isMuted}
            isVideoOn={isVideoEnabled}
            userName={userName}
            remoteUserName={remoteUserName}
          />
        </div>
      ) : layout === 'grid' && isJoined ? (
        <Card className="p-4 bg-slate-900 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            {/* Local Video */}
            <div className="bg-slate-800 rounded-lg overflow-hidden aspect-video">
              <LocalVideoPreview
                videoTrack={isVideoEnabled ? localVideoTrack : undefined}
                isMuted={isMuted}
                isVideoOn={isVideoEnabled}
                userName={userName}
                size="large"
              />
            </div>

            {/* Remote Videos */}
            {remoteUsers.length > 0 ? (
              remoteUsers.map((user) => (
                <div key={user.uid} className="bg-slate-800 rounded-lg overflow-hidden aspect-video">
                  {/* Remote video would be rendered here */}
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-700 to-slate-900">
                    <p className="text-white text-sm">{remoteUserName}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                <p className="text-slate-400 text-sm">No remote participants</p>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-8 bg-slate-100 dark:bg-slate-900 flex items-center justify-center h-96">
          <p className="text-slate-600 dark:text-slate-400">Connecting to call...</p>
        </Card>
      )}

      {/* Call Timer and Quality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CallTimer isActive={isJoined} format="compact" />
        <CallQualityIndicator
          quality="unknown"
          showDetails={showQualityDetails}
        />
        <div className="flex items-center justify-end">
          <span className={`text-sm font-medium ${isJoined ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}`}>
            {isJoined ? '● Connected' : '● Connecting...'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <CallControls
        isMuted={isMuted}
        isVideoOn={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onEndCall={() => setShowEndConfirm(true)}
        isLoading={isLoading}
      />

      {/* End Call Confirmation */}
      {showEndConfirm && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100">End this call?</h4>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                This will disconnect you from the call.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEndConfirm(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleEndCall}
                size="sm"
              >
                End Call
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 mt-1 shrink-0" size={18} />
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-100">Error</h4>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Export all components from this barrel file
export * from './CallControls';
export * from './CallTimer';
export * from './LocalVideoPreview';
export * from './RemoteUserVideo';
export * from './CallQualityIndicator';
export * from './RatingReviewModal';
export * from './IncomingCallNotification';
