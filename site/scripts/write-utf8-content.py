#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Write UI strings and Chinese markdown with guaranteed UTF-8."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "site" / "src"


def w(rel: str, content: str) -> None:
    p = ROOT / rel if not rel.startswith("site/") else ROOT / rel
    if rel.startswith("site/src/"):
        p = SITE / rel.replace("site/src/", "")
    elif "/" in rel and not rel.startswith("reference"):
        p = ROOT / rel
    else:
        p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8", newline="\n")
    print("wrote", p.relative_to(ROOT))


# Home.tsx - read template from stdin in main via heredoc in shell instead
# This script is invoked with paths; for bulk write use shell heredoc below.

if __name__ == "__main__":
    print("Use shell driver to call w()")
