export interface TenantResponse {
  id: number;
  name: string;
  email: string;
  tags: string[];
  status: boolean;
  folderId: number;   // សម្រាប់ដឹងថា Tenant នេះនៅក្នុង Folder មួយណា
  folderName: string; // សម្រាប់បង្ហាញលើ UI ថាវាជារបស់ Folder ណា
  additionalInfo?: AdditionalField[];
  lastModifiedAt:Date
}

export interface TenantRequest {
  name: string;
  email: string;
  tags: string[];
  status: boolean;
  additionalInfo: AdditionalField[];
}
export interface AdditionalField {
  label: string;
  value: string;
}