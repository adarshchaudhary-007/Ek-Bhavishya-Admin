'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User, Play, Award, MoreVertical, Star } from 'lucide-react';
import { useState } from 'react';

export default function MyCoursesPage() {
  const courses = [
    {
      id: 1,
      title: 'Vedic Astrology Basics',
      instructor: 'Dr. Rajesh Kumar',
      progress: 45,
      nextLesson: 'Chapter 3: Planetary Positions',
      completedLessons: 5,
      duration: '20',
    },
  ];

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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          My Courses
        </h1>
        <p className="text-slate-600 dark:text-slate-300">Your enrolled courses and progress</p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            You have not enrolled in any courses yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <p className="text-sm text-slate-500">By {course.instructor}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-slate-500">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Next Lesson: {course.nextLesson}
                  </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
