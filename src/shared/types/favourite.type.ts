import { EndUserMinimal } from "./enduser.type";
import { SummaryPopulated } from "./summary.type";

export type Favourite = {
  id: number;
  user_id: number;
  summary_id: number;
  created_at: string; // ISO date string
};

export type PopulatedFavourite = Favourite & {
  summary: SummaryPopulated;
  user: EndUserMinimal;
};
