import { test, expect } from '@playwright/test';
import { resetDb, supabase } from './helpers/db';

test.beforeEach(async () => {
  await resetDb();
});

test('실패 시나리오: 이름 비움 제출 → 빨간 안내 박스 / DB에 신규 레코드 없음', async ({ page }) => {
  await page.goto('/register');

  // 이름 입력란은 비운 채로
  await page.locator('select').first().selectOption('서울');
  await page.locator('select').nth(1).selectOption('경비');
  await page.locator('input[type="number"]').fill('3');
  await page.locator('button[type="submit"]').click();

  // 1) 이름 필드 위 빨간 안내 박스 확인
  await expect(page.getByText('이름을 입력해 주세요.')).toBeVisible();

  // 2) seniors 테이블에 새 레코드가 들어가지 않았는지 확인
  const { data: seniors } = await supabase.from('seniors').select('id');
  expect(seniors?.length ?? 0).toBe(0);
});
