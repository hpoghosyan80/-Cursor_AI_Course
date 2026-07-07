#!/usr/bin/env python3
"""Aggregate QA tool reports into a single JSON summary and HTML dashboard."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

MODULE_ROOT = Path(__file__).resolve().parent.parent.parent
REPORTS_DIR = MODULE_ROOT / "qa" / "reports"
CONFIG_PATH = MODULE_ROOT / "qa" / "config" / "qa.config.json"


def load_json(path: Path) -> dict | list | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def load_config() -> dict:
    data = load_json(CONFIG_PATH)
    return data if isinstance(data, dict) else {}


def parse_pytest(path: Path) -> dict:
    data = load_json(path)
    if not data or data.get("skipped"):
        return {"status": "skipped", "source": path.name}

    summary = data.get("summary", {})
    total = summary.get("total", 0)
    passed = summary.get("passed", 0)
    failed = summary.get("failed", 0)
    return {
        "status": "pass" if failed == 0 and total > 0 else "fail",
        "total": total,
        "passed": passed,
        "failed": failed,
        "pass_rate": round(passed / total, 3) if total else 0,
        "source": path.name,
    }


def parse_jest(path: Path) -> dict:
    data = load_json(path)
    if not data:
        return {"status": "skipped", "source": path.name}

    if data.get("skipped"):
        return {"status": "skipped", "reason": data.get("reason", "unknown")}

    num_passed = data.get("numPassedTests", 0)
    num_failed = data.get("numFailedTests", 0)
    total = num_passed + num_failed
    return {
        "status": "pass" if num_failed == 0 and total > 0 else "fail",
        "total": total,
        "passed": num_passed,
        "failed": num_failed,
        "pass_rate": round(num_passed / total, 3) if total else 0,
        "source": path.name,
    }


def parse_eslint(path: Path) -> dict:
    data = load_json(path)
    if not data:
        return {"status": "skipped", "source": path.name}

    if isinstance(data, dict) and data.get("skipped"):
        return {"status": "skipped", "reason": data.get("reason")}

    if not isinstance(data, list):
        return {"status": "skipped", "source": path.name}

    errors = sum(f.get("errorCount", 0) for f in data)
    warnings = sum(f.get("warningCount", 0) for f in data)
    return {
        "status": "pass" if errors == 0 else "fail",
        "errors": errors,
        "warnings": warnings,
        "files": len(data),
        "source": path.name,
    }


def parse_pylint(path: Path) -> dict:
    data = load_json(path)
    if not data:
        return {"status": "skipped", "source": path.name}

    if isinstance(data, dict) and data.get("skipped"):
        return {"status": "skipped"}

    if not isinstance(data, list):
        return {"status": "skipped", "source": path.name}

    by_type: dict[str, int] = {}
    for item in data:
        msg_type = item.get("type", "unknown")
        by_type[msg_type] = by_type.get(msg_type, 0) + 1

    score = None
    log_path = REPORTS_DIR / "pylint.log"
    if log_path.exists():
        match = re.search(r"rated at ([\d.]+)/10", log_path.read_text(encoding="utf-8"))
        if match:
            score = float(match.group(1))

    return {
        "status": "pass" if (score or 0) >= 8.0 else "warn",
        "score": score,
        "issues": len(data),
        "by_type": by_type,
        "source": path.name,
    }


def parse_snyk(path: Path) -> dict:
    data = load_json(path)
    if not data:
        return {"status": "skipped", "source": path.name}

    if data.get("skipped"):
        return {"status": "skipped", "reason": data.get("reason")}

    vulns = data.get("vulnerabilities", 0)
    return {
        "status": "pass" if vulns == 0 else "warn",
        "vulnerabilities": vulns,
        "scans": data.get("scans", []),
        "source": path.name,
    }


def parse_zap(path: Path) -> dict:
    data = load_json(path)
    if not data:
        return {"status": "skipped", "source": path.name}

    if data.get("skipped"):
        return {"status": "skipped", "reason": data.get("reason")}

    alerts = data.get("site", [{}])
    high = medium = low = 0
    if alerts and isinstance(alerts, list):
        for site in alerts:
            for alert in site.get("alerts", []):
                risk = alert.get("riskcode", "0")
                if risk in ("3", 3):
                    high += 1
                elif risk in ("2", 2):
                    medium += 1
                else:
                    low += 1

    return {
        "status": "pass" if high == 0 else "warn",
        "high": high,
        "medium": medium,
        "low": low,
        "source": path.name,
    }


def parse_lighthouse(path: Path) -> dict:
    data = load_json(path)
    if not data:
        return {"status": "skipped", "source": path.name}

    if data.get("skipped"):
        return {"status": "skipped", "reason": data.get("reason")}

    categories = data.get("categories", {})
    scores = {}
    for name, cat in categories.items():
        scores[name] = round((cat.get("score") or 0) * 100)

    perf = scores.get("performance", 0)
    return {
        "status": "pass" if perf >= 80 else "warn",
        "scores": scores,
        "source": path.name,
    }


def parse_k6(path: Path) -> dict:
    data = load_json(path)
    if not data:
        return {"status": "skipped", "source": path.name}

    if data.get("skipped"):
        return {"status": "skipped", "reason": data.get("reason")}

    metrics = data.get("metrics", {})
    p95 = metrics.get("http_req_duration", {}).get("values", {}).get("p(95)", 0)
    error_rate = metrics.get("errors", {}).get("values", {}).get("rate", 0)

    return {
        "status": "pass" if p95 < 500 and error_rate < 0.01 else "warn",
        "p95_ms": round(p95, 2),
        "error_rate": round(error_rate, 4),
        "source": path.name,
    }


def parse_playwright(path: Path) -> dict:
    data = load_json(path)
    if not data:
        return {"status": "skipped", "source": path.name}

    if data.get("skipped"):
        return {"status": "skipped", "reason": data.get("reason")}

    stats = data.get("stats", {})
    passed = stats.get("expected", 0)
    failed = stats.get("unexpected", 0) + stats.get("flaky", 0)
    skipped = stats.get("skipped", 0)
    total = passed + failed + skipped

    return {
        "status": "pass" if failed == 0 and passed > 0 else "fail" if failed else "skipped",
        "total": total,
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "pass_rate": round(passed / total, 3) if total else 0,
        "duration_ms": stats.get("duration", 0),
        "source": path.name,
    }


def chart_data(summary: dict) -> dict:
    """Extract numeric series for dashboard charts."""
    testing = summary.get("categories", {}).get("testing", {})
    security = summary.get("categories", {}).get("security", {})
    performance = summary.get("categories", {}).get("performance", {})
    quality = summary.get("categories", {}).get("code_quality", {})

    test_labels = []
    test_passed = []
    test_failed = []
    for name, data in testing.items():
        if data.get("status") != "skipped" and data.get("total"):
            test_labels.append(name.replace("_", " "))
            test_passed.append(data.get("passed", 0))
            test_failed.append(data.get("failed", 0))

    zap = security.get("zap", {})
    snyk = security.get("snyk", {})

    lighthouse = performance.get("lighthouse", {})
    lh_scores = lighthouse.get("scores", {})

    pylint = quality.get("pylint", {})
    pylint_types = pylint.get("by_type", {})

    k6 = performance.get("k6", {})

    return {
        "test_labels": test_labels,
        "test_passed": test_passed,
        "test_failed": test_failed,
        "security_labels": ["Snyk vulns", "ZAP high", "ZAP medium", "ZAP low"],
        "security_values": [
            snyk.get("vulnerabilities", 0) if snyk.get("status") != "skipped" else 0,
            zap.get("high", 0) if zap.get("status") != "skipped" else 0,
            zap.get("medium", 0) if zap.get("status") != "skipped" else 0,
            zap.get("low", 0) if zap.get("status") != "skipped" else 0,
        ],
        "lighthouse_labels": list(lh_scores.keys()),
        "lighthouse_values": list(lh_scores.values()),
        "pylint_labels": list(pylint_types.keys()),
        "pylint_values": list(pylint_types.values()),
        "k6_p95": k6.get("p95_ms", 0),
        "pylint_score": pylint.get("score", 0),
        "eslint_errors": quality.get("eslint", {}).get("errors", 0),
    }


def build_summary() -> dict:
    config = load_config()
    thresholds = config.get("thresholds", {})

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "thresholds": thresholds,
        "categories": {
            "testing": {
                "playwright_pom": parse_playwright(REPORTS_DIR / "playwright-results.json"),
                "pytest_module8": parse_pytest(REPORTS_DIR / "pytest-module8.json"),
                "pytest_module7": parse_pytest(REPORTS_DIR / "pytest-module7.json"),
                "jest": parse_jest(REPORTS_DIR / "jest-results.json"),
            },
            "code_quality": {
                "eslint": parse_eslint(REPORTS_DIR / "eslint-results.json"),
                "pylint": parse_pylint(REPORTS_DIR / "pylint-results.json"),
            },
            "security": {
                "snyk": parse_snyk(REPORTS_DIR / "snyk-results.json"),
                "zap": parse_zap(REPORTS_DIR / "zap-results.json"),
            },
            "performance": {
                "lighthouse": parse_lighthouse(REPORTS_DIR / "lighthouse-results.json"),
                "k6": parse_k6(REPORTS_DIR / "k6-summary.json"),
            },
        },
    }

    statuses = []
    for group in summary["categories"].values():
        for result in group.values():
            if result.get("status") != "skipped":
                statuses.append(result.get("status"))

    if not statuses:
        summary["overall"] = "unknown"
    elif any(s == "fail" for s in statuses):
        summary["overall"] = "fail"
    elif any(s == "warn" for s in statuses):
        summary["overall"] = "warn"
    else:
        summary["overall"] = "pass"

    return summary


def status_badge(status: str) -> str:
    colors = {"pass": "#22c55e", "fail": "#ef4444", "warn": "#f59e0b", "skipped": "#94a3b8"}
    color = colors.get(status, "#64748b")
    return f'<span class="badge" style="background:{color}">{status.upper()}</span>'


def render_card(title: str, data: dict) -> str:
    status = data.get("status", "unknown")
    rows = "".join(
        f"<tr><td>{k}</td><td>{v}</td></tr>"
        for k, v in data.items()
        if k not in ("status", "source")
    )
    return f"""
    <div class="card">
      <h3>{title} {status_badge(status)}</h3>
      <table>{rows}</table>
      <small>Source: {data.get('source', 'n/a')}</small>
    </div>
    """


def render_html(summary: dict) -> str:
    overall = summary.get("overall", "unknown")
    charts = chart_data(summary)
    cards = []
    for group_name, group in summary["categories"].items():
        for tool_name, data in group.items():
            cards.append(render_card(f"{group_name.replace('_', ' ').title()} — {tool_name}", data))

    charts_json = json.dumps(charts)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QA Quality Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {{ font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; }}
    body {{ margin: 0; padding: 2rem; max-width: 1400px; margin-inline: auto; }}
    h1 {{ margin-bottom: 0.25rem; }}
    h2 {{ margin-top: 2rem; color: #94a3b8; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }}
    .overall {{ font-size: 1.25rem; margin-bottom: 1.5rem; }}
    .metrics {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }}
    .metric {{ background: #1e293b; border-radius: 12px; padding: 1rem; border: 1px solid #334155; text-align: center; }}
    .metric .value {{ font-size: 2rem; font-weight: 700; color: #38bdf8; }}
    .metric .label {{ font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem; }}
    .charts {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1rem; margin-bottom: 2rem; }}
    .chart-card {{ background: #1e293b; border-radius: 12px; padding: 1rem; border: 1px solid #334155; }}
    .chart-card canvas {{ max-height: 260px; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }}
    .card {{ background: #1e293b; border-radius: 12px; padding: 1rem 1.25rem; border: 1px solid #334155; }}
    .card h3 {{ margin: 0 0 0.75rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; }}
    .badge {{ padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; color: #0f172a; font-weight: 700; }}
    table {{ width: 100%; border-collapse: collapse; font-size: 0.85rem; }}
    td {{ padding: 0.25rem 0; border-bottom: 1px solid #334155; }}
    td:first-child {{ color: #94a3b8; width: 45%; }}
    small {{ color: #64748b; }}
    a {{ color: #38bdf8; }}
    .nav {{ margin-bottom: 1.5rem; }}
    .nav a {{ margin-right: 1.5rem; }}
  </style>
</head>
<body>
  <h1>QA Quality Dashboard</h1>
  <p class="overall">Overall: {status_badge(overall)} &nbsp; Generated: {summary.get('generated_at', '')}</p>
  <div class="nav">
    <a href="QA_REPORT.html">Full QA Report</a>
    <a href="recommendations.md">Improvement Recommendations</a>
    <a href="qa-summary.json">JSON Summary</a>
  </div>

  <h2>Key Metrics</h2>
  <div class="metrics">
    <div class="metric"><div class="value">{charts['pylint_score'] or '—'}</div><div class="label">Pylint Score /10</div></div>
    <div class="metric"><div class="value">{charts['eslint_errors']}</div><div class="label">ESLint Errors</div></div>
    <div class="metric"><div class="value">{charts['k6_p95'] or '—'}<span style="font-size:1rem">ms</span></div><div class="label">k6 p95 Latency</div></div>
    <div class="metric"><div class="value">{sum(charts['security_values'])}</div><div class="label">Security Findings</div></div>
  </div>

  <h2>Metrics Visualization</h2>
  <div class="charts">
    <div class="chart-card"><canvas id="testChart"></canvas></div>
    <div class="chart-card"><canvas id="lighthouseChart"></canvas></div>
    <div class="chart-card"><canvas id="securityChart"></canvas></div>
    <div class="chart-card"><canvas id="pylintChart"></canvas></div>
  </div>

  <h2>Tool Results</h2>
  <div class="grid">
    {''.join(cards)}
  </div>

  <script>
    const data = {charts_json};
    const chartDefaults = {{ color: '#94a3b8', borderColor: '#334155' }};
    Chart.defaults.color = chartDefaults.color;

    new Chart(document.getElementById('testChart'), {{
      type: 'bar',
      data: {{
        labels: data.test_labels,
        datasets: [
          {{ label: 'Passed', data: data.test_passed, backgroundColor: '#22c55e' }},
          {{ label: 'Failed', data: data.test_failed, backgroundColor: '#ef4444' }},
        ],
      }},
      options: {{
        responsive: true,
        plugins: {{ title: {{ display: true, text: 'Test Results by Suite', color: '#e2e8f0' }} }},
        scales: {{ x: {{ stacked: true }}, y: {{ stacked: true, beginAtZero: true }} }},
      }},
    }});

    if (data.lighthouse_labels.length) {{
      new Chart(document.getElementById('lighthouseChart'), {{
        type: 'radar',
        data: {{
          labels: data.lighthouse_labels,
          datasets: [{{ label: 'Lighthouse', data: data.lighthouse_values, backgroundColor: 'rgba(56,189,248,0.2)', borderColor: '#38bdf8' }}],
        }},
        options: {{ plugins: {{ title: {{ display: true, text: 'Lighthouse Scores', color: '#e2e8f0' }} }}, scales: {{ r: {{ min: 0, max: 100 }} }} }},
      }});
    }}

    new Chart(document.getElementById('securityChart'), {{
      type: 'bar',
      data: {{
        labels: data.security_labels,
        datasets: [{{ label: 'Count', data: data.security_values, backgroundColor: ['#ef4444','#f59e0b','#eab308','#94a3b8'] }}],
      }},
      options: {{ plugins: {{ title: {{ display: true, text: 'Security Findings', color: '#e2e8f0' }} }}, scales: {{ y: {{ beginAtZero: true }} }} }},
    }});

    if (data.pylint_labels.length) {{
      new Chart(document.getElementById('pylintChart'), {{
        type: 'doughnut',
        data: {{
          labels: data.pylint_labels,
          datasets: [{{ data: data.pylint_values, backgroundColor: ['#f59e0b','#38bdf8','#a78bfa','#94a3b8'] }}],
        }},
        options: {{ plugins: {{ title: {{ display: true, text: 'Pylint Issues by Type', color: '#e2e8f0' }} }} }},
      }});
    }}
  </script>
</body>
</html>
"""


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    summary = build_summary()

    (REPORTS_DIR / "qa-summary.json").write_text(
        json.dumps(summary, indent=2), encoding="utf-8"
    )
    (REPORTS_DIR / "dashboard.html").write_text(render_html(summary), encoding="utf-8")
    print(f"Dashboard written to {REPORTS_DIR / 'dashboard.html'}")


if __name__ == "__main__":
    main()
