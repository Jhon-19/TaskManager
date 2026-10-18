package main

import (
	"embed"
	"log"

	"api/configs"
	"api/services"

	"github.com/wailsapp/wails/v3/pkg/application"
)

// Wails uses Go's `embed` package to embed the frontend files into the binary.
// Any files in the frontend/dist folder will be embedded into the binary and
// made available to the frontend.
// See https://pkg.go.dev/embed for more information.

//go:embed all:frontend/dist
var assets embed.FS

//go:embed VERSION
var versionString string

// main function serves as the application's entry point. It initializes the application, creates a window,
// and starts a goroutine that emits a time-based event every second. It subsequently runs the application and
// logs any error that might occur.
func main() {

	configs.SetVersion(versionString)

	app := &configs.CustomApp{}

	// Create a new Wails application by providing the necessary options.
	// Variables 'Name' and 'Description' are for application metadata.
	// 'Assets' configures the asset server with the 'FS' variable pointing to the frontend files.
	// 'Bind' is a list of Go struct instances. The frontend has access to the methods of these instances.
	// 'Mac' options tailor the application when running an macOS.
	app.App = application.New(application.Options{
		Name:        "TaskManager",
		Description: "A demo of using raw HTML & CSS",
		Services: []application.Service{
			application.NewService(&services.TaskExtend{}),
			application.NewService(&services.TaskConfig{}),
		},
		Assets: application.AssetOptions{
			Handler:    application.AssetFileServerFS(assets),
			Middleware: services.ImageMiddleware,
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	// Create a new window with the necessary options.
	// 'Title' is the title of the window.
	// 'Mac' options tailor the window when running on macOS.
	// 'BackgroundColour' is the background colour of the window.
	// 'URL' is the URL that will be loaded into the webview.
	mainWindow := app.App.Window.NewWithOptions(application.WebviewWindowOptions{
		Name:  "main",
		Title: "Main Window",
		// Window sized to the golden ratio (1000 / 618 ≈ 1.618).
		Width:  1000,
		Height: 618,
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(6, 7, 15),
		URL:              "/",
	})

	settingOptions := application.WebviewWindowOptions{
		Name:  "setting",
		Title: "Setting Window",
		// Window sized to the golden ratio (1000 / 618 ≈ 1.618).
		Width:  720,
		Height: 600,
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(6, 7, 15),
		URL:              "/setting",
		Hidden:           true,
	}
	app.SetSettingOptions(settingOptions)
	settingWindow := app.App.Window.NewWithOptions(settingOptions)

	app.SetMainWindow(mainWindow)
	app.SetSettingWindow(settingWindow)

	configs.InitMenu(app)

	// Run the application. This blocks until the application has been exited.
	err := app.App.Run()

	// If an error occurred while running the application, log it and exit.
	if err != nil {
		log.Fatal(err)
	}
}
