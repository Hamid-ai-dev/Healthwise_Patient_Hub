
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { patients } from "@/data/mockData";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePlus, FileText, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const reportSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  type: z.string({
    required_error: "Please select a report type",
  }),
  date: z.string().min(1, "Date is required"),
  results: z.string().min(10, "Results should be at least 10 characters"),
  recommendations: z.string().optional(),
  notes: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const reportTypes = [
  "General Checkup",
  "Blood Test",
  "Urine Analysis",
  "X-ray",
  "MRI Scan",
  "CT Scan",
  "Ultrasound",
  "EKG/ECG",
  "Colonoscopy",
  "Endoscopy",
  "Biopsy",
  "Allergy Test",
];

const CreateReport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<ReportFormValues> = {
    patientId: patientId || "",
    type: "",
    date: new Date().toISOString().split("T")[0],
    results: "",
    recommendations: "",
    notes: "",
  };

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues,
  });

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report created",
        description: "The medical report has been successfully created",
      });
      setIsSubmitting(false);
      navigate(`/medical-records?patientId=${data.patientId}`);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Create Medical Report</h1>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              New Medical Report
            </CardTitle>
            <CardDescription>
              Create a detailed medical report for a patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!!patientId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the patient for this report.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reportTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type of medical report
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        The date when the examination was conducted
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="results"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Results</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the test results or findings"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide detailed information about the test results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recommendations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recommendations</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter recommendations for the patient"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Suggest follow-up actions, medications, or lifestyle changes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional notes or comments"
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any other relevant information
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="px-0 pt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FilePlus className="h-4 w-4" />
                        Create Report
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateReport;
