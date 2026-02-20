import { mysqlTable, int, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const brand = mysqlTable('Brand', {
  brandId: int('brand_id').primaryKey().autoincrement(), 
  brandName: varchar('brand_name', { length: 255 }).notNull(),
  brandShortName: varchar('brand_short_name', { length: 10 }),
  brandImage: varchar('brand_image', { length: 255 }),
});

export const branch = mysqlTable('Branch', {
  branchId: int('branch_id').primaryKey(),
  brandId: int('brand_id'),
  branchName: varchar('branch_name', { length: 255 }).notNull(),
  branchShortName: varchar('branch_short_name', { length: 10 }),
  branchAddress: text('branch_address'),
  email: varchar('email', { length: 255 }),
  contact: varchar('contact', { length: 10 }),
});

export const account = mysqlTable('account', {
  userId: int('user_id').primaryKey(),
  userName: varchar('user_name', { length: 50 }).notNull().unique(),
  userPassword: varchar('user_password', { length: 255 }).notNull(),
  userRole: int('user_role').default(1), // 0=Block, 1=User, 2=Admin
  branchId: int('branch_id'),
});

export const satisfaction = mysqlTable('Satisfaction', {
  satisfactionId: int('satisfaction_id').primaryKey().autoincrement(), 
  satisfactionName: varchar('satisfaction_name', { length: 25 }),
  userId: int('user_id'),
  createdAt: timestamp('created_at').defaultNow(),
});