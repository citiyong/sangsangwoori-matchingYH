import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  workers: 1, // 테스트 간 DB 간섭 방지
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://hlnkzvlritckulnsnoob.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsbmt6dmxyaXRja3VsbnNub29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjYxNzAsImV4cCI6MjA5MzYwMjE3MH0.PA1uljsQSbt-JDpP9KImSdJ2l9eVpXqbxMm4XZk0GpU',
    },
  },
});
