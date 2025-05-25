import { CareerProject, OverlapAnalysis, CareerStats, DateRange } from '../types/career';
import { 
  calculateMonthsBetween, 
  convertMonthsToYearsAndMonths, 
  expandMonthRange,
  parseYearMonth,
  formatYearMonth
} from './dateUtils';

/**
 * 중복 기간을 제거한 실제 근무 개월수 계산
 * 핵심 알고리즘: 모든 월을 Set으로 관리하여 중복 제거
 */
export const calculateUniqueMonths = (projects: CareerProject[]): string[] => {
  const uniqueMonths = new Set<string>();
  
  projects.forEach(project => {
    const monthsInProject = expandMonthRange(project.startDate, project.endDate);
    monthsInProject.forEach(month => uniqueMonths.add(month));
  });
  
  return Array.from(uniqueMonths).sort();
};

/**
 * 중복 구간 분석
 */
export const analyzeOverlaps = (projects: CareerProject[]): OverlapAnalysis => {
  // 1. 총 개월수 계산 (모든 프로젝트 기간 합계)
  const totalMonths = projects.reduce((sum, project) => {
    return sum + calculateMonthsBetween(project.startDate, project.endDate);
  }, 0);
  
  // 2. 실제 근무 개월수 계산 (중복 제거)
  const uniqueMonthsArray = calculateUniqueMonths(projects);
  const uniqueMonths = uniqueMonthsArray.length;
  
  // 3. 중복 개월수 계산
  const overlapMonths = totalMonths - uniqueMonths;
  
  // 4. 중복 구간 분석
  const overlapRanges = findOverlapRanges(projects);
  
  return {
    totalMonths,
    uniqueMonths,
    overlapMonths,
    overlapRanges
  };
};

/**
 * 중복되는 구간들을 찾아내는 함수
 */
export const findOverlapRanges = (projects: CareerProject[]): DateRange[] => {
  const overlapRanges: DateRange[] = [];
  const monthProjectMap = new Map<string, string[]>();
  
  // 각 월에 어떤 프로젝트들이 포함되는지 매핑
  projects.forEach(project => {
    const months = expandMonthRange(project.startDate, project.endDate);
    months.forEach(month => {
      if (!monthProjectMap.has(month)) {
        monthProjectMap.set(month, []);
      }
      monthProjectMap.get(month)!.push(project.id);
    });
  });
  
  // 2개 이상의 프로젝트가 포함된 월들 찾기
  const overlapMonths: string[] = [];
  monthProjectMap.forEach((projectIds, month) => {
    if (projectIds.length > 1) {
      overlapMonths.push(month);
    }
  });
  
  // 연속된 중복 월들을 구간으로 그룹핑
  if (overlapMonths.length > 0) {
    overlapMonths.sort();
    
    let rangeStart = overlapMonths[0];
    let rangeEnd = overlapMonths[0];
    let currentProjectIds = monthProjectMap.get(rangeStart) || [];
    
    for (let i = 1; i < overlapMonths.length; i++) {
      const currentMonth = overlapMonths[i];
      const prevMonth = overlapMonths[i - 1];
      const projectIds = monthProjectMap.get(currentMonth) || [];
      
      // 연속된 달이고 같은 프로젝트들이 겹치는 경우
      if (isConsecutiveMonth(prevMonth, currentMonth) && 
          arraysEqual(currentProjectIds.sort(), projectIds.sort())) {
        rangeEnd = currentMonth;
      } else {
        // 구간 완료
        overlapRanges.push({
          start: parseYearMonth(rangeStart),
          end: parseYearMonth(rangeEnd),
          projectIds: currentProjectIds
        });
        
        rangeStart = currentMonth;
        rangeEnd = currentMonth;
        currentProjectIds = projectIds;
      }
    }
    
    // 마지막 구간 추가
    overlapRanges.push({
      start: parseYearMonth(rangeStart),
      end: parseYearMonth(rangeEnd),
      projectIds: currentProjectIds
    });
  }
  
  return overlapRanges;
};

/**
 * 경력 통계 계산
 */
export const calculateCareerStats = (projects: CareerProject[]): CareerStats => {
  const analysis = analyzeOverlaps(projects);
  const totalYearsMonths = convertMonthsToYearsAndMonths(analysis.totalMonths);
  const uniqueYearsMonths = convertMonthsToYearsAndMonths(analysis.uniqueMonths);
  
  return {
    totalProjects: projects.length,
    totalYears: totalYearsMonths.years,
    totalMonths: totalYearsMonths.months,
    uniqueYears: uniqueYearsMonths.years,
    uniqueMonths: uniqueYearsMonths.months,
    overlapMonths: analysis.overlapMonths
  };
};

/**
 * 두 달이 연속인지 확인
 */
const isConsecutiveMonth = (month1: string, month2: string): boolean => {
  const date1 = parseYearMonth(month1);
  
  const nextMonth = new Date(date1.getFullYear(), date1.getMonth() + 1, 1);
  return formatYearMonth(nextMonth) === month2;
};

/**
 * 두 배열이 같은지 확인
 */
const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
};

/**
 * 디버깅용: 중복 분석 결과를 콘솔에 출력
 */
export const debugOverlapAnalysis = (projects: CareerProject[]): void => {
  console.log('=== 중복 분석 결과 ===');
  console.log('프로젝트 목록:');
  projects.forEach(project => {
    console.log(`  ${project.projectName}: ${project.startDate} ~ ${project.endDate} (${calculateMonthsBetween(project.startDate, project.endDate)}개월)`);
  });
  
  const analysis = analyzeOverlaps(projects);
  console.log(`\n총 개월수: ${analysis.totalMonths}개월`);
  console.log(`실제 개월수: ${analysis.uniqueMonths}개월`);
  console.log(`중복 개월수: ${analysis.overlapMonths}개월`);
  
  if (analysis.overlapRanges.length > 0) {
    console.log('\n중복 구간:');
    analysis.overlapRanges.forEach((range, index) => {
      console.log(`  구간 ${index + 1}: ${formatYearMonth(range.start)} ~ ${formatYearMonth(range.end)} (프로젝트 ${range.projectIds.length}개 중복)`);
    });
  }
};
