'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  MessageCircle,
  Phone,
  Calendar,
  Star,
  Trash2,
  MailCheck,
} from 'lucide-react';
import { useState } from 'react';

const mockNotifications = [
  {
    id: '1',
    type: 'message',
    title: 'New message from Rajesh Kumar',
    description: 'You have a new message: "Check your kundali reading..."',
    timestamp: '5 mins ago',
    read: false,
    icon: MessageCircle,
  },
  {
    id: '2',
    type: 'call',
    title: 'Incoming call from Priya Sharma',
    description: 'Priya Sharma is calling you now',
    timestamp: '15 mins ago',
    read: false,
    icon: Phone,
  },
  {
    id: '3',
    type: 'booking',
    title: 'Booking confirmed',
    description: 'Your session with Astrologer Kumar is confirmed for tomorrow at 10:00 AM',
    timestamp: '1 hour ago',
    read: true,
    icon: Calendar,
  },
  {
    id: '4',
    type: 'review',
    title: 'Please rate your session',
    description: 'Rate your recent call with Rajesh Kumar',
    timestamp: '2 hours ago',
    read: true,
    icon: Star,
  },
  {
    id: '5',
    type: 'message',
    title: 'Message reminder',
    description: 'You have 3 unread messages',
    timestamp: '3 hours ago',
    read: true,
    icon: MessageCircle,
  },
];

function getNotificationColor(type: string) {
  switch (type) {
    case 'message':
      return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
    case 'call':
      return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    case 'booking':
      return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
    case 'review':
      return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    default:
      return 'bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800';
  }
}

function getNotificationIconColor(type: string) {
  switch (type) {
    case 'message':
      return 'text-blue-600 dark:text-blue-400';
    case 'call':
      return 'text-green-600 dark:text-green-400';
    case 'booking':
      return 'text-purple-600 dark:text-purple-400';
    case 'review':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-slate-600 dark:text-slate-400';
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Notifications
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Stay updated with calls, messages, and bookings
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="default" className="h-fit text-lg px-3 py-2 bg-red-600">
            {unreadCount} New
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Total Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{notifications.length}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Unread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{unreadCount}</div>
            <p className="text-xs text-slate-500 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {notifications.filter((n) => n.type === 'message').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">From astrologers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-600 dark:text-slate-300">
              Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {notifications.filter((n) => n.type === 'booking').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Upcoming sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Actions */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Notification Center</CardTitle>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button size="sm" variant="outline" onClick={handleMarkAllAsRead}>
                <MailCheck size={16} className="mr-2" />
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button size="sm" variant="outline" onClick={handleDeleteAll}>
                <Trash2 size={16} className="mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Bell size={16} />
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className={`flex items-center gap-2 ${unreadCount > 0 ? 'relative' : ''}`}
              >
                <Bell size={16} />
                Unread
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="message" className="flex items-center gap-2">
                <MessageCircle size={16} />
                Messages
              </TabsTrigger>
              <TabsTrigger value="call" className="flex items-center gap-2">
                <Phone size={16} />
                Calls
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <Calendar size={16} />
                Bookings
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Bell size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No notifications</p>
                  <p className="text-sm">
                    {activeTab === 'unread'
                      ? 'All notifications have been read'
                      : "You're all caught up!"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-2 transition-all ${getNotificationColor(notification.type)} ${
                        !notification.read ? 'ring-2 ring-blue-400 dark:ring-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-white dark:bg-slate-800 shrink-0">
                          <IconComponent
                            size={24}
                            className={getNotificationIconColor(notification.type)}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                {notification.description}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-3 h-3 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {notification.timestamp}
                            </p>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="h-7 text-xs"
                                >
                                  Mark as Read
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(notification.id)}
                                className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
