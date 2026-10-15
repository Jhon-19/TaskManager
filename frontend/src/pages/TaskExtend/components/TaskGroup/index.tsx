import { Button, Flex, message } from "antd";
import { useEffect, useState } from "react";
import styles from "./index.module.less";
import { DeleteFilled, HolderOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { TaskExtend } from "../../../../../bindings/api/services";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import Task from "../Task";
import EditableText from "@/components/EditableText";
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { produce } from "immer";
import classNames from "classnames";

function TaskGroup(props: any) {
  const { taskGroup, groupIndex, onRefresh } = props;

  const { selectedDate } = useTaskExtendContext();

  const { id, name, tasks: propTasks } = taskGroup || {};

  const isDefaultGroup = name === "默认任务组";

  // 分组自身可拖（外层 DragDropProvider 在 TaskPanel）
  const { ref: groupRef, isDragging } = useSortable({
    id,
    index: groupIndex,
    disabled: isDefaultGroup,
  });

  // 维护本地任务列表以支持乐观更新
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    setTasks(Array.isArray(propTasks) ? propTasks : []);
  }, [propTasks]);

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

  const handleTaskDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;
    const sourceId = event.operation.source?.id;
    const targetId = event.operation.target?.id;
    if (!sourceId || !targetId || sourceId === targetId) return;

    const from = tasks.findIndex((t) => t.id === sourceId);
    const to = tasks.findIndex((t) => t.id === targetId);
    if (from === -1 || to === -1) return;

    const next = produce(tasks, (draft) => {
      const [moved] = draft.splice(from, 1);
      draft.splice(to, 0, moved);
    });

    // 乐观更新
    setTasks(next);
    TaskExtend.UpdateTaskGroupData(selectedDate, id, JSON.stringify(next)).catch(
      (err: any) => {
        message.error(err?.message || "排序保存失败");
        onRefresh?.();
      }
    );
  };

  return (
    <div
      ref={groupRef as any}
      className={classNames(styles.taskGroup, { [styles.dragging]: isDragging })}
    >
      <Flex gap={8} align="center" justify="space-between" className={styles.taskGroupName}>
        <Flex gap={4} align="center" className={styles.editableText}>
          {!isDefaultGroup && (
            <HolderOutlined className={styles.dragHandle} />
          )}
          <EditableText
            value={name}
            onChange={handleUpdateTaskGroup}
            editable={!isDefaultGroup}
          />
        </Flex>
        {!isDefaultGroup && (
          <Button
            danger
            type="text"
            icon={<DeleteFilled />}
            onClick={handleDeleteTaskGroup}
          />
        )}
      </Flex>
      <DragDropProvider onDragEnd={handleTaskDragEnd}>
        <Flex vertical={true} gap={8}>
          {Array.isArray(tasks) &&
            tasks.map((task: any, index: number) => (
              <Task
                key={task.id}
                task={task}
                taskGroupId={id}
                taskIndex={index}
                onRefresh={onRefresh}
              />
            ))}
        </Flex>
      </DragDropProvider>
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
