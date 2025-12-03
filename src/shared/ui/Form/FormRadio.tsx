import { InputHTMLAttributes } from 'react';
import { FieldValues, Path, UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';
import { BaseFormFieldProps, Option, ValidationRules } from './types';
import { buildValidationRules, cn } from './utils';
import { useFormField } from './hooks/useFormField';
import styles from "./FormRadio.module.css";

/**
 * FormRadio Component Props
 */
interface FormRadioProps<T extends FieldValues>
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'>,
    BaseFormFieldProps<T> {
  /** 라디오 버튼 옵션 목록 */
  options: Option[];
  /** React Hook Form register 함수 (useFormContext 사용 시 선택적) */
  register?: UseFormRegister<T>;
  /** Form errors 객체 (useFormContext 사용 시 선택적) */
  errors?: FieldErrors<T>;
  /** Validation 규칙 (RegisterOptions 직접 전달) */
  rules?: ValidationRules<T>;
  /** 라디오 버튼 정렬 방향 */
  direction?: 'horizontal' | 'vertical';
  /** 편의 속성: 커스텀 검증 함수 */
  validate?: RegisterOptions<T>['validate'];
}

/**
 * FormRadio Component (리팩토링 버전)
 *
 * **개선 사항:**
 * - ✅ SOLID 원칙 준수 (SRP, OCP, DIP)
 * - ✅ useFormField 훅으로 공통 로직 추상화
 * - ✅ buildValidationRules로 validation 로직 분리
 * - ✅ Type assertion 제거 (타입 안전성 향상)
 * - ✅ useFormContext 지원 (props drilling 제거)
 * - ✅ Option 타입 공통화
 *
 * @example
 * ```tsx
 * // useFormContext 사용
 * <FormRadio
 *   name="gender"
 *   label="성별"
 *   options={[
 *     { value: 'male', label: '남성' },
 *     { value: 'female', label: '여성' }
 *   ]}
 *   required
 * />
 * ```
 */
export function FormRadio<T extends FieldValues>({
  name,
  label,
  description,
  options,
  register: externalRegister,
  errors: externalErrors,
  required,
  disabled,
  rules,
  validate,
  direction = 'horizontal',
  className,
  ...rest
}: FormRadioProps<T>) {
  // useFormField 훅으로 공통 로직 처리
  const { register, error } = useFormField({
    name,
    register: externalRegister,
    errors: externalErrors,
  });

  // Validation 규칙 빌드
  const validationRules = buildValidationRules<T>({
    required,
    validate,
    rules,
    label,
    name,
  });

  return (
    <div className={cn('form-radio-wrapper', className, styles.formRadio)}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}
      {description && <p className="form-description">{description}</p>}
      <div className={cn('radio-group', direction)}>
        {options.map((option) => (
          <label key={option.value} className={cn('radio-label', option.disabled && 'disabled')}>
            <input
              type="radio"
              value={option.value}
              disabled={disabled || option.disabled}
              className="radio-input"
              {...register(name, validationRules)}
              {...rest}
            />
            <span className="radio-text">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
