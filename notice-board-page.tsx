import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function NoticeBoardPage() {
  const [, navigate] = useLocation();
  const [searchParams] = useSearch();
  const initialNoticeId = searchParams && searchParams.includes("id=") ? 
    parseInt(searchParams.split("id=")[1]) : null;
  
  const [selectedNotice, setSelectedNotice] = useState<number | null>(initialNoticeId);

  const { data: notices, isLoading } = useQuery({
    queryKey: ["/api/notices"],
  });

  const handleNoticeClick = (id: number) => {
    setSelectedNotice(id);
  };

  const selectedNoticeData = notices?.find(notice => notice.id === selectedNotice);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center">
        <button className="mr-2" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Notice Board</h1>
      </header>
      
      {/* Content */}
      <div className="p-4">
        {/* Notices List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notices && notices.length > 0 ? (
            notices.map((notice) => (
              <div 
                key={notice.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleNoticeClick(notice.id)}
              >
                {notice.imageUrl && (
                  <img 
                    src={notice.imageUrl} 
                    alt={notice.title} 
                    className="w-full h-40 object-cover" 
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-800">{notice.title}</h3>
                    {notice.isNew && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">New</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{notice.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Posted: {format(new Date(notice.date), "dd MMM yyyy")}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-primary-500 font-medium p-0 h-auto"
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No notices available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Notice Detail Dialog */}
      <Dialog open={selectedNotice !== null} onOpenChange={(open) => !open && setSelectedNotice(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          {selectedNoticeData && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedNoticeData.title}</DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Posted: {format(new Date(selectedNoticeData.date), "dd MMMM yyyy")}
                </DialogDescription>
              </DialogHeader>
              
              {selectedNoticeData.imageUrl && (
                <div className="mt-2 mb-4">
                  <img 
                    src={selectedNoticeData.imageUrl} 
                    alt={selectedNoticeData.title} 
                    className="w-full rounded-md" 
                  />
                </div>
              )}
              
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {selectedNoticeData.content}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <NavBar />
    </div>
  );
}
