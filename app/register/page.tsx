'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const REGIONS = ['서울', '경기', '인천', '기타'];
const JOB_TYPES = ['경비', '청소', '조리', '돌봄', '기타'];

type FormErrors = {
  name?: string;
  region?: string;
  desired_job?: string;
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [desiredJob, setDesiredJob] = useState('');
  const [careerYears, setCareerYears] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = '이름을 입력해 주세요.';
    if (!region) errs.region = '지역을 선택해 주세요.';
    if (!desiredJob) errs.desired_job = '희망 직종을 선택해 주세요.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setSubmitError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    const { error } = await supabase.from('seniors').insert({
      name: name.trim(),
      region,
      desired_job: desiredJob,
      career_years: careerYears ? parseInt(careerYears) : 0,
    });

    setLoading(false);
    if (error) {
      setSubmitError('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } else {
      setSuccess(true);
      setName('');
      setRegion('');
      setDesiredJob('');
      setCareerYears('');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">시니어 프로필 등록</h1>
        <p className="text-xl text-gray-500 mb-10">
          정보를 입력하시면 맞춤 일자리를 추천해 드립니다.
        </p>

        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 text-green-800 text-xl font-semibold rounded-xl px-6 py-4">
            ✓ 등록이 완료되었습니다
          </div>
        )}

        {submitError && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 text-red-800 text-xl font-semibold rounded-xl px-6 py-4">
            {submitError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col gap-7"
        >
          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800">
              이름 <span className="text-red-500">*</span>
            </label>
            {errors.name && (
              <p className="bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
                {errors.name}
              </p>
            )}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className={`border-2 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
          </div>

          {/* 지역 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800">
              지역 <span className="text-red-500">*</span>
            </label>
            {errors.region && (
              <p className="bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
                {errors.region}
              </p>
            )}
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={`border-2 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 bg-white ${
                errors.region ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">선택해 주세요</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* 희망 직종 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800">
              희망 직종 <span className="text-red-500">*</span>
            </label>
            {errors.desired_job && (
              <p className="bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
                {errors.desired_job}
              </p>
            )}
            <select
              value={desiredJob}
              onChange={(e) => setDesiredJob(e.target.value)}
              className={`border-2 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500 bg-white ${
                errors.desired_job ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              <option value="">선택해 주세요</option>
              {JOB_TYPES.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* 경력 연수 */}
          <div className="flex flex-col gap-2">
            <label className="text-xl font-semibold text-gray-800">경력 연수 (년)</label>
            <input
              type="number"
              value={careerYears}
              onChange={(e) => setCareerYears(e.target.value)}
              placeholder="0"
              min={0}
              className="border-2 border-gray-300 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold py-5 rounded-xl transition-colors"
          >
            {loading ? '저장 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </main>
  );
}
