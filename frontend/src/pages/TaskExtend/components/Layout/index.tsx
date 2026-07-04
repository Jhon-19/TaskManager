import { useEffect, useState } from "react";
import NavList from "../NavList";
import styles from "./index.module.less";
import { TaskExtend } from "../../../../../bindings/api/services";
import { Button, Flex } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function Layout(props: any) {
  const { children } = props;

  const [dateList, setDateList] = useState<string[]>([]);

  const getTaskList = () => {
    TaskExtend.GetDateList(0, 7)
      .then((_dateList: string[] | null) => {
        setDateList(_dateList || []);
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
        <Flex justify="space-between">
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
