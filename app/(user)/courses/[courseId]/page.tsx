'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Calendar,
  ExternalLink,
  Video,
  Radio,
  ArrowLeft,
  Clock,
  Play,
  FileText,
  Headphones,
  Package,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface LiveSchedule {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  daysOfWeek?: string[];
  durationMinutes?: number;
  frequency?: string;
}

interface CourseModule {
  _id?: string;
  title: string;
  description?: string;
  duration: number;
  videoUrl?: string;
}

interface CourseResource {
  _id?: string;
  title: string;
  resourceType: 'ebook' | 'audiobook' | 'other';
  fileUrl?: string;
  description?: string;
  duration?: number;
}

interface CourseRecording {
  enabled?: boolean;
  recordingUrl?: string;
}

interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  price: number;
  isFree?: boolean;
  courseType?: 'recorded' | 'live' | 'webinar';
  liveSchedule?: LiveSchedule;
  recording?: CourseRecording;
  modules?: CourseModule[];
  resources?: CourseResource[];
  instructor?: string;
  thumbnail?: string;
}

interface Enrollment {
  _id: string;
  progress?: {
    percentage?: number;
    completedModules?: Array<{ moduleId: string; completedAt: string }>;
  };
}

export default function UserCourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);

  const loadCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/v1/user/courses/courses/${courseId}`);
      const result = data.data || data;
      setCourse(result.course || result);
      setIsEnrolled(result.isEnrolled || false);
      setEnrollment(result.enrollment || null);
    } catch {
      toast.error('Failed to load course. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId, loadCourse]);

  const handleEnroll = async () => {
    try {
      const { data } = await api.post(`/api/v1/user/courses/courses/${courseId}/enroll`);
      setIsEnrolled(true);
      setEnrollment(data.data || data);
      toast.success('You are enrolled in this course.');
    } catch {
      toast.error('Enrollment failed. Please try again later.');
    }
  };

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      const { data } = await api.get(`/api/v1/user/courses/courses/${courseId}/join`);
      const result = data.data || data;
      if (!result?.canJoin) {
        toast.info(result?.message || 'Join window has not opened yet.');
        return;
      }
      if (!result?.agora) {
        toast.info('Live session configuration is missing.');
        return;
      }
      toast.success('Joining live session...');
      // In a full implementation, this would navigate to an Agora-based live course page
    } catch {
      toast.error('Unable to join. Please try again later.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleRecording = async () => {
    try {
      setIsRecordingLoading(true);
      const { data } = await api.get(`/api/v1/user/courses/courses/${courseId}/recording`);
      const result = data.data || data;
      if (result?.recordingUrl) {
        window.open(result.recordingUrl, '_blank');
      } else {
        toast.info('Recording link is not ready yet.');
      }
    } catch {
      toast.error('Unable to open recording. Please try again later.');
    } finally {
      setIsRecordingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  const courseType = course.courseType || 'recorded';
  const isLiveCourse = courseType === 'live' || courseType === 'webinar';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/courses')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-semibold">{course.title}</h1>
            <p className="text-xs text-muted-foreground">{courseType.toUpperCase()}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {courseType === 'webinar'
                  ? 'Webinar Live'
                  : courseType === 'live'
                    ? 'Live Course'
                    : 'Recorded'}
              </Badge>
              <Badge variant="outline">
                {course.isFree || course.price === 0 ? 'Free' : `₹${course.price}`}
              </Badge>
            </div>
            <p className="text-muted-foreground">{course.description}</p>

            {/* Live Schedule */}
            {course.liveSchedule && isLiveCourse && (
              <div className="space-y-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-semibold">
                  <Calendar className="w-4 h-4" />
                  <span>Class Schedule</span>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Period:</span>
                    <span className="font-medium">
                      {course.liveSchedule.startDate
                        ? new Date(course.liveSchedule.startDate).toLocaleDateString()
                        : 'N/A'}{' '}
                      -{' '}
                      {course.liveSchedule.endDate
                        ? new Date(course.liveSchedule.endDate).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.liveSchedule.startTime || 'N/A'} (
                      {course.liveSchedule.durationMinutes} mins)
                    </span>
                  </div>
                  {course.liveSchedule.daysOfWeek &&
                    course.liveSchedule.daysOfWeek.length > 0 && (
                      <div className="flex items-start justify-between">
                        <span className="text-muted-foreground">Days:</span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                          {course.liveSchedule.daysOfWeek.map((day) => (
                            <Badge key={day} variant="secondary" className="text-[10px] h-4 px-1">
                              {day.substring(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Frequency:</span>
                    <Badge variant="outline" className="capitalize text-[10px] h-4">
                      {course.liveSchedule.frequency || 'once'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {!isEnrolled ? (
                <Button onClick={handleEnroll} className="bg-emerald-600 hover:bg-emerald-700">
                  Enroll
                </Button>
              ) : (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Enrolled
                </Badge>
              )}

              {isEnrolled && isLiveCourse && (
                <Button
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Radio className="w-4 h-4 mr-2" />
                  {isJoining ? 'Checking...' : 'Join Live'}
                </Button>
              )}

              {isEnrolled && course.recording?.enabled && (
                <Button
                  variant="outline"
                  onClick={handleRecording}
                  disabled={isRecordingLoading}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {isRecordingLoading ? 'Loading...' : 'View Recording'}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              )}

              {isEnrolled &&
                courseType === 'recorded' &&
                course.modules &&
                course.modules.length > 0 && (
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Course
                  </Button>
                )}
            </div>

            {/* Course Modules */}
            {course.modules && course.modules.length > 0 && (
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Course Content</h3>
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        isEnrolled
                          ? 'bg-card cursor-pointer hover:border-emerald-200 transition-colors'
                          : 'bg-muted/30 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{module.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {module.duration} mins
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isEnrolled &&
                          enrollment?.progress?.completedModules?.some(
                            (m) => m.moduleId === (module._id || module.title)
                          ) && (
                            <Badge className="bg-emerald-500 text-white border-none text-[10px] h-5">
                              Completed
                            </Badge>
                          )}
                        {!isEnrolled && (
                          <Badge variant="outline" className="text-[10px] h-5 bg-muted/30">
                            Locked
                          </Badge>
                        )}
                        {isEnrolled ? (
                          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Play className="w-5 h-5 fill-current" />
                          </div>
                        ) : (
                          <Video className="w-5 h-5 text-muted-foreground/40" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {course.resources && course.resources.length > 0 && (
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Learning Materials</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {course.resources.map((resource, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        isEnrolled
                          ? 'bg-card cursor-pointer hover:border-emerald-200 transition-colors'
                          : 'bg-muted/30 opacity-80'
                      }`}
                      onClick={() =>
                        isEnrolled && resource.fileUrl && window.open(resource.fileUrl, '_blank')
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            resource.resourceType === 'ebook'
                              ? 'bg-blue-50 text-blue-600'
                              : resource.resourceType === 'audiobook'
                                ? 'bg-purple-50 text-purple-600'
                                : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {resource.resourceType === 'ebook' && <FileText className="w-5 h-5" />}
                          {resource.resourceType === 'audiobook' && (
                            <Headphones className="w-5 h-5" />
                          )}
                          {resource.resourceType === 'other' && <Package className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm line-clamp-1">{resource.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[9px] h-4 px-1 uppercase">
                              {resource.resourceType}
                            </Badge>
                            {resource.duration && resource.resourceType === 'audiobook' && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {resource.duration}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={isEnrolled ? 'text-emerald-600' : 'text-muted-foreground/40'}
                        disabled={!isEnrolled}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
