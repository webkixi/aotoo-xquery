import { getYmd } from "./getymd";

export function formatDate(date) {
  let ymd = getYmd(date)
  return `${ymd.year}-${ymd.month}-${ymd.day}`
}