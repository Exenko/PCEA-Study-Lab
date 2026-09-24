#!/bin/sh
# Start PCEA Study Lab (Mac/Linux). Progress is saved in the profiles folder next to this file.
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is needed to save progress as files. Install it from https://nodejs.org/ and run this again."
  echo "Or open index.html directly to use the app with progress saved in your browser."
  printf "Press Enter to close. "; read -r _
  exit 1
fi
exec node server.js "$@"
