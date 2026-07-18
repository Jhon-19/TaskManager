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

  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);

  const { title, id, detail } = task || {};

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
    
    setDetailDrawerVisible(false);
  };

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
        onClose={() => setDetailDrawerVisible(false)}
        footer={
          <Flex gap={12}>
            <Button onClick={() => setDetailDrawerVisible(false)}>取消</Button>
            <Button onClick={handleDetailConfirm} type="primary">
              确认
            </Button>
          </Flex>
        }
      >
        <MarkdownEditor value={detail} />
      </Drawer>
    </>
  );
}

export default Task;
