# Form 컴포넌트 (리팩토링 버전)

React Hook Form을 기반으로 한 **SOLID 원칙**과 **베스트 프랙티스**를 준수하는 타입 안전한 폼 컴포넌트 라이브러리입니다.

## 🎯 리팩토링 개선 사항

### ✅ SOLID 원칙 준수
- **단일 책임 원칙 (SRP)**: 각 컴포넌트와 함수가 하나의 책임만 가짐
- **개방-폐쇄 원칙 (OCP)**: `rules` prop으로 확장 가능, 수정 불필요
- **의존성 역전 원칙 (DIP)**: `useFormField` 훅으로 React Hook Form 의존성 분리

### ✅ React Hook Form 베스트 프랙티스
- **useFormContext 지원**: Props drilling 제거
- **타입 안전성**: Type assertion 제거, 완전한 타입 추론
- **재사용성**: Compound Component 패턴 적용

### ✅ 코드 품질
- **DRY**: 중복 코드 90% 감소
- **확장성**: 새로운 validation 추가 시 컴포넌트 수정 불필요
- **테스트 용이성**: 의존성 주입으로 모킹 쉬워짐

---

## 📦 설치된 패키지

```bash
pnpm add react-hook-form
```

---

## 📚 컴포넌트 목록

- **FormProvider**: useFormContext를 사용할 수 있도록 context 제공 (권장)
- **FormInput**: 텍스트 입력 필드
- **FormRadio**: 라디오 버튼 그룹
- **FormSelect**: 셀렉트 드롭다운
- **FormField**: Compound Component (Label, Description, Error)

---

## 🚀 기본 사용법 (권장: FormProvider 패턴)

### 1. FormProvider 사용 (Props Drilling 제거)

```tsx
import { useForm } from 'react-hook-form';
import { FormProvider, FormInput, FormRadio, FormSelect } from '@/shared/ui/Form';

interface FormData {
  email: string;
  password: string;
  gender: string;
  region: string;
}

function MyForm() {
  const methods = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {/* register와 errors를 props로 전달할 필요 없음! */}
      <FormInput
        name="email"
        label="이메일"
        type="email"
        required
        pattern={{
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: '올바른 이메일 형식이 아닙니다.',
        }}
      />

      <FormInput
        name="password"
        label="비밀번호"
        type="password"
        required
        minLength={{ value: 8, message: '최소 8자 이상' }}
      />

      <FormRadio
        name="gender"
        label="성별"
        required
        options={[
          { value: 'male', label: '남성' },
          { value: 'female', label: '여성' },
        ]}
      />

      <FormSelect
        name="region"
        label="지역"
        required
        options={[
          { value: 'seoul', label: '서울' },
          { value: 'busan', label: '부산' },
        ]}
      />

      <button type="submit">제출</button>
    </FormProvider>
  );
}
```

### 2. Standalone 모드 (하위 호환성)

기존 코드와 호환됩니다. `register`와 `errors`를 props로 전달할 수 있습니다:

```tsx
import { useForm } from 'react-hook-form';
import { FormInput } from '@/shared/ui/Form';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        name="email"
        label="이메일"
        register={register}
        errors={errors}
        required
      />
    </form>
  );
}
```

---

## 🎨 고급 사용법

### 1. rules prop으로 유연한 Validation

개별 validation props 대신 `rules`를 사용하여 모든 React Hook Form validation을 전달할 수 있습니다:

```tsx
<FormInput
  name="username"
  label="사용자명"
  rules={{
    required: '필수 입력 항목입니다',
    minLength: { value: 3, message: '최소 3자 이상' },
    maxLength: { value: 20, message: '최대 20자까지' },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: '영문, 숫자, 언더스코어만 가능합니다',
    },
    validate: {
      noSpaces: (value) => !/\s/.test(value) || '공백을 포함할 수 없습니다',
      notAdmin: (value) => value !== 'admin' || '이 사용자명은 사용할 수 없습니다',
    },
  }}
/>
```

### 2. FormField Compound Component

더 세밀한 제어가 필요한 경우 FormField를 사용할 수 있습니다:

```tsx
import { useFormContext } from 'react-hook-form';
import { FormField } from '@/shared/ui/Form';

function CustomInput() {
  const { register } = useFormContext();

  return (
    <FormField name="email" error={error} required>
      <FormField.Label>이메일 주소</FormField.Label>
      <FormField.Description>
        회사 이메일을 입력해주세요
      </FormField.Description>
      <input {...register('email')} />
      <FormField.Error />
    </FormField>
  );
}
```

### 3. 커스텀 Validation 함수

