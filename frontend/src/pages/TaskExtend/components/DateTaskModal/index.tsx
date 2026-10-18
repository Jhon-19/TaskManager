import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, message, Modal } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { TaskExtend } from "../../../../../bindings/api/services";
import { loadTaskConfig } from "../../../../biz/taskConfig";
import { resolveExtendDate, todayStr } from "../../../../biz/extendSource";
import styles from "./index.module.less";

function DateTaskModal(props: any) {
  const { onSuccess } = props;

  const [dateTaskModalVisible, setDateTaskModalVisible] =
    useState<boolean>(false);

  const [createDate, setCreateDate] = useState<any>(dayjs());
  const [extendDate, setExtendDate] = useState<any>(dayjs().subtract(1, "day"));

  // 打开弹窗时，根据继承类型设置默认继承日期
  const initExtendDate = async () => {
    try {
      const config = await loadTaskConfig();
      if (config.extendFrom === "none") {
        setExtendDate(null);
        return;
      }
      if (config.extendFrom === "yesterday") {
        setExtendDate(dayjs().subtract(1, "day"));
        return;
      }
      // last：取日期列表中最近一个有任务的日期（列表倒序，第一个早于今天的即目标）
      const dateList = await TaskExtend.GetDateList(0, config.dateListCount);
      const source = Array.isArray(dateList)
        ? resolveExtendDate("last", dateList, todayStr())
        : null;
      setExtendDate(source ? dayjs(source, "YYYYMMDD") : null);
    } catch (err) {
      console.log(err);
    }
  };

  const createDateTask = async () => {
    if (!createDate) {
      message.warning("请选择创建任务的日期");
      return;
    }
    try {
      const currentDate = createDate.format("YYYYMMDD");
      // 继承日期为空表示不继承，后端会创建默认任务组
      const targetDate = extendDate ? extendDate.format("YYYYMMDD") : "";
      await TaskExtend.CreateDateTask(currentDate, targetDate);
      onSuccess?.();
    } catch (err: any) {
      message.error(err?.message || "创建任务失败");
    }
  };

  return (
    <>
      <div
        onClick={() => {
          initExtendDate();
          setDateTaskModalVisible(true);
        }}
        className={styles.addTaskButton}
      >
        <PlusCircleOutlined />
      </div>
      <Modal
        title="新建任务日期"
        open={dateTaskModalVisible}
        onCancel={() => {
          setDateTaskModalVisible(false);
        }}
        width={320}
        footer={
          <Flex gap={12} justify="end">
            <Button
              onClick={() => {
                setDateTaskModalVisible(false);
              }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                createDateTask();
                setDateTaskModalVisible(false);
              }}
              type="primary"
            >
              确定
            </Button>
          </Flex>
        }
      >
        <Flex className={styles.taskModalBody} vertical gap={12}>
          <Flex align="center" gap={8} justify="space-between">
            创建任务的日期
            <DatePicker
              value={createDate}
              onChange={(date, dateString) => {
                setCreateDate(date);
              }}
            />
          </Flex>
          <Flex align="center" gap={8} justify="space-between">
            继承自
            <DatePicker
              value={extendDate}
              onChange={(date, dateString) => {
                setExtendDate(date);
              }}
            />
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}

export default DateTaskModal;
