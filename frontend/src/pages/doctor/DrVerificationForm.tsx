import React, { useState } from 'react';
import { useForm, useFieldArray, useController, SubmitHandler } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DrVerificationForm = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'experience' | 'certifications'>('personal');
  const { register, handleSubmit, control, setValue, formState, watch, trigger, getValues } = useForm({
    defaultValues: {
      fullName: '',
      dob: '',
      gender: '',
      contactNumber: '',
      address: '',
      education: [{ degree: '', institution: '', gradYear: '', country: '', specialization: '' }],
      experiences: [{ institution: '', position: '', startDate: '', endDate: '', description: '' }],
      certifications: [{ certificate: '', authority: '', certYear: '' }]
    },
    mode: 'onChange', // Validation on input change
  });

  const { fields: eduFields, append: appendEdu } = useFieldArray({ control, name: 'education' });
  const { fields: expFields, append: appendExp } = useFieldArray({ control, name: 'experiences' });
  const { fields: certFields, append: appendCert } = useFieldArray({ control, name: 'certifications' });

  const { field: genderField } = useController({
    name: 'gender',
    control,
    defaultValue: ''
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const response = await fetch('/api/submitDoctorVerification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Submission failed');
      console.log('Success:', result);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Function to validate the current section
  const validateCurrentSection = async () => {
    let valid = false;
    switch (activeTab) {
      case 'personal':
        valid = await trigger(['fullName', 'dob', 'gender', 'contactNumber', 'address']);
        break;
      case 'education':
        valid = await trigger('education');
        break;
      case 'experience':
        valid = await trigger('experiences');
        break;
      case 'certifications':
        valid = await trigger('certifications');
        break;
      default:
        break;
    }
    return valid;
  };

  // Handle section change with validation
  const handleTabChange = async (nextTab: 'personal' | 'education' | 'experience' | 'certifications') => {
    const isValid = await validateCurrentSection();
    if (isValid) {
      setActiveTab(nextTab);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name*</Label>
              <Input id="fullName" {...register("fullName", { required: true })} placeholder="Dr. John Smith" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth*</Label>
              <Input id="dob" type="date" {...register("dob", { required: true })} className="mt-1" />
            </div>
            <div>
              <Label>Gender*</Label>
              <Select {...genderField} value={genderField.value} onValueChange={(val) => setValue('gender', val)}>
                <SelectTrigger className="mt-1">
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
              <Input type='number' id="contactNumber" {...register("contactNumber", { required: true })} placeholder="Contact" className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address*</Label>
              <Input id="address" {...register("address", { required: true })} placeholder="Address" className="mt-1" />
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            {eduFields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Degree*</Label>
                  <Input {...register(`education.${index}.degree`, { required: true })} placeholder="Degree" className="mt-1" />
                </div>
                <div>
                  <Label>Institution*</Label>
                  <Input {...register(`education.${index}.institution`, { required: true })} placeholder="Institution" className="mt-1" />
                </div>
                <div>
                  <Label>Grad Year*</Label>
                  <Input type='number' min="1900" max="2025" {...register(`education.${index}.gradYear`, { required: true })} placeholder="Valid Grad Year (1990 to 2025)" className="mt-1" />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input {...register(`education.${index}.country`)} placeholder="Country" className="mt-1" />
                </div>
                <div>
                  <Label>Specialization</Label>
                  <Input {...register(`education.${index}.specialization`)} placeholder="Specialization" className="mt-1" />
                </div>
              </div>
            ))}
            <Label className="text-blue-600 cursor-pointer" onClick={() => appendEdu({ degree: '', institution: '', gradYear: '', country: '', specialization: '' })}>
              + Add Another Education
            </Label>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            {expFields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Institution*</Label>
                  <Input {...register(`experiences.${index}.institution`, { required: true })} placeholder="Institution" className="mt-1" />
                </div>
                <div>
                  <Label>Position*</Label>
                  <Input {...register(`experiences.${index}.position`, { required: true })} placeholder="Position" className="mt-1" />
                </div>
                <div>
                  <Label>Start Date*</Label>
                  <Input type="date" {...register(`experiences.${index}.startDate`, { required: true })} className="mt-1" />
                </div>
                <div>
                  <Label>End Date*</Label>
                  <Input type="date" {...register(`experiences.${index}.endDate`, { required: true })} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea {...register(`experiences.${index}.description`)} className="mt-1" placeholder="Description" />
                </div>
              </div>
            ))}
            <Label className="text-blue-600 cursor-pointer" onClick={() => appendExp({ institution: '', position: '', startDate: '', endDate: '', description: '' })}>
              + Add Another Experience
            </Label>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-4">
            {certFields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Certificate Name*</Label>
                  <Input {...register(`certifications.${index}.certificate`, { required: true })} placeholder="Certificate Name" className="mt-1" />
                </div>
                <div>
                  <Label>Issuing Organization*</Label>
                  <Input {...register(`certifications.${index}.authority`, { required: true })} placeholder="Issuing Organization" className="mt-1" />
                </div>
                <div>
                  <Label>Issue Year*</Label>
                  <Input type='number' min="1900" max="2025" {...register(`certifications.${index}.certYear`, { required: true })} placeholder="Valid Issue Year (1990 to 2025)" className="mt-1" />
                </div>
              </div>
            ))}
            <Label className="text-blue-600 cursor-pointer" onClick={() => appendCert({ certificate: '', authority: '', certYear: '' })}>
              + Add Another Certification
            </Label>
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
                onClick={() => handleTabChange(tab as 'personal' | 'education' | 'experience' | 'certifications')}
                disabled={activeTab !== tab && !formState.isValid}
                className={`px-4 py-2 font-medium border-b-2 transition-colors duration-300 ${
                  activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {renderTabContent()}
          <div className="flex justify-between">
            {activeTab !== 'personal' && (
              <button type="button" onClick={() => setActiveTab('personal')} className="px-6 py-2 bg-gray-300 rounded-md">
                Previous
              </button>
            )}
            <button
              type="button" 
              onClick={async () => {
                const valid = await validateCurrentSection();
                if (valid) {
                  const currentTabIndex = ['personal', 'education', 'experience', 'certifications'].indexOf(activeTab);
                  const nextTab = ['personal', 'education', 'experience', 'certifications'][currentTabIndex + 1] as 'personal' | 'education' | 'experience' | 'certifications';
                  if (nextTab) setActiveTab(nextTab);
                }
              }}
              className={`ml-auto rounded-md px-6 py-2 ${formState.isValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              disabled={!formState.isValid}
            >
              {activeTab === 'certifications' ? 'Save Information' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DrVerificationForm;
