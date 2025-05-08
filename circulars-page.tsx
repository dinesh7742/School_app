import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { NavBar } from "@/components/nav-bar";
import { PDFViewer } from "@/components/pdf-viewer";
import { ArrowLeft, Search, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CircularsPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCircular, setSelectedCircular] = useState<{id: number, title: string, filePath: string} | null>(null);

  const { data: circulars, isLoading } = useQuery({
    queryKey: ["/api/circulars"],
  });

  // Filter circulars based on search query
  const filteredCirculars = circulars?.filter(circular => 
    circular.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "all" || circular.category === selectedCategory)
  );

  const handleCircularClick = (circular: {id: number, title: string, filePath: string}) => {
    setSelectedCircular(circular);
  };

  const handleDownload = (circular: {id: number, title: string, filePath: string}, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(circular.filePath, '_blank');
  };

  const categories = [
    { value: "all", label: "All" },
    { value: "exams", label: "Exams" },
    { value: "events", label: "Events" },
    { value: "holidays", label: "Holidays" },
    { value: "others", label: "Others" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center">
        <button className="mr-2" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Circulars</h1>
      </header>
      
      {/* Content */}
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="Search circulars"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="mb-4 overflow-x-auto pb-2">
            <TabsList className="inline-flex">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.value} 
                  value={category.value}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Circulars List */}
          {categories.map(category => (
            <TabsContent key={category.value} value={category.value} className="space-y-3 mt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredCirculars && filteredCirculars.length > 0 ? (
                filteredCirculars.map((circular) => (
                  <div 
                    key={circular.id} 
                    className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleCircularClick(circular)}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-gray-800">{circular.title}</h3>
                          {circular.isNew && (
                            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">New</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{circular.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {new Date(circular.date).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs flex items-center text-primary-500 font-medium p-0 h-auto"
                            onClick={(e) => handleDownload(circular, e)}
                          >
                            <Download className="w-3 h-3 mr-1" /> Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <p className="text-gray-500">No circulars found</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {selectedCircular && (
        <PDFViewer 
          url={selectedCircular.filePath} 
          title={selectedCircular.title} 
          onClose={() => setSelectedCircular(null)} 
        />
      )}
      
      <NavBar />
    </div>
  );
}
