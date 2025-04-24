import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Calendar, 
  AlertCircle 
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting data:', data); // Log the data being sent
      const response = await fetch('/api/alerts/contact', {
      // For testing, you can temporarily hardcode the backend URL:
      // const response = await fetch('http://localhost:5000/api/alerts/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      console.log('Response Status:', response.status); // Log the status code
      const responseBody = await response.json(); // Parse the response body
      console.log('Response Body:', responseBody); // Log the response body
      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "We've received your message and will get back to you soon.",
        });
        form.reset();
      } else {
        toast({
          title: "Error sending message",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error); // Log any fetch errors
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5 text-healwise-blue" />,
      title: "Address",
      details: ["123 Healthcare Avenue", "Medical District", "New York, NY 10001"]
    },
    {
      icon: <Phone className="h-5 w-5 text-healwise-blue" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"]
    },
    {
      icon: <Mail className="h-5 w-5 text-healwise-blue" />,
      title: "Email",
      details: ["contact@healwise.com", "support@healwise.com"]
    },
    {
      icon: <Clock className="h-5 w-5 text-healwise-blue" />,
      title: "Operating Hours",
      details: ["Monday - Friday: 8am - 8pm", "Saturday: 9am - 5pm", "Sunday: Closed"]
    }
  ];

  const quickLinks = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Live Chat",
      description: "Chat with our customer support team in real-time"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Book Appointment",
      description: "Schedule a meeting with our healthcare providers"
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Emergency Support",
      description: "Get immediate assistance for urgent matters"
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Have questions or feedback? Our team is here to help. Reach out to us using any of the methods below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-t-4 border-t-healwise-blue">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {info.icon}
                    <h3 className="text-lg font-semibold ml-2">{info.title}</h3>
                  </div>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600">{detail}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {quickLinks.map((link, index) => (
              <Card key={index} className="border border-healwise-blue bg-white hover:bg-blue-50 transition-colors cursor-pointer">
                <CardContent className="p-6 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{link.title}</h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Message subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-healwise-blue hover:bg-blue-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
              <div className="bg-gray-200 h-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.305935303!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1612463711208!5m2!1sen!2sca" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  title="Google Maps Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;