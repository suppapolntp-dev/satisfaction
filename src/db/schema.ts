// src/db/schema.ts
import { mysqlTable, int, tinyint, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const brand = mysqlTable('Brand', {
  brandId:        int('brand_id').primaryKey(),
  brandName:      varchar('brand_name',       { length: 255 }).notNull(),
  brandShortName: varchar('brand_short_name', { length: 10  }),
  brandImage:     varchar('brand_image',      { length: 255 }),
});

export const branch = mysqlTable('Branch', {
  branchId:        int('branch_id').primaryKey(),
  brandId:         int('brand_id'),
  branchName:      varchar('branch_name',       { length: 255 }).notNull(),
  branchShortName: varchar('branch_short_name', { length: 10  }),
  branchAddress:   text('branch_address'),
  email:           varchar('email',   { length: 255 }),
  contact:         varchar('contact', { length: 10  }),
});

export const role = mysqlTable('Role', {
  roleId:              int('role_id').primaryKey().autoincrement(),
  roleName:            varchar('role_name', { length: 100 }).notNull(),
  isActive:            tinyint('is_active').default(1),
  canViewAll:          tinyint('can_view_all').default(0),
  canViewDashboard:    tinyint('can_view_dashboard').default(0),
  canViewSatisfaction: tinyint('can_view_satisfaction').default(0),
  canManageBrand:      tinyint('can_manage_brand').default(0),
  canManageBranch:     tinyint('can_manage_branch').default(0),
  canManageArea:       tinyint('can_manage_area').default(0),
  canManageUser:       tinyint('can_manage_user').default(0),
  canManageRole:       tinyint('can_manage_role').default(0),
});

export const area = mysqlTable('Area', {
  areaId:      int('area_id').primaryKey().autoincrement(),
  areaName:    varchar('area_name',   { length: 100 }).notNull(),
  description: varchar('description', { length: 255 }),
  canFilter:   tinyint('can_filter').default(0),   // ← ใหม่
});

export const areaBranch = mysqlTable('AreaBranch', {
  id:       int('id').primaryKey().autoincrement(),
  areaId:   int('area_id').notNull(),
  branchId: int('branch_id').notNull(),
});

export const account = mysqlTable('Account', {
  userId:       int('user_id').primaryKey().autoincrement(),
  userName:     varchar('user_name',     { length: 50  }).notNull().unique(),
  userPassword: varchar('user_password', { length: 255 }).notNull(),
  roleId:       int('role_id'),
  areaId:       int('area_id'),
});

export const userBranch = mysqlTable('UserBranch', {
  id:       int('id').primaryKey().autoincrement(),
  userId:   int('user_id').notNull(),
  branchId: int('branch_id').notNull(),
});

export const userBrand = mysqlTable('UserBrand', {
  id:      int('id').primaryKey().autoincrement(),
  userId:  int('user_id').notNull(),
  brandId: int('brand_id').notNull(),
});

export const satisfaction = mysqlTable('Satisfaction', {
  satisfactionId:   int('satisfaction_id').primaryKey().autoincrement(),
  satisfactionName: varchar('satisfaction_name', { length: 25 }),
  userId:           int('user_id'),
  branchId:         int('branch_id'),
  createdAt:        timestamp('created_at').defaultNow(),
});