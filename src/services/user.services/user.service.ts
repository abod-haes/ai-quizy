import { api } from "../base.service";
import type { User, UserInput } from "@/services/user.services/user.type";
import type { ApiResponse, PaginationResponse } from "@/types/common.type";
import { END_POINTS } from "@/utils/query-apis";
import type { QueryParams } from "@/utils/query-keys";

export const userService = {
  async getUsers(
    params?: Partial<QueryParams>,
  ): Promise<PaginationResponse<User>> {
    const response = await api.get<PaginationResponse<User>>(
      END_POINTS.USER.GET_USERS,
      {
        params,
      },
    );
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(
      END_POINTS.USER.GET_USER_BY_ID(id),
    );
    return response.data;
  },

  async createUser(data: UserInput): Promise<User> {
    const response = await api.post<ApiResponse<User>>(
      END_POINTS.USER.CREATE_USER,
      data,
    );
    return response.data;
  },

  async updateUser(id: string, data: UserInput): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(
      END_POINTS.USER.UPDATE_USER,
      data,
    );
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      END_POINTS.USER.DELETE_USER(id),
    );
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(
      END_POINTS.USER.GET_CURRENT_USER,
    );
    return response.data;
  },
};
