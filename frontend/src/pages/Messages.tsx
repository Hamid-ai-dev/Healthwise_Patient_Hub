
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { messageService, Contact, MessageData } from "@/services/messageService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Send,
  PaperclipIcon,
  ImageIcon,
  FileIcon,
  UserRound,
  Loader2
} from "lucide-react";
import { formatDistance } from "date-fns";
import { useToast } from "@/components/ui/use-toast";



const Messages = () => {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const initialContactId = searchParams.get("patientId") || searchParams.get("doctorId") || "";

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactId, setSelectedContactId] = useState(initialContactId);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load contacts based on user role
  useEffect(() => {
    if (!user || !token) return;

    const fetchContacts = async () => {
      setLoading(true);
      try {
        const contactsData = await messageService.getContacts(token);
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: "Error",
          description: "Failed to load contacts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user, token, toast]);

  // Load conversation when contact is selected
  useEffect(() => {
    if (!selectedContactId || !token) return;

    const fetchConversation = async () => {
      setLoadingMessages(true);
      try {
        const conversationData = await messageService.getConversation(token, selectedContactId);
        setMessages(conversationData.messages);
        // Mark messages as read
        await messageService.markAsRead(token, selectedContactId);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive",
        });
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchConversation();
  }, [selectedContactId, token, toast]);

  // Refresh contacts periodically to get updated unread counts and last messages
  useEffect(() => {
    if (!user || !token) return;

    const refreshContacts = async () => {
      try {
        const contactsData = await messageService.getContacts(token);
        setContacts(contactsData);
      } catch (error) {
        console.error('Error refreshing contacts:', error);
      }
    };

    // Refresh contacts every 30 seconds
    const interval = setInterval(refreshContacts, 30000);
    return () => clearInterval(interval);
  }, [user, token]);
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected contact
  const selectedContact = contacts.find(c => c._id === selectedContactId);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContactId || !user || !token) return;

    setSendingMessage(true);
    try {
      const sentMessage = await messageService.sendMessage(
        token,
        selectedContactId,
        newMessage.trim()
      );

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file attachment (mock function)
  const handleAttachment = () => {
    toast({
      title: "Feature coming soon",
      description: "File attachment will be available in the next update",
    });
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
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading contacts...</span>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No contacts found
                </div>
              ) : (
                <ul className="space-y-2">
                  {filteredContacts.map((contact) => {
                    return (
                      <li key={contact._id}>
                        <button
                          className={`w-full text-left p-3 rounded-md flex items-start gap-3 ${
                            selectedContactId === contact._id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setSelectedContactId(contact._id)}
                        >
                          <div className="flex-shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>
                                {getInitials(contact.name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="font-medium truncate">{contact.name}</p>
                              {contact.lastMessage && (
                                <p className={`text-xs ${
                                  selectedContactId === contact._id
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}>
                                  {getTimeSince(contact.lastMessage.timestamp)}
                                </p>
                              )}
                            </div>
                            <p className={`text-sm truncate mt-1 ${
                              selectedContactId === contact._id
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}>
                              {contact.lastMessage?.content || "No messages yet"}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              {contact.role === "doctor" && (
                                <Badge variant={selectedContactId === contact._id ? "outline" : "secondary"} className="text-xs">
                                  Doctor
                                </Badge>
                              )}
                              {contact.unreadCount > 0 && (
                                <Badge variant="destructive" className="ml-auto">
                                  {contact.unreadCount}
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
                      <AvatarFallback>
                        {getInitials(selectedContact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selectedContact.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {selectedContact.role === "doctor"
                          ? "Doctor"
                          : "Patient"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-auto p-4">
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading messages...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <UserRound className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                          Start a conversation with {selectedContact.name} by sending a message below.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isCurrentUser = msg.senderId._id === user?.id;

                        return (
                          <div
                            key={msg._id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div className="flex items-start gap-2 max-w-[75%]">
                              {!isCurrentUser && (
                                <Avatar className="h-8 w-8 mt-0.5">
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
                                  {msg.messageType === "text" ? (
                                    <p>{msg.content}</p>
                                  ) : msg.messageType === "image" ? (
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
                                      {msg.isRead ? "✓✓" : "✓"}
                                    </span>
                                  )}
                                </p>
                              </div>
                              {isCurrentUser && (
                                <Avatar className="h-8 w-8 mt-0.5">
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
                      disabled={!newMessage.trim() || sendingMessage}
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
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



export default Messages;
