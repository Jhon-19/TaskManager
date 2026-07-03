import { useEffect, useState } from 'react';
import NavList from '../NavList';
import styles from './index.module.less';
import { TaskExtend } from '../../../../../bindings/api/services';

function Layout(props: any) {
  const {children} = props;

  const [dateList, setDateList] = useState<string[]>([])

  useEffect(() => {
    TaskExtend.GetDateList(0, 7).then((_dateList: string[] | null) => {
      setDateList(_dateList || [])
    }).catch((err) => {
      console.log(err)
    })
  }, []);

  return <div className={styles.layout}>
    <div className={styles.leftPanel}>
      <NavList dateList={dateList} />
    </div>
    <div className={styles.rightPanel}>{children}</div>
  </div>;
}

export default Layout;
