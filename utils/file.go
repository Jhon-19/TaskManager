package utils

import (
	"os"
	"path/filepath"

	"github.com/adrg/xdg"
)

func getDataHome() (string, error) {
	appDir := filepath.Join(xdg.DataHome, "TaskExtend")

	if !DirExists(appDir) {
		err := os.Mkdir(appDir, 0755)
		if err != nil {
			return "", err
		}
	}

	return appDir, nil
}

func GetDataFolder(folderName string) (string, error) {
	dataHome, err := getDataHome()
	folderPath := filepath.Join(dataHome, folderName)

	if !DirExists(folderPath) {
		err = os.Mkdir(folderPath, 0755)
	}

	if err != nil {
		return "", err
	}

	return folderPath, nil
}

func DirExists(path string) bool {
	info, err := os.Stat(path)
	if err != nil {
		return false
	}
	return info.IsDir()
}
