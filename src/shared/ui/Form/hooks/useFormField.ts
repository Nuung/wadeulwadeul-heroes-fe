import { useFormContext, FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form';
import { getErrorMessage } from '../utils';
import { ErrorMessage } from '../types';

/**
 * useFormField 훅의 반환 타입
 */
interface UseFormFieldReturn<T extends FieldValues> {
  /** React Hook Form의 register 함수 */
  register: UseFormRegister<T>;
  /** 현재 필드의 에러 메시지 */
  error: ErrorMessage;
  /** Form의 모든 에러 객체 */
  errors: FieldErrors<T>;
  /** Form Context 사용 여부 */
  isInFormContext: boolean;
}

/**
 * useFormField 훅의 옵션 타입
 */
interface UseFormFieldOptions<T extends FieldValues> {
  /** 필드 이름 */
  name: Path<T>;
  /** 외부에서 전달된 register 함수 (선택적) */
  register?: UseFormRegister<T>;
  /** 외부에서 전달된 errors 객체 (선택적) */
  errors?: FieldErrors<T>;
}

/**
 * Form Field의 공통 로직을 처리하는 커스텀 훅
 *
 * 이 훅은 두 가지 모드로 동작합니다:
 * 1. **FormContext 모드**: FormProvider 내부에서 사용될 때 자동으로 form context를 가져옴
 * 2. **Standalone 모드**: register와 errors를 props로 전달받아 사용
 *
 * 이를 통해 의존성 역전 원칙(DIP)을 준수하면서도 편의성을 제공합니다.
 *
 * @example
 * ```tsx
 * // FormContext 모드 (권장)
 * function MyInput({ name }) {
 *   const { register, error } = useFormField({ name });
 *   return <input {...register(name)} />;
 * }
 *
 * // Standalone 모드
 * function MyInput({ name, register, errors }) {
 *   const { register: reg, error } = useFormField({ name, register, errors });
 *   return <input {...reg(name)} />;
 * }
 * ```
 */
export function useFormField<T extends FieldValues>({
  name,
  register: externalRegister,
  errors: externalErrors,
}: UseFormFieldOptions<T>): UseFormFieldReturn<T> {
  // FormContext가 있는지 확인
  let formContext;
  let hasFormContext = false;

  try {
    formContext = useFormContext<T>();
    hasFormContext = true;
  } catch (error) {
    // FormContext가 없으면 외부 props 사용
    hasFormContext = false;
  }

  // register와 errors 결정
  const register = externalRegister || (formContext?.register as UseFormRegister<T>);
  const errors = externalErrors || (formContext?.formState.errors as FieldErrors<T>);

  // register가 없으면 에러
  if (!register) {
    throw new Error(
      `useFormField: "${String(name)}" 필드에 대한 register 함수를 찾을 수 없습니다. ` +
        'FormProvider 내부에서 사용하거나 register prop을 전달해주세요.'
    );
  }

  // 에러 메시지 추출
  const error = getErrorMessage(errors, name);

  return {
    register,
    error,
    errors: errors || ({} as FieldErrors<T>),
    isInFormContext: hasFormContext,
  };
}
