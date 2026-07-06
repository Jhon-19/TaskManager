import { Button, Flex, message } from "antd";
import styles from "./index.module.less";
import { PlusSquareOutlined } from "@ant-design/icons";
import { TaskExtend } from "../../../../../bindings/api/services";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import Task from "../Task";

function TaskGroup(props: any) {
  const { taskGroup, onRefresh } = props;

  const { selectedDate } = useTaskExtendContext();

  const { id, name, tasks } = taskGroup || {};

  const handleAddTask = () => {
    TaskExtend.AddTask(selectedDate, id)
      .then(() => {
        onRefresh?.();
      })
      .catch((err) => {
        message.error(err?.message);
      });
  };

  return (
    <div className={styles.taskGroup}>
      <div className={styles.taskGroupName}>{name}</div>
      <Flex vertical={true} gap={8}>
        {Array.isArray(tasks) &&
          tasks.map((task: any) => <Task key={task.id} task={task} taskGroupId={id} onRefresh={onRefresh} />)}
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
