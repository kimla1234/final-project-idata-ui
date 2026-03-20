// ទម្រង់ Request ពេលផ្ញើទៅ Backend
export interface WorkspaceRequest {
  name: string;
  description?: string;
}

// ទម្រង់ Response ដែលទទួលបានពី Backend
export interface WorkspaceResponse {
  id: number;
  name: string;
  description: string;
}

// ទម្រង់ស្ថិតិ Dashboard Analytics
export interface WorkspaceStatsResponse {
  totalCampaigns: number;
  totalEmailsSent: number;
  totalSuccess: number;
  totalFailure: number;
  overallSuccessRate: number;
}