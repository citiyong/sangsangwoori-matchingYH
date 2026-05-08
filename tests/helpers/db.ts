import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://hlnkzvlritckulnsnoob.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsbmt6dmxyaXRja3VsbnNub29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjYxNzAsImV4cCI6MjA5MzYwMjE3MH0.PA1uljsQSbt-JDpP9KImSdJ2l9eVpXqbxMm4XZk0GpU'
);

export async function resetDb() {
  // FK 순서: matches → seniors, jobs
  const { error: e1 } = await supabase.from('matches').delete().not('id', 'is', null);
  if (e1) throw new Error(`matches 삭제 실패: ${e1.message}`);
  const { error: e2 } = await supabase.from('seniors').delete().not('id', 'is', null);
  if (e2) throw new Error(`seniors 삭제 실패: ${e2.message}`);
  const { error: e3 } = await supabase.from('jobs').delete().not('id', 'is', null);
  if (e3) throw new Error(`jobs 삭제 실패: ${e3.message}`);
}

export async function insertJob(job: {
  title: string;
  region: string;
  job_type: string;
  required_career: number;
}): Promise<string> {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select('id')
    .single();
  if (error) throw new Error(`jobs 삽입 실패: ${error.message}`);
  return data.id as string;
}

export async function getSeniorByName(name: string): Promise<string> {
  const { data, error } = await supabase
    .from('seniors')
    .select('id')
    .eq('name', name)
    .single();
  if (error) throw new Error(`senior 조회 실패: ${error.message}`);
  return data.id as string;
}
