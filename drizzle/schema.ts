import { mysqlTable, unique, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";

export const account = mysqlTable("account", {
  userId: int("user_id").primaryKey().notNull(),
  userName: varchar("user_name", { length: 50 }).notNull(),
  userPassword: varchar("user_password", { length: 255 }).notNull(),
  userRole: int("user_role").default(1),
  branchId: int("branch_id"),
},
(table) => [
  unique("user_name").on(table.userName),
]);

export const branch = mysqlTable("branch", {
  branchId: int("branch_id").primaryKey().notNull(),
  brandId: int("brand_id"),
  branchName: varchar("branch_name", { length: 255 }).notNull(),
  branchShortName: varchar("branch_short_name", { length: 10 }),
  branchAddress: text("branch_address"),
  email: varchar("email", { length: 255 }),
  contact: varchar("contact", { length: 10 }),
});

export const brand = mysqlTable("brand", {
  brandId: int("brand_id").primaryKey().notNull(),
  brandName: varchar("brand_name", { length: 255 }).notNull(),
  brandShortName: varchar("brand_short_name", { length: 10 }),
  brandImage: varchar("brand_image", { length: 255 }),
});

export const satisfaction = mysqlTable("satisfaction", {
  satisfactionId: int("satisfaction_id").primaryKey().notNull(),
  satisfactionName: varchar("satisfaction_name", { length: 25 }),
  userId: int("user_id"),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});