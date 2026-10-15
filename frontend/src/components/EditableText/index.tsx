import { useEffect, useRef, useState } from "react";
import "./index.less";
import { Button, Flex, Input } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import classNames from "classnames";

function EditableText(props: any) {
  const { className, value, onChange, editable = true, defaultEditing = false } = props;

  const [isEditing, setIsEditing] = useState(!!defaultEditing);
  const [innerValue, setInnerValue] = useState("");
  const inputRef = useRef<any>(null);

  const save = () => {
    setIsEditing(false);
    onChange?.(innerValue);
  };

  const cancel = () => {
    setIsEditing(false);
    setInnerValue(value);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const turnOnEditing = () => {
    setIsEditing(true);
    setInnerValue(value);
  };

  return (
    <div className={classNames("editable-text", className)}>
      {isEditing ? (
        <Flex gap={4}>
          <Input
            className="editable-text-input"
            ref={inputRef}
            value={innerValue}
            onChange={(e) => setInnerValue(e.target.value)}
            onPressEnter={(e) => {
              // 中文输入法 composing 期间的回车不应触发保存
              if (e.nativeEvent.isComposing || (e.nativeEvent as any).keyCode === 229) return;
              save();
            }}
            onBlur={() => save()}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
          />
          <Button
            onMouseDown={(e) => e.preventDefault()}
            onClick={save}
            type="text"
            icon={<CheckOutlined />}
          />
          <Button
            onMouseDown={(e) => e.preventDefault()}
            onClick={cancel}
            type="text"
            icon={<CloseOutlined />}
          />
        </Flex>
      ) : (
        <Flex>
          <div className="editable-text-value" onClick={turnOnEditing}>
            {value}
          </div>
          {editable && (
            <Button
              onClick={turnOnEditing}
              type="text"
              icon={<EditOutlined />}
            />
          )}
        </Flex>
      )}
    </div>
  );
}

export default EditableText;
