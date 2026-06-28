package services

import (
	"api/utils"
	"fmt"
	"os"
	"path/filepath"
)

type TaskExtend struct{}

func (t *TaskExtend) CreateDateTask(date string) error {
	taskExtendFolder := utils.GetDataFolder("date-tasks")
	dateFolder := filepath.Join(taskExtendFolder, date)

	if err := os.Mkdir(dateFolder, 0755); err != nil {
		fmt.Printf("创建日期目录失败: %v", err)
		return err
	}

	return nil
}
