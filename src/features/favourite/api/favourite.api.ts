import { PopulatedFavourite } from "@shared-types/favourite.type";
import { axiosInstance } from "@shared-libs/axios/axios.base";

export const fetchMyFavourites = async (): Promise<PopulatedFavourite[]> => {
  const response = await axiosInstance.get<PopulatedFavourite[]>(
    "/favourites/me"
  );
  return response.data;
};

