import TaskExtend from "../pages/TaskExtend";
import TaskManage from "../pages/TaskManage";
import Setting from "../pages/Setting";

export const routes = [
  {
    path: '/',
    Component: TaskExtend,
  },
  {
    path: '/task-manage',
    Component: TaskManage,
  },
  {
    path: '/setting',
    Component: Setting,
  },
]