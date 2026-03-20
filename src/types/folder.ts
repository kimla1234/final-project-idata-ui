// បន្ថែមចូលក្នុង types របស់អ្នក
export interface FolderResponse {
  id: number;
  name: string;
  description?: string;
  workspaceId: number; // ដើម្បីដឹងថាវាជារបស់ Workspace មួយណា
  createdAt: string;
}

export interface FolderRequest {
  name: string;
}