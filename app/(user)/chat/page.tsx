'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import { onSocketEvent, offSocketEvent, sendMessage, joinChat, leaveChat } from '@/lib/socket';
import { useChatConversations, useSendChatMessage } from '@/lib/hooks/use-user-app';
import { ChatConversation, ChatMessage } from '@/types';

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
}

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useSocket();
  const { data: sessions = [], isLoading } = useChatConversations();
  const sendChatMessageMutation = useSendChatMessage();

  const selectedSession = sessions.find((s: ChatConversation) => s._id === selectedId) ?? null;
  const baseMessages: ChatMessage[] = selectedSession?.messages ?? [];
  const messages = [...baseMessages, ...liveMessages];

  const filteredSessions = sessions.filter((s: ChatConversation) => {
    if (!search) return true;
    const last = s.messages[s.messages.length - 1]?.content ?? '';
    return last.toLowerCase().includes(search.toLowerCase());
  });

  // Socket setup
  useEffect(() => {
    if (!isConnected || !selectedId) return;

    const handleMessageReceived = (data: ChatMessage & { conversationId?: string }) => {
      if (data.conversationId === selectedId || !data.conversationId) {
        setLiveMessages((prev) => [...prev, data]);
      }
    };

    onSocketEvent('message:received', handleMessageReceived);
    onSocketEvent('chat:message', handleMessageReceived);
    joinChat(selectedId);

    return () => {
      offSocketEvent('message:received', handleMessageReceived);
      offSocketEvent('chat:message', handleMessageReceived);
      leaveChat(selectedId);
    };
  }, [selectedId, isConnected]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSelectSession = (id: string) => {
    setSelectedId(id);
    setLiveMessages([]);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedId) return;
    const content = messageInput.trim();
    setMessageInput('');

    const optimistic: ChatMessage = {
      _id: `optimistic-${Date.now()}`,
      senderId: 'me',
      senderType: 'user',
      content,
      timestamp: new Date().toISOString(),
      status: 'sending',
    };
    setLiveMessages((prev) => [...prev, optimistic]);

    if (isConnected) {
      sendMessage(selectedId, content);
    }
    await sendChatMessageMutation.mutateAsync({ conversationId: selectedId, content });
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-140px)]">
      {/* Sessions list */}
      <Card className="w-80 flex-shrink-0 flex flex-col">
        <CardHeader className="border-b pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            Messages
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No conversations yet</div>
          ) : (
            filteredSessions.map((session: ChatConversation) => {
              const lastMsg = session.messages[session.messages.length - 1];
              const unread = session.unreadCount?.user ?? 0;
              const isSelected = selectedId === session._id;

              return (
                <div
                  key={session._id}
                  onClick={() => handleSelectSession(session._id)}
                  className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    isSelected ? 'bg-emerald-50 dark:bg-emerald-950/30 border-l-2 border-l-emerald-500' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {session.astrologerId ? session.astrologerId.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                        {session.astrologerId ? `Astrologer` : 'Chat Session'}
                      </p>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                        {lastMsg ? formatTime(lastMsg.timestamp) : formatTime(session.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {lastMsg
                        ? (lastMsg.senderType === 'user' ? 'You: ' : '') + lastMsg.content
                        : 'No messages yet'}
                    </p>
                  </div>
                  {unread > 0 && (
                    <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center flex-shrink-0">
                      {unread}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Chat area */}
      {selectedSession ? (
        <Card className="flex-1 flex flex-col min-w-0">
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {selectedSession.astrologerId ? 'Astrologer' : 'Chat Session'}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{selectedSession.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-400'}`} />
                <span className="text-xs text-gray-400">{isConnected ? 'Live' : 'Offline'}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.senderType === 'user';
                return (
                  <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                        isOwn
                          ? 'bg-emerald-600 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-0.5 ${isOwn ? 'text-emerald-100' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                        {isOwn && msg.status === 'sending' && ' · Sending...'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </CardContent>

          <div className="border-t p-3">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || sendChatMessageMutation.isPending}
                size="icon"
                className="bg-emerald-600 hover:bg-emerald-700 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        </Card>
      )}
    </div>
  );
}

