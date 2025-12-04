# Funnel 패턴 with @use-funnel

이 프로젝트는 **Toss의 `@use-funnel/react-router-dom` 라이브러리**를 사용하여 다단계 폼(Funnel)을 구현합니다.

## 설치된 라이브러리

```json
{
  "@use-funnel/react-router-dom": "^0.0.15"
}
```

## 왜 @use-funnel을 사용하나요?

- ✅ **타입 안전성**: 각 단계별 context 타입을 엄격하게 관리
- ✅ **브라우저 히스토리 통합**: 뒤로가기/앞으로가기 자동 지원
- ✅ **React Router DOM 완벽 연동**: URL 기반 상태 관리
- ✅ **간결한 API**: `funnel.Render` 컴포넌트로 선언적 작성
- ✅ **Toss 검증됨**: 토스 프로덕션 환경에서 사용 중

---

## 기본 사용법

### 1단계: 단계별 타입 정의

각 단계에서 필요한 데이터 구조를 TypeScript 타입으로 정의합니다.

```typescript
type SignupSteps = {
  email: {
    email?: string;
  };
  password: {
    email: string;
    password?: string;
  };
  complete: {
    email: string;
    password: string;
  };
};
```

**중요**: 이전 단계의 필수 데이터는 다음 단계에서 필수 타입으로 정의하세요.

---

### 2단계: useFunnel 훅 초기화

```typescript
import { useFunnel } from '@use-funnel/react-router-dom';
// 또는
import { useFunnel } from '@/shared/ui/Funnel';

export default function SignupPage() {
  const funnel = useFunnel<SignupSteps>({
    id: 'signup-flow',
    initial: {
      step: 'email',
      context: {},
    },
  });

  // funnel 객체에는 다음이 포함됩니다:
  // - funnel.step: 현재 단계 (string)
  // - funnel.context: 현재 단계의 데이터 (타입 안전)
  // - funnel.history: 단계 전환 메서드 (push, replace, back)
  // - funnel.Render: 단계별 UI 렌더링 컴포넌트
}
```

---

### 3단계: funnel.Render로 단계별 UI 구성

```tsx
return (
  <funnel.Render
    email={({ history }) => (
      <EmailForm
        onNext={(email) => history.push('password', { email })}
      />
    )}
    password={({ context, history }) => (
      <PasswordForm
        email={context.email} // 타입 안전: string (필수)
        onNext={(password) => history.push('complete', { password })}
        onBack={() => history.back()}
      />
    )}
    complete={({ context }) => (
      <CompletePage
        email={context.email}
        password={context.password}
      />
    )}
  />
);
```

---

## 핵심 API

### useFunnel 반환값

```typescript
const funnel = useFunnel<StepsType>({ id, initial });

// funnel 객체 구조
{
  step: string;           // 현재 단계
  context: any;           // 현재 context (타입 안전)
  history: {
    push(step, data),     // 다음 단계로 이동 + 데이터 전달
    replace(data),        // 현재 단계 context 업데이트 (이동 X)
    back(),               // 이전 단계로 이동 (브라우저 뒤로가기)
  },
  Render: Component,      // 단계별 렌더링 컴포넌트
}
```

### funnel.Render Props

각 단계 prop은 **함수**이며, 다음 인자를 받습니다:

```typescript
stepName={({ context, history }) => {
  // context: 현재 단계의 타입 안전한 데이터
  // history: 단계 전환 메서드
  return <YourComponent />;
}}
```

---

## 실전 예제 (ExperienceForm)

프로젝트의 `src/pages/ExperienceForm.tsx`를 참고하세요.

```tsx
type ExperienceFormSteps = {
  category: { category?: string };
  experience: { category: string; experienceYears?: number };
  occupation: { category: string; experienceYears: number; occupation?: string };
  // ... 더 많은 단계
};

export default function ExperienceForm() {
  const funnel = useFunnel<ExperienceFormSteps>({
    id: 'experience-form',
    initial: { step: 'category', context: {} },
  });

  return (
    <funnel.Render
      category={({ history }) => (
        <VStack>
          <Text>어떤 종류의 체험을 제공하시나요?</Text>
          <CategoryCard onChange={(value) => history.push('experience', { category: value })} />
        </VStack>
      )}
      experience={({ context, history }) => (
        <VStack>
          <Text>{context.category} 분야에서 몇 년 일하셨나요?</Text>
          <NumberInput onChange={(years) => history.push('occupation', { experienceYears: years })} />
          <Button onClick={() => history.back()}>이전</Button>
        </VStack>
      )}
      {/* ... 더 많은 단계 */}
    />
  );
}
```

