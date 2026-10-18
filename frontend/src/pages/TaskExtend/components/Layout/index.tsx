import { useEffect, useState } from "react";
import { Events } from "@wailsio/runtime";
import { Flex } from "antd";
import NavList from "../NavList";
import styles from "./index.module.less";
import { TaskExtend } from "../../../../../bindings/api/services";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import DateTaskModal from "../DateTaskModal";
import { CONFIG_CHANGED_EVENT } from "../../../../constants/events";
import {
  DEFAULT_TASK_CONFIG,
  getTaskConfig,
  loadTaskConfig,
} from "../../../../biz/taskConfig";
import { runStartupAutoExtend } from "../../../../biz/startupAutoExtend";
import { todayStr } from "../../../../biz/extendSource";

function Layout(props: any) {
  const { children } = props;

  const [dateList, setDateList] = useState<string[]>([]);

  const { setSelectedDate } = useTaskExtendContext();

  const getTaskList = () => {
    // 每次拉取时从配置缓存取最新个数，避免闭包旧值
    const dateListCount =
      getTaskConfig()?.dateListCount ?? DEFAULT_TASK_CONFIG.dateListCount;
    TaskExtend.GetDateList(0, dateListCount)
      .then((_dateList: string[] | null) => {
        if (Array.isArray(_dateList)) {
          setDateList(_dateList || []);
          if (_dateList.length > 0) {
            setSelectedDate(_dateList?.[0] || "");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    (async () => {
      // 应用启动时判断是否为新的一天并自动继承，再拉取日期列表
      const createdToday = await runStartupAutoExtend();
      getTaskList();
      if (createdToday) {
        setSelectedDate(todayStr());
      }
    })();

    // 配置在设置窗口修改后（后端事件广播），主窗口重拉配置与日期列表
    const offConfigChanged = Events.On(CONFIG_CHANGED_EVENT, () => {
      loadTaskConfig(true).then(() => getTaskList());
    });
    // 切回主窗口时兜底重拉（覆盖事件未达的场景）
    const onWindowActive = () => {
      loadTaskConfig(true).then(() => getTaskList());
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        onWindowActive();
      }
    };
    window.addEventListener("focus", onWindowActive);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      offConfigChanged?.();
      window.removeEventListener("focus", onWindowActive);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.leftPanel}>
        <Flex justify="space-between" align="center">
          <div className={styles.taskTitle}>日期列表</div>
          <DateTaskModal onSuccess={getTaskList} />
        </Flex>
        <div className={styles.navScroll}>
          <NavList dateList={dateList} />
        </div>
      </div>
      <div className={styles.rightPanel}>{children}</div>
    </div>
  );
}

export default Layout;
