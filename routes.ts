import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertComplaintSchema, insertHomeworkSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // ===== Homework Routes =====
  app.get("/api/homeworks", async (req, res) => {
    try {
      const homeworks = await storage.getHomeworks();
      res.json(homeworks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch homeworks" });
    }
  });

  app.get("/api/homeworks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const homework = await storage.getHomeworkById(id);
      
      if (!homework) {
        return res.status(404).json({ message: "Homework not found" });
      }
      
      res.json(homework);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch homework" });
    }
  });

  app.patch("/api/homeworks/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedHomework = await storage.updateHomeworkStatus(id, status);
      
      if (!updatedHomework) {
        return res.status(404).json({ message: "Homework not found" });
      }
      
      res.json(updatedHomework);
    } catch (error) {
      res.status(500).json({ message: "Failed to update homework status" });
    }
  });

  // ===== Textbook Routes =====
  app.get("/api/textbooks", async (req, res) => {
    try {
      const classGrade = req.query.classGrade as string | undefined;
      const subject = req.query.subject as string | undefined;
      
      const textbooks = await storage.getTextbooks(classGrade, subject);
      res.json(textbooks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch textbooks" });
    }
  });

  app.get("/api/textbooks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const textbook = await storage.getTextbookById(id);
      
      if (!textbook) {
        return res.status(404).json({ message: "Textbook not found" });
      }
      
      res.json(textbook);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch textbook" });
    }
  });

  // ===== Live Class Routes =====
  app.get("/api/live-classes", async (req, res) => {
    try {
      const liveClasses = await storage.getLiveClasses();
      res.json(liveClasses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live classes" });
    }
  });

  app.get("/api/live-classes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const liveClass = await storage.getLiveClassById(id);
      
      if (!liveClass) {
        return res.status(404).json({ message: "Live class not found" });
      }
      
      res.json(liveClass);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live class" });
    }
  });

  // ===== Notice Routes =====
  app.get("/api/notices", async (req, res) => {
    try {
      const notices = await storage.getNotices();
      res.json(notices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notices" });
    }
  });

  app.get("/api/notices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notice = await storage.getNoticeById(id);
      
      if (!notice) {
        return res.status(404).json({ message: "Notice not found" });
      }
      
      res.json(notice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notice" });
    }
  });

  // ===== Circular Routes =====
  app.get("/api/circulars", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const circulars = await storage.getCirculars(category);
      res.json(circulars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch circulars" });
    }
  });

  app.get("/api/circulars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const circular = await storage.getCircularById(id);
      
      if (!circular) {
        return res.status(404).json({ message: "Circular not found" });
      }
      
      res.json(circular);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch circular" });
    }
  });

  // ===== Complaint Routes =====
  app.get("/api/complaints", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user?.id;
      const complaints = await storage.getComplaints(userId);
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  app.post("/api/complaints", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = req.user?.id;
      const complaintData = {
        ...req.body,
        userId: req.body.isAnonymous ? undefined : userId,
        date: new Date()
      };
      
      // Validate request body
      const validatedData = insertComplaintSchema.parse(complaintData);
      
      const complaint = await storage.createComplaint(validatedData);
      res.status(201).json(complaint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid complaint data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create complaint" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
