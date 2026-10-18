import { TaskConfig } from "../../bindings/api/services";
import type {
  TaskConfigData,
  UpdateTaskConfigData,
} from "../../bindings/api/constants/models";

// 与后端默认配置对齐的兜底值（GetConfig 失败或返回非法值时使用）
export const DEFAULT_TASK_CONFIG: TaskConfigData = {
  extendFrom: "last",
  extendOnStart: false,
  dateListCount: 10,
};

export const EXTEND_FROM_OPTIONS = ["last", "yesterday", "none"];

let cached: TaskConfigData | null = null;
let inflight: Promise<TaskConfigData> | null = null;
const listeners = new Set<() => void>();

export function getTaskConfig(): TaskConfigData | null {
  return cached;
}

export function subscribeTaskConfig(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

// 防御性归一化：extendFrom 非法时回退 last，dateListCount 至少为 1
function normalizeConfig(raw: TaskConfigData): TaskConfigData {
  const extendFrom = EXTEND_FROM_OPTIONS.includes(raw?.extendFrom)
    ? raw.extendFrom
    : DEFAULT_TASK_CONFIG.extendFrom;
  const dateListCount =
    raw?.dateListCount && raw.dateListCount >= 1
      ? raw.dateListCount
      : DEFAULT_TASK_CONFIG.dateListCount;
  return {
    extendFrom,
    extendOnStart: !!raw?.extendOnStart,
    dateListCount,
  };
}

export async function loadTaskConfig(force = false): Promise<TaskConfigData> {
  if (cached && !force) return cached;
  if (!inflight) {
    inflight = TaskConfig.GetConfig()
      .then((raw) => {
        cached = normalizeConfig(raw);
        notify();
        return cached;
      })
      .catch((err) => {
        console.log(err);
        cached = { ...DEFAULT_TASK_CONFIG };
        notify();
        return cached;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function updateTaskConfig(
  updateConfigData: UpdateTaskConfigData
): Promise<void> {
  await TaskConfig.UpdateConfig(updateConfigData);
  // 保存成功后强制重拉（后端会同时 Emit 配置变更事件通知其它窗口）
  await loadTaskConfig(true);
}
