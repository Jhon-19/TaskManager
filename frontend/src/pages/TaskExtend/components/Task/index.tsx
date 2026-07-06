import { message } from "antd";
import styles from "./index.module.less";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import EditableText from "@/components/EditableText";
import { TaskExtend } from "../../../../../bindings/api/services";

function Task(props: any) {
  const { task, taskGroupId, onRefresh } = props;

  const {selectedDate} = useTaskExtendContext();

  const { title, id } = task || {};

  const updateTask = async (key, value) => { 
    try {
      await TaskExtend.UpdateTask(selectedDate, taskGroupId, id, { [key]: value } as any)
      onRefresh?.()
    } catch (err: any) {
      message.error(err?.message)
    }
   }

  return (
    <div className={styles.task}>
      <EditableText
        value={title}
        onChange={(newValue) => {
          updateTask("title", newValue)
        }}
      />
    </div>
  );
}

export default Task;
