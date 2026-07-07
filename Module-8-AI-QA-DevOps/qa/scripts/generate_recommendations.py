#!/usr/bin/env python3
"""Generate AI-style improvement recommendations from aggregated QA reports."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

MODULE_ROOT = Path(__file__).resolve().parent.parent.parent
REPORTS_DIR = MODULE_ROOT / "qa" / "reports"
SUMMARY_PATH = REPORTS_DIR / "qa-summary.json"
CONFIG_PATH = MODULE_ROOT / "qa" / "config" / "qa.config.json"


def load_summary() -> dict:
    if not SUMMARY_PATH.exists():
        return {}
    return json.loads(SUMMARY_PATH.read_text(encoding="utf-8"))


def load_thresholds() -> dict:
    if CONFIG_PATH.exists():
        config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        return config.get("thresholds", {})
    return {}


def priority_emoji(priority: str) -> str:
    return {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(priority, "⚪")


class RecommendationEngine:
    """Rule-based analyzer that produces actionable QA improvement suggestions."""

    def __init__(self, summary: dict, thresholds: dict) -> None:
        self.summary = summary
        self.thresholds = thresholds
        self.recommendations: list[dict] = []

    def add(self, category: str, priority: str, title: str, detail: str, action: str) -> None:
        self.recommendations.append(
            {
                "category": category,
                "priority": priority,
                "title": title,
                "detail": detail,
                "action": action,
            }
        )

    def analyze_testing(self) -> None:
        testing = self.summary.get("categories", {}).get("testing", {})

        for key, label in [("pytest_module8", "Module 8"), ("pytest_module7", "Module 7")]:
            data = testing.get(key, {})
            if data.get("status") == "fail":
                self.add(
                    "Testing",
                    "high",
                    f"Fix failing {label} pytest tests",
                    f"{data.get('failed', 0)} of {data.get('total', 0)} tests failed "
                    f"(pass rate: {data.get('pass_rate', 0):.0%}).",
                    "Run `pytest tests/ -v --tb=short`, fix regressions, and add tests for new code paths.",
                )

        jest = testing.get("jest", {})
        if jest.get("status") == "fail":
            self.add(
                "Testing",
                "high",
                "Fix failing Jest unit tests",
                f"{jest.get('failed', 0)} Jest test(s) failed in Module 6 components.",
                "Run `npm run test:jest:watch` in Module-8 and update component logic or test assertions.",
            )

        playwright = testing.get("playwright_pom", {})
        if playwright.get("status") == "fail":
            self.add(
                "Testing",
                "high",
                "Fix failing Playwright POM E2E tests",
                f"{playwright.get('failed', 0)} of {playwright.get('total', 0)} E2E tests failed.",
                "Run `npm run test:e2e:pom` and update page objects in qa/framework/pages/.",
            )
        elif playwright.get("status") == "skipped":
            self.add(
                "Testing",
                "medium",
                "Run Page Object Model E2E suite",
                "Playwright POM tests did not run or produced no results.",
                "Run `bash qa/scripts/run-e2e-pom.sh` with Module 6 frontend available.",
            )
        elif jest.get("status") == "skipped":
            self.add(
                "Testing",
                "medium",
                "Enable Jest unit test coverage",
                "Jest did not run or produced no results.",
                "Run `npm install && npm run test:jest` in Module-8-AI-QA-DevOps.",
            )

    def analyze_code_quality(self) -> None:
        quality = self.summary.get("categories", {}).get("code_quality", {})
        min_score = self.thresholds.get("pylint_score", 8.0)
        max_errors = self.thresholds.get("eslint_max_errors", 0)

        eslint = quality.get("eslint", {})
        if eslint.get("status") == "fail":
            self.add(
                "Code Quality",
                "medium",
                "Resolve ESLint errors in frontend",
                f"Found {eslint.get('errors', 0)} errors and {eslint.get('warnings', 0)} warnings "
                f"across {eslint.get('files', 0)} files.",
                "Run `npm run lint:eslint:check` and fix issues; enable pre-commit ESLint hook.",
            )

        pylint = quality.get("pylint", {})
        score = pylint.get("score")
        if score is not None and score < min_score:
            self.add(
                "Code Quality",
                "medium",
                "Improve Python code quality (Pylint)",
                f"Pylint score {score}/10 is below threshold {min_score}. "
                f"{pylint.get('issues', 0)} issue(s) detected.",
                "Address convention and refactor warnings; extract large functions and add type hints.",
            )

    def analyze_security(self) -> None:
        security = self.summary.get("categories", {}).get("security", {})

        snyk = security.get("snyk", {})
        if snyk.get("status") == "warn":
            self.add(
                "Security",
                "high",
                "Remediate dependency vulnerabilities (Snyk)",
                f"{snyk.get('vulnerabilities', 0)} vulnerable dependency(ies) found.",
                "Run `snyk test` and apply `snyk wizard` or upgrade affected packages.",
            )
        elif snyk.get("status") == "skipped":
            self.add(
                "Security",
                "low",
                "Enable Snyk in CI and local QA",
                "Snyk scan was skipped (CLI or SNYK_TOKEN missing).",
                "Set SNYK_TOKEN in GitHub Secrets and install Snyk CLI for local runs.",
            )

        zap = security.get("zap", {})
        if zap.get("high", 0) > 0:
            self.add(
                "Security",
                "high",
                "Fix high-risk OWASP ZAP findings",
                f"ZAP reported {zap.get('high', 0)} high, {zap.get('medium', 0)} medium alerts.",
                "Review qa/reports/zap-report.html; add security headers, input validation, and CSRF protection.",
            )
        elif zap.get("status") == "skipped":
            self.add(
                "Security",
                "medium",
                "Run OWASP ZAP DAST in CI",
                "ZAP scan was skipped (Docker or target unavailable).",
                "Start backend and run `bash qa/scripts/run-zap.sh` with Docker installed.",
            )

    def analyze_performance(self) -> None:
        perf = self.summary.get("categories", {}).get("performance", {})
        min_perf = self.thresholds.get("lighthouse_performance", 80)
        max_p95 = self.thresholds.get("k6_p95_ms", 500)

        lighthouse = perf.get("lighthouse", {})
        scores = lighthouse.get("scores", {})
        if lighthouse.get("status") == "warn":
            self.add(
                "Performance",
                "medium",
                "Improve Lighthouse performance score",
                f"Performance score {scores.get('performance', 0)} is below {min_perf}. "
                f"Accessibility: {scores.get('accessibility', 'n/a')}, SEO: {scores.get('seo', 'n/a')}.",
                "Optimize bundle size (code splitting), lazy-load images, and reduce main-thread work.",
            )
        elif lighthouse.get("status") == "skipped":
            self.add(
                "Performance",
                "low",
                "Run Lighthouse audits regularly",
                "Frontend was not reachable during QA run.",
                "Start Module 6 with `npm run dev` before running `bash qa/run-qa.sh`.",
            )

        k6 = perf.get("k6", {})
        p95 = k6.get("p95_ms", 0)
        if k6.get("status") == "warn":
            self.add(
                "Performance",
                "high",
                "Reduce API latency under load (k6)",
                f"p95 latency {p95}ms exceeds {max_p95}ms SLA. Error rate: {k6.get('error_rate', 0):.2%}.",
                "Add caching, connection pooling, and database indexes; profile slow endpoints.",
            )
        elif k6.get("status") == "skipped":
            self.add(
                "Performance",
                "medium",
                "Add k6 load tests to release gate",
                "k6 was skipped because backend was not running.",
                "Start Module 7 backend and re-run `bash qa/scripts/run-k6.sh`.",
            )

    def analyze_overall(self) -> None:
        overall = self.summary.get("overall", "unknown")
        if overall == "pass":
            self.add(
                "General",
                "low",
                "Maintain quality gates",
                "All executed checks passed. Continue monitoring trends across releases.",
                "Archive qa/reports/ per release and compare qa-summary.json over time.",
            )

    def run(self) -> list[dict]:
        self.analyze_testing()
        self.analyze_code_quality()
        self.analyze_security()
        self.analyze_performance()
        self.analyze_overall()

        priority_order = {"high": 0, "medium": 1, "low": 2}
        self.recommendations.sort(key=lambda r: priority_order.get(r["priority"], 3))
        return self.recommendations


def render_markdown(recommendations: list[dict], summary: dict) -> str:
    lines = [
        "# AI-Generated QA Improvement Recommendations",
        "",
        f"**Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}  ",
        f"**Overall status:** {summary.get('overall', 'unknown').upper()}",
        "",
        "These recommendations are produced by analyzing pytest, Jest, ESLint, Pylint, "
        "Snyk, OWASP ZAP, Lighthouse, and k6 reports.",
        "",
    ]

    if not recommendations:
        lines.append("No recommendations — all checks passed or were skipped.")
        return "\n".join(lines) + "\n"

    for i, rec in enumerate(recommendations, 1):
        emoji = priority_emoji(rec["priority"])
        lines.extend(
            [
                f"## {i}. {emoji} {rec['title']}",
                "",
                f"**Category:** {rec['category']} · **Priority:** {rec['priority'].upper()}",
                "",
                rec["detail"],
                "",
                f"**Recommended action:** {rec['action']}",
                "",
            ]
        )

    return "\n".join(lines)


def main() -> None:
    summary = load_summary()
    if not summary:
        print("No qa-summary.json found. Run generate_dashboard.py first.")
        return

    engine = RecommendationEngine(summary, load_thresholds())
    recommendations = engine.run()

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    (REPORTS_DIR / "recommendations.json").write_text(
        json.dumps(recommendations, indent=2), encoding="utf-8"
    )
    (REPORTS_DIR / "recommendations.md").write_text(
        render_markdown(recommendations, summary), encoding="utf-8"
    )
    print(f"Recommendations written to {REPORTS_DIR / 'recommendations.md'}")


if __name__ == "__main__":
    main()
