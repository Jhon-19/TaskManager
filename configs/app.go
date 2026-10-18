package configs

import "github.com/wailsapp/wails/v3/pkg/application"

type CustomApp struct {
	App                  *application.App
	mainWindow           *application.WebviewWindow
	settingWindow        *application.WebviewWindow
	settingWindowOptions application.WebviewWindowOptions
}

func (a *CustomApp) ShowSettingWindow() {
	window, exists := a.App.Window.GetByName("setting")
	if exists {
		window.Show()
		window.Focus()
		return
	}

	settingWindow := a.App.Window.NewWithOptions(a.settingWindowOptions)
	a.SetSettingWindow(settingWindow)
	settingWindow.Show()
	settingWindow.Focus()
}

func (a *CustomApp) SetMainWindow(mainWindow *application.WebviewWindow) {
	a.mainWindow = mainWindow
}

func (a *CustomApp) SetSettingWindow(settingWindow *application.WebviewWindow) {
	a.settingWindow = settingWindow
}

func (a *CustomApp) SetSettingOptions(settingOptions application.WebviewWindowOptions) {
	a.settingWindowOptions = settingOptions
}
