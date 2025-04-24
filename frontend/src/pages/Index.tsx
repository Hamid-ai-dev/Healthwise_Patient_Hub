
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Search,
  Activity,
  Clock,
  Shield,
  Users,
  ChevronRight,
  Star,
  MessageSquare
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { doctors } from '@/data/mockData';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-healwise-blue" />,
      title: 'Easy Appointment Booking',
      description: 'Schedule appointments with top doctors with just a few clicks.',
    },
    {
      icon: <Search className="h-8 w-8 text-healwise-blue" />,
      title: 'Symptom Checker',
      description: 'Get instant insights about your symptoms and possible conditions.',
    },
    {
      icon: <Activity className="h-8 w-8 text-healwise-blue" />,
      title: 'Health Monitoring',
      description: 'Track your vital signs and health metrics over time.',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-healwise-blue" />,
      title: 'Telemedicine',
      description: 'Consult with doctors via chat or video from the comfort of your home.',
    },
  ];

  const stats = [
    { value: '10k+', label: 'Active Patients' },
    { value: '500+', label: 'Expert Doctors' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' },
  ];

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-gradient-to-r from-sky-50 to-indigo-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-healwise-blue to-healwise-green">
              Your Health, Our Priority
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              Join HealWise for personalized healthcare that combines medical expertise with cutting-edge AI technology for better health outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-healwise-blue hover:bg-blue-600 text-white px-8 py-6 rounded-lg text-lg" 
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <Link to="/about">
                <Button variant="outline" className="px-8 py-6 rounded-lg text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 h-full w-1/2 bg-contain bg-no-repeat bg-right-bottom opacity-40 md:opacity-80" 
             style={{ backgroundImage: "url('https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg')" }}>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HealWise?</h2>
            <p className="text-lg text-gray-600">
              Our platform combines cutting-edge technology with expert medical knowledge to provide you with the best healthcare experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="healwise-card border-t-4 border-t-healwise-blue">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-healwise-blue to-healwise-green text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Top Doctors</h2>
            <Link to="/doctors">
              <Button variant="outline" className="flex items-center gap-2">
                View All Doctors
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="healwise-card overflow-hidden">
                <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                  <p className="text-healwise-blue mb-2">{doctor.specialty}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(doctor.ratings || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{doctor.ratings}</span>
                  </div>
                  <Button className="w-full bg-healwise-blue hover:bg-blue-600">Book Appointment</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Healthcare Reimagined with AI and Expert Doctors
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                HealWise combines the irreplaceable expertise of medical professionals with 
                the analytical power of artificial intelligence to provide a comprehensive 
                healthcare experience focused on better outcomes for patients.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-healwise-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                    <p className="text-gray-600">
                      Get instant health insights, book appointments, and consult with doctors without waiting.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-healwise-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Data Privacy</h3>
                    <p className="text-gray-600">
                      Your health data is securely stored and protected with state-of-the-art encryption.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-healwise-orange" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert Network</h3>
                    <p className="text-gray-600">
                      Access to a network of verified specialists across multiple medical fields.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 lg:p-10">
              <img 
                src="https://img.freepik.com/free-photo/ai-technology-microchip-background-digital-transformation-concept_53876-124669.jpg" 
                alt="AI Healthcare" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-healwise-blue to-healwise-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Healthcare Experience?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of patients who have already improved their healthcare journey with HealWise.
          </p>
          <Button 
            className="bg-white text-healwise-blue hover:bg-gray-100 px-8 py-6 rounded-lg text-lg"
            onClick={handleGetStarted}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Floating Button - only for logged out users on non-mobile */}
      {!user && isScrolled && (
        <div className="hidden md:block fixed bottom-8 right-8 z-50">
          <Button 
            className="bg-healwise-blue hover:bg-blue-600 text-white px-6 py-6 rounded-full shadow-lg"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
