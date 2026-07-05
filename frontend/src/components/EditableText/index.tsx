import { useState } from "react";
import "./index.less";
import { Button, Flex, Input } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";

function EditableText(props: any) {
  const { value, onChange } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [innerValue, setInnerValue] = useState("");

  return (
    <div className="editable-text">
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
            icon={<CheckOutlined />}
          />
          <Button
            onClick={() => {
              setIsEditing(false);
              setInnerValue(value);
            }}
            icon={<CloseOutlined />}
          />
        </Flex>
      ) : (
        <Flex>
          <div className="editable-text-value">{value}</div>
          <Button
            onClick={() => {
              setIsEditing(true);
              setInnerValue(value);
            }}
            icon={<EditOutlined />}
          />
        </Flex>
      )}
    </div>
  );
}

export default EditableText;
