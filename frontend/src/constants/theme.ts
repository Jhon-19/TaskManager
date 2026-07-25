import { theme as antdTheme } from 'antd';

export const customTheme = {
  algorithm: antdTheme.defaultAlgorithm,

  token: {
    colorPrimary: "#3B82F6",

    colorSuccess: "#10B981",
    colorWarning: "#F59E0B",
    colorError: "#EF4444",

    colorBgBase: "#F5F7FA",
    colorBgContainer: "#FFFFFF",

    colorText: "#0F172A",
    colorTextSecondary: "#475569",

    colorBorder: "#E2E8F0",

    borderRadius: 8,

    boxShadow: "0 4px 12px rgba(15,23,42,.08)",
  },

  components: {
    Button: {
      colorPrimaryHover: "#2563EB",
      colorPrimaryActive: "#1D4ED8",
    },

    Input: {
      activeBorderColor: "#3B82F6",
      activeShadow: "0 0 0 2px rgba(59,130,246,.18)",
    },

    Menu: {
      itemSelectedBg: "#DBEAFE",
      itemSelectedColor: "#2563EB",
    },

    Table: {
      headerBg: "#F8FAFC",
      rowHoverBg: "#F1F5F9",
    },

    Layout: {
      bodyBg: "#F5F7FA",
      siderBg: "#F8FAFC",
      headerBg: "#FFFFFF",
    },
  },
};
