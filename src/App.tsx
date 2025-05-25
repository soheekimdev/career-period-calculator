import { useState, useEffect } from 'react';
import { CareerProject, CareerStats } from './types/career';
import FileUploader from './components/FileUploader';
import ProjectTable from './components/ProjectTable';
import StatsDisplay from './components/StatsDisplay';
import { calculateCareerStats, debugOverlapAnalysis } from './utils/careerCalculator';
import './tests/careerCalculator.test';

function App() {
  const [projects, setProjects] = useState<CareerProject[]>([]);
  const [stats, setStats] = useState<CareerStats | null>(null);

  // 프로젝트가 변경될 때마다 통계 재계산
  useEffect(() => {
    if (projects.length > 0) {
      console.log('🧮 경력 통계 계산 시작...');
      const calculatedStats = calculateCareerStats(projects);
      setStats(calculatedStats);
      
      // 디버깅용 정보 출력
      debugOverlapAnalysis(projects);
      console.log('📈 계산된 통계:', calculatedStats);
    } else {
      setStats(null);
    }
  }, [projects]);

  const handleDataLoaded = (data: CareerProject[]) => {
    console.log('📁 데이터 로드됨:', data.length, '개 프로젝트');
    setProjects(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            경력 기간 계산기
          </h1>
          <p className="text-gray-600">
            프리랜서 경력의 중복 기간을 자동으로 계산해보세요
          </p>
        </header>

        <div className="space-y-8">
          {/* 파일 업로드 섹션 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">📁 데이터 업로드</h2>
            <FileUploader onDataLoaded={handleDataLoaded} />
          </div>

          {/* 통계 표시 섹션 */}
          {stats && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">📊 경력 통계</h2>
              <StatsDisplay stats={stats} projects={projects} />
            </div>
          )}

          {/* 프로젝트 테이블 섹션 */}
          {projects.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">📋 프로젝트 목록</h2>
              <ProjectTable 
                projects={projects} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
