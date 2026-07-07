import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const apiDuration = new Trend('api_duration', true);

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  const health = http.get(`${BASE_URL}/health`);
  check(health, { 'health status 200': (r) => r.status === 200 }) || errorRate.add(1);
  apiDuration.add(health.timings.duration);

  sleep(0.5);
}

const OUT_DIR = __ENV.K6_OUT_DIR || 'qa/reports';

export function handleSummary(data) {
  return {
    [`${OUT_DIR}/k6-summary.json`]: JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  };
}

function textSummary(data) {
  const p95 = data.metrics?.http_req_duration?.values?.['p(95)'] ?? 0;
  return `k6 p95: ${p95.toFixed(2)}ms\n`;
}
