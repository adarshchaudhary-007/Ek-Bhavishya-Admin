'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User, Play, Award, MoreVertical, Star } from 'lucide-react';
import { useState } from 'react';

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses] = useState([
    {
      id: 1,
      title: 'Vedic Astrology Basics',
      instructor: 'Dr. Rajesh Kumar',
      progress: 45,
      nextLesson: 'Chapter 3: Planetary Positions',
      duration: '20 hours',
      totalLessons: 15,
      completedLessons: 7,
      lastAccessed: '2024-03-04 2:30 PM',
      image: '🔮',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Advanced Horoscope Reading',
      instructor: 'Acharya Vikram Singh',
      progress: 78,
      nextLesson: 'Chapter 8: Dashas and Predictions',
      duration: '25 hours',
      totalLessons: 20,
      completedLessons: 16,
      lastAccessed: '2024-03-03 10:15 AM',
      image: '⭐',
      rating: 4.9,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        </div>
        <p className="text-gray-600">Track your learning progress and continue where you left off</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Courses Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{courses.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active courses</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {courses.reduce((sum, c) => sum + c.completedLessons, 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total lessons done</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Learning Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {courses.reduce((sum, c) => sum + Math.floor((c.progress / 100) * parseInt(c.duration)), 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total hours spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">You have not enrolled in any courses yet</p>
            <Button
              onClick={() => router.push('/courses')}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700"
            >
              Explore Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Course Image/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl">
                    {course.image}
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{course.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{course.instructor}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        Progress: {course.progress}%
                      </span>
                      <span className="text-xs text-gray-500">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Last accessed: {course.lastAccessed}
                    </span>
                  </div>

                  {/* Next Lesson */}
                  <div className="bg-blue-50 p-2 rounded-lg mb-3">
                    <p className="text-xs text-gray-500 mb-1">Next Lesson</p>
                    <p className="text-sm font-medium text-blue-700">{course.nextLesson}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/learning/${course.id}`)}
                      className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Continue Learning
                    </Button>
                    <Button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      variant="outline"
                    >
                      Course Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
