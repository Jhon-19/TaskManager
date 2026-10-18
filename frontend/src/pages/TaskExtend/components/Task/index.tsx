import { Button, Checkbox, Drawer, Flex, message, Popconfirm } from "antd";
import styles from "./index.module.less";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import EditableText from "@/components/EditableText";
import { TaskExtend } from "../../../../../bindings/api/services";
import { DeleteOutlined, FileTextOutlined, HolderOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import classNames from "classnames";
import MarkdownEditor from "@/components/MarkdownEditor";

function Task(props: any) {
  const { task, taskGroupId, taskIndex, onRefresh, defaultEditing, onCompleteChange } = props;

  const { selectedDate } = useTaskExtendContext();

  const { title, id, detail } = task || {};

  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [detailValue, setDetailValue] = useState(detail);

  // 任务项可拖（外层 DragDropProvider 在 TaskGroup）。已完成任务禁用拖拽。
  const { ref, isDragging } = useSortable({
    id,
    index: taskIndex,
    disabled: task?.isCompleted,
  });

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
    // 优先走父级回调（会同时重排并持久化顺序 + 完成态），缺省时回退单字段更新
    if (onCompleteChange) {
      onCompleteChange(checked);
    } else {
      updateTask("isCompleted", checked);
    }
  };

  const handleDetailConfirm = () => {
    updateTask("detail", detailValue);
    setDetailDrawerVisible(false);
  };

  const handleDetailClose = () => {
    setDetailDrawerVisible(false);
  };

  return (
    <>
      <Flex
        gap={8}
        ref={ref as any}
        className={classNames(styles.task, { [styles.dragging]: isDragging })}
      >
        <HolderOutlined
          className={classNames(styles.dragHandle, {
            [styles.dragHandleDisabled]: task?.isCompleted,
          })}
        />
        <Checkbox
          checked={task?.isCompleted}
          onChange={handleTaskCheckedChange}
        />
        <Flex className={styles.editableTextWrapper}>
          <EditableText
            value={title}
            defaultEditing={defaultEditing}
            onChange={(newValue) => {
              updateTask("title", newValue);
            }}
          />
          <Button
            icon={<FileTextOutlined />}
            type="text"
            onClick={() => {
              setDetailDrawerVisible(true);
            }}
          />
        </Flex>
        <Popconfirm
          title="确认删除该任务？"
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
          onConfirm={deleteTask}
        >
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
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
