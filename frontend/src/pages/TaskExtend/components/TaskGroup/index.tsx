import { Button, Flex, message } from "antd";
import styles from "./index.module.less";
import { DeleteFilled, PlusSquareOutlined } from "@ant-design/icons";
import { TaskExtend } from "../../../../../bindings/api/services";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import Task from "../Task";
import EditableText from "@/components/EditableText";

function TaskGroup(props: any) {
  const { taskGroup, onRefresh } = props;

  const { selectedDate } = useTaskExtendContext();

  const { id, name, tasks } = taskGroup || {};

  const isDefaultGroup = name === "默认任务组";

  const handleAddTask = () => {
    TaskExtend.AddTask(selectedDate, id)
      .then(() => {
        onRefresh?.();
      })
      .catch((err) => {
        message.error(err?.message);
      });
  };

  const handleUpdateTaskGroup = (newValue: string) => {
    TaskExtend.UpdateTaskGroup(selectedDate, id, newValue)
      .then(() => {
        onRefresh?.();
      })
      .catch((err) => {
        message.error(err?.message);
      });
  };

  const handleDeleteTaskGroup = () => {
    TaskExtend.DeleteTaskGroup(selectedDate, id)
      .then(() => {
        onRefresh?.();
      })
      .catch((err) => {
        message.error(err?.message);
      });
  };

  return (
    <div className={styles.taskGroup}>
      <Flex gap={8} justify="space-between" className={styles.taskGroupName}>
        <EditableText
          value={name}
          className={styles.editableText}
          onChange={handleUpdateTaskGroup}
          editable={!isDefaultGroup}
        />
        {!isDefaultGroup && (
          <Button
            danger
            type="text"
            icon={<DeleteFilled />}
            onClick={handleDeleteTaskGroup}
          />
        )}
      </Flex>
      <Flex vertical={true} gap={8}>
        {Array.isArray(tasks) &&
          tasks.map((task: any) => (
            <Task
              key={task.id}
              task={task}
              taskGroupId={id}
              onRefresh={onRefresh}
            />
          ))}
      </Flex>
      <Button
        className={styles.addTaskButton}
        icon={<PlusSquareOutlined />}
        onClick={handleAddTask}
      >
        新增任务
      </Button>
    </div>
  );
}

export default TaskGroup;
