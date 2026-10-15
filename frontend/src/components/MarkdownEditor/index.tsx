import classNames from "classnames";
import { useEffect, useState } from "react";
import Vditor from "vditor";
import { Browser } from "@wailsio/runtime";
import "./index.less";
import { UploadImage } from "../../../bindings/api/services/taskextend";

function MarkdownEditor(props: any) {
  const { value, onChange, className } = props;

  const [vd, setVd] = useState<Vditor>();

  useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue(value);
        setVd(vditor);
      },
      mode: "ir",
      height: "100%",
      link: {
        // 关闭 Vditor 默认 window.open，改由下方捕获监听处理 cmd/ctrl+click
        isOpen: false,
      },
      upload: {
        accept: 'image/*',
        async handler(files) {
          try {
            const file = files[0];

            if (!file.type.startsWith('image/')) {
              return '只支持图片类型'
            }

            const buffer = await file.arrayBuffer();

            const bytes = new Uint8Array(buffer);

            const url = await UploadImage(file.name, Array.from(bytes) as any);

            vditor.insertValue(`![${file.name || "image"}](${url})\n`);
          } catch (err) {
            return "图片上传失败" as any;
          }
        },
      },
      toolbar: [
        "emoji",
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "insert-before",
        "insert-after",
        "|",
        "upload",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "fullscreen",
        "edit-mode",
        {
          name: "more",
          toolbar: [
            "both",
            "code-theme",
            "content-theme",
            "outline",
            "preview",
            "devtools",
          ],
        },
      ],
      input: (value) => {
        onChange?.(value)
      }
    });

    // 捕获阶段监听：cmd（mac）/ ctrl（其它平台）+ 点击链接时用系统浏览器打开
    const container = document.getElementById("vditor");
    const onCmdClick = (e: MouseEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      let url: string | null = null;

      // WYSIWYG / 预览模式：<a href>
      const a = target.closest("a");
      if (a) {
        url = a.getAttribute("href");
      } else {
        // IR 模式：<span data-type="a"> 包裹 .vditor-ir__marker--link
        const node = target.closest('[data-type="a"]');
        const marker = node?.querySelector(".vditor-ir__marker--link");
        if (marker) {
          url = marker.textContent;
        }
      }

      // 只处理绝对 http(s) 链接，避免误打开相对锚点
      if (url && /^https?:\/\//i.test(url)) {
        e.preventDefault();
        e.stopPropagation(); // 阻止 Vditor 自身冒泡阶段的 click 处理
        Browser.OpenURL(url);
      }
    };
    container?.addEventListener("click", onCmdClick, true);

    return () => {
      container?.removeEventListener("click", onCmdClick, true);
      vd?.destroy();
      setVd(undefined);
    };
  }, []);

  return (
    <div
      id="vditor"
      className={classNames("vditor", "markdown-editor", className)}
    ></div>
  );
}

export default MarkdownEditor;
