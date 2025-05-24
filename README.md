# 경력 기간 계산기 (Career Period Calculator)

프리랜서 경력의 중복 기간을 자동으로 계산해주는 웹 애플리케이션입니다.

<img width="1706" alt="image" src="https://github.com/user-attachments/assets/9ae3248e-2b69-4df8-9806-d86b20d1fac0" />
<img width="1704" alt="image" src="https://github.com/user-attachments/assets/fc8272be-6fba-4569-8677-82de54338a4c" />



## 🚀 주요 기능

- ✅ **엑셀 파일 업로드** - 기존 경력 데이터를 쉽게 가져오기
- 📥 **템플릿 다운로드** - 표준화된 양식으로 데이터 입력
- 🧮 **자동 중복 계산** - 겹치는 프로젝트 기간을 정확하게 분석
- 📊 **시각적 통계** - 총 경력/실제 경력/중복 기간을 한눈에 확인
- 💾 **결과 다운로드** - 분석 결과를 엑셀 파일로 저장
- 🎨 **반응형 디자인** - 모바일/데스크톱 모든 환경에서 사용 가능

## 🛠 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **File Processing**: xlsx
- **Charts**: recharts

## 🎯 사용 대상

- **프리랜서**: 여러 프로젝트를 동시에 진행하여 중복 기간 계산이 필요한 경우
- **인사담당자**: 지원자의 경력을 정확하게 검증해야 하는 경우  
- **개발자**: 자신의 경력을 체계적으로 관리하고 싶은 경우

## 📦 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/soheekimdev/career-period-calculator.git
cd career-period-calculator

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 📝 사용법

### 1. 템플릿 다운로드
- "템플릿 다운로드" 버튼을 클릭하여 엑셀 양식을 받습니다

### 2. 경력 정보 입력
- 사업명, 시작년월(YYYY-MM), 종료년월(YYYY-MM), 담당업무, 발주처, 기술스택, 근무형태를 입력합니다

### 3. 파일 업로드
- 작성된 엑셀 파일을 드래그&드롭 또는 클릭하여 업로드합니다

### 4. 결과 확인
- 자동으로 계산된 중복 기간과 실제 경력을 확인합니다
- "결과 다운로드" 버튼으로 분석 결과를 저장할 수 있습니다

## 🧮 계산 알고리즘

이 도구는 **구간 병합(Interval Merging)** 알고리즘을 사용합니다:

1. 모든 프로젝트 기간을 월 단위로 변환
2. 겹치는 구간들을 자동으로 병합
3. 총 경력 - 실제 경력 = 중복 기간으로 계산

**예시:**
- 프로젝트 A: 2023-04 ~ 2023-09 (6개월)
- 프로젝트 B: 2023-08 ~ 2023-12 (5개월)  
- 총 경력: 11개월, 실제 경력: 9개월, **중복: 2개월**

## 🗂 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── FileUploader.tsx # 파일 업로드 및 템플릿 다운로드
│   ├── ProjectTable.tsx # 프로젝트 목록 테이블
│   └── StatsDisplay.tsx # 통계 카드 표시
├── types/              # TypeScript 타입 정의
│   └── career.ts       # 경력 관련 타입
├── utils/              # 유틸리티 함수
│   ├── careerCalculator.ts # 중복 계산 알고리즘
│   ├── dateUtils.ts        # 날짜 처리 함수
│   └── excelUtils.ts       # 엑셀 파일 처리
├── tests/              # 테스트 파일
└── App.tsx            # 메인 앱 컴포넌트
```

## 🤝 기여하기

버그 리포트, 기능 제안, Pull Request 모두 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👩‍💻 개발자

**김소희 (Sohee Kim)**
- GitHub: [@soheekimdev](https://github.com/soheekimdev)
- Email: soheekim.dev@gmail.com

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!
