'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

interface UseAgoraOptions {
  appId: string;
  channelName: string;
  token?: string;
  uid?: number | string;
  onRemoteUserAdded?: (user: IAgoraRTCRemoteUser) => void;
  onRemoteUserRemoved?: (user: IAgoraRTCRemoteUser) => void;
  onNetworkQuality?: (quality: string) => void;
}

interface UseAgoraReturn {
  isJoined: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  remoteUsers: IAgoraRTCRemoteUser[];
  error: string | null;
  join: () => Promise<void>;
  leave: () => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  getStats: () => Promise<any>;
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
  client: IAgoraRTCClient | null;
}

export function useAgora(options: UseAgoraOptions): UseAgoraReturn {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize Agora client
  useEffect(() => {
    if (!clientRef.current && options.appId) {
      try {
        AgoraRTC.setLogLevel(0); // 0 = DEBUG, 1 = INFO, 2 = WARNING, 3 = ERROR
        clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp9' });

        clientRef.current.on('user-published', async (user, mediaType) => {
          await clientRef.current?.subscribe(user, mediaType);
          if (mediaType === 'video') {
            setRemoteUsers((prev) => [...prev, user]);
            options.onRemoteUserAdded?.(user);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        clientRef.current.on('user-unpublished', (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          options.onRemoteUserRemoved?.(user);
        });

        clientRef.current.on('user-left', (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          options.onRemoteUserRemoved?.(user);
        });

        clientRef.current.on('network-quality', (quality) => {
          const qualityLevel = quality.downlinkNetworkQuality;
          const qualityLabel = ['excellent', 'good', 'poor', 'very poor', 'unknown'][qualityLevel] || 'unknown';
          options.onNetworkQuality?.(qualityLabel);
        });
      } catch (err) {
        setError('Failed to initialize Agora client');
        console.error('Agora initialization error:', err);
      }
    }

    return () => {
      // Cleanup is handled separately
    };
  }, [options.appId]);

  const join = async () => {
    if (!clientRef.current || isJoined) return;

    try {
      setIsLoading(true);
      setError(null);

      // Create local audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = audioTrack;

      // Create local video track
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      localVideoTrackRef.current = videoTrack;

      // Join channel
      const uid = options.uid ? (typeof options.uid === 'string' ? parseInt(options.uid, 10) : options.uid) : 0;
      await clientRef.current.join(options.appId, options.channelName, options.token || null, uid);

      // Publish tracks
      await clientRef.current.publish([audioTrack, videoTrack]);

      setIsJoined(true);
      setIsMuted(false);
      setIsVideoEnabled(true);
    } catch (err) {
      setError(`Failed to join channel: ${err}`);
      console.error('Agora join error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const leave = async () => {
    if (!clientRef.current || !isJoined) return;

    try {
      setIsLoading(true);

      // Stop screen share if active
      if (isScreenSharing) {
        await toggleScreenShare();
      }

      // Unpublish and close tracks
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }

      // Leave channel
      await clientRef.current.leave();

      setIsJoined(false);
      setIsMuted(false);
      setIsVideoEnabled(true);
      setRemoteUsers([]);
    } catch (err) {
      setError(`Failed to leave channel: ${err}`);
      console.error('Agora leave error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = async () => {
    if (!localAudioTrackRef.current) return;

    try {
      if (isMuted) {
        await localAudioTrackRef.current.setEnabled(true);
        setIsMuted(false);
      } else {
        await localAudioTrackRef.current.setEnabled(false);
        setIsMuted(true);
      }
    } catch (err) {
      setError('Failed to toggle mute');
      console.error('Toggle mute error:', err);
    }
  };

  const toggleVideo = async () => {
    if (!localVideoTrackRef.current) return;

    try {
      if (isVideoEnabled) {
        await localVideoTrackRef.current.setEnabled(false);
        setIsVideoEnabled(false);
      } else {
        await localVideoTrackRef.current.setEnabled(true);
        setIsVideoEnabled(true);
      }
    } catch (err) {
      setError('Failed to toggle video');
      console.error('Toggle video error:', err);
    }
  };

  const toggleScreenShare = async () => {
    if (!clientRef.current) return;

    try {
      if (isScreenSharing) {
        // Stop screen sharing - republish camera video
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        localVideoTrackRef.current = videoTrack;
        await clientRef.current.unpublish(localVideoTrackRef.current);
        await clientRef.current.publish([videoTrack]);
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenTrack = await AgoraRTC.createScreenVideoTrack({});
        // Unpublish camera video and publish screen
        if (localVideoTrackRef.current) {
          await clientRef.current.unpublish(localVideoTrackRef.current);
          localVideoTrackRef.current.close();
        }
        // screenTrack might be [videoTrack, audioTrack], handle both cases
        const tracksToPublish = Array.isArray(screenTrack) ? screenTrack : [screenTrack];
        await clientRef.current.publish(tracksToPublish);
        // Store the video track (first element if array)
        const videoTrack = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;
        localVideoTrackRef.current = videoTrack as ICameraVideoTrack;
        setIsScreenSharing(true);
      }
    } catch (err) {
      setError('Failed to toggle screen share');
      console.error('Toggle screen share error:', err);
    }
  };

  const getStats = async () => {
    if (!clientRef.current) return null;

    try {
      const stats = await clientRef.current.getRTCStats();
      return stats;
    } catch (err) {
      console.error('Failed to get stats:', err);
      return null;
    }
  };

  return {
    isJoined,
    isLoading,
    isMuted,
    isVideoEnabled,
    isScreenSharing,
    remoteUsers,
    error,
    join,
    leave,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    getStats,
    localAudioTrack: localAudioTrackRef.current,
    localVideoTrack: localVideoTrackRef.current,
    client: clientRef.current,
  };
}