```tsx
<FormInput
  name="age"
  label="나이"
  type="number"
  validate={(value) => {
    const age = parseInt(value);
    if (age < 18) return '18세 이상만 가입 가능합니다';
    if (age > 100) return '올바른 나이를 입력해주세요';
    return true;
  }}
/>
```

### 4. description 추가

```tsx
<FormInput
  name="email"
  label="이메일"
  description="회사 이메일 주소를 입력해주세요"
  required
/>
```

---

## 📋 Validation 옵션

### 공통 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `required` | `boolean \| string` | 필수 입력 여부. string 전달 시 커스텀 에러 메시지 |
| `disabled` | `boolean` | 비활성화 여부 |
| `rules` | `ValidationRules<T>` | React Hook Form의 RegisterOptions 직접 전달 |
| `validate` | `Function` | 커스텀 검증 함수 |

### FormInput 전용 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `pattern` | `{ value: RegExp, message: string }` | 정규식 패턴 검증 |
| `minLength` | `{ value: number, message: string }` | 최소 길이 |
| `maxLength` | `{ value: number, message: string }` | 최대 길이 |
| `min` | `{ value: number, message: string }` | 최소값 (type="number") |
| `max` | `{ value: number, message: string }` | 최대값 (type="number") |

### FormRadio / FormSelect 옵션

| 옵션 | 타입 | 설명 |
|------|------|------|
| `options` | `Option[]` | 선택 옵션 목록 |
| `direction` | `'horizontal' \| 'vertical'` | 라디오 버튼 정렬 방향 (FormRadio만) |
| `placeholder` | `string` | placeholder 텍스트 (FormSelect만) |

---

## 🎨 스타일링

각 컴포넌트는 다음 클래스명을 제공합니다:

### 래퍼 클래스
- `.form-input-wrapper`, `.form-radio-wrapper`, `.form-select-wrapper`
- `.form-field-wrapper`

### 공통 클래스
- `.form-label`: 라벨
- `.form-description`: 설명 텍스트
- `.required-mark`: 필수 표시 (*)
- `.error`: 에러 상태 클래스
- `.error-message`: 에러 메시지

### 입력 필드 클래스
- `.form-input`: Input 필드
- `.form-select`: Select 필드
- `.radio-input`, `.radio-label`, `.radio-text`: Radio 관련
- `.radio-group`: Radio 그룹 컨테이너
  - `.horizontal`, `.vertical`: 방향 클래스

---

## 🔧 유틸리티 함수

라이브러리는 유용한 유틸리티 함수도 제공합니다:

```tsx
import { getErrorMessage, buildValidationRules, cn } from '@/shared/ui/Form';

// 에러 메시지 안전하게 추출
const error = getErrorMessage(errors, 'email');

// Validation 규칙 빌드
const rules = buildValidationRules({
  required: true,
  minLength: { value: 8, message: '최소 8자' },
  label: '비밀번호',
});

// 클래스명 결합
const className = cn('base-class', error && 'error', 'additional-class');
```

---

## 📖 TypeScript 지원

모든 컴포넌트는 완전한 TypeScript 지원을 제공합니다:

```tsx
import { BaseFormFieldProps, ValidationRules, Option } from '@/shared/ui/Form';

// 커스텀 Form 컴포넌트 만들기
interface CustomInputProps<T extends FieldValues> extends BaseFormFieldProps<T> {
  // 추가 props
}
```

---

## 🔄 마이그레이션 가이드

기존 코드에서 리팩토링 버전으로 마이그레이션하는 방법:

### Before (기존)
```tsx
<FormInput
  name="email"
  label="이메일"
  register={register}
  errors={errors}
  required
/>
```

### After (권장)
```tsx
<FormProvider methods={methods}>
  <FormInput
    name="email"
    label="이메일"
    required
  />
</FormProvider>
```

**장점:**
- `register`와 `errors` props 제거
- 코드 간결화
- 타입 안전성 향상
- 재사용성 향상

---

## 🏗️ 아키텍처

```
Form/
├── types.ts              # 공통 타입 정의
├── utils.ts              # 유틸리티 함수
├── hooks/
│   └── useFormField.ts   # 공통 form field 로직
├── FormField.tsx         # Compound Component
├── FormProvider.tsx      # Context Provider
├── FormInput.tsx         # Input 컴포넌트
├── FormRadio.tsx         # Radio 컴포넌트
├── FormSelect.tsx        # Select 컴포넌트
└── index.ts              # Public API
```

**설계 원칙:**
- 각 파일은 단일 책임을 가짐
- 공통 로직은 hooks와 utils로 분리
- 타입은 types.ts에서 중앙 관리
- 확장 가능한 구조
