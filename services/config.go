package services

import (
	"api/constants"
	"api/utils"
	"fmt"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v3/pkg/application"
)

type TaskConfig struct{}

func getConfigPath() (string, error) {
	configFolder, err := utils.GetDataFolder("configs")
	configFilePath := filepath.Join(configFolder, "config.json")
	return configFilePath, err
}

func saveConfig(configData constants.TaskConfigData) error {
	configFilePath, err := getConfigPath()
	if err = os.WriteFile(configFilePath, utils.MarshalJSON(configData), 0644); err != nil {
		return fmt.Errorf("保存配置失败: %w", err)
	}
	return nil
}

func (t *TaskConfig) GetConfig() (constants.TaskConfigData, error) {
	configFilePath, err := getConfigPath()

	if err != nil {
		return constants.TaskConfigData{}, err
	}

	if !utils.FileExists(configFilePath) {
		defaultConfig := constants.TaskConfigData{
			ExtendFrom:    "last",
			ExtendOnStart: false,
			DateListCount: 10,
		}
		err = saveConfig(defaultConfig)
		return defaultConfig, err
	}

	data, err := os.ReadFile(configFilePath)

	if err != nil {
		return constants.TaskConfigData{}, fmt.Errorf("获取配置文件失败: %w", err)
	}

	var configData constants.TaskConfigData
	err = utils.UnmarshalJSON(data, &configData)

	if err != nil {
		return constants.TaskConfigData{}, err
	}

	return configData, nil
}

func updateConfigElement(srcConfigData *constants.TaskConfigData, updateConfigData constants.UpdateTaskConfigData) {
	if updateConfigData.DateListCount != nil {
		srcConfigData.DateListCount = *updateConfigData.DateListCount
	}
	if updateConfigData.ExtendFrom != nil {
		srcConfigData.ExtendFrom = *updateConfigData.ExtendFrom
	}
	if updateConfigData.ExtendOnStart != nil {
		srcConfigData.ExtendOnStart = *updateConfigData.ExtendOnStart
	}
}

func (t *TaskConfig) UpdateConfig(updateConfigData constants.UpdateTaskConfigData) error {
	configData, err := t.GetConfig()
	if err != nil {
		return err
	}
	updateConfigElement(&configData, updateConfigData)
	if err = saveConfig(configData); err != nil {
		return err
	}

	application.Get().Event.Emit("task-config:changed")

	return nil
}
