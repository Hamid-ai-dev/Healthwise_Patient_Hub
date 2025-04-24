import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, Clock, Users, Star } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      image: "",
      bio: "Dr. Johnson has over 15 years of experience in healthcare management and is dedicated to improving patient care through innovative approaches."
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "",
      bio: "With a background in AI and healthcare technology, Michael leads our technical initiatives to create cutting-edge healthcare solutions."
    },
    {
      name: "Dr. James Wilson",
      role: "Medical Director",
      image: "",
      bio: "Dr. Wilson specializes in integrating traditional medical practices with modern technology to provide comprehensive patient care."
    },
    {
      name: "Emily Rodriguez",
      role: "Patient Experience Director",
      image: "",
      bio: "Emily's passion is creating seamless, patient-centered experiences that make healthcare more accessible and comfortable for everyone."
    }
  ];

  const testimonials = [
    {
      name: "Robert P.",
      text: "HealWise has completely transformed how I manage my health. The platform is intuitive, and the doctors are incredibly knowledgeable and caring.",
      rating: 5
    },
    {
      name: "Lisa M.",
      text: "As someone with chronic health issues, having easy access to my medical records and being able to consult with specialists without leaving home has been life-changing.",
      rating: 5
    },
    {
      name: "David K.",
      text: "The AI symptom checker saved me from unnecessary worry several times. It's like having a preliminary doctor's opinion whenever you need it.",
      rating: 4
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-50 to-indigo-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">About HealWise</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Reimagining healthcare by combining medical expertise with innovative technology to provide accessible, personalized care for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                At HealWise, our mission is to make quality healthcare accessible to everyone through technology 
                while maintaining the human touch that is essential to medical care. We believe that by empowering 
                both patients and healthcare providers with the right tools and information, we can create better 
                health outcomes and experiences.
              </p>
              <p className="text-lg text-gray-700">
                We are committed to continuous innovation in healthcare delivery, focusing on preventive care, 
                personalized treatment plans, and seamless communication between patients and healthcare providers.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-healwise-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Compassion</h3>
                    <p className="text-gray-600">
                      We approach healthcare with empathy and understanding, recognizing each patient's unique needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-healwise-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                    <p className="text-gray-600">
                      We uphold the highest standards of professionalism, ethics, and privacy in all aspects of our service.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-healwise-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                    <p className="text-gray-600">
                      We continuously seek new and better ways to deliver healthcare, embracing technology to improve outcomes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                    <p className="text-gray-600">
                      We believe in the power of partnership between patients, providers, and technology to create the best health outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-lg text-gray-700 mb-4">
                HealWise was founded in 2020 by a team of healthcare professionals and technology experts who recognized the need for more accessible, 
                efficient, and personalized healthcare services. Born during a time when remote healthcare became essential, we set out to build more 
                than just a telemedicine platform.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Our founders envisioned a comprehensive ecosystem where artificial intelligence and human expertise work hand in hand to provide 
                the best possible care. They understood that while technology can enhance efficiency and accessibility, the human element – 
                compassion, understanding, and personalized attention – remains at the heart of effective healthcare.
              </p>
              <p className="text-lg text-gray-700">
                Today, HealWise has grown into a trusted healthcare platform serving thousands of patients and connecting them with hundreds of 
                qualified healthcare providers. We continue to innovate and expand our services, always guided by our mission to make quality 
                healthcare accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team & Testimonials */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="team" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="team">Our Leadership Team</TabsTrigger>
              <TabsTrigger value="testimonials">Patient Testimonials</TabsTrigger>
            </TabsList>
            <TabsContent value="team">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback className="bg-healwise-blue text-white text-xl">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-healwise-blue mb-3">{member.role}</p>
                      <p className="text-gray-600">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="testimonials">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-gray-50 border-none">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                      <p className="font-semibold">- {testimonial.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;