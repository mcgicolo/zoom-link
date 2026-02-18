#!/usr/bin/env bash

set -euo pipefail

TEMPLATE_REPO="${TEMPLATE_REPO:-mcgicolo/mcgi-zoom-generator}"
TEMPLATE_BRANCH="${TEMPLATE_BRANCH:-main}"

DEFAULT_LOCALES=(
  "Abucay"
  "Alion"
  "Ariada"
  "Bagac"
  "Balanga"
  "Baseco"
  "Batangas Dos"
  "Bliss"
  "Colo"
  "Culis"
  "Diwa"
  "Dona Orani"
  "General Lim"
  "Gugo"
  "Hermosa"
  "Lamao"
  "Limay"
  "Mariveles"
  "Morong Bayan"
  "Morong Resort"
  "Mt. View"
  "Old San Jose"
  "Orani"
  "Orion"
  "Pilar"
  "Roosevelt"
  "Samal"
  "Tanato"
  "Tucop"
)

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

print_usage() {
  cat <<'EOF'
Usage:
  bash install.sh

Install via one-liner (replace <URL>):
  macOS / Linux:
    curl -fsSL <URL>/install.sh | bash

  Windows (PowerShell):
    irm <URL>/install.ps1 | iex

  Windows (Git Bash):
    curl -fsSL <URL>/install.sh | bash
EOF
}

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

json_escape() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  printf '%s' "$value"
}

join_by() {
  local separator="$1"
  shift
  local items=("$@")
  local output=""
  local i
  for i in "${!items[@]}"; do
    if [[ "$i" -gt 0 ]]; then
      output+="$separator"
    fi
    output+="${items[$i]}"
  done
  printf '%s' "$output"
}

detect_os() {
  local uname_out
  uname_out="$(uname -s)"
  case "$uname_out" in
    Darwin*) printf 'macos' ;;
    Linux*) printf 'linux' ;;
    MINGW*|MSYS*|CYGWIN*) printf 'windows' ;;
    *) printf 'unknown' ;;
  esac
}

run_sudo_cmd() {
  if command_exists sudo; then
    sudo "$@"
  else
    "$@"
  fi
}

install_with_brew() {
  local pkg="$1"
  if ! command_exists brew; then
    return 1
  fi
  brew list "$pkg" >/dev/null 2>&1 || brew install "$pkg"
}

install_on_linux() {
  local pkg="$1"
  if command_exists apt-get; then
    run_sudo_cmd apt-get update
    run_sudo_cmd apt-get install -y "$pkg"
    return
  fi
  if command_exists dnf; then
    run_sudo_cmd dnf install -y "$pkg"
    return
  fi
  if command_exists yum; then
    run_sudo_cmd yum install -y "$pkg"
    return
  fi
  if command_exists pacman; then
    run_sudo_cmd pacman -Sy --noconfirm "$pkg"
    return
  fi
  echo "No supported package manager found to install $pkg. Please install it manually."
  exit 1
}

install_on_windows() {
  local winget_id="$1"
  if command_exists powershell.exe; then
    powershell.exe -NoProfile -Command "winget install --id $winget_id -e --accept-package-agreements --accept-source-agreements" >/dev/null 2>&1 || true
    return
  fi
  echo "Unable to auto-install dependency on Windows. Please install: $winget_id"
  exit 1
}

ensure_git_installed() {
  if command_exists git; then
    return
  fi

  local os="$1"
  echo "Git not found. Installing..."
  case "$os" in
    macos) install_with_brew git || { echo "Install Homebrew or install Git manually."; exit 1; } ;;
    linux) install_on_linux git ;;
    windows) install_on_windows "Git.Git" ;;
    *) echo "Unsupported OS. Please install Git manually."; exit 1 ;;
  esac

  command_exists git || { echo "Git installation failed."; exit 1; }
}

ensure_gh_installed() {
  if command_exists gh; then
    return
  fi

  local os="$1"
  echo "GitHub CLI not found. Installing..."
  case "$os" in
    macos) install_with_brew gh || { echo "Install Homebrew or install gh manually."; exit 1; } ;;
    linux) install_on_linux gh ;;
    windows) install_on_windows "GitHub.cli" ;;
    *) echo "Unsupported OS. Please install GitHub CLI manually."; exit 1 ;;
  esac

  command_exists gh || { echo "GitHub CLI installation failed."; exit 1; }
}

