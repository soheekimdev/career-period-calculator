import * as XLSX from 'xlsx';
import { CareerProject } from '../types/career';
import { calculateMonthsBetween } from './dateUtils';

/**
 * 엑셀 날짜 시리얼 번호를 YYYY-MM 형식으로 변환
 */
const convertExcelDateToYearMonth = (value: any): string => {
  if (!value) return '';
  
  const valueStr = value.toString().trim();
  
  // 이미 YYYY-MM 형식인 경우
  const yearMonthRegex = /^\d{4}-\d{2}$/;
  if (yearMonthRegex.test(valueStr)) {
    return valueStr;
  }
  
  // 엑셀 날짜 시리얼 번호인 경우 (숫자)
  const numberValue = Number(valueStr);
  if (!isNaN(numberValue) && numberValue > 40000 && numberValue < 100000) {
    try {
      // XLSX 라이브러리의 날짜 변환 함수 사용
      const date = XLSX.SSF.parse_date_code(numberValue);
      if (date && date.y && date.m) {
        const year = date.y;
        const month = date.m.toString().padStart(2, '0');
        return `${year}-${month}`;
      }
    } catch (error) {
      console.warn('날짜 변환 실패:', valueStr, error);
    }
  }
  
  // 다른 형식 시도 (YYYY.MM, YYYY/MM 등)
  const otherFormats = [
    /^(\d{4})\.(\d{1,2})$/, // YYYY.MM
    /^(\d{4})\/(\d{1,2})$/, // YYYY/MM
    /^(\d{4})-(\d{1})$/,    // YYYY-M
  ];
  
  for (const regex of otherFormats) {
    const match = valueStr.match(regex);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, '0');
      return `${year}-${month}`;
    }
  }
  
  return valueStr; // 변환할 수 없으면 원본 반환
};

/**
 * 엑셀 템플릿 데이터 생성
 */
export const createTemplateData = () => {
  return [
    // 헤더 행
    ['사업명', '시작년월', '종료년월', '기간', '담당업무', '발주처', '비고(기술기능)', '근무형태'],
    
    // 예시 데이터 1
    ['프로젝트 A', '2023-04', '2023-09', '=DATEDIF(B2,C2,"y")&"년 "&DATEDIF(B2,C2,"ym")+1&"개월"', '퍼블리싱', '클라이언트 A', 'HTML, CSS, JavaScript', '프리랜서'],
    
    // 예시 데이터 2  
    ['프로젝트 B', '2023-08', '2023-12', '=DATEDIF(B3,C3,"y")&"년 "&DATEDIF(B3,C3,"ym")+1&"개월"', '퍼블리싱', '클라이언트 B', 'HTML, CSS, JavaScript, JSP', '프리랜서'],
    
    // 예시 데이터 3
    ['프로젝트 C', '2024-01', '2024-05', '=DATEDIF(B4,C4,"y")&"년 "&DATEDIF(B4,C4,"ym")+1&"개월"', 'React 개발', '클라이언트 C', 'React, TypeScript, styled-components', '프리랜서'],
    
    // 빈 행들 (사용자가 입력할 수 있도록)
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    
    // 사용법 설명
    ['', '', '', '', '', '', '', ''],
    ['사용법:', '', '', '', '', '', '', ''],
    ['1. 시작년월과 종료년월은 반드시 텍스트 형식으로 입력하세요'],
    ['2. 예시: 2023-04, 2024-12 (대시 포함, 월은 두 자리)'],
    ['3. 엑셀이 자동으로 날짜로 변환하지 않도록 주의하세요'],
    ['4. 근무형태: 프리랜서, 정규직, 계약직 등을 입력하세요'],
    ['5. 기간 열은 자동으로 계산됩니다'],
    ['6. 파일을 저장한 후 웹사이트에 업로드하세요']
  ];
};

/**
 * 엑셀 템플릿 파일 다운로드
 */
