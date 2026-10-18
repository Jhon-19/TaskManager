import { Button, Form, InputNumber, message, Radio, Switch } from "antd";
import { useEffect, useState } from "react";
import { useTaskConfig } from "../../../../hooks/useTaskConfig";
import styles from "./index.module.less";

const EXTEND_FROM_OPTIONS = [
  { value: "last", label: "上一个有任务的日期" },
  { value: "yesterday", label: "昨天" },
  { value: "none", label: "不继承" },
];

function ConfigForm(props: any) {
  const {} = props;

  const { config, update } = useTaskConfig();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  // 配置加载完成后回填表单
  useEffect(() => {
    if (config) {
      form.setFieldsValue(config);
    }
  }, [config]);

  const onFinish = async (values: any) => {
    setSaving(true);
    try {
      await update({
        extendFrom: values.extendFrom,
        extendOnStart: values.extendOnStart,
        dateListCount: values.dateListCount,
      });
      message.success("保存成功");
    } catch (err: any) {
      message.error(err?.message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form form={form} layout="vertical" disabled={!config} onFinish={onFinish}>
      <Form.Item
        label="日期列表显示个数"
        name="dateListCount"
        extra={
          <span className={styles.hint}>
            左侧日期列表最多展示的日期条数
          </span>
        }
        rules={[
          { required: true, message: "请输入日期列表显示个数" },
          { type: "number", min: 1, message: "至少为 1" },
        ]}
      >
        <InputNumber min={1} max={100} precision={0} style={{ width: 120 }} />
      </Form.Item>
      <Form.Item
        label="继承类型"
        name="extendFrom"
        extra={
          <span className={styles.hint}>
            新建任务日期时默认从哪个日期继承未完成任务
          </span>
        }
      >
        <Radio.Group options={EXTEND_FROM_OPTIONS} />
      </Form.Item>
      <Form.Item
        label="启动时新一天自动继承"
        name="extendOnStart"
        valuePropName="checked"
        extra={
          <span className={styles.hint}>
            应用启动时检测到新的一天将自动创建今日任务并继承
          </span>
        }
      >
        <Switch />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={saving}>
        保存
      </Button>
    </Form>
  );
}

export default ConfigForm;
