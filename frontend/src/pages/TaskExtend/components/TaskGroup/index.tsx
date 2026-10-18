import { Button, Flex, message, Popconfirm } from "antd";
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
  const { taskGroup, groupIndex, onRefresh, defaultEditing } = props;

  const { selectedDate } = useTaskExtendContext();

  const { id, name, tasks: propTasks } = taskGroup || {};

  const isDefaultGroup = name === "默认任务组";

  const [newTaskId, setNewTaskId] = useState<string | null>(null);

  // 分组自身可拖（外层 DragDropProvider 在 TaskPanel）
  const { ref: groupRef, isDragging } = useSortable({
    id,
    index: groupIndex,
    disabled: isDefaultGroup,
  });

  // 维护本地任务列表以支持乐观更新
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    // 稳定分区：未完成在前、已完成在后，形成连续的“已完成区域”
    setTasks(
      Array.isArray(propTasks)
        ? [...propTasks].sort(
            (a, b) => Number(!!a.isCompleted) - Number(!!b.isCompleted)
          )
        : []
    );
  }, [propTasks]);

  const handleAddTask = () => {
    TaskExtend.AddTask(selectedDate, id)
      .then((newId: string) => {
        setNewTaskId(newId);
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
    const source = event.operation.source;
    const target = event.operation.target;
    if (!source) return;

    const from = tasks.findIndex((t) => t.id === source.id);
    if (from === -1) return;

    // 已完成任务整体禁用拖拽，防御性拦截
    if (tasks[from]?.isCompleted) return;

    // OptimisticSortingPlugin 在拖拽过程中会把 target 重置为 source 自身，
    // 因此不能用 sourceId !== targetId 判断是否发生了移动。
    // 真正的新位置由 sortable 的投影 index 给出；未投影时回退到 target 的位置。
    const projectedIndex = (source as any).index;
    let to: number;
    if (typeof projectedIndex === "number" && projectedIndex !== from) {
      to = projectedIndex;
    } else if (target && target.id !== source.id) {
      to = tasks.findIndex((t) => t.id === target.id);
    } else {
      return;
    }
    if (to === -1 || from === to) return;

    const next = produce(tasks, (draft) => {
      const [moved] = draft.splice(from, 1);
      draft.splice(to, 0, moved);
    });

    // 边界校验：禁止未完成任务进入已完成区域。
    // 直接以最终数组形态判定——若已完成段之后仍存在未完成任务，说明越界，拒绝。
    const firstCompletedIdx = next.findIndex((t) => t.isCompleted);
    const invariantBroken =
      firstCompletedIdx !== -1 &&
      next.slice(firstCompletedIdx).some((t) => !t.isCompleted);
    if (invariantBroken) return;

    // 乐观更新
    setTasks(next);
    TaskExtend.UpdateTaskGroupData(selectedDate, id, JSON.stringify(next)).catch(
      (err: any) => {
        message.error(err?.message || "排序保存失败");
        onRefresh?.();
      }
    );
  };

  const handleTaskCompleteChange = (taskId: string, completed: boolean) => {
    // 排序需在 recipe 内对 draft 执行：produce 返回的结果被 immer 深度冻结，
    // 在其上调用原地的 .sort() 会抛 "Attempted to assign to readonly property"
    const next = produce(tasks, (draft) => {
      const t = draft.find((item) => item.id === taskId);
      if (t) t.isCompleted = completed;
      draft.sort(
        (a, b) => Number(!!a.isCompleted) - Number(!!b.isCompleted)
      );
    });

    // 乐观更新（顺序 + 完成态一并持久化）
    setTasks(next);
    TaskExtend.UpdateTaskGroupData(selectedDate, id, JSON.stringify(next)).catch(
      (err: any) => {
        message.error(err?.message || "保存失败");
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
            defaultEditing={defaultEditing}
          />
        </Flex>
        {!isDefaultGroup && (
          <Popconfirm
            title="确认删除该分组？"
            description="分组下的所有任务也将一并删除"
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={handleDeleteTaskGroup}
          >
            <Button
              danger
              type="text"
              icon={<DeleteFilled />}
            />
          </Popconfirm>
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
                defaultEditing={task.id === newTaskId}
                onRefresh={onRefresh}
                onCompleteChange={(checked) =>
                  handleTaskCompleteChange(task.id, checked)
                }
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
