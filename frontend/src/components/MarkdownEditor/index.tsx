import classNames from "classnames";
import { useEffect, useState } from "react";
import Vditor from "vditor";
import "./index.less";
import { UploadImage } from "../../../bindings/api/services/taskextend";

function MarkdownEditor(props: any) {
  const { value, className } = props;

  const [vd, setVd] = useState<Vditor>();

  useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue(value);
        setVd(vditor);
      },
      mode: "ir",
      height: "100%",
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
    });

    return () => {
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
