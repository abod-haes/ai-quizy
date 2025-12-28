import { PartialQueryParams } from "@/utils/query-keys";
import { api } from "../base.service";
import { END_POINTS } from "@/utils/query-apis";
import { Unit, CreateUnitInput } from "./unit.type";
import { PaginatedResponse } from "@/types/common.type";

export const unitServices = {
  async getUnits(params?: PartialQueryParams): Promise<PaginatedResponse<Unit>> {
    const response = await api.get<PaginatedResponse<Unit>>(
      END_POINTS.UNIT.GET_UNITS(params)
    );
    return response.data;
  },

  async createUnit(data: CreateUnitInput): Promise<Unit> {
    const response = await api.post<Unit>(END_POINTS.UNIT.CREATE_UNIT, data);
    return response.data;
  },

  async updateUnit(id: string, data: CreateUnitInput): Promise<Unit> {
    const response = await api.put<Unit>(END_POINTS.UNIT.UPDATE_UNIT(id), data);
    return response.data;
  },

  async deleteUnit(id: string): Promise<void> {
    await api.delete(END_POINTS.UNIT.DELETE_UNIT(id));
  },

  async getUnitById(id: string): Promise<Unit> {
    const response = await api.get<Unit>(END_POINTS.UNIT.GET_UNIT_BY_ID(id));
    return response.data;
  },
};

