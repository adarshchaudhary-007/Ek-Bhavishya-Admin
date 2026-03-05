'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Phone,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CallControlsProps {
  isMuted?: boolean;
  isVideoOn?: boolean;
  isScreenSharing?: boolean;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  onToggleScreenShare?: () => void;
  onEndCall?: () => void;
  onReport?: () => void;
  isLoading?: boolean;
}

export function CallControls({
  isMuted = false,
  isVideoOn = true,
  isScreenSharing = false,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
  onReport,
  isLoading = false,
}: CallControlsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Button
          variant={isMuted ? 'destructive' : 'outline'}
          size="lg"
          onClick={onToggleMute}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isMuted ? (
            <>
              <MicOff size={20} />
              Unmute
            </>
          ) : (
            <>
              <Mic size={20} />
              Mute
            </>
          )}
        </Button>

        <Button
          variant={!isVideoOn ? 'destructive' : 'outline'}
          size="lg"
          onClick={onToggleVideo}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isVideoOn ? (
            <>
              <Video size={20} />
              Stop Video
            </>
          ) : (
            <>
              <VideoOff size={20} />
              Start Video
            </>
          )}
        </Button>

        <Button
          variant={isScreenSharing ? 'secondary' : 'outline'}
          size="lg"
          onClick={onToggleScreenShare}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Monitor size={20} />
          {isScreenSharing ? 'Stop' : 'Share'} Screen
        </Button>

        <div className="border-l pl-4">
          <Button
            variant="destructive"
            size="lg"
            onClick={onEndCall}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Phone size={20} />
            End Call
          </Button>
        </div>

        {onReport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onReport} className="text-red-600">
                Report Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );
}
