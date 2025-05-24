import React from 'react';
import { CareerProject, CareerStats } from '../types/career';
import { downloadResultsExcel } from '../utils/excelUtils';
import { analyzeOverlaps } from '../utils/careerCalculator';

interface StatsDisplayProps {
  stats: CareerStats;
  projects: CareerProject[];
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, projects }) => {
  const handleDownloadResults = () => {
    try {
      const analysis = analyzeOverlaps(projects);
      downloadResultsExcel(projects, {
        totalMonths: analysis.totalMonths,
        uniqueMonths: analysis.uniqueMonths,
        overlapMonths: analysis.overlapMonths
      });
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {stats.totalYears}년 {stats.totalMonths}개월
        </div>
        <div className="text-sm text-blue-600 font-medium">총 경력 기간</div>
        <div className="text-xs text-gray-500 mt-1">(중복 포함)</div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-green-600 mb-2">
          {stats.uniqueYears}년 {stats.uniqueMonths}개월
        </div>
        <div className="text-sm text-green-600 font-medium">실제 경력 기간</div>
        <div className="text-xs text-gray-500 mt-1">(중복 제외)</div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-3xl font-bold text-red-600 mb-2">
          {Math.floor(stats.overlapMonths / 12)}년 {stats.overlapMonths % 12}개월
        </div>
        <div className="text-sm text-red-600 font-medium">중복 기간</div>
        <div className="text-xs text-gray-500 mt-1">총 {stats.overlapMonths}개월</div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center md:col-span-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-lg font-semibold text-gray-700">
            총 {stats.totalProjects}개 프로젝트
          </div>
          <button
            onClick={handleDownloadResults}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>💾</span>
            결과 다운로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;
