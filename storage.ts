import { 
  users, User, InsertUser, 
  homeworks, Homework, InsertHomework,
  textbooks, Textbook, InsertTextbook,
  liveClasses, LiveClass, InsertLiveClass,
  notices, Notice, InsertNotice,
  circulars, Circular, InsertCircular,
  complaints, Complaint, InsertComplaint
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Homeworks
  getHomeworks(userId?: number): Promise<Homework[]>;
  getHomeworkById(id: number): Promise<Homework | undefined>;
  createHomework(homework: InsertHomework): Promise<Homework>;
  updateHomeworkStatus(id: number, status: string): Promise<Homework | undefined>;
  
  // Textbooks
  getTextbooks(classGrade?: string, subject?: string): Promise<Textbook[]>;
  getTextbookById(id: number): Promise<Textbook | undefined>;
  createTextbook(textbook: InsertTextbook): Promise<Textbook>;
  
  // Live Classes
  getLiveClasses(): Promise<LiveClass[]>;
  getLiveClassById(id: number): Promise<LiveClass | undefined>;
  createLiveClass(liveClass: InsertLiveClass): Promise<LiveClass>;
  
  // Notices
  getNotices(): Promise<Notice[]>;
  getNoticeById(id: number): Promise<Notice | undefined>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  
  // Circulars
  getCirculars(category?: string): Promise<Circular[]>;
  getCircularById(id: number): Promise<Circular | undefined>;
  createCircular(circular: InsertCircular): Promise<Circular>;
  
  // Complaints
  getComplaints(userId?: number): Promise<Complaint[]>;
  getComplaintById(id: number): Promise<Complaint | undefined>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private userMap: Map<number, User>;
  private homeworkMap: Map<number, Homework>;
  private textbookMap: Map<number, Textbook>;
  private liveClassMap: Map<number, LiveClass>;
  private noticeMap: Map<number, Notice>;
  private circularMap: Map<number, Circular>;
  private complaintMap: Map<number, Complaint>;
  
  sessionStore: session.SessionStore;
  private userId: number = 1;
  private homeworkId: number = 1;
  private textbookId: number = 1;
  private liveClassId: number = 1;
  private noticeId: number = 1;
  private circularId: number = 1;
  private complaintId: number = 1;

  constructor() {
    this.userMap = new Map();
    this.homeworkMap = new Map();
    this.textbookMap = new Map();
    this.liveClassMap = new Map();
    this.noticeMap = new Map();
    this.circularMap = new Map();
    this.complaintMap = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.userMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userMap.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.userMap.set(id, user);
    return user;
  }

  // Homework methods
  async getHomeworks(userId?: number): Promise<Homework[]> {
    return Array.from(this.homeworkMap.values());
  }

  async getHomeworkById(id: number): Promise<Homework | undefined> {
    return this.homeworkMap.get(id);
  }

  async createHomework(insertHomework: InsertHomework): Promise<Homework> {
    const id = this.homeworkId++;
    const homework: Homework = { ...insertHomework, id };
    this.homeworkMap.set(id, homework);
    return homework;
  }

  async updateHomeworkStatus(id: number, status: string): Promise<Homework | undefined> {
    const homework = this.homeworkMap.get(id);
    if (!homework) return undefined;
    
    const updatedHomework: Homework = { ...homework, status };
    this.homeworkMap.set(id, updatedHomework);
    return updatedHomework;
  }

  // Textbook methods
  async getTextbooks(classGrade?: string, subject?: string): Promise<Textbook[]> {
    let textbooks = Array.from(this.textbookMap.values());
    
    if (classGrade) {
      textbooks = textbooks.filter(textbook => textbook.classGrade === classGrade);
    }
    
    if (subject) {
      textbooks = textbooks.filter(textbook => textbook.subject === subject);
    }
    
    return textbooks;
  }

  async getTextbookById(id: number): Promise<Textbook | undefined> {
    return this.textbookMap.get(id);
  }

  async createTextbook(insertTextbook: InsertTextbook): Promise<Textbook> {
    const id = this.textbookId++;
    const textbook: Textbook = { ...insertTextbook, id };
    this.textbookMap.set(id, textbook);
    return textbook;
  }

  // Live Class methods
  async getLiveClasses(): Promise<LiveClass[]> {
    return Array.from(this.liveClassMap.values());
  }

  async getLiveClassById(id: number): Promise<LiveClass | undefined> {
    return this.liveClassMap.get(id);
  }

  async createLiveClass(insertLiveClass: InsertLiveClass): Promise<LiveClass> {
    const id = this.liveClassId++;
    const liveClass: LiveClass = { ...insertLiveClass, id };
    this.liveClassMap.set(id, liveClass);
    return liveClass;
  }

  // Notice methods
  async getNotices(): Promise<Notice[]> {
    return Array.from(this.noticeMap.values());
  }

  async getNoticeById(id: number): Promise<Notice | undefined> {
    return this.noticeMap.get(id);
  }

  async createNotice(insertNotice: InsertNotice): Promise<Notice> {
    const id = this.noticeId++;
    const notice: Notice = { ...insertNotice, id };
    this.noticeMap.set(id, notice);
    return notice;
  }

  // Circular methods
  async getCirculars(category?: string): Promise<Circular[]> {
    let circulars = Array.from(this.circularMap.values());
    
    if (category && category !== 'all') {
      circulars = circulars.filter(circular => circular.category === category);
    }
    
    return circulars;
  }

  async getCircularById(id: number): Promise<Circular | undefined> {
    return this.circularMap.get(id);
  }

  async createCircular(insertCircular: InsertCircular): Promise<Circular> {
    const id = this.circularId++;
    const circular: Circular = { ...insertCircular, id };
    this.circularMap.set(id, circular);
    return circular;
  }

  // Complaint methods
  async getComplaints(userId?: number): Promise<Complaint[]> {
    let complaints = Array.from(this.complaintMap.values());
    
    if (userId) {
      complaints = complaints.filter(complaint => 
        complaint.userId === userId || complaint.isAnonymous === false
      );
    }
    
    return complaints;
  }

  async getComplaintById(id: number): Promise<Complaint | undefined> {
    return this.complaintMap.get(id);
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = this.complaintId++;
    const complaint: Complaint = { ...insertComplaint, id };
    this.complaintMap.set(id, complaint);
    return complaint;
  }

  // Initialize demo data
  private initializeDemoData() {
    // Sample textbooks
    this.createTextbook({
      title: "NCERT Mathematics",
      subject: "Mathematics",
      description: "Class 10 Mathematics textbook for Term 1",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3",
      filePath: "/textbooks/math-10-term1.pdf",
      classGrade: "10",
      term: "Term 1"
    });

    this.createTextbook({
      title: "NCERT Mathematics",
      subject: "Mathematics",
      description: "Class 10 Mathematics textbook for Term 2",
      imageUrl: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-4.0.3",
      filePath: "/textbooks/math-10-term2.pdf",
      classGrade: "10",
      term: "Term 2"
    });

    this.createTextbook({
      title: "NCERT Science",
      subject: "Science",
      description: "Class 10 Physics textbook",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3",
      filePath: "/textbooks/science-10-physics.pdf",
      classGrade: "10",
      term: "Physics"
    });

    this.createTextbook({
      title: "NCERT Science",
      subject: "Science",
      description: "Class 10 Chemistry textbook",
      imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3",
      filePath: "/textbooks/science-10-chemistry.pdf",
      classGrade: "10",
      term: "Chemistry"
    });

    // Sample homeworks
    this.createHomework({
      subject: "Mathematics",
      description: "Complete exercises 5.1 to 5.3 from textbook",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      assignedDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      status: "pending"
    });

    this.createHomework({
      subject: "Science",
      description: "Prepare a chart on types of chemical reactions",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      assignedDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      status: "pending"
    });

    this.createHomework({
      subject: "English",
      description: "Write an essay on \"My Favorite Book\"",
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      assignedDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      status: "completed"
    });

    // Sample live classes
    const today = new Date();
    
    this.createLiveClass({
      subject: "Mathematics",
      teacher: "Ms. Sharma",
      date: today,
      startTime: new Date(today.setHours(11, 30, 0)),
      endTime: new Date(today.setHours(12, 30, 0)),
      meetingLink: "https://zoom.us/j/1234567890",
      status: "live"
    });

    this.createLiveClass({
      subject: "Science",
      teacher: "Mr. Patel",
      date: today,
      startTime: new Date(today.setHours(13, 30, 0)),
      endTime: new Date(today.setHours(14, 30, 0)),
      meetingLink: "https://zoom.us/j/0987654321",
      status: "upcoming"
    });

    this.createLiveClass({
      subject: "English",
      teacher: "Ms. Roy",
      date: today,
      startTime: new Date(today.setHours(16, 0, 0)),
      endTime: new Date(today.setHours(17, 0, 0)),
      meetingLink: "https://zoom.us/j/5678901234",
      status: "upcoming"
    });

    // Sample notices
    this.createNotice({
      title: "Annual Sports Day",
      content: "Annual sports day will be held on 15th March. All students must register by 10th March for various events. Parents are cordially invited to attend the event.",
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3",
      isNew: true
    });

    this.createNotice({
      title: "Science Exhibition",
      content: "Inter-school science exhibition will be held on 20th February. Interested students should register with their science teachers by 15th February.",
      date: new Date(new Date().setDate(new Date().getDate() - 6)),
      imageUrl: "",
      isNew: false
    });

    this.createNotice({
      title: "Term Examination Schedule",
      content: "Final term examinations will begin from 10th March. Detailed schedule has been shared in the circulars section. All students are requested to prepare accordingly.",
      date: new Date(new Date().setDate(new Date().getDate() - 9)),
      imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3",
      isNew: false
    });

    // Sample circulars
    this.createCircular({
      title: "Annual Examination Schedule",
      description: "Final examination schedule for all classes",
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      category: "exams",
      filePath: "/circulars/exam-schedule.pdf",
      isNew: true
    });

    this.createCircular({
      title: "Annual Sports Day Notice",
      description: "Details about annual sports day event and registration",
      date: new Date(new Date().setDate(new Date().getDate() - 9)),
      category: "events",
      filePath: "/circulars/sports-day.pdf",
      isNew: false
    });

    this.createCircular({
      title: "Holiday Notice - Republic Day",
      description: "School will remain closed on 26th January",
      date: new Date(new Date().setDate(new Date().getDate() - 15)),
      category: "holidays",
      filePath: "/circulars/republic-day.pdf",
      isNew: false
    });

    // Sample complaints
    this.createComplaint({
      userId: 1,
      subject: "Classroom Cleanliness",
      message: "The classrooms need better cleaning services. Dust accumulates on desks daily.",
      date: new Date(new Date().setDate(new Date().getDate() - 4)),
      status: "pending",
      isAnonymous: false
    });

    this.createComplaint({
      userId: 1,
      subject: "Library Access Hours",
      message: "Request to extend library hours after school for students who stay for extracurricular activities.",
      date: new Date(new Date().setDate(new Date().getDate() - 20)),
      status: "addressed",
      isAnonymous: false
    });
  }
}

export const storage = new MemStorage();
