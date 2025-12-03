import { InputHTMLAttributes } from 'react';
import { FieldValues, Path, UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';
import { BaseFormFieldProps, ValidationRules } from './types';
import { buildValidationRules, cn } from './utils';
import { useFormField } from './hooks/useFormField';

/**
 * FormInput Component Props
 *
 * useFormContext를 사용하는 경우 register와 errors를 생략할 수 있습니다.
 */
interface FormInputProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>,
    BaseFormFieldProps<T> {
  /** React Hook Form register 함수 (useFormContext 사용 시 선택적) */
  register?: UseFormRegister<T>;
  /** Form errors 객체 (useFormContext 사용 시 선택적) */
  errors?: FieldErrors<T>;
  /** Validation 규칙 (RegisterOptions 직접 전달) */
  rules?: ValidationRules<T>;
  /** 편의 속성: 패턴 검증 */
  pattern?: {
    value: RegExp;
    message: string;
  };
  /** 편의 속성: 최소 길이 */
  minLength?: {
    value: number;
    message: string;
  };
  /** 편의 속성: 최대 길이 */
  maxLength?: {
    value: number;
    message: string;
  };
  /** 편의 속성: 최소값 (type="number"일 때) */
  min?: {
    value: number;
    message: string;
  };
  /** 편의 속성: 최대값 (type="number"일 때) */
  max?: {
    value: number;
    message: string;
  };
  /** 편의 속성: 커스텀 검증 함수 */
  validate?: RegisterOptions<T>['validate'];
}

/**
 * FormInput Component (리팩토링 버전)
 *
 * **개선 사항:**
 * - ✅ SOLID 원칙 준수 (SRP, OCP, DIP)
 * - ✅ useFormField 훅으로 공통 로직 추상화
 * - ✅ buildValidationRules로 validation 로직 분리
 * - ✅ Type assertion 제거 (타입 안전성 향상)
 * - ✅ useFormContext 지원 (props drilling 제거)
 * - ✅ rules prop으로 확장성 향상
 *
 * @example
 * ```tsx
 * // useFormContext 사용 (권장)
 * <FormProvider {...methods}>
 *   <FormInput
 *     name="email"
 *     label="이메일"
 *     rules={{ required: "필수 입력", pattern: { value: /.../, message: "형식 오류" } }}
 *   />
 * </FormProvider>
 *
 * // Standalone 모드
 * <FormInput
 *   name="email"
 *   label="이메일"
 *   register={register}
 *   errors={errors}
 *   required
 * />
 * ```
 */
export function FormInput<T extends FieldValues>({
  name,
  label,
  description,
  register: externalRegister,
  errors: externalErrors,
  required,
  disabled,
  rules,
  pattern,
  minLength,
  maxLength,
  min,
  max,
  validate,
  type = 'text',
  placeholder,
  className,
  ...rest
}: FormInputProps<T>) {
  // useFormField 훅으로 공통 로직 처리 (DIP 준수)
  const { register, error } = useFormField({
    name,
    register: externalRegister,
    errors: externalErrors,
  });

  // Validation 규칙 빌드 (OCP 준수 - 새로운 규칙 추가 시 컴포넌트 수정 불필요)
  const validationRules = buildValidationRules<T>({
    required,
    pattern,
    minLength,
    maxLength,
    min,
    max,
    validate,
    rules,
    label,
    name,
  });

  return (
    <div className={cn('form-input-wrapper', className)}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}
      {description && <p className="form-description">{description}</p>}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('form-input', error && 'error')}
        {...register(name, validationRules)}
        {...rest}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
