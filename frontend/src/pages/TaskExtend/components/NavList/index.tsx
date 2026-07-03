import dayjs from "dayjs";
import styles from './index.module.less';

const groupDateByMonth = (dateList: string[]) => {
  if (!Array.isArray(dateList)) return {};

  const dateGroup = dateList.reduce((acc: any, date: string) => {
    const dateObj = dayjs(date, "YYYYMMDD");
    const yearMonth = dateObj.format("YYYYMM");

    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }

    acc[yearMonth].push({
      date,
      day: dateObj.date(),
    });
  }, {});

  return dateGroup;
};

function NavList(props: any) {
  const { dateList } = props;

  const dateGroup = groupDateByMonth(dateList);

  return (
    <div>
      {Object.keys(dateGroup).map((yearMonth: string) => {
        const dayList = dateGroup[yearMonth];

        if (!Array.isArray(dayList)) return null;

        return (
          <div>
            <div className={styles.groupTitle}>{yearMonth}</div>
            {dayList.map((day: string) => (
              <div  className={styles.groupItem}>{day}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default NavList;
