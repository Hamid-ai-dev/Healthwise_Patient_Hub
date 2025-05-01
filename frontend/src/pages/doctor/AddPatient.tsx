import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select"


interface AddPatientProps {
  onClose: () => void;
  onSave: (newPatient: any) => void; 
}
const AddPatient: React.FC<AddPatientProps> = ({ onClose, onSave }) => {
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    email: "",
    height: "",
    weight: "",
    bloodPressure: "",
    heartRate: "",
    image: null as File | null,
  });

  // Load form data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('patientFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Update localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('patientFormData', JSON.stringify(formData));
  }, [formData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData((prevData) => ({
          ...prevData,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white p-3 rounded-lg shadow-xl overflow-y-auto max-h-[95vh]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Patient</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newPatient = {
            id: Date.now().toString(),
            name: formData.name,
            age: formData.age,
            gender: formData.gender,
            phone: formData.phone,
            address: formData.address,
            email: formData.email,
            height: formData.height,
            weight: formData.weight,
            bloodPressure: formData.bloodPressure,
            heartRate: formData.heartRate,
            image: formData.image,
            queries: [],
          };
          // Pass the new patient data to the parent component
          onSave(newPatient);
          // Clear form data and localStorage
          setFormData({
            name: "",
            age: "",
            gender: "",
            phone: "",
            address: "",
            email: "",
            height: "",
            weight: "",
            bloodPressure: "",
            heartRate: "",
            image: null,
          });
          localStorage.removeItem('patientFormData');
          // Close the form/modal
          onClose();
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Image Upload */}
        <div>
          <Label htmlFor="file-input">Upload Image</Label>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="mt-1 items-center justify-center text-center" 
            id="file-input" required
          />
        </div>
        {/* Full Name */}
        <div>
          <Label>Full Name</Label>
          <Input 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jordan Blake" 
            className="mt-1" required/>
        </div>
        {/* Age */}
        <div>
          <Label>Age</Label>
          <Input 
            type="number" 
            value={formData.age} 
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="34" 
            className="mt-1" required/>
        </div>
        {/* Gender */}
        <div>
          <Label>Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger className="mt-1 border w-full rounded-md p-2 text-sm">
                  <SelectValue placeholder="Select gender" />
            </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
        </div>
        {/* Contact Number */}
        <div>
          <Label>Contact Number</Label>
          <Input 
            type="tel" 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (408) 555-0198" 
            className="mt-1" required/>
        </div>
        {/* Address */}
        <div className="sm:col-span-2 lg:col-span-3">
          <Label>Address</Label>
          <Textarea 
            value={formData.address} 
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Maple Street, Springfield, IL 62704, USA"
            className="mt-1" required/>
        </div>
        {/* Email */}
        <div>
          <Label>Email</Label>
          <Input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com" 
            className="mt-1" required/>
        </div>
        {/* Height */}
        <div>
          <Label>Height</Label>
          <Input 
            type="text"
            value={formData.height} 
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            placeholder="Height (e.g., 5 feet 6 inches)" 
            className="mt-1" required/>
        </div>
        {/* Weight */}
        <div>
          <Label>Weight</Label>
          <Input 
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="Weight (e.g., 60 kg)"
            className="mt-1" required/>
        </div>
        {/* Blood Pressure */}
        <div>
          <Label>Blood Pressure</Label>
          <Input 
            type="number" 
            value={formData.bloodPressure}
            onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
            placeholder="Blood Pressure (e.g., 120/80 mmHg)" 
            className="mt-1" required/>
        </div>
        {/* Heart Rate */}
        <div>
          <Label>Heart Rate</Label>
          <Input 
            type="text" 
            value={formData.heartRate} 
            onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
            placeholder="Heart Rate (e.g., 72 bpm)" 
            className="mt-1" required/>
        </div>
        {/* Submit + Close Button */}
        <div className="col-span-full flex justify-between mt-6">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button type="submit">Save Patient</Button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;
