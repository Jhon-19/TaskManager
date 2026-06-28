import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./config/routes";

const router = createBrowserRouter(routes)

function App(props: any) {
  const {} = props;
  return <div className="container">
    <RouterProvider router={router} />
  </div>;
}

export default App;
