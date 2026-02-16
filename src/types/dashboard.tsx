// ไฟล์: types/dashboard.ts

// กำหนดหน้าตาของข้อมูล Response ในตาราง
export interface ResponseData {
  time: string;
  branch: string;
  sentiment: 'Smile' | 'Neutral' | 'Sad'; // บังคับว่าต้องเป็น 3 ค่านี้เท่านั้น
  comment?: string; // เครื่องหมาย ? หมายถึงจะมีหรือไม่มีก็ได้ (Optional)
}

// กำหนดหน้าตาของข้อมูลสำหรับทำกราฟ Brand Satisfaction
export interface BrandSatisfaction {
  name: string;
  sad: number;
  neutral: number;
  smile: number;
}