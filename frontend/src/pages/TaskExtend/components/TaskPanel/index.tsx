import { useEffect, useState } from "react";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import { TaskExtend } from "../../../../../bindings/api/services";
import { Button, Flex, message } from "antd";
import styles from "./index.module.less";
import TaskGroup from "../TaskGroup";
import { PlusOutlined } from "@ant-design/icons";

function TaskPanel(props: any) {
  const {} = props;

  const { selectedDate } = useTaskExtendContext();

  const [taskGroups, setTaskGroups] = useState<any[]>([]);

  const getTaskGroups = () => {
    TaskExtend.GetTaskData(selectedDate).then((res: any) => {
      setTaskGroups(res || []);
    });
  };

  useEffect(() => {
    if (selectedDate) {
      getTaskGroups();
    }
  }, [selectedDate]);

  const handleAddGroup = () => {
    TaskExtend.AddTaskGroup(selectedDate, "新的分组")
      .then((res: any) => {
        getTaskGroups();
      })
      .catch((err: any) => {
        message.error(err?.message || "新增分组失败");
      });
  };

  return (
    <div>
      <Flex
        className={styles.taskHeader}
        justify={"space-between"}
        align={"center"}
      >
        <div className={styles.taskHeaderTitle}>任务列表</div>
        <Button icon={<PlusOutlined />} onClick={handleAddGroup}>
          新增分组
        </Button>
      </Flex>
      <Flex vertical={true} gap={12} className={styles.taskGroups}>
        {Array.isArray(taskGroups) &&
          taskGroups.map((taskGroup: any) => (
            <TaskGroup
              key={taskGroup.id}
              taskGroup={taskGroup}
              onRefresh={getTaskGroups}
            />
          ))}
      </Flex>
    </div>
  );
}

export default TaskPanel;
