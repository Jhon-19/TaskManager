import { useEffect, useState } from "react";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import { TaskExtend } from "../../../../../bindings/api/services";

function TaskPanel(props: any) {
  const {} = props;

  const { selectedDate } = useTaskExtendContext();

  const [taskGroups, setTaskGroups] = useState<any[]>([]);

  useEffect(() => {
    if (selectedDate) {
      TaskExtend.GetTaskData(selectedDate).then((res: any) => {
        setTaskGroups(res || []);
        console.log("zhiyu-test ~ TaskPanel ~ res:", res);
      });
    }
  }, [selectedDate]);

  return <div>{JSON.stringify(taskGroups)}</div>;
}

export default TaskPanel;
