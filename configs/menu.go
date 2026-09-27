package configs

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/updater"
	"github.com/wailsapp/wails/v3/pkg/updater/providers/github"
)

const currentVersion = "1.0.0"

var gh, _ = github.New(github.Config{
	Repository:    "Jhon-19/TaskManager",
	ChecksumAsset: "SHA256SUMS",
	HTTPClient: &http.Client{
		Timeout: 10 * time.Minute,
	},
})

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
