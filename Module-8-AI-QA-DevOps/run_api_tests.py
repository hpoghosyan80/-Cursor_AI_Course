#!/usr/bin/env python3
"""Run REST API unittest suite only."""

import sys
import unittest
from pathlib import Path

MODULE_ROOT = Path(__file__).resolve().parent
if str(MODULE_ROOT) not in sys.path:
    sys.path.insert(0, str(MODULE_ROOT))


def main() -> int:
    suite = unittest.defaultTestLoader.discover(
        start_dir=str(MODULE_ROOT / "tests" / "api"),
        pattern="test_*.py",
        top_level_dir=str(MODULE_ROOT),
    )
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
