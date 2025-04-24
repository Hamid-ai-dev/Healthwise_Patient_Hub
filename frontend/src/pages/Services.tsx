import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Stethoscope, 
  Brain, 
  FileImage, 
  MessageSquare, 
  Calendar, 
  Activity, 
  Heart, 
  Pill,
  Dumbbell,
  ChefHat,
  ClipboardList,
  Shield
} from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Primary Care",
      description: "Comprehensive healthcare services for individuals and families, including regular check-ups, preventive care, and management of chronic conditions.",
      icon: <Stethoscope className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Specialist Consultations",
      description: "Access to specialists across various medical fields for specialized care and treatment of complex conditions.",
      icon: <Heart className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Diagnostic Imaging",
      description: "Advanced imaging services including X-rays, MRIs, CT scans, and ultrasounds for accurate diagnosis and treatment planning.",
      icon: <FileImage className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Telemedicine",
      description: "Virtual consultations with healthcare providers from the comfort of your home, saving time and ensuring continuous care.",
      icon: <MessageSquare className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Appointment Scheduling",
      description: "Easy online appointment booking with your preferred doctors and specialists at times convenient for you.",
      icon: <Calendar className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Health Monitoring",
      description: "Track vital health metrics over time to monitor progress and make informed decisions about your healthcare.",
      icon: <Activity className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "AI-Powered Diagnostics",
      description: "Cutting-edge artificial intelligence tools that help doctors make faster, more accurate diagnoses and treatment recommendations.",
      icon: <Brain className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Medication Management",
      description: "Comprehensive medication review, electronic prescriptions, and reminders to ensure effective and safe medication use.",
      icon: <Pill className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Nutrition Planning",
      description: "Personalized diet plans and nutritional guidance to support your health goals and dietary needs.",
      icon: <ChefHat className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Fitness Programs",
      description: "Customized exercise regimens designed by healthcare professionals to improve your physical health and wellbeing.",
      icon: <Dumbbell className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Medical Records Access",
      description: "Secure, 24/7 access to your complete medical records, test results, and treatment history.",
      icon: <ClipboardList className="h-10 w-10 text-healwise-blue" />
    },
    {
      title: "Preventive Care",
      description: "Proactive health services focused on preventing disease, including vaccinations, screenings, and health risk assessments.",
      icon: <Shield className="h-10 w-10 text-healwise-blue" />
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-lg text-gray-600">
              HealWise offers a comprehensive range of healthcare services designed to meet your needs
              and provide you with the best possible care experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-t-4 border-t-healwise-blue transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;