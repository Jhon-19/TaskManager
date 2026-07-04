import Layout from "./components/Layout";
import { TaskExtendProvider } from "./contexts/TaskExtendContext";

function TaskExtend(props: any) {
  const {} = props;
  return (
    <Layout>
      <div>12333</div>
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
