import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name:varchar({ length: 25 }).notNull(),
  username: varchar({ length: 25 }).notNull().unique(),
  email: varchar({ length: 128 }).notNull().unique(),
  password: varchar({ length: 100 }).notNull(),
  // role: varchar({ length: 5,enum: ["admin","user"]}).$default(()=>"user"),
  otp: varchar({ length: 6 }), // or however your OTP is formatted
  otpGeneratedTime: timestamp(),
  isActive: boolean().default(false),
});
export const eventsTable = pgTable("event", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  datetime: timestamp("datetime", { mode: "string" }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  capacity: integer("capacity").notNull(),
});

export const registrationsTable = pgTable("registration", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => usersTable.id).notNull(),
  eventId: integer('event_id').references(() => eventsTable.id).notNull(),
});