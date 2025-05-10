import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Search, ArrowLeft, MoreVertical, X, Check, Phone, Video, Image, Paperclip, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import my_avata from "../assets"

export const MessagingSystem = () => {
  const [contacts, setContacts] = useState([
    {
      id: "1",
      name: "John Brindi",
      avatar: "C:\Users\THE GREAT\Desktop\app\src\assets\my_avata.jpg",
      lastSeen: "2 min ago",
      status: "online",
      unread: 2,
    },
    {
      id: "2",
      name: "Abdul Fadiga",
      avatar: "",
      lastSeen: "1 hour ago",
      status: "offline",
      unread: 0,
    },
    {
      id: "3",
      name: "Favour",
      avatar: "",
      lastSeen: "5 min ago",
      status: "online",
      unread: 0,
    },
    {
      id: "4",
      name: "SEED",
      avatar: "",
      lastSeen: "3 hours ago",
      status: "offline",
      unread: 3,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeContactId, setActiveContactId] = useState(null);
  const [messages, setMessages] = useState({
    "1": [
      {
        id: "1-1",
        text: "Hello, I'm interested in the frontend internship position.",
        sender: "contact",
        timestamp: new Date(Date.now() - 60000 * 25),
        status: "read",
      },
      {
        id: "1-2",
        text: "Hi John! Thanks for your interest. Could you tell me more about your experience with React?",
        sender: "user",
        timestamp: new Date(Date.now() - 60000 * 20),
        status: "read",
      },
      {
        id: "1-3",
        text: "I've worked on several projects using React, including a personal portfolio and an e-commerce site.",
        sender: "contact",
        timestamp: new Date(Date.now() - 60000 * 10),
        status: "read",
      },
      {
        id: "1-4",
        text: "That sounds great! Would you be available for an interview next week?",
        sender: "user",
        timestamp: new Date(Date.now() - 60000 * 5),
        status: "delivered",
      },
    ],
    "2": [
      {
        id: "2-1",
        text: "Thank you for considering my application.",
        sender: "contact",
        timestamp: new Date(Date.now() - 60000 * 60 * 5),
        status: "read",
      },
      {
        id: "2-2",
        text: "You're welcome! We were impressed with your portfolio.",
        sender: "user",
        timestamp: new Date(Date.now() - 60000 * 60 * 4),
        status: "read",
      },
    ],
    "4": [
      {
        id: "4-1",
        text: "Hi there, do you have any questions about the internship?",
        sender: "user",
        timestamp: new Date(Date.now() - 60000 * 60 * 24),
        status: "delivered",
      },
      {
        id: "4-2",
        text: "Yes, I was wondering about the duration of the internship.",
        sender: "contact",
        timestamp: new Date(Date.now() - 60000 * 60 * 23),
        status: "read",
      },
      {
        id: "4-3",
        text: "It's a 3-month program with the possibility of extension.",
        sender: "user",
        timestamp: new Date(Date.now() - 60000 * 60 * 22),
        status: "sent",
      },
    ],
  });

  const [newMessage, setNewMessage] = useState("");
  const [mobileViewingChat, setMobileViewingChat] = useState(false);

  const activeContact = contacts.find((contact) => contact.id === activeContactId);
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!activeContactId || !newMessage.trim()) return;

    const newMsg = {
      id: `${activeContactId}-${Date.now()}`,
      text: newMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }));

    setNewMessage("");

    // Simulate response for demo (would be removed in a real application)
    setTimeout(() => {
      const responseMsg = {
        id: `${activeContactId}-${Date.now() + 1}`,
        text: "Thanks for your message. I'll get back to you soon.",
        sender: "contact",
        timestamp: new Date(),
        status: "sent",
      };

      setMessages((prev) => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), responseMsg],
      }));
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-14rem)] overflow-hidden rounded-lg border">
      {/* Contact List */}
      <div
        className={`bg-white w-full md:w-1/3 border-r flex flex-col ${
          mobileViewingChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${
                  activeContactId === contact.id ? "bg-gray-50" : ""
                }`}
                onClick={() => {
                  setActiveContactId(contact.id);
                  setMobileViewingChat(true);
                  // Mark messages as read
                  if (contact.unread > 0) {
                    setContacts(
                      contacts.map((c) =>
                        c.id === contact.id ? { ...c, unread: 0 } : c
                      )
                    );
                  }
                }}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {contact.status === "online" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.lastSeen}</span>
                  </div>
                  {messages[contact.id] && messages[contact.id].length > 0 ? (
                    <p className="text-sm text-gray-500 truncate">
                      {messages[contact.id][messages[contact.id].length - 1].text}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No messages yet</p>
                  )}
                </div>
                {contact.unread > 0 && (
                  <Badge className="ml-2">{contact.unread}</Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div
        className={`bg-gray-50 flex-1 flex flex-col ${
          !mobileViewingChat ? "hidden md:flex" : "flex"
        }`}
      >
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileViewingChat(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarFallback>
                    {activeContact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activeContact.name}</h3>
                  <p className="text-xs text-gray-500">
                    {activeContact.status === "online" ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      `Last seen ${activeContact.lastSeen}`
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Clear Chat</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages[activeContact.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-white border"
                      }`}
                    >
                      <p>{message.text}</p>
                      <div
                        className={`text-xs mt-1 flex justify-end items-center gap-1 ${
                          message.sender === "user"
                            ? "text-primary-foreground/80"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {message.sender === "user" && (
                          <>
                            {message.status === "sent" && (
                              <Check className="h-3 w-3" />
                            )}
                            {message.status === "delivered" && (
                              <div className="flex">
                                <Check className="h-3 w-3" />
                                <Check className="h-3 w-3 -ml-1" />
                              </div>
                            )}
                            {message.status === "read" && (
                              <div className="flex text-blue-400">
                                <Check className="h-3 w-3" />
                                <Check className="h-3 w-3 -ml-1" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white p-3 border-t flex gap-2 items-end">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <Image className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              <Textarea
                placeholder="Type a message..."
                className="flex-1 min-h-10 max-h-32 resize-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-gray-500 max-w-sm">
              Select a conversation or start a new one with applicants and interns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Message Icon
const MessageIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default MessagingSystem;