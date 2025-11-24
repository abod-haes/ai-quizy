import { api } from "../base.service";
import type { User, UserInput } from "@/services/user.services/user.type";
import type { ApiResponse, PaginatedResponse } from "@/types/common.type";
import { END_POINTS } from "@/utils/query-apis";
import type { QueryParams } from "@/utils/query-keys";

export const userService = {
  async getUsers(
    params?: Partial<QueryParams>,
  ): Promise<PaginatedResponse<User[]>> {
    const response = await api.get<PaginatedResponse<User[]>>(
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
    return response.data.data;
  },

  async createUser(data: UserInput): Promise<User> {
    const response = await api.post<ApiResponse<User>>(
      END_POINTS.USER.CREATE_USER,
      data,
    );
    return response.data.data;
  },

  async updateUser(id: string, data: UserInput): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(
      END_POINTS.USER.UPDATE_USER,
      data,
    );
    return response.data.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      END_POINTS.USER.DELETE_USER(id),
    );
    return response.data.data;
  },
};
