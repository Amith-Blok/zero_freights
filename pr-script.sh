#!/bin/bash

GIT_FLAG=false

while getopts "g" opt; do
  case $opt in
    g)
      GIT_FLAG=true
      ;;
    *)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

shift $((OPTIND - 1))

if [ "$#" -ne 2 ]; then
  echo "Usage: ./pipeline.sh [-g] <PR_TITLE> <PR_BODY>"
  exit 1
fi

PR_TITLE=$1
PR_BODY=$2

if [ "$GIT_FLAG" = true ]; then
  echo "Running git commands..."
  git add .
  if ! git commit -m "$PR_TITLE"; then
    echo "Git commit failed. Aborting pipeline."
    exit 1
  fi
  if ! git push; then
    echo "Git push failed. Aborting pipeline."
    exit 1
  fi
fi

echo "Running lint..."
if ! npx lint-staged; then
  echo "Linting failed. Aborting pipeline."
  exit 1
fi

echo "Running build..."
if ! yarn build; then
  echo "Build failed. Aborting pipeline."
  exit 1
fi

echo "Creating GitHub PR..."
if ! gh pr new --title "$PR_TITLE" --body "$PR_BODY"; then
  echo "Failed to create GitHub PR."
  exit 1
fi

echo "Pipeline completed successfully."
