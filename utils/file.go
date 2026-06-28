package utils

import (
	"os"
	"path/filepath"

	"github.com/adrg/xdg"
)

func getDataHome() string {
	appDir := filepath.Join(xdg.DataHome, "TaskExtend")

	err := os.Mkdir(appDir, 0755)

	if err != nil {
		panic(err)
	}

	return appDir
}

func GetDataFolder(folderName string) string {
	dataHome := getDataHome()
	folderPath := filepath.Join(dataHome, folderName)

	err := os.Mkdir(folderPath, 0755)

	if err != nil {
		panic(err)
	}

	return folderPath
}
