import { useEffect, useState } from "react";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import { TaskExtend } from "../../../../../bindings/api/services";
import { Button, Flex, message } from "antd";
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { produce } from "immer";
import styles from "./index.module.less";
import TaskGroup from "../TaskGroup";
import { PlusOutlined } from "@ant-design/icons";

function TaskPanel(props: any) {
  const {} = props;

  const { selectedDate } = useTaskExtendContext();

  const [taskGroups, setTaskGroups] = useState<any[]>([]);
  const [newGroupId, setNewGroupId] = useState<string | null>(null);

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
      .then((newGroupId: string) => {
        setNewGroupId(newGroupId);
        getTaskGroups();
      })
      .catch((err: any) => {
        message.error(err?.message || "新增分组失败");
      });
  };

  const handleGroupDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;
    const source = event.operation.source;
    const target = event.operation.target;
    if (!source) return;

    const from = taskGroups.findIndex((g) => g.id === source.id);
    if (from === -1) return;

    // OptimisticSortingPlugin 在拖拽过程中会把 target 重置为 source 自身，
    // 因此不能用 sourceId !== targetId 判断是否发生了移动。
    // 真正的新位置由 sortable 的投影 index 给出；未投影时回退到 target 的位置。
    const projectedIndex = (source as any).index;
    let to: number;
    if (typeof projectedIndex === "number" && projectedIndex !== from) {
      to = projectedIndex;
    } else if (target && target.id !== source.id) {
      to = taskGroups.findIndex((g) => g.id === target.id);
    } else {
      return;
    }
    if (to === -1 || from === to) return;

    const next = produce(taskGroups, (draft) => {
      const [moved] = draft.splice(from, 1);
      draft.splice(to, 0, moved);
    });

    // 乐观更新
    setTaskGroups(next);
    TaskExtend.UpdateDateTaskData(selectedDate, JSON.stringify(next)).catch(
      (err: any) => {
        message.error(err?.message || "排序保存失败");
        getTaskGroups();
      }
    );
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
      <DragDropProvider onDragEnd={handleGroupDragEnd}>
        <Flex vertical={true} gap={12} className={styles.taskGroups}>
          {Array.isArray(taskGroups) &&
            taskGroups.map((taskGroup: any, index: number) => (
              <TaskGroup
                key={taskGroup.id}
                taskGroup={taskGroup}
                groupIndex={index}
                defaultEditing={taskGroup.id === newGroupId}
                onRefresh={getTaskGroups}
              />
            ))}
        </Flex>
      </DragDropProvider>
    </div>
  );
}

export default TaskPanel;
