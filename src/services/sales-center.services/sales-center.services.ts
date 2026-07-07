import { END_POINTS } from "@/utils/query-apis";
import { api } from "../base.service";
import { PaginatedResponse } from "@/types/common.type";
import { PartialQueryParams } from "@/utils/query-keys";
import { SalesCenter } from "./sales-center.type";

export const salesCenterServices = {
  async getSalesCenters(
    params?: PartialQueryParams,
  ): Promise<PaginatedResponse<SalesCenter>> {
    const response = await api.get<PaginatedResponse<SalesCenter>>(
      END_POINTS.POINTS_OF_SALE.GET_POINTS_OF_SALE(params),
    );
    return response.data;
  },
};
