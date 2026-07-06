import { useState } from "react";
import "./index.less";
import { Button, Flex, Input } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import classNames from "classnames";

function EditableText(props: any) {
  const { className, value, onChange, editable = true } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [innerValue, setInnerValue] = useState("");

  return (
    <div className={classNames("editable-text", className)}>
      {isEditing ? (
        <Flex gap={4}>
          <Input
            className="editable-text-input"
            value={innerValue}
            onChange={(e) => setInnerValue(e.target.value)}
          />
          <Button
            onClick={() => {
              setIsEditing(false);
              onChange?.(innerValue);
            }}
            type="text"
            icon={<CheckOutlined />}
          />
          <Button
            onClick={() => {
              setIsEditing(false);
              setInnerValue(value);
            }}
            type="text"
            icon={<CloseOutlined />}
          />
        </Flex>
      ) : (
        <Flex>
          <div className="editable-text-value">{value}</div>
          {editable && (
            <Button
              onClick={() => {
                setIsEditing(true);
                setInnerValue(value);
              }}
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
