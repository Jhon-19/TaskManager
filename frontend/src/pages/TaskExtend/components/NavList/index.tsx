import dayjs from "dayjs";
import styles from "./index.module.less";

const groupDateByMonth = (dateList: string[]) => {
  if (!Array.isArray(dateList)) return {};

  const dateGroup = dateList.reduce((acc: any, date: string) => {
    const dateObj = dayjs(date, "YYYYMMDD");
    const yearMonth = dateObj.format("YYYYMM");
    const day = dateObj.format("DD");

    if (!acc[yearMonth]) {
      acc[yearMonth] = [];
    }

    acc[yearMonth].push({
      date,
      day,
    });
    return acc;
  }, {});

  return dateGroup;
};

function NavList(props: any) {
  const { dateList } = props;

  const dateGroup = groupDateByMonth(dateList);

  return (
    <div>
      {dateGroup &&
        Object.keys(dateGroup).map((yearMonth: string) => {
          const dayList = dateGroup[yearMonth];

          if (!Array.isArray(dayList)) return null;

          return (
            <div key={yearMonth}>
              <div className={styles.groupTitle}>{yearMonth}</div>
              {dayList.map((dayInfo: any) => (
                <div key={dayInfo?.date} className={styles.groupItem}>
                  {dayInfo?.day || '-'}
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
}

export default NavList;
