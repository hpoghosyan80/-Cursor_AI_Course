#!/usr/bin/env python3
"""Lightweight API performance test for CI — validates p95 response time < threshold."""

from __future__ import annotations

import json
import statistics
import sys
import time
from pathlib import Path

MODULE_ROOT = Path(__file__).resolve().parent.parent
if str(MODULE_ROOT) not in sys.path:
    sys.path.insert(0, str(MODULE_ROOT))

from src.rest_app import create_rest_app  # noqa: E402

THRESHOLD_MS = 500
REQUESTS = 50
WARMUP = 5


def main() -> int:
    app = create_rest_app()
    client = app.test_client()
    timings: list[float] = []

    for i in range(WARMUP + REQUESTS):
        start = time.perf_counter()
        response = client.get("/api/products")
        elapsed_ms = (time.perf_counter() - start) * 1000
        if response.status_code != 200:
            print(f"Request {i} failed: {response.status_code}")
            return 1
        if i >= WARMUP:
            timings.append(elapsed_ms)

    p50 = statistics.median(timings)
    p95 = statistics.quantiles(timings, n=20)[18]
    p99 = statistics.quantiles(timings, n=100)[98] if len(timings) >= 100 else max(timings)

    report = {
        "requests": REQUESTS,
        "threshold_ms": THRESHOLD_MS,
        "p50_ms": round(p50, 2),
        "p95_ms": round(p95, 2),
        "p99_ms": round(p99, 2),
        "passed": p95 < THRESHOLD_MS,
    }

    out = MODULE_ROOT / "performance-report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))

    if not report["passed"]:
        print(f"FAIL: p95 {p95:.1f}ms exceeds {THRESHOLD_MS}ms threshold")
        return 1
    print("PASS: performance within SLA")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
