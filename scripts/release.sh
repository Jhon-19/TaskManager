#!/usr/bin/env bash
# scripts/release.sh
#
# 构建 TaskManager.app，打包为 taskmanager-darwin-arm64.zip，
# 生成 SHA256SUMS，并发布到 GitHub Releases。
#
# 用法：./scripts/release.sh
#   交互式输入版本号（如 v0.1.0）与发布说明（可留空）。
#   也可通过环境变量 RELEASE_NOTES 预置发布说明（支持多行）。

set -euo pipefail

# 项目根目录（脚本位于 <root>/scripts/ 下）。
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_NAME="taskmanager"
BIN_DIR="${ROOT_DIR}/bin"
APP_BUNDLE="${APP_NAME}.app"
ZIP_NAME="${APP_NAME}-darwin-arm64.zip"
ARCH="$(uname -m)"

# ------------------------------------------------------------------
# 颜色输出
# ------------------------------------------------------------------
info()  { printf "\033[1;34m==> %s\033[0m\n" "$*"; }
ok()    { printf "\033[1;32m==> %s\033[0m\n" "$*"; }
warn()  { printf "\033[1;33m!!  %s\033[0m\n" "$*" >&2; }
die()   { printf "\033[1;31m!!  %s\033[0m\n" "$*" >&2; exit 1; }

# ------------------------------------------------------------------
# 前置检查
# ------------------------------------------------------------------
check_cmd() {
    command -v "$1" >/dev/null 2>&1 || die "未找到命令: $1（请先安装后再运行本脚本）"
}

info "前置依赖检查..."
for cmd in wails3 gh zip shasum; do
    check_cmd "$cmd"
done

if [ "$ARCH" != "arm64" ]; then
    warn "当前架构为 $ARCH，本脚本面向 darwin-arm64 打包，产物命名仍为 ${ZIP_NAME}。"
fi

# ------------------------------------------------------------------
# 交互输入
# ------------------------------------------------------------------
# 先读取并显示当前版本号（来自 VERSION 单一真相源）
CURRENT_VER=""
if [ -f "${ROOT_DIR}/VERSION" ]; then
    CURRENT_VER="$(tr -d '[:space:]' < "${ROOT_DIR}/VERSION")"
fi
info "当前版本：v${CURRENT_VER:-（未设置，VERSION 文件不存在）}"

info "请输入发布信息："

VERSION=""
while true; do
    read -r -p "  版本号 (如 0.1.0): " VERSION
    VERSION="${VERSION// /}"  # 去除首尾空白
    [ -n "$VERSION" ] && break
    warn "版本号不能为空。"
done

# 输入省略 v 前缀；内部统一构造带 v 的发布标签
NUMVER="${VERSION#v}"      # 去掉可能的 v 前缀：0.1.0 / v0.1.0 -> 0.1.0
RELEASE_TAG="v${NUMVER}"   # GitHub Release 标签：v0.1.0

if [ -n "${RELEASE_NOTES:-}" ]; then
    NOTES="$RELEASE_NOTES"
    info "使用环境变量 RELEASE_NOTES 作为发布说明。"
else
    read -r -p "  发布说明 (可留空): " NOTES
    NOTES="${NOTES:-Release ${RELEASE_TAG}}"
fi

info "版本号 : ${RELEASE_TAG}"
info "说明   : ${NOTES}"
printf "确认发布？[y/N] "
read -r CONFIRM
[ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ] || die "已取消。"

# ------------------------------------------------------------------
# 写入版本号到 VERSION（单一真相源）并提交推送
#   VERSION 文件是项目唯一的版本号真相源：
#   - Go 运行时版本：go build 时通过 -ldflags -X 注入 configs.currentVersion
#   - 产物 .app 版本：create:app:bundle 时用 PlistBuddy 写入 Info.plist
#   因此发布时只需更新 VERSION 文件并提交，构建链路会自动同步其余位置。
# ------------------------------------------------------------------
info "写入 VERSION 文件 -> ${NUMVER}"
echo "$NUMVER" > "${ROOT_DIR}/VERSION"

cd "$ROOT_DIR"
if [ -n "$(git status --porcelain VERSION)" ]; then
    git add VERSION
    git commit -m "chore: release ${RELEASE_TAG}"
    git push
    ok "版本号已提交并推送：${RELEASE_TAG}"
else
    info "VERSION 未变化（已是 ${NUMVER}），跳过提交。"
fi

# ------------------------------------------------------------------
# 构建 .app
# ------------------------------------------------------------------
info "构建 ${APP_BUNDLE}（wails3 package）..."
cd "$ROOT_DIR"
wails3 package GOOS=darwin

[ -d "${BIN_DIR}/${APP_BUNDLE}" ] || die "构建未生成 ${BIN_DIR}/${APP_BUNDLE}"
ok "构建完成。"

# ------------------------------------------------------------------
# 打包 zip
# ------------------------------------------------------------------
info "打包 ${ZIP_NAME}..."
cd "$BIN_DIR"
rm -f "$ZIP_NAME"
zip -r "$ZIP_NAME" "$APP_BUNDLE" >/dev/null
[ -f "$ZIP_NAME" ] || die "zip 打包失败"
ok "打包完成。"

# ------------------------------------------------------------------
# 生成校验和
# ------------------------------------------------------------------
info "生成 SHA256SUMS..."
shasum -a 256 "$ZIP_NAME" > SHA256SUMS
ok "SHA256SUMS:"
sed 's/^/    /' SHA256SUMS

# ------------------------------------------------------------------
# 发布到 GitHub Releases
# ------------------------------------------------------------------
info "创建 GitHub Release ${RELEASE_TAG}..."
gh release create "$RELEASE_TAG" \
    --title "$RELEASE_TAG" \
    --notes "$NOTES" \
    SHA256SUMS "$ZIP_NAME"

ok "发布完成：${RELEASE_TAG}"
