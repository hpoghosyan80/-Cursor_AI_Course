#!/usr/bin/env python3
"""Generate a comprehensive printable QA report from aggregated results."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from html import escape
from pathlib import Path

MODULE_ROOT = Path(__file__).resolve().parent.parent.parent
REPORTS_DIR = MODULE_ROOT / "qa" / "reports"
SUMMARY_PATH = REPORTS_DIR / "qa-summary.json"
RECOMMENDATIONS_PATH = REPORTS_DIR / "recommendations.md"


def load_json(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def status_color(status: str) -> str:
    return {
        "pass": "#22c55e",
        "fail": "#ef4444",
        "warn": "#f59e0b",
        "skipped": "#94a3b8",
    }.get(status, "#64748b")


def render_section_table(group_name: str, group: dict) -> str:
    rows = []
    for tool, data in group.items():
        status = data.get("status", "unknown")
        details = ", ".join(
            f"{k}: {v}"
            for k, v in data.items()
            if k not in ("status", "source") and not isinstance(v, dict)
        )
        rows.append(
            f"<tr>"
            f"<td>{escape(tool)}</td>"
            f'<td><span class="status" style="background:{status_color(status)}">{status.upper()}</span></td>'
            f"<td>{escape(details)}</td>"
            f"</tr>"
        )
    return f"""
    <section>
      <h2>{escape(group_name.replace('_', ' ').title())}</h2>
      <table>
        <thead><tr><th>Tool</th><th>Status</th><th>Details</th></tr></thead>
        <tbody>{''.join(rows)}</tbody>
      </table>
    </section>
    """


def render_recommendations(md_text: str) -> str:
    if not md_text.strip():
        return "<p>No recommendations generated.</p>"
    lines = []
    for line in md_text.splitlines():
        if line.startswith("# "):
            lines.append(f"<h1>{escape(line[2:])}</h1>")
        elif line.startswith("## "):
            lines.append(f"<h3>{escape(line[3:])}</h3>")
        elif line.startswith("**") and line.endswith("**"):
            lines.append(f"<p><strong>{escape(line.strip('*'))}</strong></p>")
        elif line.strip():
            lines.append(f"<p>{escape(line)}</p>")
    return "\n".join(lines)


def render_report(summary: dict, recommendations_md: str) -> str:
    overall = summary.get("overall", "unknown")
    generated = summary.get("generated_at", datetime.now(timezone.utc).isoformat())
    sections = "".join(
        render_section_table(name, group)
        for name, group in summary.get("categories", {}).items()
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>QA Automation Report</title>
  <style>
    body {{ font-family: Georgia, serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; color: #1e293b; }}
    h1 {{ border-bottom: 2px solid #334155; padding-bottom: 0.5rem; }}
    h2 {{ color: #475569; margin-top: 2rem; }}
    h3 {{ color: #64748b; }}
    table {{ width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }}
    th, td {{ border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; text-align: left; }}
    th {{ background: #f1f5f9; }}
    .status {{ padding: 0.15rem 0.5rem; border-radius: 4px; color: #fff; font-size: 0.75rem; font-weight: bold; }}
    .overall {{ font-size: 1.1rem; margin: 1rem 0; }}
    .meta {{ color: #64748b; font-size: 0.9rem; }}
    .recommendations {{ background: #f8fafc; padding: 1rem 1.5rem; border-radius: 8px; margin-top: 2rem; }}
    @media print {{ body {{ margin: 0; }} }}
  </style>
</head>
<body>
  <h1>QA Automation Report</h1>
  <p class="meta">Project: Cursor AI Course · Generated: {escape(generated)}</p>
  <p class="overall">Overall Status:
    <span class="status" style="background:{status_color(overall)}">{overall.upper()}</span>
  </p>

  <p>This report aggregates results from Playwright POM E2E tests, pytest, Jest,
  ESLint, Pylint, Snyk, OWASP ZAP, Lighthouse, and k6 performance tests.</p>

  {sections}

  <div class="recommendations">
    <h2>Improvement Recommendations</h2>
    {render_recommendations(recommendations_md)}
  </div>

  <p class="meta" style="margin-top:3rem">
    Interactive dashboard: <a href="dashboard.html">dashboard.html</a> ·
  Raw data: <a href="qa-summary.json">qa-summary.json</a>
  </p>
</body>
</html>
"""


def main() -> None:
    summary = load_json(SUMMARY_PATH)
    if not summary:
        print("No qa-summary.json found. Run generate_dashboard.py first.")
        return

    recommendations_md = ""
    if RECOMMENDATIONS_PATH.exists():
        recommendations_md = RECOMMENDATIONS_PATH.read_text(encoding="utf-8")

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_html = render_report(summary, recommendations_md)
    (REPORTS_DIR / "QA_REPORT.html").write_text(report_html, encoding="utf-8")
    print(f"Report written to {REPORTS_DIR / 'QA_REPORT.html'}")


if __name__ == "__main__":
    main()
