# Funnel 컴포넌트

다단계 폼(Funnel)을 타입 안전하게 구현하기 위한 컴포넌트와 훅입니다.

## 개요

Funnel 패턴은 사용자를 여러 단계를 거쳐 하나의 목표로 안내하는 UI 패턴입니다. 주로 회원가입, 온보딩, 설문조사 등에서 사용됩니다.

이 라이브러리는 각 단계별로 필요한 데이터를 타입 안전하게 관리하며, 단계 간 전환과 상태 관리를 쉽게 할 수 있도록 도와줍니다.

## 설치된 패키지

```bash
pnpm add @use-funnel/react-router-dom
```

## 주요 기능

- ✅ TypeScript 타입 안전성
- ✅ 단계별 context 관리
- ✅ 히스토리 관리 (뒤로 가기 지원)
- ✅ 진행 상황 표시 (ProgressBar)
- ✅ React Hook Form과 완벽한 통합

## 기본 사용법

### 1. 단계별 타입 정의

먼저 각 단계에서 필요한 데이터 구조를 정의합니다:

```tsx
type OnboardingSteps = {
  email: {
    email?: string;
  };
  password: {
    email: string;
    password?: string;
  };
  profile: {
    email: string;
    password: string;
    nickname?: string;
    region?: string;
  };
};
```

각 단계마다 필수 필드가 달라지는 것을 주목하세요. 이를 통해 타입 안전성을 보장합니다.

### 2. useFunnel 훅 사용

```tsx
import { useFunnel } from '@/shared/ui/Funnel';

function OnboardingPage() {
  const funnel = useFunnel<OnboardingSteps>('email', {});

  return (
    <div>
      <h1>회원가입</h1>
      {/* Funnel 컴포넌트 사용 */}
    </div>
  );
}
```

### 3. Funnel 컴포넌트로 단계 렌더링

```tsx
import { Funnel } from '@/shared/ui/Funnel';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/shared/ui/Form';

function OnboardingPage() {
  const funnel = useFunnel<OnboardingSteps>('email', {});

  return (
    <Funnel
      currentStep={funnel.currentStep}
      context={funnel.context}
      onNext={funnel.setStep}
      onPrev={funnel.canGoBack ? funnel.goBack : undefined}
      steps={{
        email: ({ onNext }) => {
          const { register, handleSubmit, formState: { errors } } = useForm();

          return (
            <form onSubmit={handleSubmit((data) => onNext('password', data))}>
              <h2>이메일 입력</h2>
              <FormInput
                name="email"
                label="이메일"
                type="email"
                register={register}
                errors={errors}
                required
              />
              <button type="submit">다음</button>
            </form>
          );
        },

        password: ({ context, onNext, onPrev }) => {
          const { register, handleSubmit, formState: { errors } } = useForm();

          return (
            <form onSubmit={handleSubmit((data) => onNext('profile', data))}>
              <h2>비밀번호 입력</h2>
              <p>이메일: {context.email}</p>
              <FormInput
                name="password"
                label="비밀번호"
                type="password"
                register={register}
                errors={errors}
                required
                minLength={{ value: 8, message: '최소 8자 이상' }}
              />
              <button type="button" onClick={onPrev}>이전</button>
              <button type="submit">다음</button>
            </form>
          );
        },

        profile: ({ context, onNext }) => {
          const { register, handleSubmit, formState: { errors } } = useForm();

          return (
            <form onSubmit={handleSubmit((data) => {
              console.log('최종 데이터:', { ...context, ...data });
              // 회원가입 API 호출 등
            })}>
              <h2>프로필 입력</h2>
              <FormInput
                name="nickname"
                label="닉네임"
                register={register}
                errors={errors}
                required
              />
              <button type="submit">완료</button>
            </form>
          );
        },
      }}
    />
  );
}
```

## 진행 상황 표시

`FunnelProgressBar` 컴포넌트를 사용하여 사용자에게 진행 상황을 보여줄 수 있습니다:

```tsx
import { FunnelProgressBar } from '@/shared/ui/Funnel';

function OnboardingPage() {
  const funnel = useFunnel<OnboardingSteps>('email', {});

  const stepOrder: Array<keyof OnboardingSteps> = ['email', 'password', 'profile'];
  const currentStepIndex = stepOrder.indexOf(funnel.currentStep) + 1;

  return (
    <div>
      <FunnelProgressBar
        totalSteps={stepOrder.length}
        currentStep={currentStepIndex}
        stepLabels={['이메일', '비밀번호', '프로필']}
      />

      <Funnel
        currentStep={funnel.currentStep}
        context={funnel.context}
        onNext={funnel.setStep}
        steps={{...}}
      />
    </div>
  );
}
```

## useFunnel API

### 반환값

- `currentStep`: 현재 활성화된 단계
- `context`: 현재까지 수집된 모든 데이터
- `history`: 단계 이동 히스토리
- `setStep(step, data?)`: 다음 단계로 이동하면서 데이터 저장
- `goBack()`: 이전 단계로 이동
- `goToStep(step)`: 특정 단계로 직접 이동
- `updateContext(data)`: context만 업데이트 (단계 이동 없이)
- `reset()`: 초기 상태로 리셋
- `canGoBack`: 뒤로 가기 가능 여부

### 사용 예제

```tsx
// 다음 단계로 이동하면서 데이터 저장
funnel.setStep('password', { email: 'user@example.com' });

// 이전 단계로 이동
funnel.goBack();

// context만 업데이트
funnel.updateContext({ nickname: 'johndoe' });

// 처음부터 다시 시작
funnel.reset();
```

## Form 컴포넌트와 함께 사용

Funnel은 같은 폴더의 Form 컴포넌트와 완벽하게 통합됩니다:

```tsx
import { FormInput, FormRadio, FormSelect } from '@/shared/ui/Form';
import { Funnel, useFunnel } from '@/shared/ui/Funnel';
import { useForm } from 'react-hook-form';

// 단계별 폼을 쉽게 구성할 수 있습니다
```

## 스타일링

Funnel 컴포넌트는 다음 클래스명을 제공합니다:

- `.funnel-container`: Funnel 컨테이너
- `.funnel-progress-bar`: ProgressBar 컨테이너
- `.progress-track`: 진행 바 트랙
- `.progress-fill`: 진행 바 채우기
- `.progress-labels`: 단계 레이블 컨테이너
- `.progress-label`: 개별 단계 레이블
  - `.active`: 현재 단계
  - `.completed`: 완료된 단계
- `.progress-text`: 진행 상황 텍스트

## 고급 사용법

### 조건부 단계

특정 조건에 따라 단계를 건너뛸 수 있습니다:

```tsx
const handleNext = (data: any) => {
  if (data.skipProfile) {
    funnel.setStep('complete', data);
  } else {
    funnel.setStep('profile', data);
  }
};
```

### 데이터 영속성

브라우저 새로고침 시에도 데이터를 유지하려면 localStorage를 활용할 수 있습니다:

```tsx
const [initialContext] = useState(() => {
  const saved = localStorage.getItem('onboarding-context');
  return saved ? JSON.parse(saved) : {};
});

const funnel = useFunnel<OnboardingSteps>('email', initialContext);

useEffect(() => {
  localStorage.setItem('onboarding-context', JSON.stringify(funnel.context));
}, [funnel.context]);
```
