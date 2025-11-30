import { axiosInstance } from "@shared-libs/axios/axios.base";

export interface AdminCommentResponse {
  id: number;
  summary_id: number;
  user_id: number;
  content: string;
  parent_comment_id: number | null;
  access: "public" | "private";
  created_at: string;
  user?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    role?: {
      id: number;
      role_name: string;
      permissions?: string | null;
    };
  };
  parent_comment?: AdminCommentResponse | null;
}

export const fetchAdminRelatedComments = async (
  summaryId: number
): Promise<AdminCommentResponse[]> => {
  const response = await axiosInstance.get<AdminCommentResponse[]>(
    `/comments/admin-related?summary_id=${summaryId}`
  );
  return response.data;
};

export interface CreateCommentPayload {
  summary_id: number;
  content: string;
  parent_comment_id?: number | null;
  access?: "public" | "private";
}

export const createComment = async (
  payload: CreateCommentPayload
): Promise<AdminCommentResponse> => {
  const response = await axiosInstance.post<AdminCommentResponse>(
    "/comments/",
    payload
  );
  return response.data;
};
