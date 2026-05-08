import { test, expect } from '@playwright/test';
import { resetDb, insertJob, getSeniorByName } from './helpers/db';

// 점수 체계: 지역 일치 +3 / 직종 일치 +2 / 경력 충족 +1 = 최대 6점
// 서울/경비/required_career:3  ×  서울/경비/5년 → 3+2+1 = 6점

test.beforeEach(async () => {
  await resetDb();
  await insertJob({ title: '서울 경비원 모집', region: '서울', job_type: '경비', required_career: 3 });
});

test('정상 시나리오: 등록 완료 메시지 → 추천 목록에 6점 금색 배지 카드 상단 노출', async ({ page }) => {
  await page.goto('/register');

  await page.locator('input[placeholder="홍길동"]').fill('테스트시니어');
  await page.locator('select').first().selectOption('서울');
  await page.locator('select').nth(1).selectOption('경비');
  await page.locator('input[type="number"]').fill('5');
  await page.locator('button[type="submit"]').click();

  // 1) 초록 성공 박스 확인
  await expect(page.getByText('등록이 완료되었습니다')).toBeVisible();

  // 2) DB에서 방금 생성된 senior ID 조회
  const seniorId = await getSeniorByName('테스트시니어');

  // 3) 추천 목록 페이지로 이동
  await page.goto(`/recommendations?senior_id=${seniorId}`);

  // 4) 6점 금색(bg-yellow-400) 배지가 최상단 카드에 표시되는지 확인
  const firstBadge = page.locator('.bg-yellow-400').first();
  await expect(firstBadge).toBeVisible();
  await expect(firstBadge).toContainText('6');
});
