import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";


const DrVerificationForm = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'experience' | 'certifications'>('personal');
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    contactNumber: '',
    address: '',
    education: [{ degree: '', institution: '', gradYear: '', country: '', specialization: '' }],
    experiences: [{ institution: '', position: '', startDate: '', endDate: '', description: '' }],
    certifications: [{ certificate: '', authority: '', certYear: '' }],
  });

  const handleChange = (e, sectionIndex = null, sectionName = null) => {
    const { name, value } = e.target;
    if (sectionName !== null && sectionIndex !== null) {
      const updatedSection = [...formData[sectionName]];
      updatedSection[sectionIndex][name] = value;
      setFormData({ ...formData, [sectionName]: updatedSection });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSection = (sectionName, template) => {
    setFormData({ ...formData, [sectionName]: [...formData[sectionName], template] });
  };

  const nextTab = () => {
    const tabs = ['personal', 'education', 'experience', 'certifications'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1] as 'personal' | 'education' | 'experience' | 'certifications');
    }
  };

  const prevTab = () => {
    const tabs = ['personal', 'education', 'experience', 'certifications'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1] as 'personal' | 'education' | 'experience' | 'certifications');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submitDoctorVerification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Submission failed');
      console.log('Success:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name*</Label>
              <Input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Dr. John Smith" className='mt-1' required />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth*</Label>
              <Input id="dob" type="date" name="dob" value={formData.dob} onChange={handleChange} className='mt-1' required />
            </div>
            <div>
              <Label htmlFor="gender">Gender*</Label>
              <Select name="gender" value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="mt-1" id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number*</Label>
              <Input id="contactNumber" type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address*</Label>
              <Input id="address" type="text" name="address" value={formData.address} onChange={handleChange} required placeholder='Address' className='mt-1'/>
            </div>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor={`degree-${index}`}>Degree*</Label>
                  <Input id={`degree-${index}`} name="degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education')} placeholder='Degree' className='mt-1' required />
                </div>
                <div>
                  <Label htmlFor={`institution-${index}`}>Institution*</Label>
                  <Input id={`institution-${index}`} name="institution" value={edu.institution} onChange={(e) => handleChange(e, index, 'education')} placeholder='Institution' className='mt-1' required />
                </div>
                <div>
                  <Label htmlFor={`gradYear-${index}`}>Graduation Year*</Label>
                  <Input id={`gradYear-${index}`} name="gradYear" value={edu.gradYear} onChange={(e) => handleChange(e, index, 'education')} placeholder='GradYear' className='mt-1' required />
                </div>
                <div>
                  <Label htmlFor={`country-${index}`}>Country</Label>
                  <Input id={`country-${index}`} name="country" value={edu.country} onChange={(e) => handleChange(e, index, 'education')} placeholder='Country' className='mt-1' />
                </div>
                <div>
                  <Label htmlFor={`specialization-${index}`}>Specialization</Label>
                  <Input id={`specialization-${index}`} name="specialization" value={edu.specialization} onChange={(e) => handleChange(e, index, 'education')} placeholder='Specialization' className='mt-1' />
                </div>
              </div>
            ))}
            <Label className="block text-blue-600 cursor-pointer" onClick={() => addSection('education', { degree: '', institution: '', gradYear: '', country: '', specialization: '' })}>+ Add Another Education</Label>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-4">
            {formData.experiences.map((exp, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor={`expInstitution-${index}`}>Institution*</Label>
                  <Input id={`expInstitution-${index}`} name="institution" value={exp.institution} onChange={(e) => handleChange(e, index, 'experiences')} placeholder='Institution' className='mt-1' required />
                </div>
                <div>
                  <Label htmlFor={`position-${index}`}>Position*</Label>
                  <Input id={`position-${index}`} name="position" value={exp.position} onChange={(e) => handleChange(e, index, 'experiences')} placeholder='Position' className='mt-1' required />
                </div>
                <div>
                  <Label htmlFor={`startDate-${index}`}>Start Date*</Label>
                  <Input id={`startDate-${index}`} type="date" name="startDate" value={exp.startDate} onChange={(e) => handleChange(e, index, 'experiences')} placeholder='Start Date' className='mt-1' required />
                </div>
                <div>
                  <Label htmlFor={`endDate-${index}`}>End Date*</Label>
                  <Input id={`endDate-${index}`} type="date" name="endDate" value={exp.endDate} onChange={(e) => handleChange(e, index, 'experiences')} placeholder='End Date' className='mt-1' required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea id={`description-${index}`} name="description" value={exp.description} onChange={(e) => handleChange(e, index, 'experiences')} className='mt-1' placeholder="Description" />
                </div>
              </div>
            ))}
            <Label className="block text-blue-600 cursor-pointer" onClick={() => addSection('experiences', { institution: '', position: '', startDate: '', endDate: '', description: '' })}>+ Add Another Experience</Label>
          </div>
        );
      case 'certifications':
        return (
          <div className="space-y-4">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor={`certificate-${index}`}>Certificate Name*</Label>
                  <Input id={`certificate-${index}`} name="certificate" value={cert.certificate} onChange={(e) => handleChange(e, index, 'certifications')} className='mt-1' placeholder='Certificate Name' required />
                </div>
                <div>
                  <Label htmlFor={`authority-${index}`}>Issuing Organization*</Label>
                  <Input id={`authority-${index}`} name="authority" value={cert.authority} onChange={(e) => handleChange(e, index, 'certifications')}placeholder='Issuing Organization' className='mt-1' required />
                </div>
                <div>
                  <Label htmlFor={`certYear-${index}`}>Issue Year*</Label>
                  <Input id={`certYear-${index}`} type="text" name="certYear" value={cert.certYear} onChange={(e) => handleChange(e, index, 'certifications')} placeholder='Issue Year' className='mt-1' required />
                </div>
              </div>
            ))}
            <Label className="block text-blue-600 cursor-pointer" onClick={() => addSection('certifications', { certificate: '', authority: '', certYear: '' })}>+ Add Another Certification</Label>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-blue-700 mb-4">Doctor Verification Form</h1>
        <p className="text-sm text-gray-600 mb-6">Please complete all sections to verify your medical credentials</p>

        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-4">
            {['personal', 'education', 'experience', 'certifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "personal" | "education" | "experience" | "certifications")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors duration-300 ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderTabContent()}

          <div className="flex justify-between pt-6">
            {activeTab !== 'personal' && (
              <button type="button" onClick={prevTab} className="px-6 py-2 bg-gray-300 rounded-md">Previous</button>
            )}
            {activeTab !== 'certifications' ? (
              <button type="button" onClick={nextTab} className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next</button>
            ) : (
              <button type="submit" className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save Information</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DrVerificationForm;