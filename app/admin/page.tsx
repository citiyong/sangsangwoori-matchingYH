export default function AdminPage() {
  // 더미 카운트 (기능 구현 전 UI 확인용)
  const stats = {
    unmatched: 12,
    pending: 5,
    assigned: 28,
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
        <p className="text-xl text-gray-500 mb-2">매칭 현황을 한눈에 확인합니다.</p>
        <p className="text-base text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-8 inline-block">
          ※ 아래는 UI 확인용 더미 데이터입니다. 실제 기능은 다음 단계에서 구현됩니다.
        </p>

        {/* 상태 카드 3종 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl border-2 border-red-200 p-8 flex flex-col items-center shadow-sm">
            <span className="text-5xl font-bold text-red-600 mb-2">{stats.unmatched}</span>
            <span className="text-xl font-semibold text-gray-700">미매칭</span>
            <span className="text-base text-gray-400 mt-1">아직 매칭 없음</span>
          </div>
          <div className="bg-white rounded-2xl border-2 border-yellow-200 p-8 flex flex-col items-center shadow-sm">
            <span className="text-5xl font-bold text-yellow-600 mb-2">{stats.pending}</span>
            <span className="text-xl font-semibold text-gray-700">매칭 대기</span>
            <span className="text-base text-gray-400 mt-1">확정 검토 중</span>
          </div>
          <div className="bg-white rounded-2xl border-2 border-green-200 p-8 flex flex-col items-center shadow-sm">
            <span className="text-5xl font-bold text-green-600 mb-2">{stats.assigned}</span>
            <span className="text-xl font-semibold text-gray-700">배정 완료</span>
            <span className="text-base text-gray-400 mt-1">최종 확정됨</span>
          </div>
        </div>

        {/* 목록 자리 (다음 블록에서 구현) */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
          <p className="text-2xl font-semibold mb-2">상세 목록 영역</p>
          <p className="text-lg">기능 구현은 다음 단계에서 진행됩니다.</p>
        </div>
      </div>
    </main>
  );
}
