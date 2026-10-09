#!/bin/zsh
cd -- "${0:A:h}"
if curl -fsS http://127.0.0.1:4173/ >/dev/null 2>&1; then
  open 'http://127.0.0.1:4173'
else
  (sleep 1; open 'http://127.0.0.1:4173') &
  python3 -m http.server 4173 --bind 127.0.0.1 --directory .
fi
