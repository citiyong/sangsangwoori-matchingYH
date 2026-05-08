'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const REGIONS = ['서울', '경기', '인천', '기타'];
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타'];

type Senior = {
  id: string;
  name: string;
  region: string;
  desired_job: string;
  career_years: number;
};

type MatchStat = { senior_id: string; score: number; status: string };

type Job = {
  id: string;
  title: string;
  region: string;
  job_type: string;
  required_career: number;
};

type SeniorStatus = 'unmatched' | 'pending' | 'assigned';

function calcStatus(matches: MatchStat[]): SeniorStatus {
  if (!matches.length || matches.every((m) => m.score === 0)) return 'unmatched';
  if (matches.some((m) => m.status === 'assigned' || m.status === 'done')) return 'assigned';
  return 'pending';
}

function bestScore(matches: MatchStat[]): number {
  return matches.reduce((max, m) => Math.max(max, m.score), 0);
}

const STATUS_LABEL: Record<SeniorStatus, string> = {
  unmatched: '미매칭',
  pending: '매칭 대기',
  assigned: '배정 완료',
};

const STATUS_COLOR: Record<SeniorStatus, string> = {
  unmatched: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-green-100 text-green-700',
};

export default function AdminPage() {
  const [seniors, setSeniors] = useState<Senior[]>([]);
  const [matchMap, setMatchMap] = useState<Record<string, MatchStat[]>>({});
  const [loadingDash, setLoadingDash] = useState(true);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [jobType, setJobType] = useState('');
  const [requiredCareer, setRequiredCareer] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoadingDash(true);
    const [{ data: sData }, { data: mData }] = await Promise.all([
      supabase.from('seniors').select('*').order('created_at', { ascending: false }),
      supabase.from('matches').select('senior_id, score, status'),
    ]);
    if (sData) setSeniors(sData);
    if (mData) {
      const grouped: Record<string, MatchStat[]> = {};
      for (const m of mData) {
        if (!grouped[m.senior_id]) grouped[m.senior_id] = [];
        grouped[m.senior_id].push(m);
      }
      setMatchMap(grouped);
    }
    setLoadingDash(false);
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setJobs(data);
    setLoadingJobs(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchJobs();
  }, [fetchDashboard, fetchJobs]);

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    if (!title.trim() || !region || !jobType) {
      setAddError('공고명, 지역, 직종은 필수입니다.');
      return;
    }
    setAdding(true);

    const { data: newJob, error } = await supabase
      .from('jobs')
      .insert({
        title: title.trim(),
        region,
        job_type: jobType,
        required_career: requiredCareer ? parseInt(requiredCareer) : 0,
      })
      .select('id')
      .single();

    if (error || !newJob) {
      setAddError('저장 중 오류가 발생했습니다.');
      setAdding(false);
      return;
    }

    await supabase.rpc('recalculate_matches_for_job', { p_job_id: newJob.id });

    setAdding(false);
    setTitle('');
    setRegion('');
    setJobType('');
    setRequiredCareer('');
    await Promise.all([fetchJobs(), fetchDashboard()]);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
      fetchDashboard();
    }
  }

  const unmatchedCount = seniors.filter(
    (s) => calcStatus(matchMap[s.id] ?? []) === 'unmatched'
  ).length;
  const pendingCount = seniors.filter(
    (s) => calcStatus(matchMap[s.id] ?? []) === 'pending'
  ).length;
  const assignedCount = seniors.filter(
    (s) => calcStatus(matchMap[s.id] ?? []) === 'assigned'
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
        <p className="text-xl text-gray-500 mb-8">매칭 현황과 일자리를 관리합니다.</p>

        {/* ── 집계 카드 ── */}
        {loadingDash ? (
          <p className="text-center text-xl text-gray-400 py-10 mb-12">집계 중...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* 미매칭 */}
            <div className="bg-white rounded-2xl border-2 border-red-200 p-8 flex flex-col items-center shadow-sm">
              <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
              <span className="text-5xl font-bold text-red-600 mb-2">{unmatchedCount}</span>
              <span className="text-xl font-semibold text-gray-700">미매칭</span>
              <span className="text-lg text-gray-400 mt-1">매칭 없거나 전부 0점</span>
            </div>
            {/* 매칭 대기 */}
            <div className="bg-white rounded-2xl border-2 border-yellow-200 p-8 flex flex-col items-center shadow-sm">
              <Clock className="w-10 h-10 text-yellow-500 mb-3" />
              <span className="text-5xl font-bold text-yellow-600 mb-2">{pendingCount}</span>
              <span className="text-xl font-semibold text-gray-700">매칭 대기</span>
              <span className="text-lg text-gray-400 mt-1">확정 검토 중</span>
            </div>
            {/* 배정 완료 */}
            <div className="bg-white rounded-2xl border-2 border-green-200 p-8 flex flex-col items-center shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
              <span className="text-5xl font-bold text-green-600 mb-2">{assignedCount}</span>
              <span className="text-xl font-semibold text-gray-700">배정 완료</span>
              <span className="text-lg text-gray-400 mt-1">assigned / done</span>
            </div>
          </div>
        )}

        {/* ── 시니어 목록 테이블 ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
          <div className="px-8 py-5 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800">
              시니어 목록{!loadingDash && ` (${seniors.length}명)`}
            </h2>
          </div>
          {loadingDash ? (
            <p className="text-center text-xl text-gray-400 py-12">불러오는 중...</p>
          ) : seniors.length === 0 ? (
            <p className="text-center text-xl text-gray-400 py-12">등록된 시니어가 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-lg">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">이름</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">지역</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">희망 직종</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">최고 점수</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">상태</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {seniors.map((senior) => {
                    const sm = matchMap[senior.id] ?? [];
                    const status = calcStatus(sm);
                    const best = bestScore(sm);
                    return (
                      <tr
                        key={senior.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{senior.name}</td>
                        <td className="px-6 py-4 text-gray-600">{senior.region}</td>
                        <td className="px-6 py-4 text-gray-600">{senior.desired_job}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xl font-bold ${
                              best >= 4 ? 'text-blue-700' : 'text-gray-400'
                            }`}
                          >
                            {best}점
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-base font-semibold ${STATUS_COLOR[status]}`}
                          >
                            {STATUS_LABEL[status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/recommendations?senior_id=${senior.id}`}
                            className="inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-3 rounded-lg text-lg transition-colors min-h-[48px]"
                          >
                            상세 보기
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── 일자리 관리 섹션 ── */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">일자리 관리</h2>

          {/* 추가 폼 */}
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
                  className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold py-4 rounded-xl transition-colors min-h-[48px]"
                >
                  {adding ? '저장 중...' : '추가'}
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
              <p className="text-center text-xl text-gray-400 py-16">
                등록된 일자리가 없습니다.
              </p>
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
                            className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-lg text-lg transition-colors min-h-[48px]"
                          >
                            삭제 확인
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
