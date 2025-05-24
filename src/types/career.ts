// 경력 프로젝트 데이터 타입
export interface CareerProject {
  id: string;
  projectName: string;      // 사업명
  startDate: string;        // 시작년월 (YYYY-MM 형식)
  endDate: string;          // 종료년월 (YYYY-MM 형식)
  duration: number;         // 기간 (개월수)
  role: string;             // 담당업무
  client: string;           // 발주처
  skills: string;           // 기술스택/비고
  workType?: string;        // 근무형태
}

// 기간 구간 타입 (중복 계산용)
export interface DateRange {
  start: Date;
  end: Date;
  projectIds: string[];     // 해당 구간에 포함된 프로젝트 ID들
}

// 중복 분석 결과 타입
export interface OverlapAnalysis {
  totalMonths: number;      // 총 경력 개월수 (중복 포함)
  uniqueMonths: number;     // 실제 경력 개월수 (중복 제외)
  overlapMonths: number;    // 중복 개월수
  overlapRanges: DateRange[]; // 중복된 구간들
}

// 경력 통계 타입
export interface CareerStats {
  totalProjects: number;
  totalYears: number;
  totalMonths: number;
  uniqueYears: number;
  uniqueMonths: number;
  overlapMonths: number;
}

// 파일 업로드 상태 타입
export interface FileUploadState {
  file: File | null;
  isLoading: boolean;
  error: string | null;
  data: CareerProject[] | null;
}
