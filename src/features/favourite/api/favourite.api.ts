import { PopulatedFavourite, Favourite } from "@shared-types/favourite.type";
import { axiosInstance } from "@shared-libs/axios/axios.base";

export const fetchMyFavourites = async (): Promise<PopulatedFavourite[]> => {
  const response = await axiosInstance.get<PopulatedFavourite[]>(
    "/favourites/me"
  );
  return response.data;
};

export const addFavourite = async (
  summaryId: number
): Promise<Favourite> => {
  const response = await axiosInstance.post<Favourite>("/favourites/", {
    summary_id: summaryId,
  });
  return response.data;
};

export const removeFavourite = async (
  favouriteId: number
): Promise<void> => {
  await axiosInstance.delete(`/favourites/${favouriteId}`);
};

export const checkFavouriteStatus = async (
  summaryId: number
): Promise<Favourite | null> => {
  try {
    const response = await axiosInstance.get<Favourite>(
      `/favourites/check?summary_id=${summaryId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

