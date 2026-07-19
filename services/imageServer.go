package services

import (
	"net/http"
	"strings"

	"api/utils"
)

// ImageHTTPPath 是前端访问图片的 URL 前缀（相对路径，由 webview 以当前页面 origin 解析）
const ImageHTTPPath = "/images/"

// imageFolder 返回图片存放目录，目录不存在时自动创建
func imageFolder() string {
	folder, err := utils.GetDataFolder("images")
	if err != nil {
		return ""
	}
	return folder
}

// ImageAssetsHandler 返回一个 http.Handler，用于对外服务已保存的图片。
// 供 Wails AssetServer 中间件转发 /images/ 请求使用。
func ImageAssetsHandler() http.Handler {
	return http.StripPrefix(ImageHTTPPath, http.FileServer(http.Dir(imageFolder())))
}

// ImageMiddleware 是 Wails AssetServer 中间件：拦截 /images/ 路径并返回本地图片，
// 其余请求交回默认（嵌入资源）处理链。直接使用 Wails 提供的 AssetOptions.Middleware API。
func ImageMiddleware(next http.Handler) http.Handler {
	images := ImageAssetsHandler()
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, ImageHTTPPath) {
			images.ServeHTTP(w, r)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// imageURL 把已保存的文件名拼成前端可加载的 HTTP（相对）地址
func imageURL(filename string) string {
	return ImageHTTPPath + filename
}