ensure_base_tools() {
  if ! command_exists curl; then
    echo "curl is required but not found."
    exit 1
  fi

  if ! command_exists tar; then
    echo "tar is required but not found."
    exit 1
  fi
}

prompt_required() {
  local label="$1"
  local value=""
  while [[ -z "$value" ]]; do
    printf '%s: ' "$label" >&2
    IFS= read -r value
    value="$(trim "$value")"
  done
  printf '%s' "$value"
}

prompt_secret_required() {
  local label="$1"
  local value=""
  while [[ -z "$value" ]]; do
    printf '%s: ' "$label" >&2
    IFS= read -r -s value
    echo >&2
    value="$(trim "$value")"
  done
  printf '%s' "$value"
}

configure_github_auth() {
  local github_pass="$1"

  if gh auth status >/dev/null 2>&1; then
    return
  fi

  echo "Authenticating GitHub CLI..."
  if printf '%s' "$github_pass" | gh auth login --hostname github.com --git-protocol https --with-token >/dev/null 2>&1; then
    return
  fi

  echo "Token-based login failed. Falling back to browser login..."
  gh auth login --hostname github.com --git-protocol https --web
}

parse_locales() {
  local raw_input="$1"
  local parsed=()

  if [[ -z "$raw_input" ]]; then
    parsed=("${DEFAULT_LOCALES[@]}")
  else
    IFS=',' read -r -a chunks <<< "$raw_input"
    local item trimmed_item
    for item in "${chunks[@]}"; do
      trimmed_item="$(trim "$item")"
      if [[ -n "$trimmed_item" ]]; then
        parsed+=("$trimmed_item")
      fi
    done
  fi

  if [[ "${#parsed[@]}" -eq 0 ]]; then
    parsed=("${DEFAULT_LOCALES[@]}")
  fi

  printf '%s\n' "${parsed[@]}"
}

