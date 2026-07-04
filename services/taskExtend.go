package services

import (
	"api/utils"
	"fmt"
	"os"
	"path/filepath"
)

type TaskExtend struct{}

// CreateDateTask 根据日期创建任务目录
// date: yyyymmdd 形式的日期字符串，如 "20260704"
func (t *TaskExtend) CreateDateTask(date string) error {
	taskExtendFolder, err := utils.GetDataFolder("date-tasks")
	dateFolder := filepath.Join(taskExtendFolder, date)

	if err = os.Mkdir(dateFolder, 0755); err != nil {
		fmt.Printf("创建日期目录失败: %v", err)
		return err
	}

	return nil
}

func (t *TaskExtend) GetDateList(pageNum int, pageSize int) ([]string, error) {
	taskExtendFolder, err := utils.GetDataFolder("date-tasks")

	entries, err := os.ReadDir(taskExtendFolder)

	if err != nil {
		return []string{}, err
	}

	dateList := make([]string, 0, pageSize)

	for index, entry := range entries {
		if entry.IsDir() {
			if index >= pageNum*pageSize && index < (pageNum+1)*pageSize {
				dateList = append(dateList, entry.Name())
			}
			if len(dateList) >= pageSize {
				break
			}
		}
	}

	return dateList, nil
}
