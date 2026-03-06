'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserCourses, useMyEnrolledCourseIds } from '@/lib/hooks/use-user-app';
import { UserCourse } from '@/types';
import { Search, Star, Users, Clock, BookOpen, IndianRupee, CheckCircle } from 'lucide-react';

export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  const { data: courses = [], isLoading, isError } = useUserCourses();
  const { data: enrolledIds = new Set<string>() } = useMyEnrolledCourseIds();

  const filteredCourses = courses.filter((course: UserCourse) => {
    const instructorName = typeof course.astrologer === 'object' && course.astrologer?.name
      ? course.astrologer.name
      : typeof course.astrologer === 'string' ? course.astrologer : course.instructor ?? '';
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructorName.toLowerCase().includes(searchTerm.toLowerCase());

    const coursePrice = course.isFree ? 0 : course.price;
    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'free' && coursePrice === 0) ||
      (priceFilter === 'budget' && coursePrice > 0 && coursePrice < 999) ||
      (priceFilter === 'premium' && coursePrice >= 999);

    return matchesSearch && matchesPrice;
  });

  const enrolledCourses = filteredCourses.filter(c => enrolledIds.has(c._id));
  const availableCourses = filteredCourses.filter(c => !enrolledIds.has(c._id));

  const totalStudents = filteredCourses.reduce((acc, course) => acc + (course.totalEnrollments ?? course.students ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Astrology Courses</h1>
        </div>
        <p className="text-gray-600">Expand your knowledge with expert-led courses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Available Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
            <p className="text-xs text-gray-500 mt-1">Courses available</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{enrolledIds.size}</p>
            <p className="text-xs text-gray-500 mt-1">Courses in progress</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{totalStudents.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title, instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600 self-center">Price:</span>
            {['all', 'free', 'budget', 'premium'].map(filter => (
              <button
                key={filter}
                onClick={() => setPriceFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  priceFilter === filter
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'free' ? 'Free' : filter === 'budget' ? 'Under ₹1000' : '₹1000+'}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredCourses.length} of {courses.length} course{courses.length !== 1 ? 's' : ''}
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <BookOpen className="w-8 h-8 text-emerald-600 animate-pulse" />
          </div>
          <p className="text-gray-500 mt-2">Loading courses...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-600">Failed to load courses. Please retry.</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No courses found matching your criteria</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Enrolled Courses */}
          {enrolledCourses.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-900">My Enrolled Courses</h2>
                <span className="ml-1 text-sm text-white bg-emerald-600 rounded-full px-2 py-0.5">{enrolledCourses.length}</span>
              </div>
              <CourseGrid courses={enrolledCourses} enrolled router={router} />
            </section>
          )}

          {/* Available Courses */}
          {availableCourses.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {enrolledCourses.length > 0 ? 'Explore More Courses' : 'All Courses'}
                </h2>
                <span className="ml-1 text-sm text-white bg-gray-500 rounded-full px-2 py-0.5">{availableCourses.length}</span>
              </div>
              <CourseGrid courses={availableCourses} enrolled={false} router={router} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function CourseGrid({ courses, enrolled, router }: { courses: UserCourse[]; enrolled: boolean; router: ReturnType<typeof import('next/navigation').useRouter> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: UserCourse) => (
        <Card
          key={course._id}
          className={`overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer ${enrolled ? 'ring-2 ring-emerald-200' : ''}`}
          onClick={() => router.push(`/courses/${course._id}`)}
        >
          {/* Image Section */}
          <div className="bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 h-40 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform overflow-hidden relative">
            {course.title.charAt(0)}
            {enrolled && (
              <span className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Enrolled
              </span>
            )}
          </div>

          {/* Content */}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {typeof course.astrologer === 'object' && course.astrologer?.name
                    ? `By ${course.astrologer.name}`
                    : course.instructor
                      ? `By ${course.instructor}`
                      : course.category ?? ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {(course.rating ?? 0).toFixed(1)}
              </div>
              {course.courseType && (
                <Badge variant="outline" className="text-xs capitalize">{course.courseType}</Badge>
              )}
              {course.level && (
                <Badge variant="secondary" className="text-xs">{course.level}</Badge>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600 border-t border-gray-200 pt-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>
                  {course.modules && course.modules.length > 0
                    ? `${course.modules.reduce((s, m) => s + (m.duration || 0), 0)} min · ${course.modules.length} module${course.modules.length > 1 ? 's' : ''}`
                    : `${course.duration || 0} hours of content`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{(course.totalEnrollments ?? course.students ?? 0).toLocaleString()} students enrolled</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span className="text-lg font-bold text-emerald-600">
                  {course.isFree || course.price === 0 ? 'FREE' : course.price.toLocaleString()}
                </span>
              </div>
              <Button
                onClick={(e) => { e.stopPropagation(); router.push(`/courses/${course._id}`); }}
                className={enrolled ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'}
              >
                {enrolled ? 'Continue' : 'View Course'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
