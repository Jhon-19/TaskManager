import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, message, Modal } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { TaskExtend } from "../../../../../bindings/api/services";

function DateTaskModal(props: any) {
  const { onSuccess } = props;

  const [dateTaskModalVisible, setDateTaskModalVisible] =
    useState<boolean>(false);

  const [createDate, setCreateDate] = useState<any>(dayjs());
  const [extendDate, setExtendDate] = useState<any>(dayjs().subtract(1, "day"));

  const createDateTask = async () => {
    const currentDate = dayjs().format("YYYYMMDD");
    try {
      await TaskExtend.CreateDateTask(currentDate);
      onSuccess?.();
    } catch (err: any) {
      message.error(err?.message || "创建任务失败");
    }
  };

  return (
    <div>
      <Button
        icon={<PlusCircleOutlined />}
        onClick={() => {
          setDateTaskModalVisible(true);
        }}
      />
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
                setDateTaskModalVisible(false);
              }}
              type="primary"
            >
              确定
            </Button>
          </Flex>
        }
      >
        <Flex vertical gap={12}>
          <Flex align="center" gap={8}>
          创建任务的日期
          <DatePicker
            value={createDate}
            onChange={(date, dateString) => {
              setCreateDate(date);
            }}
          />
        </Flex>
        <Flex align="center" gap={8}>
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
    </div>
  );
}

export default DateTaskModal;
