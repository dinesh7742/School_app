import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function HomeworkPage() {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState("today");
  const { toast } = useToast();

  const { data: homeworks, isLoading } = useQuery({
    queryKey: ["/api/homeworks"],
  });

  const updateHomeworkStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/homeworks/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homeworks"] });
      toast({
        title: "Status updated",
        description: "Homework status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter homeworks based on selected date range
  const filteredHomeworks = homeworks?.filter(homework => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - today.getDay());
    
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const lastWeekEnd = new Date(weekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    
    const homeworkDate = new Date(homework.dueDate);
    homeworkDate.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case "today":
        return homeworkDate.getTime() === today.getTime();
      case "yesterday":
        return homeworkDate.getTime() === yesterday.getTime();
      case "thisWeek":
        return homeworkDate >= weekStart && homeworkDate <= today;
      case "lastWeek":
        return homeworkDate >= lastWeekStart && homeworkDate <= lastWeekEnd;
      default:
        return true;
    }
  });

  const handleStatusChange = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    updateHomeworkStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center">
        <button className="mr-2" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Homework</h1>
      </header>
      
      {/* Content */}
      <div className="p-4">
        {/* Date Filter */}
        <div className="flex items-center overflow-x-auto pb-2 mb-4 space-x-2">
          <Button 
            variant={filter === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("today")}
          >
            Today
          </Button>
          <Button 
            variant={filter === "yesterday" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("yesterday")}
          >
            Yesterday
          </Button>
          <Button 
            variant={filter === "thisWeek" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("thisWeek")}
          >
            This Week
          </Button>
          <Button 
            variant={filter === "lastWeek" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("lastWeek")}
          >
            Last Week
          </Button>
        </div>
        
        {/* Homework List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredHomeworks && filteredHomeworks.length > 0 ? (
            filteredHomeworks.map((homework) => (
              <div key={homework.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="text-sm font-medium text-gray-800">{homework.subject}</h3>
                      <span 
                        className={`ml-2 text-xs ${
                          homework.status === "completed" 
                            ? "bg-green-100 text-green-600" 
                            : new Date(homework.dueDate) < new Date() 
                              ? "bg-red-100 text-red-600" 
                              : "bg-orange-100 text-orange-600"
                        } px-2 py-0.5 rounded`}
                      >
                        {homework.status === "completed" 
                          ? "Completed" 
                          : new Date(homework.dueDate) < new Date() 
                            ? "Overdue"
                            : "Due Soon"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{homework.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        Assigned: {new Date(homework.assignedDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Switch 
                      checked={homework.status === "completed"}
                      onCheckedChange={() => handleStatusChange(homework.id, homework.status)}
                      disabled={updateHomeworkStatusMutation.isPending}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No homework found for this period</p>
            </div>
          )}
        </div>
      </div>
      
      <NavBar />
    </div>
  );
}
