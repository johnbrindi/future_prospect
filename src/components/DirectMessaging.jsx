import React, { useState, useRef, useEffect } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, User, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export const DirectMessaging = () => {
  const [contacts, setContacts] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      photo: "",
      lastSeen: new Date(),
      online: true,
      unread: 2,
      internshipApplied: "Software Development Intern"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      photo: "",
      lastSeen: new Date(Date.now() - 20 * 60 * 1000),
      online: false,
      unread: 0,
      internshipApplied: "Software Development Intern"
    },
    {
      id: "3",
      name: "Michael Johnson",
      email: "michael.j@example.com",
      photo: "",
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      online: false,
      unread: 0,
      internshipApplied: "UI/UX Design Intern"
    },
    {
      id: "4",
      name: "Emily Williams",
      email: "emily.w@example.com",
      photo: "",
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      online: true,
      unread: 1,
      internshipApplied: "UI/UX Design Intern"
    }
  ]);

  const [activeContact, setActiveContact] = useState(contacts[0] || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  
  const [conversations, setConversations] = useState({
    "1": [
      {
        id: "1-1",
        text: "Hello, I'm interested in the Software Development internship position.",
        sender: "contact",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "read"
      },
      {
        id: "1-2",
        text: "Hi John! Thanks for your interest. We're reviewing your application. Do you have any specific questions?",
        sender: "user",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: "read"
      },
      {
        id: "1-3",
        text: "Yes, I wanted to ask about the tech stack you're using and what kind of projects I'd be working on.",
        sender: "contact",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: "read"
      },
      {
        id: "1-4",
        text: "We primarily use React, Node.js, and PostgreSQL. Interns typically work on real customer-facing features.",
        sender: "user",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        status: "read"
      },
      {
        id: "1-5",
        text: "That sounds great! When would the internship start?",
        sender: "contact",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: "delivered"
      },
      {
        id: "1-6",
        text: "When are you available to start?",
        sender: "contact",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        status: "sent"
      }
    ],
    "4": [
      {
        id: "4-1",
        text: "Hi, I have some questions about the UI/UX Design intern position.",
        sender: "contact",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: "delivered"
      }
    ]
  });

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.internshipApplied.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!activeContact || !newMessage.trim()) return;
    
    const newMsg = {
      id: `${activeContact.id}-${Date.now()}`,
      text: newMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sent"
    };
    
    setConversations(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg]
    }));
    
    if (activeContact.unread > 0) {
      setContacts(contacts.map(c => 
        c.id === activeContact.id ? {...c, unread: 0} : c
      ));
    }
    
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeContact]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (diff < oneDay && now.getDate() === date.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 7 * oneDay) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatLastSeen = (date, isOnline) => {
    if (isOnline) return "Online";
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    
    if (diff < oneMinute) return "Just now";
    if (diff < oneHour) return `${Math.floor(diff / oneMinute)}m ago`;
    if (diff < oneDay) return `${Math.floor(diff / oneHour)}h ago`;
    return "Last seen " + date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)] border rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Contact Sidebar */}
        <div className="border-r border-gray-200 md:col-span-1 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search contacts..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`p-3 flex items-center border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeContact?.id === contact.id ? 'bg-primary/5 border-l-4 border-l-primary pl-2' : ''
                  }`}
                  onClick={() => {
                    setActiveContact(contact);
                    if (contact.unread > 0) {
                      setContacts(contacts.map(c => 
                        c.id === contact.id ? {...c, unread: 0} : c
                      ));
                    }
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      {contact.photo ? (
                        <AvatarImage src={contact.photo} alt={contact.name} />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                      {contact.unread > 0 && (
                        <Badge className="ml-2 bg-primary text-white text-xs h-5 min-w-5 flex items-center justify-center px-1.5">
                          {contact.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {conversations[contact.id]?.length > 0 
                        ? conversations[contact.id][conversations[contact.id].length - 1].text.substring(0, 30) + 
                          (conversations[contact.id][conversations[contact.id].length - 1].text.length > 30 ? '...' : '')
                        : contact.internshipApplied}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-5 text-center">
                <MessageCircle className="h-8 w-8 text-gray-400 mb-2" />
                <h4 className="font-medium">No contacts found</h4>
                <p className="text-sm text-gray-500">
                  {searchTerm ? `No results for "${searchTerm}"` : "You don't have any messages yet"}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col h-full">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    {activeContact.photo ? (
                      <AvatarImage src={activeContact.photo} alt={activeContact.name} />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {activeContact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="ml-3">
                    <h4 className="font-medium text-sm">{activeContact.name}</h4>
                    <p className="text-xs text-gray-500">
                      {formatLastSeen(activeContact.lastSeen, activeContact.online)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <User className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Block Contact</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversations[activeContact.id]?.length > 0 ? (
                  conversations[activeContact.id].map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                          message.sender === "user" ? "text-primary-foreground/70" : "text-gray-500"
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-5">
                    <div className="rounded-full bg-primary/10 p-3 mb-3">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-medium">No messages yet</h4>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs">
                      Send your first message to start the conversation with {activeContact.name}
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="p-3 border-t border-gray-200">
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="mr-1">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Input 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="mr-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-5 text-center">
              <div className="rounded-full bg-primary/10 p-5 mb-4">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Your Messages</h3>
              <p className="text-gray-500 max-w-md mb-4">
                Select a contact from the list to view your conversation history and exchange messages with internship applicants.
              </p>
              <p className="text-sm text-gray-400">
                All messages with internship applicants will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};