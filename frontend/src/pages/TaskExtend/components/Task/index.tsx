import { Button, Flex, message } from "antd";
import styles from "./index.module.less";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import EditableText from "@/components/EditableText";
import { TaskExtend } from "../../../../../bindings/api/services";
import { DeleteOutlined } from "@ant-design/icons";

function Task(props: any) {
  const { task, taskGroupId, onRefresh } = props;

  const { selectedDate } = useTaskExtendContext();

  const { title, id } = task || {};

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

  return (
    <Flex gap={8} className={styles.task}>
      <EditableText
        className={styles.editableText}
        value={title}
        onChange={(newValue) => {
          updateTask("title", newValue);
        }}
      />
      <Button danger icon={<DeleteOutlined />} onClick={deleteTask} />
    </Flex>
  );
}

export default Task;