---

## 고급 기능

### 1. 조건부 단계 전환

```typescript
category={({ history }) => {
  const handleNext = (category: string) => {
    if (category === 'premium') {
      history.push('payment', { category });
    } else {
      history.push('basic', { category });
    }
  };

  return <CategorySelector onSelect={handleNext} />;
}}
```

### 2. 이벤트 기반 전환 (funnel.Render.with)

복잡한 이벤트 처리가 필요한 경우:

```typescript
<funnel.Render
  stepName={funnel.Render.with({
    events: {
      success: (data, { history }) => history.push('nextStep', data),
      error: (error, { history }) => history.push('errorStep', { error }),
    },
    render({ dispatch }) {
      return (
        <Form
          onSuccess={(data) => dispatch('success', data)}
          onError={(error) => dispatch('error', error)}
        />
      );
    },
  })}
/>
```

### 3. 오버레이 단계 (funnel.Render.overlay)

이전 단계를 유지하면서 모달처럼 표시:

```typescript
<funnel.Render
  termsModal={funnel.Render.overlay({
    render({ close }) {
      return <TermsModal onClose={close} />;
    },
  })}
/>
```

---

## 진행 상황 표시 (FunnelProgressBar)

이 프로젝트는 독립적인 `FunnelProgressBar` 컴포넌트를 제공합니다.

```tsx
import { FunnelProgressBar } from '@/shared/ui/Funnel';

const steps = ['category', 'experience', 'occupation', 'location', 'name'];
const currentIndex = steps.indexOf(funnel.step) + 1;

<FunnelProgressBar
  totalSteps={steps.length}
  currentStep={currentIndex}
  stepLabels={['카테고리', '경력', '직업', '장소', '이름']}
/>
```

---

## 주의사항

### 1. 타입 정의 규칙

❌ **잘못된 예시**:
```typescript
type Steps = {
  step1: { data?: string };
  step2: { data?: string }; // data가 필수인데 optional!
};
```

✅ **올바른 예시**:
```typescript
type Steps = {
  step1: { data?: string };
  step2: { data: string }; // 이전 단계 데이터는 필수
};
```

### 2. context vs formData

- `funnel.context`: Funnel 라이브러리가 관리하는 상태 (단계 간 전환)
- `formData`: 로컬 state로 관리하는 입력 중 데이터

대부분의 경우 `formData`를 사용하고, 단계 전환 시에만 `history.push`로 context에 전달하는 패턴을 권장합니다.

### 3. history.back() vs history.replace()

- `history.back()`: 브라우저 뒤로가기 (권장)
- `history.replace()`: context만 업데이트 (단계 이동 X)

---

## 공식 문서

더 자세한 내용은 @use-funnel 공식 문서를 참고하세요:

- 📚 **공식 문서**: https://use-funnel.slash.page/ko
- 📘 **funnel.Render 가이드**: https://use-funnel.slash.page/ko/docs/funnel-render
- 🔧 **API 레퍼런스**: https://use-funnel.slash.page/ko/docs/use-funnel
- 💡 **예제**: https://use-funnel.slash.page/ko/docs/example

---

## 마이그레이션 노트

이전에는 커스텀 `useFunnel` 래퍼를 사용했으나, 2024년 12월부터 공식 라이브러리로 완전 전환했습니다.

### 변경 사항

| 이전 (커스텀)                             | 현재 (라이브러리)                        |
|----------------------------------------|--------------------------------------|
| `useFunnel(steps, options)`            | `useFunnel({ id, initial })`         |
| `[Funnel, state, history]` (튜플)      | `funnel` (객체)                       |
| `<Funnel><Funnel.Step>`                | `<funnel.Render stepName={...} />`   |
| `state.currentStep`                    | `funnel.step`                        |
| `state.context`                        | `funnel.context`                     |

### 이점

- ✅ 238라인의 커스텀 코드 제거
- ✅ 라이브러리 업데이트 자동 반영
- ✅ 공식 문서 및 커뮤니티 지원
- ✅ 더 간결한 코드 (40% 감소)
