package services

import (
	"api/constants"
	"api/utils"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"github.com/google/uuid"
)

type TaskExtend struct{}

// CreateDateTask 根据日期创建任务目录
// date: yyyymmdd 形式的日期字符串，如 "20260704"
func (t *TaskExtend) CreateDateTask(date string) error {
	dateFolder, err := getDateFolderPath(date)

	if err = os.Mkdir(dateFolder, 0755); err != nil {
		return fmt.Errorf("创建日期目录失败: %w", err)
	}

	dataFilePath := filepath.Join(dateFolder, "tasks.json")

	initialData := []constants.TaskGroup{
		{
			ID:    uuid.NewString(),
			Name:  "默认任务组",
			Tasks: []constants.Task{},
		},
	}

	if err = os.WriteFile(dataFilePath, utils.MarshalJSON(initialData), 0644); err != nil {
		return fmt.Errorf("初始化任务文件失败: %w", err)
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

	sort.Slice(dateList, func(i, j int) bool {
		return dateList[i] > dateList[j]
	})

	return dateList, nil
}

func (t *TaskExtend) GetTaskData(date string) ([]constants.TaskGroup, error) {
	dataFilePath, err := getDataFilePath(date)

	if !utils.FileExists(dataFilePath) {
		return []constants.TaskGroup{}, fmt.Errorf("任务数据文件不存在: %s", dataFilePath)
	}

	data, err := os.ReadFile(dataFilePath)

	if err != nil {
		return []constants.TaskGroup{}, err
	}

	var taskGroups []constants.TaskGroup
	err = utils.UnmarshalJSON(data, &taskGroups)

	if err != nil {
		return []constants.TaskGroup{}, err
	}

	return taskGroups, nil
}

func getDateFolderPath(date string) (string, error) {
	taskExtendFolder, err := utils.GetDataFolder("date-tasks")
	dateFolder := filepath.Join(taskExtendFolder, date)
	return dateFolder, err
}

func getDataFilePath(date string) (string, error) {
	taskExtendFolder, err := utils.GetDataFolder("date-tasks")
	dataFilePath := filepath.Join(taskExtendFolder, date, "tasks.json")
	return dataFilePath, err
}

func saveTaskData(taskGroups []constants.TaskGroup, date string) error {
	dataFilePath, err := getDataFilePath(date)

	if err = os.WriteFile(dataFilePath, utils.MarshalJSON(taskGroups), 0644); err != nil {
		return fmt.Errorf("保存任务文件失败: %w", err)
	}

	return nil
}

func (t *TaskExtend) AddTask(date string, taskGroupId string) error {
	taskGroups, err := t.GetTaskData(date)

	if err != nil {
		return fmt.Errorf("获取任务数据失败: %w", err)
	}

	for index, taskGroup := range taskGroups {
		if taskGroup.ID == taskGroupId {
			taskGroups[index].Tasks = append(taskGroup.Tasks, constants.Task{
				ID:          uuid.NewString(),
				Title:       "新任务",
				Detail:      "",
				IsCompleted: false,
			})
			break
		}
	}

	return saveTaskData(taskGroups, date)
}

func updateTaskElement(srcTask *constants.Task, updatedTask constants.UpdateTask) {
	if updatedTask.Title != nil {
		srcTask.Title = *updatedTask.Title
	}
	if updatedTask.Detail != nil {
		srcTask.Detail = *updatedTask.Detail
	}
	if updatedTask.IsCompleted != nil {
		srcTask.IsCompleted = *updatedTask.IsCompleted
	}
}

func (t *TaskExtend) UpdateTask(date string, taskGroupId string, taskId string, updatedTask constants.UpdateTask) error {
	taskGroups, err := t.GetTaskData(date)

	if err != nil {
		return fmt.Errorf("获取任务数据失败: %w", err)
	}

	for groupIndex, taskGroup := range taskGroups {
		if taskGroup.ID == taskGroupId {
			for taskIndex, task := range taskGroup.Tasks {
				if task.ID == taskId {
					updateTaskElement(&taskGroups[groupIndex].Tasks[taskIndex], updatedTask)
					break
				}
			}
			break
		}
	}

	return saveTaskData(taskGroups, date)
}

func (t *TaskExtend) DeleteTask(date string, taskGroupId string, taskId string) error {
	taskGroups, err := t.GetTaskData(date)

	if err != nil {
		return fmt.Errorf("获取任务数据失败: %w", err)
	}

	for groupIndex, taskGroup := range taskGroups {
		if taskGroup.ID == taskGroupId {
			for taskIndex, task := range taskGroup.Tasks {
				if task.ID == taskId {
					taskGroups[groupIndex].Tasks = append(taskGroups[groupIndex].Tasks[:taskIndex], taskGroups[groupIndex].Tasks[taskIndex+1:]...)
					break
				}
			}
			break
		}
	}

	return saveTaskData(taskGroups, date)
}
