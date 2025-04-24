
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { patients, doctors } from "@/data/mockData";
import { Message, Patient, Doctor, User } from "@/types";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Send, 
  PaperclipIcon,
  Clock, 
  ImageIcon,
  FileIcon,
  UserRound
} from "lucide-react";
import { formatDistance } from "date-fns";
import { toast } from "@/hooks/use-toast";

// Mock messages data
const mockMessages: Message[] = [
  {
    id: "msg1",
    senderId: "1", // patient
    receiverId: "2", // doctor
    content: "Hello Dr. Smith, I've been experiencing severe headaches since yesterday.",
    timestamp: "2023-06-19T09:30:00",
    read: true,
    type: "text"
  },
  {
    id: "msg2",
    senderId: "2", // doctor
    receiverId: "1", // patient
    content: "Hello John, I'm sorry to hear that. Could you describe the pain? Is it constant or comes and goes?",
    timestamp: "2023-06-19T10:15:00",
    read: true,
    type: "text"
  },
  {
    id: "msg3",
    senderId: "1", // patient
    receiverId: "2", // doctor
    content: "It's a throbbing pain that comes and goes. Usually worse in the morning.",
    timestamp: "2023-06-19T10:30:00",
    read: true,
    type: "text"
  },
  {
    id: "msg4",
    senderId: "2", // doctor
    receiverId: "1", // patient
    content: "I see. Have you taken any medication for it? Also, please come in for a check-up this week.",
    timestamp: "2023-06-19T10:45:00",
    read: false,
    type: "text"
  },
  {
    id: "msg5",
    senderId: "3", // patient
    receiverId: "2", // doctor
    content: "Dr. Smith, my blood pressure readings have been higher than usual this week.",
    timestamp: "2023-06-18T14:20:00",
    read: true,
    type: "text"
  },
  {
    id: "msg6",
    senderId: "4", // patient
    receiverId: "2", // doctor
    content: "Hi doctor, I need to reschedule my appointment for next week.",
    timestamp: "2023-06-17T11:10:00",
    read: false,
    type: "text"
  }
];

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialContactId = searchParams.get("patientId") || searchParams.get("doctorId") || "";
  
  const [contacts, setContacts] = useState<(Patient | Doctor)[]>([]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactId, setSelectedContactId] = useState(initialContactId);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get all contacts based on user role
  useEffect(() => {
    if (!user) return;
    
    if (user.role === "doctor") {
      setContacts(patients);
    } else if (user.role === "patient") {
      setContacts(doctors);
    }
    
    if (initialContactId) {
      setSelectedContactId(initialContactId);
    }
  }, [user, initialContactId]);
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get conversation messages between current user and selected contact
  const conversationMessages = selectedContactId 
    ? messages.filter(msg => 
        (msg.senderId === user?.id && msg.receiverId === selectedContactId) || 
        (msg.senderId === selectedContactId && msg.receiverId === user?.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];
  
  // Get selected contact
  const selectedContact = contacts.find(c => c.id === selectedContactId);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  // Mark messages as read when selecting a contact
  useEffect(() => {
    if (selectedContactId && user) {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.receiverId === user.id && msg.senderId === selectedContactId && !msg.read
            ? { ...msg, read: true }
            : msg
        )
      );
    }
  }, [selectedContactId, user]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Format time for message display
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Get last message for a contact
  const getLastMessage = (contactId: string) => {
    const contactMessages = messages.filter(msg => 
      (msg.senderId === user?.id && msg.receiverId === contactId) || 
      (msg.senderId === contactId && msg.receiverId === user?.id)
    );
    
    return contactMessages.length > 0 
      ? contactMessages.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]
      : null;
  };

  // Get unread count for a contact
  const getUnreadCount = (contactId: string) => {
    return messages.filter(msg => 
      msg.senderId === contactId && 
      msg.receiverId === user?.id && 
      !msg.read
    ).length;
  };

  // Send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContactId || !user) return;
    
    const newMsg: Message = {
      id: `msg${messages.length + 1}`,
      senderId: user.id,
      receiverId: selectedContactId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      type: "text"
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // In a real app, you would send this to an API
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };

  // Handle file attachment (mock function)
  const handleAttachment = () => {
    toast({
      title: "Feature coming soon",
      description: "File attachment will be available in the next update",
    });
  };

  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get time since for contact list
  const getTimeSince = (timestamp: string) => {
    try {
      return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-180px)]">
          {/* Contacts sidebar */}
          <Card className="md:w-1/3 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Messages</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {filteredContacts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No contacts found
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredContacts.map((contact) => {
                    const lastMessage = getLastMessage(contact.id);
                    const unreadCount = getUnreadCount(contact.id);
                    
                    return (
                      <li key={contact.id}>
                        <button
                          className={`w-full text-left p-3 rounded-md flex items-start gap-3 ${
                            selectedContactId === contact.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setSelectedContactId(contact.id)}
                        >
                          <div className="flex-shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={contact.image} />
                              <AvatarFallback>
                                {getInitials(contact.name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="font-medium truncate">{contact.name}</p>
                              {lastMessage && (
                                <p className={`text-xs ${
                                  selectedContactId === contact.id
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}>
                                  {getTimeSince(lastMessage.timestamp)}
                                </p>
                              )}
                            </div>
                            <p className={`text-sm truncate mt-1 ${
                              selectedContactId === contact.id
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}>
                              {lastMessage?.content || "No messages yet"}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              {contact.role === "doctor" && (
                                <Badge variant={selectedContactId === contact.id ? "outline" : "secondary"} className="text-xs">
                                  {(contact as Doctor).specialty}
                                </Badge>
                              )}
                              {unreadCount > 0 && (
                                <Badge variant="destructive" className="ml-auto">
                                  {unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
          
          {/* Message area */}
          <Card className="md:w-2/3 flex flex-col">
            {selectedContact ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.image} />
                      <AvatarFallback>
                        {getInitials(selectedContact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selectedContact.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {selectedContact.role === "doctor" 
                          ? (selectedContact as Doctor).specialty 
                          : "Patient"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-auto p-4">
                  {conversationMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MessageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                          Start a conversation with {selectedContact.name} by sending a message below.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversationMessages.map((msg, index) => {
                        const isCurrentUser = msg.senderId === user?.id;
                        const senderContact = isCurrentUser ? user : selectedContact;
                        
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div className="flex items-start gap-2 max-w-[75%]">
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8 mt-0.5">
                                  <AvatarImage src={selectedContact.image} />
                                  <AvatarFallback>
                                    {getInitials(selectedContact.name)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div>
                                <div
                                  className={`p-3 rounded-lg ${
                                    isCurrentUser
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  {msg.type === "text" ? (
                                    <p>{msg.content}</p>
                                  ) : msg.type === "image" ? (
                                    <div>
                                      <ImageIcon className="h-4 w-4 mb-1" />
                                      <p>Image attachment</p>
                                    </div>
                                  ) : (
                                    <div>
                                      <FileIcon className="h-4 w-4 mb-1" />
                                      <p>Document attachment</p>
                                    </div>
                                  )}
                                </div>
                                <p className={`text-xs mt-1 ${
                                  isCurrentUser ? "text-right" : ""
                                } text-muted-foreground`}>
                                  {formatMessageTime(msg.timestamp)}
                                  {isCurrentUser && (
                                    <span className="ml-1">
                                      {msg.read ? "✓✓" : "✓"}
                                    </span>
                                  )}
                                </p>
                              </div>
                              {isCurrentUser && (
                                <Avatar className="h-8 w-8 mt-0.5">
                                  <AvatarImage src={user?.image} />
                                  <AvatarFallback>
                                    {user ? getInitials(user.name) : "U"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleAttachment}
                    >
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Textarea
                      placeholder={`Message ${selectedContact.name}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="min-h-[60px] resize-none"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <UserRound className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Contact Selected</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                    Select a contact from the list to start messaging.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

const MessageIcon = ({ className }: { className?: string }) => (
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

export default Messages;
