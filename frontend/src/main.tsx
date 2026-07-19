import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/zh-cn";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

dayjs.extend(customParseFormat);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
