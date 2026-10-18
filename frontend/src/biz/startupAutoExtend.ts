import { TaskExtend } from "../../bindings/api/services";
import { resolveExtendDate, todayStr } from "./extendSource";
import { loadTaskConfig } from "./taskConfig";

// 模块级守卫：应用生命周期内只执行一次（防 StrictMode 双挂载导致重复创建）
let started = false;

// 应用启动时判断是否为新的一天并自动继承，返回是否自动创建了今天
export async function runStartupAutoExtend(): Promise<boolean> {
  if (started) return false;
  started = true;

  const config = await loadTaskConfig();
  if (!config.extendOnStart || config.extendFrom === "none") return false;

  let dateList: string[] = [];
  try {
    const result = await TaskExtend.GetDateList(0, config.dateListCount);
    if (Array.isArray(result)) {
      dateList = result;
    }
  } catch (err) {
    console.log(err);
  }

  const today = todayStr();
  // 今天已存在（倒序列表，今天存在必在最前），无需继承
  if (dateList.includes(today)) return false;

  const source = resolveExtendDate(config.extendFrom, dateList, today);
  // 无可继承来源（列表为空、last 未找到）时跳过
  if (!source) return false;

  try {
    await TaskExtend.CreateDateTask(today, source);
    return true;
  } catch (err) {
    // 目录已存在等场景：记日志不弹错，不影响主流程
    console.log("startup auto extend failed:", err);
    return false;
  }
}
