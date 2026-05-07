export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';

type MatchRow = {
  id: string;
  score: number;
  status: string;
  jobs: {
    title: string;
    region: string;
    job_type: string;
    required_career: number;
  };
};

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score === 6
      ? 'bg-yellow-400 text-yellow-900'
      : score >= 4
      ? 'bg-green-600 text-white'
      : 'bg-gray-400 text-white';
  return (
    <div className={`flex flex-col items-center rounded-xl px-5 py-3 min-w-[80px] ${cls}`}>
      <span className="text-2xl font-bold">{score}</span>
      <span className="text-sm">점 / 6</span>
    </div>
  );
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ senior_id?: string }>;
}) {
  const { senior_id: seniorId } = await searchParams;

  // senior_id 없이 접근한 경우
  if (!seniorId) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">자동 매칭 추천 목록</h1>
          <div className="bg-amber-50 border-2 border-amber-400 text-amber-800 text-xl rounded-xl px-6 py-6">
            담당자 대시보드에서 시니어의{' '}
            <strong>"상세 보기"</strong> 버튼을 눌러 확인하세요.
          </div>
        </div>
      </main>
    );
  }

  // 시니어 정보 + 매칭 결과 병렬 조회
  const [{ data: seniorRaw }, { data: rawMatches }] = await Promise.all([
    supabase
      .from('seniors')
      .select('name, region, desired_job')
      .eq('id', seniorId)
      .single(),
    supabase
      .from('matches')
      .select('id, score, status, jobs(title, region, job_type, required_career)')
      .eq('senior_id', seniorId)
      .gt('score', 0)
      .order('score', { ascending: false }),
  ]);

  const senior = seniorRaw as { name: string; region: string; desired_job: string } | null;
  const matches = (rawMatches ?? []) as unknown as MatchRow[];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">자동 매칭 추천 목록</h1>

        {senior ? (
          <p className="text-xl text-gray-500 mb-8">
            <strong>{senior.name}</strong>님 ({senior.region} · {senior.desired_job})의 추천
            일자리입니다.
          </p>
        ) : (
          <p className="text-xl text-red-500 mb-8">시니어 정보를 찾을 수 없습니다.</p>
        )}

        {matches.length === 0 ? (
          <div className="bg-gray-50 border-2 border-gray-300 text-gray-600 text-xl rounded-xl px-6 py-10 text-center">
            현재 매칭되는 일자리가 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {matches.map((match) => {
              const job = match.jobs;
              return (
                <li
                  key={match.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-6 flex items-center justify-between shadow-sm"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-gray-900">{job.title}</span>
                    <span className="text-lg text-gray-500">
                      {job.region} · {job.job_type}
                    </span>
                    <span className="text-base text-gray-400">
                      요구 경력 {job.required_career}년
                    </span>
                  </div>
                  <ScoreBadge score={match.score} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
