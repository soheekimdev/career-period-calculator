import { parse, format, differenceInMonths, startOfMonth, endOfMonth } from 'date-fns';

/**
 * YYYY-MM 형식의 문자열을 Date 객체로 변환
 */
export const parseYearMonth = (yearMonth: string): Date => {
  try {
    // "2023-04" -> 2023년 4월 1일
    return parse(yearMonth + '-01', 'yyyy-MM-dd', new Date());
  } catch (error) {
    throw new Error(`Invalid date format: ${yearMonth}. Expected format: YYYY-MM`);
  }
};

/**
 * Date 객체를 YYYY-MM 형식으로 변환
 */
export const formatYearMonth = (date: Date): string => {
  return format(date, 'yyyy-MM');
};

/**
 * 두 날짜 사이의 개월수 계산 (시작월과 종료월 포함)
 * 예: 2023-04 ~ 2023-06 = 3개월 (4월, 5월, 6월)
 */
export const calculateMonthsBetween = (startYearMonth: string, endYearMonth: string): number => {
  const startDate = parseYearMonth(startYearMonth);
  const endDate = parseYearMonth(endYearMonth);
  
  // differenceInMonths는 시작월을 포함하지 않으므로 +1
  return differenceInMonths(endDate, startDate) + 1;
};

/**
 * 연도와 개월수를 년/월 형태로 변환
 * 예: 25개월 -> { years: 2, months: 1 }
 */
export const convertMonthsToYearsAndMonths = (totalMonths: number): { years: number; months: number } => {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return { years, months };
};

/**
 * 월 단위 Date Range 생성 (해당 월의 시작일과 마지막일)
 */
export const createMonthRange = (yearMonth: string): { start: Date; end: Date } => {
  const date = parseYearMonth(yearMonth);
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  };
};

/**
 * 두 기간이 겹치는지 확인
 */
export const isOverlapping = (
  range1: { start: string; end: string },
  range2: { start: string; end: string }
): boolean => {
  const start1 = parseYearMonth(range1.start);
  const end1 = parseYearMonth(range1.end);
  const start2 = parseYearMonth(range2.start);
  const end2 = parseYearMonth(range2.end);

  // 겹치지 않는 경우: range1이 range2보다 완전히 앞에 있거나 뒤에 있는 경우
  // 겹치는 경우: 위의 조건이 아닌 모든 경우
  return !(end1 < start2 || end2 < start1);
};

/**
 * 개월수 배열을 월별로 확장
 * 예: "2023-04" ~ "2023-06" -> ["2023-04", "2023-05", "2023-06"]
 */
export const expandMonthRange = (startYearMonth: string, endYearMonth: string): string[] => {
  const months: string[] = [];
  const startDate = parseYearMonth(startYearMonth);
  const endDate = parseYearMonth(endYearMonth);
  
  let currentDate = startDate;
  
  while (currentDate <= endDate) {
    months.push(formatYearMonth(currentDate));
    // 다음 달로 이동
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }
  
  return months;
};
