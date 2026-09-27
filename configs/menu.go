package configs

import (
	"context"
	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/updater"
	"github.com/wailsapp/wails/v3/pkg/updater/providers/github"
)

var gh, _ = github.New(github.Config{Repository: "Jhon-19/TaskManager"})

const currentVersion = "0.0.1"

func InitMenu(app *application.App) {
	if err := app.Updater.Init(updater.Config{
		CurrentVersion: currentVersion,
		Providers:      []updater.Provider{gh},
	}); err != nil {
		log.Fatal(err)
	}
	menu := application.DefaultApplicationMenu().Clone()
	app.Menu.SetApplicationMenu(menu)
	appMenu := menu.AddSubmenu("App")
	appMenu.Add("检查更新").OnClick(func(*application.Context) {
		go func() {
			if err := app.Updater.CheckAndInstall(context.Background()); err != nil {
				log.Fatalf("update error: %v", err)
			}
		}()
	})
}
