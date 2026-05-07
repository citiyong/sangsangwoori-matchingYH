export default function RecommendationsPage() {
  // 더미 데이터 (기능 구현 전 UI 확인용)
  const dummyMatches = [
    { id: 1, seniorName: "홍길동", jobTitle: "아파트 경비원", region: "서울 강남구", score: 92 },
    { id: 2, seniorName: "김순자", jobTitle: "병원 식당 조리사", region: "부산 해운대구", score: 85 },
    { id: 3, seniorName: "박철수", jobTitle: "사무 보조", region: "인천 남동구", score: 78 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">자동 매칭 추천 목록</h1>
        <p className="text-xl text-gray-500 mb-2">
          점수 높은 순으로 매칭 결과가 표시됩니다.
        </p>
        <p className="text-base text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-8 inline-block">
          ※ 아래는 UI 확인용 더미 데이터입니다. 실제 기능은 다음 단계에서 구현됩니다.
        </p>

        {/* 매칭 목록 카드 */}
        <ul className="flex flex-col gap-4">
          {dummyMatches.map((match) => (
            <li
              key={match.id}
              className="bg-white rounded-2xl border-2 border-gray-200 p-6 flex items-center justify-between shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-gray-900">{match.jobTitle}</span>
                <span className="text-lg text-gray-500">{match.seniorName} · {match.region}</span>
              </div>
              <div className="flex flex-col items-center bg-blue-700 text-white rounded-xl px-5 py-3 min-w-[80px]">
                <span className="text-2xl font-bold">{match.score}</span>
                <span className="text-sm">점</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