export const downloadTemplate = () => {
  try {
    const templateData = createTemplateData();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    
    // 컬럼 너비 설정
    const columnWidths = [
      { width: 25 }, // 사업명
      { width: 12 }, // 시작년월
      { width: 12 }, // 종료년월
      { width: 10 }, // 기간
      { width: 15 }, // 담당업무
      { width: 15 }, // 발주처
      { width: 30 }, // 비고
      { width: 12 }  // 근무형태
    ];
    worksheet['!cols'] = columnWidths;
    
    // 헤더 스타일 적용 (H열까지로 확장)
    const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:H1');
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      
      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'E6F3FF' } }
      };
    }
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '경력사항');
    
    // 파일 다운로드
    const fileName = `경력사항_템플릿_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    console.log('✅ 템플릿 파일 다운로드 완료:', fileName);
    return true;
  } catch (error) {
    console.error('❌ 템플릿 다운로드 실패:', error);
    return false;
  }
};

/**
 * 엑셀 파일에서 경력 데이터 파싱
 */
export const parseExcelFile = async (file: File): Promise<CareerProject[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 첫 번째 시트 사용
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // 시트를 JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // 헤더 행 찾기 (사업명이 포함된 행)
        let headerRowIndex = -1;
        for (let i = 0; i < jsonData.length; i++) {
          if (jsonData[i][0] === '사업명' || jsonData[i].includes('사업명')) {
            headerRowIndex = i;
            break;
          }
        }
        
        if (headerRowIndex === -1) {
          throw new Error('헤더 행을 찾을 수 없습니다. "사업명" 컬럼이 있는지 확인해주세요.');
        }
        
        const projects: CareerProject[] = [];
        
        // 데이터 행 처리 (헤더 다음 행부터)
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // 빈 행이나 사업명이 없는 행은 스킵
          if (!row[0] || row[0].toString().trim() === '') {
            continue;
          }
          
          // 사용법 설명 부분 스킵
          if (row[0].toString().includes('사용법:') || row[0].toString().includes('1.')) {
            break;
          }
          
          try {
            const projectName = row[0]?.toString().trim() || '';
            const startDate = convertExcelDateToYearMonth(row[1]);
            const endDate = convertExcelDateToYearMonth(row[2]);
            const role = row[4]?.toString().trim() || '';
            const client = row[5]?.toString().trim() || '';
            const skills = row[6]?.toString().trim() || '';
            const workType = row[7]?.toString().trim() || '';
            
            // 디버깅: 변환된 날짜 로깅
            console.log(`행 ${i + 1}: 원본 데이터`, { 
              시작: row[1], 종료: row[2], 
              변환후: { startDate, endDate },
              근무형태: workType
            });
            
            // 필수 필드 검증
            if (!projectName || !startDate || !endDate) {
              console.warn(`행 ${i + 1}: 필수 필드가 누락되었습니다.`, { projectName, startDate, endDate });
              continue;
            }
            
            // 날짜 형식 검증 (YYYY-MM)
            const dateRegex = /^\d{4}-\d{2}$/;
            if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
              throw new Error(`행 ${i + 1}: 날짜 형식이 올바르지 않습니다. YYYY-MM 형식으로 입력해주세요. (예: 2023-04)`);
            }
            
            // 기간 계산
            const duration = calculateMonthsBetween(startDate, endDate);
            
            const project: CareerProject = {
              id: `project-${i}`,
              projectName,
              startDate,
              endDate,
              duration,
              role,
              client,
              skills,
              workType // 새로 추가된 필드
            };
            
            projects.push(project);
            
          } catch (error) {
            console.error(`행 ${i + 1} 파싱 오류:`, error);
            throw new Error(`행 ${i + 1}에서 오류가 발생했습니다: ${error}`);
          }
        }
        
        if (projects.length === 0) {
          throw new Error('유효한 프로젝트 데이터를 찾을 수 없습니다.');
        }
        
        console.log('✅ 엑셀 파싱 완료:', projects.length, '개 프로젝트');
        resolve(projects);
        
      } catch (error) {
        console.error('❌ 엑셀 파싱 실패:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('파일을 읽을 수 없습니다.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * 계산 결과를 포함한 엑셀 파일 다운로드
 */
export const downloadResultsExcel = (
  projects: CareerProject[], 
  stats: { 
    totalMonths: number; 
    uniqueMonths: number; 
    overlapMonths: number; 
  }
) => {
  try {
    // 프로젝트 데이터 준비
    const projectData = [
      ['사업명', '시작년월', '종료년월', '기간', '담당업무', '발주처', '기술스택', '근무형태'],
      ...projects.map(project => [
        project.projectName,
        project.startDate,
        project.endDate,
        `${project.duration}개월`,
        project.role,
        project.client,
        project.skills,
        project.workType || ''
      ])
    ];
    
    // 통계 데이터 준비
    const statsData = [
      ['', '', '', '', '', '', '', ''],
      ['경력 통계', '', '', '', '', '', '', ''],
      ['총 경력 기간 (중복 포함)', `${Math.floor(stats.totalMonths / 12)}년 ${stats.totalMonths % 12}개월`, '', '', '', '', '', ''],
      ['실제 경력 기간 (중복 제외)', `${Math.floor(stats.uniqueMonths / 12)}년 ${stats.uniqueMonths % 12}개월`, '', '', '', '', '', ''],
      ['중복 기간', `${Math.floor(stats.overlapMonths / 12)}년 ${stats.overlapMonths % 12}개월`, '', '', '', '', '', '']
    ];
    
    // 전체 데이터 결합
    const allData = [...projectData, ...statsData];
    
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '경력분석결과');
    
    // 파일 다운로드
    const fileName = `경력분석결과_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    console.log('✅ 결과 파일 다운로드 완료:', fileName);
    return true;
  } catch (error) {
    console.error('❌ 결과 다운로드 실패:', error);
    return false;
  }
};
