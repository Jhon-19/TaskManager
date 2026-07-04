import { useEffect, useState } from "react";
import NavList from "../NavList";
import styles from "./index.module.less";
import { TaskExtend } from "../../../../../bindings/api/services";
import { Button, Flex } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";

function Layout(props: any) {
  const { children } = props;

  const [dateList, setDateList] = useState<string[]>([]);

  const { setSelectedDate } = useTaskExtendContext();

  const getTaskList = () => {
    TaskExtend.GetDateList(0, 7)
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
          <div>任务列表</div>
          <div>
            <Button
              icon={<PlusCircleOutlined />}
              onClick={() => {
                const currentDate = dayjs().format("YYYYMMDD");
                TaskExtend.CreateDateTask(currentDate);
                getTaskList();
              }}
            />
          </div>
        </Flex>
        <NavList dateList={dateList} />
      </div>
      <div className={styles.rightPanel}>{children}</div>
    </div>
  );
}

export default Layout;
