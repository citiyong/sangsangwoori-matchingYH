import { test, expect } from '@playwright/test';
import { resetDb, insertJob, getSeniorByName } from './helpers/db';

// 점수 체계: 지역 +3 / 직종 +2 / 경력 +1
// 서울/경비/3년  ×  기타/기타/required_career:10
//   → 지역 불일치(0) + 직종 불일치(0) + 3 < 10(0) = 0점 → 추천 목록 미노출
// ※ required_career:0 이면 3 ≥ 0 으로 경력 1점이 부여되어 "매칭 없음" 조건 불충족,
//   때문에 required_career:10 으로 설정합니다.

test.beforeEach(async () => {
  await resetDb();
  await insertJob({ title: '기타 공고', region: '기타', job_type: '기타', required_career: 10 });
});

test('엣지 시나리오: 매칭 조건 불일치 시 "현재 매칭되는 일자리가 없습니다" 안내 박스 표시', async ({ page }) => {
  await page.goto('/register');

  await page.locator('input[placeholder="홍길동"]').fill('테스트시니어');
  await page.locator('select').first().selectOption('서울');
  await page.locator('select').nth(1).selectOption('경비');
  await page.locator('input[type="number"]').fill('3');
  await page.locator('button[type="submit"]').click();

  await expect(page.getByText('등록이 완료되었습니다')).toBeVisible();

  const seniorId = await getSeniorByName('테스트시니어');

  await page.goto(`/recommendations?senior_id=${seniorId}`);

  await expect(page.getByText('현재 매칭되는 일자리가 없습니다')).toBeVisible();
});
