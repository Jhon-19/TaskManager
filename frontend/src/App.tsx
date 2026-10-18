import { createHashRouter, RouterProvider } from "react-router";
import { routes } from "./config/routes";

// 使用 Hash 路由：生产构建下 Wails 资产服务器对 /setting 等非资源路径返回 404，
// Hash 路由（/#/setting）可确保所有窗口都命中 index.html
const router = createHashRouter(routes)

function App(props: any) {
  const {} = props;
  return <div className="container">
    <RouterProvider router={router} />
  </div>;
}

export default App;
