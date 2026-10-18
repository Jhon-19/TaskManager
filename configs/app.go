package configs

import "github.com/wailsapp/wails/v3/pkg/application"

type CustomApp struct {
	App           *application.App
	mainWindow    *application.WebviewWindow
	settingWindow *application.WebviewWindow
}

func (a *CustomApp) ShowSettingWindow() {
	if a.settingWindow != nil {
		a.settingWindow.Show()
		a.settingWindow.Focus()
	}
}

func (a *CustomApp) SetMainWindow(mainWindow *application.WebviewWindow) {
	a.mainWindow = mainWindow
}

func (a *CustomApp) SetSettingWindow(settingWindow *application.WebviewWindow) {
	a.settingWindow = settingWindow
}
