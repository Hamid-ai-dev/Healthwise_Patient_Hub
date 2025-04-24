
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import { doctors } from "@/data/mockData";
import { Star } from "lucide-react";

const Doctors = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Doctors</h1>
          <p className="text-lg text-gray-600">
            Meet our team of experienced healthcare professionals dedicated to providing you with the best medical care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative">
                <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center">
                  {doctor.image ? (
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={doctor.image} alt={doctor.name} />
                      <AvatarFallback className="text-4xl bg-healwise-blue text-white">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                {doctor.isAvailable && (
                  <Badge className="absolute top-4 right-4 bg-green-500">Available</Badge>
                )}
              </div>
              
              <CardContent className="p-6">
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
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {doctor.bio || `Dr. ${doctor.name.split(' ')[1]} is a specialist in ${doctor.specialty} with years of experience in the field.`}
                </p>
                
                <Button className="w-full bg-healwise-blue hover:bg-blue-600">Book Appointment</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Doctors;
