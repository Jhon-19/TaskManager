import dayjs from "dayjs";

export const todayStr = () => dayjs().format("YYYYMMDD");

// 根据继承类型解析默认继承日期，无可继承来源时返回 null
// dateList 为倒序列表（最新在前），yyyymmdd 字符串可直接按字典序比较
export function resolveExtendDate(
  extendFrom: string,
  dateList: string[],
  today: string
): string | null {
  if (extendFrom === "none") return null;
  if (extendFrom === "yesterday") {
    return dayjs(today).subtract(1, "day").format("YYYYMMDD");
  }
  // last：取第一个严格早于今天的日期，即上一个有任务的日期
  return dateList.find((date) => date < today) ?? null;
}
