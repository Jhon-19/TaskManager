package configs

import "strings"

// currentVersion 由构建时 -ldflags -X 注入（见 Taskfile BUILD_FLAGS），
// 唯一真相源为项目根 VERSION 文件。默认值仅用于未注入时的兜底。
var currentVersion = "0.0.0"

func SetVersion(v string) {
	v = strings.TrimSpace(v)
	if v == "" || currentVersion != "0.0.0" {
		return
	}
	currentVersion = v
}
