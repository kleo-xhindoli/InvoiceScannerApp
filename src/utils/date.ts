import { format } from "date-fns";

export function formatDateTime(dateTime: string) {
  const date = new Date(dateTime);
  return format(date, "dd/MM/yyyy 'at' HH:mm");
}
