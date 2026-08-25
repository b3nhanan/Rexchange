import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Send,
  ExternalLink,
  CheckCircle2,
  Smile,
} from 'lucide-react';

export const MessagesScreen: React.FC = () => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    sendMessage,
    navigateTo,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [exchangedNotified, setExchangedNotified] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, messageInput);
    setMessageInput('');
  };

  const handleMarkExchanged = () => {
    setExchangedNotified(true);
    setTimeout(() => setExchangedNotified(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 dot-grid pt-24 pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-120px)] min-h-[640px]">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden h-full flex flex-col md:flex-row shadow-2xl">
          {/* Left: Conversations List */}
          <div className="w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-slate-950/40">
            {/* Header */}
            <div className="p-5 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="font-display text-lg font-bold text-white">Campus Messages</h1>
                <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {conversations.length} Active
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 no-scrollbar">
              {filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversation?.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`w-full p-4 flex items-start gap-3.5 text-left transition-all hover:bg-white/[0.06] cursor-pointer ${
                      isSelected ? 'bg-indigo-600/20 border-l-4 border-l-indigo-400' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.participant.avatar}
                        alt={conv.participant.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-white/10"
                      />
                      {conv.participant.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-slate-950 shadow-[0_0_6px_#22c55e]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-display text-xs font-bold text-slate-100 truncate">
                          {conv.participant.name}
                        </h4>
                        <span className="font-mono text-[10px] text-slate-500">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="font-body text-xs text-slate-400 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Chat Stream */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col bg-slate-950/20 min-w-0">
              {/* Active Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeConversation.participant.avatar}
                      alt={activeConversation.participant.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-white/10"
                    />
                    {activeConversation.participant.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-slate-950" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">
                      {activeConversation.participant.name}
                    </h3>
                    <p className="font-mono text-[10px] text-slate-400">
                      {activeConversation.participant.department || 'Verified Student'} •{' '}
                      <span className="text-green-400">Active now</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('profile')}
                  className="font-mono text-xs text-indigo-400 hover:underline"
                >
                  View Profile
                </button>
              </div>

              {/* Listing Context Banner */}
              {activeConversation.listingContext && (
                <div className="px-5 py-3 bg-white/[0.04] border-b border-white/10 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={activeConversation.listingContext.imageUrl}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-display text-xs font-semibold text-white truncate">
                        {activeConversation.listingContext.title}
                      </p>
                      <p className="font-mono text-[11px] text-green-400 font-bold">
                        {activeConversation.listingContext.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                    <button
                      onClick={() =>
                        navigateTo('listing_detail', activeConversation.listingContext?.id)
                      }
                      className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <span>Item</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={handleMarkExchanged}
                      className="px-3 py-1 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 font-bold hover:bg-green-500/25 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{exchangedNotified ? 'Trade Logged!' : 'Mark Exchanged'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/30'
                            : 'bg-white/5 text-slate-100 rounded-bl-none border border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <p className="font-body text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3.5 border-t border-white/10 bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMessageInput((prev) => `${prev} 👍`)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="Add reaction"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Message ${activeConversation.participant.name}...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-body"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold disabled:opacity-40 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8 text-slate-500 font-mono text-xs">
              Select a conversation to begin chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
