import { CareerProject } from '../types/career';
import { calculateCareerStats, debugOverlapAnalysis } from '../utils/careerCalculator';
import { calculateMonthsBetween, expandMonthRange } from '../utils/dateUtils';

// 테스트 데이터
const testProjects: CareerProject[] = [
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

/**
 * 기본 기능 테스트
 */
export const runBasicTests = () => {
  console.log('=== 기본 기능 테스트 ===');

  // 1. 날짜 계산 테스트
  console.log('\n1. 날짜 계산 테스트:');
  console.log('2023-04 ~ 2023-09:', calculateMonthsBetween('2023-04', '2023-09'), '개월'); // 예상: 6개월
  console.log('2023-08 ~ 2023-12:', calculateMonthsBetween('2023-08', '2023-12'), '개월'); // 예상: 5개월

  // 2. 월 확장 테스트
  console.log('\n2. 월 확장 테스트:');
  console.log('2023-04 ~ 2023-06:', expandMonthRange('2023-04', '2023-06'));

  // 3. 중복 계산 테스트
  console.log('\n3. 중복 계산 테스트:');
  debugOverlapAnalysis(testProjects);

  const stats = calculateCareerStats(testProjects);
  console.log('\n최종 통계:', stats);

  // 예상 결과:
  // - 총 개월수: 6 + 5 + 2 = 13개월
  // - 실제 개월수: 2023-04 ~ 2023-12 = 9개월
  // - 중복 개월수: 13 - 9 = 4개월

  console.log('\n=== 테스트 완료 ===');
};

/**
 * 브라우저에서 테스트 실행
 */
if (typeof window !== 'undefined') {
  (window as any).runCareerTests = runBasicTests;
  console.log('💡 브라우저 콘솔에서 runCareerTests() 를 실행해보세요!');
}
