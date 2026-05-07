import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">상상우리 매칭 시스템</h1>
      <p className="text-xl text-gray-600 mb-12">시니어 ↔ 일자리 자동 매칭 플랫폼</p>

      <nav className="flex flex-col gap-4 w-full max-w-sm">
        <Link
          href="/register"
          className="block text-center bg-blue-700 hover:bg-blue-800 text-white text-xl font-semibold py-5 px-8 rounded-xl border-2 border-blue-700 transition-colors"
        >
          시니어 프로필 등록
        </Link>
        <Link
          href="/recommendations"
          className="block text-center bg-green-700 hover:bg-green-800 text-white text-xl font-semibold py-5 px-8 rounded-xl border-2 border-green-700 transition-colors"
        >
          자동 매칭 추천 목록
        </Link>
        <Link
          href="/admin"
          className="block text-center bg-gray-800 hover:bg-gray-900 text-white text-xl font-semibold py-5 px-8 rounded-xl border-2 border-gray-800 transition-colors"
        >
          담당자 대시보드
        </Link>
      </nav>
    </main>
  );
}
