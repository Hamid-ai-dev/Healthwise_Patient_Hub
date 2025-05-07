import React, { useState } from 'react';
import { useForm, useFieldArray, useController, SubmitHandler } from 'react-hook-form';
import axios from 'axios'; // Import axios
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Import Button if not already
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast"; // Import useToast

// Define the structure of the form data more precisely if desired
interface EducationData {
  degree: string;
  institution: string;
  gradYear: string; // Keep as string initially from input, backend expects number
  country?: string;
  specialization?: string;
}

interface ExperienceData {
  institution: string;
  position: string;
  startDate: string; // Keep as string from date input
  endDate: string; // Keep as string from date input
  description?: string;
}

interface CertificationData {
  certificate: string; // Matches backend schema
  authority: string;   // Matches backend schema
  certYear: string;    // Keep as string initially, backend expects number
}

interface FormData {
  fullName: string;
  dob: string; // Keep as string from date input
  gender: string;
  contactNumber: string;
  address: string;
  education: EducationData[];
  experiences: ExperienceData[];
  certifications: CertificationData[];
}


const DrVerificationForm = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'experience' | 'certifications'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const { token } = useAuth(); // Get the token from AuthContext
  const { toast } = useToast(); // Get toast function

  const { register, handleSubmit, control, setValue, formState, watch, trigger, getValues } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      dob: '',
      gender: '',
      contactNumber: '',
      address: '',
      education: [{ degree: '', institution: '', gradYear: '', country: '', specialization: '' }],
      experiences: [{ institution: '', position: '', startDate: '', endDate: '', description: '' }],
      // Use backend field names for consistency from the start
      certifications: [{ certificate: '', authority: '', certYear: '' }]
    },
    mode: 'onChange', // Validation on input change
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experiences' });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control, name: 'certifications' });

  const { field: genderField } = useController({
    name: 'gender',
    control,
    rules: { required: 'Gender is required' }, // Add validation rule
    defaultValue: ''
  });


  // --- ONSUBMIT FUNCTION (MODIFIED) ---
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true); // Start loading indicator

    // Prepare/reshape data for the backend
    // Backend expects specific types (Date, Number), handle conversion if needed here or on backend
    // Backend expects 'certificates' field name based on controller logic
    const reshapedData = {
      personal: [{
        fullName: data.fullName,
        dateOfBirth: data.dob, // Backend will parse this string into Date
        gender: data.gender,
        contactNumber: data.contactNumber,
        address: data.address,
      }],
      education: data.education.map(edu => ({
          ...edu,
          gradYear: parseInt(edu.gradYear, 10) || null // Convert to number, handle potential NaN
      })),
      experience: data.experiences.map(exp => ({
          ...exp,
          // Backend expects Date objects, sending strings is usually fine if backend parses them
          startDate: exp.startDate,
          endDate: exp.endDate,
      })),
      certificates: data.certifications.map(cert => ({
          ...cert,
          certYear: parseInt(cert.certYear, 10) || null // Convert to number, handle potential NaN
      })),
    };

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please log in again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      // Optional: Redirect to login using useNavigate() from react-router-dom
      // navigate('/login');
      return;
    }

    try {
      console.log("Sending data to backend:", reshapedData); // Log data being sent

      const response = await axios.post(
        'http://localhost:5000/api/doctor/profile', // Your backend endpoint
        reshapedData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the JWT token
          }
        }
      );

      console.log("Backend response:", response.data); // Log success response

      toast({
        title: "Profile Saved",
        description: "Your verification details have been submitted successfully.",
      });
      // Optional: Navigate to dashboard or another page after successful submission
      // navigate('/doctor-dashboard');

    } catch (error: any) { // Catch specific axios errors if needed
      console.error("Submission error:", error.response?.data || error.message); // Log detailed error

      const errorMessage = error.response?.data?.message || // Use backend message if available
                           error.message || // Otherwise, use generic axios error message
                           'An unexpected error occurred.';

      toast({
        title: "Submission Failed",
        description: `Could not save profile. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Stop loading indicator regardless of success/failure
    }
  };
  // --- END ONSUBMIT ---


  // Function to validate the current section (using react-hook-form's trigger)
  const validateCurrentSection = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData | `education.${number}.${keyof EducationData}` | `experiences.${number}.${keyof ExperienceData}` | `certifications.${number}.${keyof CertificationData}`)[] = [];

    switch (activeTab) {
      case 'personal':
        fieldsToValidate = ['fullName', 'dob', 'gender', 'contactNumber', 'address'];
        break;
      case 'education':
        // Validate all fields within all education items
        fieldsToValidate = getValues('education').flatMap((_, index) => [
            `education.${index}.degree`,
            `education.${index}.institution`,
            `education.${index}.gradYear`
            // Add other required fields if necessary
        ]) as any[]; // Type assertion might be needed depending on strictness
         // Or simply trigger the array field: fieldsToValidate = ['education']; // might be less granular
        break;
      case 'experience':
        fieldsToValidate = getValues('experiences').flatMap((_, index) => [
            `experiences.${index}.institution`,
            `experiences.${index}.position`,
            `experiences.${index}.startDate`,
            `experiences.${index}.endDate`
         ]) as any[];
         // Or: fieldsToValidate = ['experiences'];
        break;
      case 'certifications':
         fieldsToValidate = getValues('certifications').flatMap((_, index) => [
            `certifications.${index}.certificate`,
            `certifications.${index}.authority`,
            `certifications.${index}.certYear`
         ]) as any[];
         // Or: fieldsToValidate = ['certifications'];
        break;
      default:
        return false; // Should not happen
    }
    // Trigger validation for the specified fields and return true if all are valid
     if (fieldsToValidate.length === 0 && activeTab === 'education' && getValues('education').length === 0) return true; // Allow empty education initially? Adjust logic if needed. Similarly for others.

     const isValid = await trigger(fieldsToValidate as any); // trigger can take array of field names
     console.log(`Validation for ${activeTab}: ${isValid}`, fieldsToValidate); // Debug validation
     return isValid;
  };

  // Handle section change with validation
  const handleTabChange = async (targetTab: 'personal' | 'education' | 'experience' | 'certifications') => {
     // Allow moving backward without validation
    const currentIndex = ['personal', 'education', 'experience', 'certifications'].indexOf(activeTab);
    const targetIndex = ['personal', 'education', 'experience', 'certifications'].indexOf(targetTab);

    if (targetIndex < currentIndex) {
      setActiveTab(targetTab);
      return;
    }

     // Validate current section before moving forward
    const isValid = await validateCurrentSection();
    if (isValid) {
      setActiveTab(targetTab);
    } else {
         toast({
            title: "Validation Error",
            description: "Please fill in all required fields (*) in the current section before proceeding.",
            variant: "destructive",
        });
    }
  };

  // Function to handle the "Next" or "Save" button click
  const handleNextOrSave = async () => {
    const isValid = await validateCurrentSection();
    if (isValid) {
      if (activeTab === 'certifications') {
        // If on the last tab and valid, trigger the form submission
        handleSubmit(onSubmit)();
      } else {
        // If not on the last tab and valid, move to the next tab
        const currentTabIndex = ['personal', 'education', 'experience', 'certifications'].indexOf(activeTab);
        const nextTab = ['personal', 'education', 'experience', 'certifications'][currentTabIndex + 1];
        if (nextTab) {
          setActiveTab(nextTab as any);
        }
      }
    } else {
         toast({
            title: "Validation Error",
            description: "Please fill in all required (*) fields before proceeding.",
            variant: "destructive",
        });
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name*</Label>
              <Input id="fullName" {...register("fullName", { required: "Full Name is required" })} placeholder="Dr. John Smith" className={`mt-1 ${formState.errors.fullName ? 'border-red-500' : ''}`} />
              {formState.errors.fullName && <p className="text-red-500 text-xs mt-1">{formState.errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth*</Label>
              <Input id="dob" type="date" {...register("dob", { required: "Date of Birth is required" })} className={`mt-1 ${formState.errors.dob ? 'border-red-500' : ''}`} />
               {formState.errors.dob && <p className="text-red-500 text-xs mt-1">{formState.errors.dob.message}</p>}
            </div>
            <div>
              <Label>Gender*</Label>
              <Select
                value={genderField.value}
                onValueChange={(val) => setValue('gender', val, { shouldValidate: true })} // Trigger validation on change
                >
                <SelectTrigger className={`mt-1 ${formState.errors.gender ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
                {formState.errors.gender && <p className="text-red-500 text-xs mt-1">{formState.errors.gender.message}</p>}
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number*</Label>
              <Input type='tel' id="contactNumber" {...register("contactNumber", { required: "Contact Number is required" })} placeholder="Contact" className={`mt-1 ${formState.errors.contactNumber ? 'border-red-500' : ''}`} />
               {formState.errors.contactNumber && <p className="text-red-500 text-xs mt-1">{formState.errors.contactNumber.message}</p>}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address*</Label>
              <Input id="address" {...register("address", { required: "Address is required" })} placeholder="Address" className={`mt-1 ${formState.errors.address ? 'border-red-500' : ''}`} />
               {formState.errors.address && <p className="text-red-500 text-xs mt-1">{formState.errors.address.message}</p>}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            {eduFields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
                 {/* Add remove button */}
                  {eduFields.length > 1 && (
                     <Button
                         type="button"
                         variant="destructive"
                         size="sm"
                         onClick={() => removeEdu(index)}
                         className="absolute top-2 right-2 px-2 py-1"
                     > X </Button>
                  )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label>Degree*</Label>
                      <Input {...register(`education.${index}.degree`, { required: "Degree is required" })} placeholder="Degree" className={`mt-1 ${formState.errors.education?.[index]?.degree ? 'border-red-500' : ''}`} />
                       {formState.errors.education?.[index]?.degree && <p className="text-red-500 text-xs mt-1">{formState.errors.education?.[index]?.degree?.message}</p>}
                    </div>
                    <div>
                      <Label>Institution*</Label>
                      <Input {...register(`education.${index}.institution`, { required: "Institution is required" })} placeholder="Institution" className={`mt-1 ${formState.errors.education?.[index]?.institution ? 'border-red-500' : ''}`} />
                       {formState.errors.education?.[index]?.institution && <p className="text-red-500 text-xs mt-1">{formState.errors.education?.[index]?.institution?.message}</p>}
                    </div>
                    <div>
                      <Label>Grad Year*</Label>
                      <Input type='number' min="1900" max={new Date().getFullYear()} {...register(`education.${index}.gradYear`, { required: "Grad Year is required", valueAsNumber: true })} placeholder={`Year (1900-${new Date().getFullYear()})`} className={`mt-1 ${formState.errors.education?.[index]?.gradYear ? 'border-red-500' : ''}`} />
                       {formState.errors.education?.[index]?.gradYear && <p className="text-red-500 text-xs mt-1">{formState.errors.education?.[index]?.gradYear?.message}</p>}
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

              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendEdu({ degree: '', institution: '', gradYear: '', country: '', specialization: '' })}>
              + Add Another Education
            </Button>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            {expFields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
                 {expFields.length > 1 && (
                     <Button
                         type="button"
                         variant="destructive"
                         size="sm"
                         onClick={() => removeExp(index)}
                         className="absolute top-2 right-2 px-2 py-1"
                     > X </Button>
                  )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Institution*</Label>
                      <Input {...register(`experiences.${index}.institution`, { required: "Institution is required" })} placeholder="Institution" className={`mt-1 ${formState.errors.experiences?.[index]?.institution ? 'border-red-500' : ''}`} />
                       {formState.errors.experiences?.[index]?.institution && <p className="text-red-500 text-xs mt-1">{formState.errors.experiences?.[index]?.institution?.message}</p>}
                    </div>
                    <div>
                      <Label>Position*</Label>
                      <Input {...register(`experiences.${index}.position`, { required: "Position is required" })} placeholder="Position" className={`mt-1 ${formState.errors.experiences?.[index]?.position ? 'border-red-500' : ''}`} />
                        {formState.errors.experiences?.[index]?.position && <p className="text-red-500 text-xs mt-1">{formState.errors.experiences?.[index]?.position?.message}</p>}
                    </div>
                    <div>
                      <Label>Start Date*</Label>
                      <Input type="date" {...register(`experiences.${index}.startDate`, { required: "Start Date is required" })} className={`mt-1 ${formState.errors.experiences?.[index]?.startDate ? 'border-red-500' : ''}`} />
                      {formState.errors.experiences?.[index]?.startDate && <p className="text-red-500 text-xs mt-1">{formState.errors.experiences?.[index]?.startDate?.message}</p>}
                    </div>
                    <div>
                      <Label>End Date*</Label>
                      <Input type="date" {...register(`experiences.${index}.endDate`, { required: "End Date is required" })} className={`mt-1 ${formState.errors.experiences?.[index]?.endDate ? 'border-red-500' : ''}`} />
                       {formState.errors.experiences?.[index]?.endDate && <p className="text-red-500 text-xs mt-1">{formState.errors.experiences?.[index]?.endDate?.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea {...register(`experiences.${index}.description`)} className="mt-1" placeholder="Description" />
                    </div>
                 </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => appendExp({ institution: '', position: '', startDate: '', endDate: '', description: '' })}>
              + Add Another Experience
            </Button>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6">
            {certFields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-4 relative">
                 {certFields.length > 1 && (
                     <Button
                         type="button"
                         variant="destructive"
                         size="sm"
                         onClick={() => removeCert(index)}
                         className="absolute top-2 right-2 px-2 py-1"
                     > X </Button>
                  )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Certificate Name*</Label>
                    <Input {...register(`certifications.${index}.certificate`, { required: "Certificate Name is required" })} placeholder="Certificate Name" className={`mt-1 ${formState.errors.certifications?.[index]?.certificate ? 'border-red-500' : ''}`} />
                     {formState.errors.certifications?.[index]?.certificate && <p className="text-red-500 text-xs mt-1">{formState.errors.certifications?.[index]?.certificate?.message}</p>}
                  </div>
                  <div>
                    <Label>Issuing Organization*</Label>
                    <Input {...register(`certifications.${index}.authority`, { required: "Issuing Organization is required" })} placeholder="Issuing Organization" className={`mt-1 ${formState.errors.certifications?.[index]?.authority ? 'border-red-500' : ''}`} />
                     {formState.errors.certifications?.[index]?.authority && <p className="text-red-500 text-xs mt-1">{formState.errors.certifications?.[index]?.authority?.message}</p>}
                  </div>
                  <div>
                    <Label>Issue Year*</Label>
                    <Input type='number' min="1900" max={new Date().getFullYear()} {...register(`certifications.${index}.certYear`, { required: "Issue Year is required", valueAsNumber: true })} placeholder={`Year (1900-${new Date().getFullYear()})`} className={`mt-1 ${formState.errors.certifications?.[index]?.certYear ? 'border-red-500' : ''}`} />
                     {formState.errors.certifications?.[index]?.certYear && <p className="text-red-500 text-xs mt-1">{formState.errors.certifications?.[index]?.certYear?.message}</p>}
                  </div>
                 </div>
              </div>
            ))}
             <Button type="button" variant="outline" onClick={() => appendCert({ certificate: '', authority: '', certYear: '' })}>
               + Add Another Certification
             </Button>
          </div>
        );
    }
  };

  return (
    // Add some padding top if needed, adjust styling as required
    <div className="min-h-screen flex flex-col items-center justify-start p-6 pt-12 bg-gray-50">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-blue-700 mb-4">Doctor Verification Form</h1>
        <p className="text-sm text-gray-600 mb-6">Please complete all sections to verify your medical credentials</p>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {(['personal', 'education', 'experience', 'certifications'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)} // Use handleTabChange for validation on forward moves
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={activeTab === tab ? 'page' : undefined}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* No need for <form> tag here if using handleSubmit programmatically */}
        <div className="space-y-6"> {/* Replaced form tag */}
          {renderTabContent()}

          <div className="flex justify-between pt-6 border-t mt-6">
             {/* Previous Button */}
             <Button
                type="button"
                variant="outline"
                onClick={() => {
                    const currentIndex = ['personal', 'education', 'experience', 'certifications'].indexOf(activeTab);
                    if (currentIndex > 0) {
                        const prevTab = ['personal', 'education', 'experience', 'certifications'][currentIndex - 1];
                        setActiveTab(prevTab as any);
                    }
                }}
                // Disable Previous button if on the first tab
                disabled={activeTab === 'personal'}
             >
               Previous
             </Button>

             {/* Next / Save Button */}
              <Button
                  type="button" // Important: type="button" to prevent default form submission
                  onClick={handleNextOrSave} // Use the combined handler
                  disabled={isSubmitting} // Disable button while submitting
                  className="ml-auto" // Push to the right
              >
                 {isSubmitting ? (
                    // Basic loading indicator
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 ) : (
                    activeTab === 'certifications' ? 'Save Information' : 'Next'
                 )}
                 {isSubmitting ? 'Saving...' : (activeTab === 'certifications' ? 'Save Information' : 'Next')}
              </Button>
          </div>
        </div> {/* End of replaced form div */}
      </div>
    </div>
  );
};

export default DrVerificationForm;