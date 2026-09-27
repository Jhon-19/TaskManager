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
info "请输入发布信息："

VERSION=""
while true; do
    read -r -p "  版本号 (如 v0.1.0): " VERSION
    VERSION="${VERSION// /}"  # 去除首尾空白
    [ -n "$VERSION" ] && break
    warn "版本号不能为空。"
done

if [ -n "${RELEASE_NOTES:-}" ]; then
    NOTES="$RELEASE_NOTES"
    info "使用环境变量 RELEASE_NOTES 作为发布说明。"
else
    read -r -p "  发布说明 (可留空): " NOTES
    NOTES="${NOTES:-Release ${VERSION}}"
fi

info "版本号 : ${VERSION}"
info "说明   : ${NOTES}"
printf "确认发布？[y/N] "
read -r CONFIRM
[ "$CONFIRM" = "y" ] || [ "$CONFIRM" = "Y" ] || die "已取消。"

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
info "创建 GitHub Release ${VERSION}..."
gh release create "$VERSION" \
    --title "$VERSION" \
    --notes "$NOTES" \
    SHA256SUMS "$ZIP_NAME"

ok "发布完成：${VERSION}"
