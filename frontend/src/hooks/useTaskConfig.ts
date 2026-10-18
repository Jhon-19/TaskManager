import { useEffect, useSyncExternalStore } from "react";
import {
  getTaskConfig,
  loadTaskConfig,
  subscribeTaskConfig,
  updateTaskConfig,
} from "../biz/taskConfig";

export function useTaskConfig() {
  const config = useSyncExternalStore(
    subscribeTaskConfig,
    getTaskConfig,
    getTaskConfig
  );

  useEffect(() => {
    loadTaskConfig();
  }, []);

  return {
    config,
    reload: () => loadTaskConfig(true),
    update: updateTaskConfig,
  };
}
