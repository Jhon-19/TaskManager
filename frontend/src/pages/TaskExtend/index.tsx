import Layout from "./components/Layout";
import TaskPanel from "./components/TaskPanel";
import { TaskExtendProvider } from "./contexts/TaskExtendContext";

function TaskExtend(props: any) {
  const {} = props;
  return (
    <Layout>
      <TaskPanel />
    </Layout>
  );
}

const TaskExtendWrapper = (props) => {
  return (
    <TaskExtendProvider>
      <TaskExtend {...props} />
    </TaskExtendProvider>
  );
};

export default TaskExtendWrapper;
