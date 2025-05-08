import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { insertComplaintSchema, Complaint } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";

const complaintFormSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  isAnonymous: z.boolean().default(false),
});

type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

export default function ComplaintPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      subject: "",
      message: "",
      isAnonymous: false,
    },
  });

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["/api/complaints"],
  });

  const submitComplaintMutation = useMutation({
    mutationFn: async (values: ComplaintFormValues) => {
      const res = await apiRequest("POST", "/api/complaints", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      toast({
        title: "Complaint submitted",
        description: "Your complaint has been submitted successfully",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ComplaintFormValues) => {
    submitComplaintMutation.mutate(values);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center">
        <button className="mr-2" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Complaint Box</h1>
      </header>
      
      {/* Content */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Complaint or Suggestion</CardTitle>
            <CardDescription>
              Your feedback helps improve our school
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject" {...field} />
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
                          placeholder="Describe your complaint or suggestion..." 
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isAnonymous"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Submit anonymously</FormLabel>
                        <FormDescription>
                          Your identity will not be revealed to school administration.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={submitComplaintMutation.isPending}
                >
                  {submitComplaintMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <h2 className="text-md font-semibold text-gray-800 mb-3">Your Previous Submissions</h2>
          
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : complaints && complaints.length > 0 ? (
              complaints.map((complaint: Complaint) => (
                <div key={complaint.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-800">{complaint.subject}</h3>
                    <span className={`text-xs ${
                      complaint.status === "addressed" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-yellow-100 text-yellow-600"
                    } px-2 py-0.5 rounded`}>
                      {complaint.status === "addressed" ? "Addressed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{complaint.message}</p>
                  <div className="text-xs text-gray-500">
                    <span>
                      Submitted: {new Date(complaint.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-gray-500">No previous submissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <NavBar />
    </div>
  );
}
