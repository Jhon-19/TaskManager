import dayjs from "dayjs";
import styles from "./index.module.less";
import { Flex } from "antd";
import { useTaskExtendContext } from "../../contexts/TaskExtendContext";
import classNames from "classnames";

const groupDateByMonth = (dateList: string[]) => {
  if (!Array.isArray(dateList)) return { order: [], groups: {} };

  // 用 order 数组显式记录月份出现顺序，避免 Object.keys 对数字字符串键
  // （如 "202610"）按数值升序重排，导致月份与 dateList 顺序不一致。
  const order: string[] = [];
  const groups: Record<string, { date: string; day: string }[]> = {};

  dateList.forEach((date: string) => {
    const dateObj = dayjs(date, "YYYYMMDD");
    const yearMonth = dateObj.format("YYYYMM");
    const day = dateObj.format("DD");

    if (!groups[yearMonth]) {
      groups[yearMonth] = [];
      order.push(yearMonth);
    }

    groups[yearMonth].push({ date, day });
  });

  return { order, groups };
};

function NavList(props: any) {
  const { dateList } = props;

  const { selectedDate, setSelectedDate } = useTaskExtendContext();

  const { order, groups: dateGroup } = groupDateByMonth(dateList);

  return (
    <div>
      {order.map((yearMonth: string) => {
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
