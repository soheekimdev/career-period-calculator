import React from 'react';
import { CareerProject } from '../types/career';

interface ProjectTableProps {
  projects: CareerProject[];
  onProjectsChange: (projects: CareerProject[]) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onProjectsChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <colgroup>
          <col width="" />
          <col width="100" />
          <col width="100" />
          <col width="80" />
          <col width="100" />
          <col width="" />
          <col width="" />
          <col width="90" />
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">사업명</th>
            <th className="border border-gray-300 px-4 py-2 text-left">시작일</th>
            <th className="border border-gray-300 px-4 py-2 text-left">종료일</th>
            <th className="border border-gray-300 px-4 py-2 text-left">기간</th>
            <th className="border border-gray-300 px-4 py-2 text-left">담당업무</th>
            <th className="border border-gray-300 px-4 py-2 text-left">발주처</th>
            <th className="border border-gray-300 px-4 py-2 text-left">기술스택</th>
            <th className="border border-gray-300 px-4 py-2 text-left">근무형태</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 break-keep">{project.projectName}</td>
              <td className="border border-gray-300 px-4 py-2 break-keep">{project.startDate}</td>
              <td className="border border-gray-300 px-4 py-2 break-keep">{project.endDate}</td>
              <td className="border border-gray-300 px-4 py-2 text-center break-keep">{project.duration}개월</td>
              <td className="border border-gray-300 px-4 py-2 break-keep">{project.role}</td>
              <td className="border border-gray-300 px-4 py-2 break-keep">{project.client}</td>
              <td className="border border-gray-300 px-4 py-2 text-sm break-keep">{project.skills}</td>
              <td className="border border-gray-300 px-4 py-2 text-sm break-keep">{project.workType || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">프로젝트 데이터가 없습니다. 엑셀 파일을 업로드해주세요.</div>
      )}
    </div>
  );
};

export default ProjectTable;
