// types/template.ts

export interface TemplateRequest {
  name: string;
  subject: string;
  content: string;
}

export interface TemplateResponse {
  id: number;
  name: string;
  subject: string;
  content: string;
  createdAt: string; // ឬប្ដូរតាម field ជាក់ស្ដែងក្នុង Java Response របស់អ្នក
}