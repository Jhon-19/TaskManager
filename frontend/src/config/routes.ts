import TaskExtend from "../pages/TaskExtend";
import TaskManage from "../pages/TaskManage";

export const routes = [
  {
    path: '/',
    Component: TaskExtend,
  },
  {
    path: '/task-manage',
    Component: TaskManage,
  },
]