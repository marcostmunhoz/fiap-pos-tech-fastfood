import { check } from 'k6';
import http from 'k6/http';

/** @type {import('k6/options').Options} */
export const options = {
  vus: 100,
  batch: 10,
  duration: '300s',
};
const BASE_URL = __ENV.BASE_URL || 'localhost:3000';

export default function () {
  const res = http.get(`http://${BASE_URL}/api/v1/load?level=20`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  check(res, {
    'response time is less than 200ms': (r) => r.timings.duration < 200,
  });
}
