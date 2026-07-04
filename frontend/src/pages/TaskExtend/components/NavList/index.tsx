import dayjs from "dayjs";
import styles from "./index.module.less";
import { Flex } from "antd";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import classNames from "classnames";

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

  const { selectedDate, setSelectedDate } = useTaskExtendContext();

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
              <Flex gap={4} vertical={true}>
                {dayList.map((dayInfo: any) => {
                  const { date, day } = dayInfo || {};
                  return (
                    <div
                      key={dayInfo?.date}
                      className={classNames(styles.groupItem, {
                        [styles.selected]: selectedDate === date,
                      })}
                      onClick={() => {
                        setSelectedDate(date);
                      }}
                    >
                      {day || "-"}
                    </div>
                  );
                })}
              </Flex>
            </div>
          );
        })}
    </div>
  );
}

export default NavList;
