import { Button, Checkbox, Drawer, Flex, message } from "antd";
import styles from "./index.module.less";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import EditableText from "@/components/EditableText";
import { TaskExtend } from "../../../../../bindings/api/services";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";

function Task(props: any) {
  const { task, taskGroupId, onRefresh } = props;

  const { selectedDate } = useTaskExtendContext();

  const { title, id, detail } = task || {};

  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [detailValue, setDetailValue] = useState(detail)

  const updateTask = async (key, value) => {
    try {
      await TaskExtend.UpdateTask(selectedDate, taskGroupId, id, {
        [key]: value,
      } as any);
      onRefresh?.();
    } catch (err: any) {
      message.error(err?.message);
    }
  };

  const deleteTask = () => {
    TaskExtend.DeleteTask(selectedDate, taskGroupId, id)
      .then(() => {
        onRefresh?.();
      })
      .catch((err) => {
        message.error(err?.message);
      });
  };

  const handleTaskCheckedChange = (e) => {
    const checked = e.target.checked;
    updateTask("isCompleted", checked);
  };

  const handleDetailConfirm = () => {
    updateTask('detail', detailValue)
    setDetailDrawerVisible(false);
  };

  const handleDetailClose = () => {
    setDetailDrawerVisible(false)
  }

  return (
    <>
      <Flex gap={8} className={styles.task}>
        <Checkbox
          checked={task?.isCompleted}
          onChange={handleTaskCheckedChange}
        />
        <div
          className={styles.editableTextWrapper}
          onClick={() => {
            setDetailDrawerVisible(true);
          }}
        >
          <EditableText
            value={title}
            onChange={(newValue) => {
              updateTask("title", newValue);
            }}
          />
        </div>
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={deleteTask}
        />
      </Flex>
      <Drawer
        title="任务详情"
        size={520}
        open={detailDrawerVisible}
        onClose={handleDetailClose}
        footer={
          <Flex gap={12}>
            <Button onClick={handleDetailClose}>取消</Button>
            <Button onClick={handleDetailConfirm} type="primary">
              确认
            </Button>
          </Flex>
        }
        destroyOnHidden
      >
        <MarkdownEditor value={detailValue} onChange={setDetailValue} />
      </Drawer>
    </>
  );
}

export default Task;
