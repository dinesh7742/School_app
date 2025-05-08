import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  classGrade: text("class_grade").notNull(),
  rollNumber: text("roll_number").notNull(),
  schoolCode: text("school_code").notNull(),
  profileImage: text("profile_image"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  classGrade: true,
  rollNumber: true,
  schoolCode: true,
  profileImage: true,
});

// Homework schema
export const homeworks = pgTable("homeworks", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date").notNull(),
  assignedDate: timestamp("assigned_date").notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertHomeworkSchema = createInsertSchema(homeworks).pick({
  subject: true,
  description: true,
  dueDate: true,
  assignedDate: true,
  status: true,
});

// Textbook schema
export const textbooks = pgTable("textbooks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  filePath: text("file_path").notNull(),
  classGrade: text("class_grade").notNull(),
  term: text("term"),
});

export const insertTextbookSchema = createInsertSchema(textbooks).pick({
  title: true,
  subject: true,
  description: true,
  imageUrl: true,
  filePath: true,
  classGrade: true,
  term: true,
});

// Live class schema
export const liveClasses = pgTable("live_classes", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  teacher: text("teacher").notNull(),
  date: timestamp("date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  meetingLink: text("meeting_link").notNull(),
  status: text("status").notNull().default("upcoming"),
});

export const insertLiveClassSchema = createInsertSchema(liveClasses).pick({
  subject: true,
  teacher: true,
  date: true,
  startTime: true,
  endTime: true,
  meetingLink: true,
  status: true,
});

// Notice schema
export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url"),
  isNew: boolean("is_new").default(true),
});

export const insertNoticeSchema = createInsertSchema(notices).pick({
  title: true,
  content: true,
  date: true,
  imageUrl: true,
  isNew: true,
});

// Circular schema
export const circulars = pgTable("circulars", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  category: text("category").notNull().default("general"),
  filePath: text("file_path").notNull(),
  isNew: boolean("is_new").default(true),
});

export const insertCircularSchema = createInsertSchema(circulars).pick({
  title: true,
  description: true,
  date: true,
  category: true,
  filePath: true,
  isNew: true,
});

// Complaint schema
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("pending"),
  isAnonymous: boolean("is_anonymous").default(false),
});

export const insertComplaintSchema = createInsertSchema(complaints).pick({
  userId: true,
  subject: true,
  message: true,
  date: true,
  status: true,
  isAnonymous: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Homework = typeof homeworks.$inferSelect;
export type InsertHomework = z.infer<typeof insertHomeworkSchema>;

export type Textbook = typeof textbooks.$inferSelect;
export type InsertTextbook = z.infer<typeof insertTextbookSchema>;

export type LiveClass = typeof liveClasses.$inferSelect;
export type InsertLiveClass = z.infer<typeof insertLiveClassSchema>;

export type Notice = typeof notices.$inferSelect;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;

export type Circular = typeof circulars.$inferSelect;
export type InsertCircular = z.infer<typeof insertCircularSchema>;

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
