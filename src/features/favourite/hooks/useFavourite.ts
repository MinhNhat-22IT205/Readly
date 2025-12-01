import { useState, useEffect } from "react";
import useSWR from "swr";
import { Favourite } from "@shared-types/favourite.type";
import {
  checkFavouriteStatus,
  addFavourite,
  removeFavourite,
} from "../api/favourite.api";

export function useFavourite(summaryId: number | null) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [favouriteId, setFavouriteId] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<Favourite | null>(
    summaryId ? [`favourite-status`, summaryId] : null,
    ([, id]) => checkFavouriteStatus(id as number)
  );

  useEffect(() => {
    if (data) {
      setIsFavourite(true);
      setFavouriteId(data.id);
    } else {
      setIsFavourite(false);
      setFavouriteId(null);
    }
  }, [data]);

  const toggleFavourite = async () => {
    if (!summaryId || isToggling) return;

    setIsToggling(true);
    try {
      if (isFavourite && favouriteId) {
        await removeFavourite(favouriteId);
        setIsFavourite(false);
        setFavouriteId(null);
        mutate(null, false);
      } else {
        const newFavourite = await addFavourite(summaryId);
        setIsFavourite(true);
        setFavouriteId(newFavourite.id);
        mutate(newFavourite, false);
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return {
    isFavourite,
    isLoading,
    isError: error,
    toggleFavourite,
    isToggling,
  };
}

