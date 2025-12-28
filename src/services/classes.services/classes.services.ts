import { END_POINTS } from "@/utils/query-apis";
import { api } from "../base.service";
import { BriefAPIS, PaginatedResponse } from "@/types/common.type";
import { Class, CreateClassInput } from "./classes.type";
import { PartialQueryParams } from "@/utils/query-keys";

export const classesServices = {
  async getClassesBrief(): Promise<BriefAPIS[]> {
    const response = await api.get(END_POINTS.CLASSES.GET_CLASSES_BRIEF());
    return response.data;
  },

  async getClasses(params?: PartialQueryParams): Promise<PaginatedResponse<Class>> {
    const response = await api.get<PaginatedResponse<Class>>(
      END_POINTS.CLASSES.GET_CLASSES(params)
    );
    return response.data;
  },

  async createClass(data: CreateClassInput): Promise<string> {
    const response = await api.post<string>(END_POINTS.CLASSES.CREATE_CLASS, data);
    return response.data;
  },
};