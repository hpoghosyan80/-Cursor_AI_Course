#!/usr/bin/env python3
"""Run profile-management unittest suites (excludes tests/api)."""

import sys
import unittest
from pathlib import Path

MODULE_ROOT = Path(__file__).resolve().parent
if str(MODULE_ROOT) not in sys.path:
    sys.path.insert(0, str(MODULE_ROOT))

SUITE_DIRS = ["positive", "negative", "edge", "security"]


def main() -> int:
    loader = unittest.defaultTestLoader
    suite = unittest.TestSuite()
    for name in SUITE_DIRS:
        discovered = loader.discover(
            start_dir=str(MODULE_ROOT / "tests" / name),
            pattern="test_*.py",
            top_level_dir=str(MODULE_ROOT),
        )
        suite.addTests(discovered)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
