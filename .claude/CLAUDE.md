# 와들와들 히어로즈 프론트엔드 프로젝트 설정

## 패키지 관리자

**이 프로젝트에서는 npm을 사용합니다.**

- ✅ 사용: `npm install`, `npm run dev`, `npm run build`
- ❌ 사용 금지: `pnpm`, `yarn`, `bun`

## 프로젝트 정보

- **프레임워크**: React 19 + Vite + TypeScript
- **라우팅**: React Router DOM v7
- **폼 관리**: React Hook Form
- **UI 라이브러리**: @vapor-ui

## 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 주요 아키텍처 패턴

### Funnel 패턴
- Compound Component 패턴 사용
- `useFunnel` 훅으로 다단계 폼 관리
- History API (`history.push`, `history.back`)로 단계 전환

### Form 컴포넌트
- React Hook Form 기반
- Compound Component 패턴 (`FormField.Label`, `FormField.Error`)
- 타입 안전성 보장

## 코딩 규칙

1. **타입 안전성**: `any` 사용 금지, 제네릭 활용
2. **SOLID 원칙**: 특히 SRP(단일 책임 원칙) 준수
3. **선언적 API**: Compound Component, Render Props 활용
4. **as const**: 리터럴 타입 추론을 위해 배열/객체에 `as const` 사용
