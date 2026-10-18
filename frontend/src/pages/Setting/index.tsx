import ConfigForm from "./components/ConfigForm";
import styles from "./index.module.less";

function Setting(props: any) {
  const {} = props;

  return (
    <div className={styles.settingPage}>
      <div className={styles.settingTitle}>设置</div>
      <ConfigForm />
    </div>
  );
}

export default Setting;
