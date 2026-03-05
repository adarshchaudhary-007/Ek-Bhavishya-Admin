'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { onSocketEvent, offSocketEvent, sendMessage, joinChat, leaveChat } from '@/lib/socket';
import {
  useChatConversations,
  useChatMessages,
  useSendChatMessage,
} from '@/lib/hooks/use-user-app';
import { ChatConversation, ChatMessage } from '@/types';

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const { isConnected } = useSocket();
  const { data: conversations = [], isLoading: isConversationsLoading } = useChatConversations();
  const { data: apiMessages = [], isLoading: isMessagesLoading } = useChatMessages(selectedConversation);
  const sendChatMessageMutation = useSendChatMessage();

  const messages = [...apiMessages, ...liveMessages];

  // Setup Socket.io listeners
  useEffect(() => {
    if (!isConnected || !selectedConversation) return;

    const handleMessageReceived = (data: ChatMessage) => {
      if (data.conversationId === selectedConversation) {
        setLiveMessages((prev) => [...prev, data]);
      }
    };

    const handleTyping = (data: unknown) => {
      console.log('User is typing:', data);
    };

    onSocketEvent('message:received', handleMessageReceived);
    onSocketEvent('typing', handleTyping);
    joinChat(selectedConversation);

    return () => {
      offSocketEvent('message:received', handleMessageReceived);
      offSocketEvent('typing', handleTyping);
      leaveChat(selectedConversation);
    };
  }, [selectedConversation, isConnected]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setLiveMessages([]);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    if (isConnected) {
      sendMessage(selectedConversation, messageInput);
    }

    setLiveMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        conversationId: selectedConversation,
        content: messageInput,
        sender: 'current-user',
        createdAt: new Date().toISOString(),
      },
    ]);

    await sendChatMessageMutation.mutateAsync({
      conversationId: selectedConversation,
      content: messageInput,
    });

    setMessageInput('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="w-full md:w-96 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle size={24} />
              Messages
            </CardTitle>
            <Input placeholder="Search conversations..." className="mt-4" />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {isConversationsLoading ? (
              <div className="p-4 text-center text-slate-500">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No conversations yet</div>
            ) : (
              <div>
                {conversations.map((conv: ChatConversation) => (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv._id)}
                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      selectedConversation === conv._id ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {conv.participantName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{conv.participantName}</p>
                        <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                        <p className="text-xs text-slate-400 mt-1">{conv.lastMessageTime}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        {selectedConversation ? (
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Chat</CardTitle>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-slate-500">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {isMessagesLoading ? (
                <div className="text-center text-slate-500 py-8">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  Start a conversation
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === 'current-user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'current-user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={!isConnected}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !isConnected || sendChatMessageMutation.isPending}
                  size="icon"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
