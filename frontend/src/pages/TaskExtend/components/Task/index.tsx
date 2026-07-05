import EditableText from "../../../../components/EditableText";
import styles from "./index.module.less";

function Task(props: any) {
  const { task } = props;

  const { title } = task || {};

  return (
    <div className={styles.task}>
      <EditableText
        value={title}
        onChange={(newValue) => {
          // Handle the updated value
        }}
      />
    </div>
  );
}

export default Task;
