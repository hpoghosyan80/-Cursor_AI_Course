#!/usr/bin/env python3
"""Discover and run Module 8 unittest suites (profile + REST API)."""

import sys
import unittest
from pathlib import Path

MODULE_ROOT = Path(__file__).resolve().parent
if str(MODULE_ROOT) not in sys.path:
    sys.path.insert(0, str(MODULE_ROOT))


def main() -> int:
    suite = unittest.defaultTestLoader.discover(
        start_dir=str(MODULE_ROOT / "tests"),
        pattern="test_*.py",
        top_level_dir=str(MODULE_ROOT),
    )
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
