'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const REGIONS = ['서울', '경기', '인천', '기타'];
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타'];

type Job = {
  id: string;
  title: string;
  region: string;
  job_type: string;
  required_career: number;
};

export default function AdminPage() {
  // 매칭 현황 (다음 블록에서 실제 데이터로 교체)
  const stats = { unmatched: 12, pending: 5, assigned: 28 };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // 일자리 추가 폼
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [jobType, setJobType] = useState('');
  const [requiredCareer, setRequiredCareer] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setJobs(data);
    setLoadingJobs(false);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    if (!title.trim() || !region || !jobType) {
      setAddError('공고명, 지역, 직종은 필수입니다.');
      return;
    }
    setAdding(true);
    const { error } = await supabase.from('jobs').insert({
      title: title.trim(),
      region,
      job_type: jobType,
      required_career: requiredCareer ? parseInt(requiredCareer) : 0,
    });
    setAdding(false);
    if (error) {
      setAddError('저장 중 오류가 발생했습니다.');
    } else {
      setTitle('');
      setRegion('');
      setJobType('');
      setRequiredCareer('');
      fetchJobs();
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
        <p className="text-xl text-gray-500 mb-8">매칭 현황과 일자리를 관리합니다.</p>

        {/* 매칭 현황 카드 (다음 블록에서 실제 데이터 연동) */}
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

        {/* 일자리 관리 섹션 */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">일자리 관리</h2>

          {/* 일자리 추가 폼 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">새 일자리 등록</h3>

            {addError && (
              <p className="mb-5 bg-red-50 border-2 border-red-400 text-red-700 text-lg rounded-xl px-5 py-3">
                {addError}
              </p>
            )}

            <form onSubmit={handleAddJob} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-lg font-semibold text-gray-700">공고명 *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 아파트 경비원"
                  className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700">지역 *</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">선택</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700">직종 *</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">선택</option>
                  {JOB_TYPES.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-gray-700">요구 경력 (년)</label>
                <input
                  type="number"
                  value={requiredCareer}
                  onChange={(e) => setRequiredCareer(e.target.value)}
                  placeholder="0"
                  min={0}
                  className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={adding}
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold py-4 rounded-xl transition-colors"
                >
                  {adding ? '저장 중...' : '일자리 등록'}
                </button>
              </div>
            </form>
          </div>

          {/* 일자리 목록 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800">
                등록된 일자리{!loadingJobs && ` (${jobs.length}건)`}
              </h3>
            </div>

            {loadingJobs ? (
              <p className="text-center text-xl text-gray-400 py-16">불러오는 중...</p>
            ) : jobs.length === 0 ? (
              <p className="text-center text-xl text-gray-400 py-16">등록된 일자리가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-lg">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">공고명</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">지역</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">직종</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">요구 경력</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                        <td className="px-6 py-4 text-gray-600">{job.region}</td>
                        <td className="px-6 py-4 text-gray-600">{job.job_type}</td>
                        <td className="px-6 py-4 text-gray-600">{job.required_career}년</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg text-base transition-colors"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
