'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RatingReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  astrologerName: string;
  callDuration?: string;
  onSubmit?: (rating: number, review: string) => Promise<void>;
}

export function RatingReviewModal({
  open,
  onOpenChange,
  astrologerName,
  callDuration,
  onSubmit,
}: RatingReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!review.trim() && rating !== 5) {
      toast.error('Please provide a review or select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(rating, review);
      }
      toast.success('Thank you for your feedback!');
      onOpenChange(false);
      setReview('');
      setRating(5);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            Share your feedback about your session with {astrologerName}
            {callDuration ? ` (${callDuration})` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="mb-3 block">Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      i <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review */}
          <div>
            <Label htmlFor="review">Review (Optional)</Label>
            <Textarea
              id="review"
              placeholder="Share your thoughts about the session..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
