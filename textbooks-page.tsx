import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { NavBar } from "@/components/nav-bar";
import { PDFViewer } from "@/components/pdf-viewer";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TextbooksPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTextbook, setSelectedTextbook] = useState<{id: number, title: string, filePath: string} | null>(null);

  const { data: textbooks, isLoading } = useQuery({
    queryKey: ["/api/textbooks"],
  });

  // Filter textbooks based on search query
  const filteredTextbooks = textbooks?.filter(textbook => 
    textbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    textbook.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group textbooks by subject
  const groupedTextbooks = filteredTextbooks?.reduce((groups, textbook) => {
    const subject = textbook.subject;
    if (!groups[subject]) {
      groups[subject] = [];
    }
    groups[subject].push(textbook);
    return groups;
  }, {} as Record<string, typeof textbooks>);

  const handleTextbookClick = (textbook: {id: number, title: string, filePath: string}) => {
    setSelectedTextbook(textbook);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 shadow-sm flex items-center">
        <button className="mr-2" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Textbooks</h1>
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
            placeholder="Search textbooks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Textbooks by Subject */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : groupedTextbooks && Object.keys(groupedTextbooks).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedTextbooks).map(([subject, books]) => (
              <div key={subject}>
                <h2 className="text-md font-semibold text-gray-800 mb-3">{subject}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {books.map((book) => (
                    <div 
                      key={book.id} 
                      className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleTextbookClick(book)}
                    >
                      <div className={`h-32 ${subject === 'Mathematics' ? 'bg-blue-100' : 'bg-green-100'} relative overflow-hidden`}>
                        <img 
                          src={book.imageUrl} 
                          alt={book.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className={`absolute bottom-0 right-0 ${subject === 'Mathematics' ? 'bg-blue-500' : 'bg-green-500'} text-white text-xs px-2 py-1`}>
                          PDF
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">Class {book.classGrade} • {book.term}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No textbooks found</p>
          </div>
        )}
      </div>
      
      {selectedTextbook && (
        <PDFViewer 
          url={selectedTextbook.filePath} 
          title={selectedTextbook.title} 
          onClose={() => setSelectedTextbook(null)} 
        />
      )}
      
      <NavBar />
    </div>
  );
}
