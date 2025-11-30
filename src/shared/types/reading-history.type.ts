import { EndUserMinimal } from "./enduser.type";
import { SummaryPopulated } from "./summary.type";

export type ReadingHistory = {
  id: number;
  user_id: number;
  summary_id: number;
  last_section_id?: number | null;
  progress_percent: number;
  time_spent: number;
  device_type: string;
  last_read_date?: string | null;
};
export type ReadingHistoryPopulated = ReadingHistory & {
  user: EndUserMinimal;
  summary: SummaryPopulated;
};
