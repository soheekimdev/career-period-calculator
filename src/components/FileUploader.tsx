import React, { useState, useRef } from 'react';
import { CareerProject } from '../types/career';
import { parseExcelFile, downloadTemplate } from '../utils/excelUtils';

interface FileUploaderProps {
  onDataLoaded: (data: CareerProject[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // 파일 확장자 검증
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      setError('지원하지 않는 파일 형식입니다. .xlsx, .xls, .csv 파일만 업로드 가능합니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('📁 파일 업로드 시작:', file.name);
      const projects = await parseExcelFile(file);
      console.log('✅ 파일 파싱 완료:', projects.length, '개 프로젝트');
      onDataLoaded(projects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '파일을 읽는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('❌ 파일 처리 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleTemplateDownload = () => {
    try {
      downloadTemplate();
    } catch (error) {
      setError('템플릿 다운로드 중 오류가 발생했습니다.');
      console.error('템플릿 다운로드 오류:', error);
    }
  };

  const handleTestDataLoad = () => {
    // 기존 테스트 데이터 로드 기능 (개발/테스트용)
    const testData: CareerProject[] = [
      {
        id: '1',
        projectName: '프로젝트 A',
        startDate: '2023-04',
        endDate: '2023-09',
        duration: 6,
        role: '개발',
        client: '클라이언트 A',
        skills: 'React',
        workType: '정직원',
      },
      {
        id: '2',
        projectName: '프로젝트 B',
        startDate: '2023-08',
        endDate: '2023-12',
        duration: 5,
        role: '개발',
        client: '클라이언트 B',
        skills: 'TypeScript',
        workType: '프리랜서',
      },
      {
        id: '3',
        projectName: '프로젝트 C',
        startDate: '2023-10',
        endDate: '2023-11',
        duration: 2,
        role: '개발',
        client: '클라이언트 C',
        skills: 'JavaScript',
        workType: '프리랜서',
      },
    ];

    console.log('📊 테스트 데이터 로딩 완료');
    onDataLoaded(testData);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* 템플릿 다운로드 섹션 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-medium text-blue-800 mb-1">📋 엑셀 템플릿 다운로드</h3>
            <p className="text-sm text-blue-600">먼저 템플릿을 다운로드하여 경력 정보를 입력하세요.</p>
          </div>
          <button
            onClick={handleTemplateDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>📥</span>
            템플릿 다운로드
          </button>
        </div>
      </div>

      {/* 파일 업로드 섹션 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleInputFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-4xl">{dragOver ? '📂' : '📊'}</div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {dragOver ? '파일을 여기에 놓으세요' : '엑셀 파일을 업로드하세요'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              .xlsx, .xls, .csv 파일을 지원합니다 | 드래그&드롭 또는 클릭하여 선택
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleButtonClick}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isLoading ? '업로드 중...' : '📁 파일 선택'}
            </button>

            <button
              onClick={handleTestDataLoad}
              disabled={isLoading}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              🧪 테스트 데이터
            </button>
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <p className="text-blue-700">파일을 처리하는 중입니다...</p>
          </div>
        </div>
      )}

      {/* 오류 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <div>
              <p className="text-red-700 font-medium">파일 처리 오류</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button onClick={() => setError(null)} className="text-red-500 text-sm underline mt-2 hover:text-red-700">
                오류 메시지 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-md font-medium text-gray-800 mb-2">📝 사용법</h3>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. 위의 "템플릿 다운로드" 버튼을 클릭하여 엑셀 템플릿을 다운로드합니다</li>
          <li>2. 템플릿에 경력 정보를 입력합니다 (시작연월/종료연월은 YYYY-MM 형식)</li>
          <li>3. 작성이 완료된 파일을 여기에 업로드합니다</li>
          <li>4. 자동으로 중복 기간이 계산되어 결과를 확인할 수 있습니다</li>
        </ol>
      </div>
    </div>
  );
};

export default FileUploader;
