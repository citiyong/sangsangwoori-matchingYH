export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 프로필 등록</h1>
        <p className="text-xl text-gray-500 mb-10">
          정보를 입력하시면 맞춤 일자리를 추천해 드립니다.
        </p>

        {/* 폼 껍데기 */}
        <form className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col gap-7">
          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800">이름</label>
            <input
              type="text"
              placeholder="홍길동"
              disabled
              className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 지역 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800">지역</label>
            <input
              type="text"
              placeholder="서울 강남구"
              disabled
              className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 희망 직종 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800">희망 직종</label>
            <input
              type="text"
              placeholder="경비, 조리, 사무보조 등"
              disabled
              className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 경력 연수 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800">경력 연수</label>
            <input
              type="number"
              placeholder="10"
              disabled
              className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* 제출 버튼 (비활성) */}
          <button
            type="button"
            disabled
            className="mt-4 bg-blue-700 text-white text-2xl font-bold py-5 rounded-xl opacity-40 cursor-not-allowed"
          >
            등록하기 (준비 중)
          </button>
        </form>
      </div>
    </main>
  );
}
