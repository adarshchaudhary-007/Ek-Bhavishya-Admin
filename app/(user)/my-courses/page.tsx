'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MyCoursesPage() {
  const courses = [
    {
      id: 1,
      title: 'Vedic Astrology Basics',
      instructor: 'Dr. Rajesh Kumar',
      progress: 45,
      nextLesson: 'Chapter 3: Planetary Positions',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
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
