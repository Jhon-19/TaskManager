import { useEffect, useState } from "react";
import NavList from "../NavList";
import styles from "./index.module.less";
import { TaskExtend } from "../../../../../bindings/api/services";
import { Flex } from "antd";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import DateTaskModal from "../DateTaskModal";

function Layout(props: any) {
  const { children } = props;

  const [dateList, setDateList] = useState<string[]>([]);

  const { setSelectedDate } = useTaskExtendContext();

  const getTaskList = () => {
    TaskExtend.GetDateList(0, 20)
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
    getTaskList();
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.leftPanel}>
        <Flex justify="space-between" align="center">
          <div className={styles.taskTitle}>日期列表</div>
          <DateTaskModal onSuccess={getTaskList} />
        </Flex>
        <NavList dateList={dateList} />
      </div>
      <div className={styles.rightPanel}>{children}</div>
    </div>
  );
}

export default Layout;
