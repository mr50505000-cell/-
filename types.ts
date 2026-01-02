
export interface UploadedImage {
  id: string;
  data: string; // Base64
  name: string;
  preview: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultUrl: string | null;
}
