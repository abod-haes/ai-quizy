import { api } from "../base.service";
import { END_POINTS } from "@/utils/query-apis";
import { Statistics } from "./statistics.type";

export const statisticsService = {
  async getStatistics(): Promise<Statistics> {
    const response = await api.get<Statistics>(END_POINTS.STATISTICS.GET_STATISTICS);
    return response.data;
  },
};

