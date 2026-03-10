#!/usr/bin/env bash
set -euo pipefail

# اسم الصورة
IMAGE_NAME="excalidraw-frontend"

# جلب اسم الفرع الحالي
BRANCH_NAME="$(git rev-parse --abbrev-ref HEAD)"

# تنظيف اسم الفرع ليكون صالحًا كـ Docker tag
# مثال:
# feature/test-1  --> feature-test-1
BRANCH_TAG="$(echo "$BRANCH_NAME" | tr '[:upper:]' '[:lower:]' | sed 's#[^a-zA-Z0-9_.-]#-#g')"

# تنفيذ البناء
echo "Building Docker image..."
echo "Branch: $BRANCH_NAME"
echo "Tag: $BRANCH_TAG"

docker build -t "${IMAGE_NAME}:${BRANCH_TAG}" .

echo "Done: ${IMAGE_NAME}:${BRANCH_TAG}"
