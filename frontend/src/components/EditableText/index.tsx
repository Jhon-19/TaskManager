import { useEffect, useRef, useState } from "react";
import "./index.less";
import { Button, Flex, Input } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import classNames from "classnames";

function EditableText(props: any) {
  const { className, value, onChange, editable = true } = props;

  const [isEditing, setIsEditing] = useState(false);
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
            onPressEnter={save}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
          />
          <Button onClick={save} type="text" icon={<CheckOutlined />} />
          <Button onClick={cancel} type="text" icon={<CloseOutlined />} />
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