parse_github_repo_url() {
  local raw_url="$1"
  local cleaned="$raw_url"

  cleaned="${cleaned#https://github.com/}"
  cleaned="${cleaned#http://github.com/}"
  cleaned="${cleaned#git@github.com:}"
  cleaned="${cleaned%/}"
  cleaned="${cleaned%.git}"

  if [[ "$cleaned" != */* || "$cleaned" == */*/* ]]; then
    echo "Invalid GitHub repository URL: $raw_url"
    exit 1
  fi

  local owner repo
  owner="${cleaned%%/*}"
  repo="${cleaned##*/}"

  if [[ -z "$owner" || -z "$repo" ]]; then
    echo "Invalid GitHub repository URL: $raw_url"
    exit 1
  fi

  printf '%s\n%s\n' "$owner" "$repo"
}

build_locale_json() {
  local locales=("$@")
  local output=""
  local i escaped
  for i in "${!locales[@]}"; do
    escaped="$(json_escape "${locales[$i]}")"
    if [[ "$i" -gt 0 ]]; then
      output+=","
    fi
    output+="\"$escaped\""
  done
  printf '%s' "$output"
}

download_template_docs() {
  local destination="$1"

  local temp_dir archive_path repo_basename extract_dir source_docs
  temp_dir="$(mktemp -d)"
  archive_path="$temp_dir/template.tar.gz"
  repo_basename="${TEMPLATE_REPO##*/}"
  extract_dir="$temp_dir/$repo_basename-$TEMPLATE_BRANCH"
  source_docs="$extract_dir/docs"

  cleanup() {
    rm -rf "$temp_dir"
  }
  trap cleanup RETURN

  curl -fsSL "https://codeload.github.com/$TEMPLATE_REPO/tar.gz/refs/heads/$TEMPLATE_BRANCH" -o "$archive_path"
  tar -xzf "$archive_path" -C "$temp_dir"

  if [[ ! -d "$source_docs" ]]; then
    echo "Could not find docs/ in template repository $TEMPLATE_REPO ($TEMPLATE_BRANCH)."
    exit 1
  fi

  mkdir -p "$destination"
  cp -R "$source_docs"/. "$destination"/
}

write_config_json() {
  local target_dir="$1"
  local zoom_id="$2"
  local zoom_pass="$3"
  local worker_name="$4"
  local worker_phone="$5"
  shift 5
  local locales=("$@")
  local locale_json
  locale_json="$(build_locale_json "${locales[@]}")"

  cat > "$target_dir/config.json" <<EOF
{
  "zoom": {
    "meetingId": "$(json_escape "$zoom_id")",
    "password": "$(json_escape "$zoom_pass")"
  },
  "contact": {
    "name": "$(json_escape "$worker_name")",
    "phone": "$(json_escape "$worker_phone")"
  },
  "localeList": [${locale_json}]
}
EOF
}

setup_git_and_push() {
  local repo_owner="$1"
  local repo_name="$2"
  local repo_full_name="$repo_owner/$repo_name"
  local github_email="$3"
  local worker_name="$4"
  local target_dir="$5"

  (
    cd "$target_dir"

    if [[ ! -d .git ]]; then
      git init -b main >/dev/null 2>&1 || {
        git init >/dev/null
        git checkout -b main >/dev/null 2>&1 || true
      }
    fi

    git config user.email "$github_email"
    git config user.name "$worker_name"

    git add .
    if ! git diff --cached --quiet; then
      git commit -m "Initial zoom page setup" >/dev/null
    fi

    if git remote get-url origin >/dev/null 2>&1; then
      git push -f -u origin main
    else
      gh repo create "$repo_full_name" --public --source=. --remote=origin --push
    fi
  )
}

enable_github_pages() {
  local repo_owner="$1"
  local repo_name="$2"
  local repo_full_name="$repo_owner/$repo_name"
  local page_url="https://$repo_owner.github.io/$repo_name/"

  if gh api -X POST "repos/$repo_full_name/pages" -f source[branch]=main -f source[path]=/ >/dev/null 2>&1; then
    :
  else
    gh api -X PUT "repos/$repo_full_name/pages" -f source[branch]=main -f source[path]=/ >/dev/null
  fi

  echo "GitHub Pages has been activated for $repo_full_name."
  echo "You may visit this URL shortly after 1-3 minutes:"
  echo "$page_url"
}

main() {
  if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    print_usage
    exit 0
  fi

  local os
  os="$(detect_os)"

  ensure_base_tools
  ensure_git_installed "$os"
  ensure_gh_installed "$os"

  echo "Fill up the required details:"
  local github_repo_url github_repo_owner github_repo_name github_email github_pass worker_name worker_phone zoom_id zoom_pass locale_input
  github_repo_url="$(prompt_required "GitHub repo URL (example: https://github.com/OWNER/REPO)")"
  mapfile -t parsed_repo < <(parse_github_repo_url "$github_repo_url")
  github_repo_owner="${parsed_repo[0]}"
  github_repo_name="${parsed_repo[1]}"
  github_email="$(prompt_required "GitHub email")"
  github_pass="$(prompt_secret_required "GitHub pass (use Personal Access Token)")"
  worker_name="$(prompt_required "Worker name")"
  worker_phone="$(prompt_required "Worker phone")"
  zoom_id="$(prompt_required "Zoom ID")"
  zoom_pass="$(prompt_secret_required "Zoom Pass")"

  local default_locale_text
  default_locale_text="$(join_by ", " "${DEFAULT_LOCALES[@]}")"
  printf 'Allowed locales (comma-separated, press Enter for default: %s): ' "$default_locale_text" >&2
  IFS= read -r locale_input

  mapfile -t parsed_locales < <(parse_locales "${locale_input:-}")

  local target_dir
  target_dir="$(pwd)/$github_repo_name"

  if [[ -d "$target_dir" ]] && [[ -n "$(ls -A "$target_dir")" ]]; then
    echo "Target directory already exists and is not empty: $target_dir"
    exit 1
  fi

  configure_github_auth "$github_pass"
  download_template_docs "$target_dir"
  write_config_json "$target_dir" "$zoom_id" "$zoom_pass" "$worker_name" "$worker_phone" "${parsed_locales[@]}"
  setup_git_and_push "$github_repo_owner" "$github_repo_name" "$github_email" "$worker_name" "$target_dir"
  enable_github_pages "$github_repo_owner" "$github_repo_name"

  echo "Done. Project created at: $target_dir"
}

main "$@"
