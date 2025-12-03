import { SelectHTMLAttributes } from 'react';
import { FieldValues, Path, UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';
import { BaseFormFieldProps, Option, ValidationRules } from './types';
import { buildValidationRules, cn } from './utils';
import { useFormField } from './hooks/useFormField';

/**
 * FormSelect Component Props
 */
interface FormSelectProps<T extends FieldValues>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'>,
    BaseFormFieldProps<T> {
  /** 셀렉트 옵션 목록 */
  options: Option[];
  /** React Hook Form register 함수 (useFormContext 사용 시 선택적) */
  register?: UseFormRegister<T>;
  /** Form errors 객체 (useFormContext 사용 시 선택적) */
  errors?: FieldErrors<T>;
  /** Validation 규칙 (RegisterOptions 직접 전달) */
  rules?: ValidationRules<T>;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 편의 속성: 커스텀 검증 함수 */
  validate?: RegisterOptions<T>['validate'];
}

/**
 * FormSelect Component (리팩토링 버전)
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
 * <FormSelect
 *   name="region"
 *   label="지역"
 *   options={[
 *     { value: 'seoul', label: '서울' },
 *     { value: 'busan', label: '부산' }
 *   ]}
 *   required
 * />
 * ```
 */
export function FormSelect<T extends FieldValues>({
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
  placeholder = '선택해주세요',
  className,
  ...rest
}: FormSelectProps<T>) {
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
    <div className={cn('form-select-wrapper', className)}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}
      {description && <p className="form-description">{description}</p>}
      <select
        id={name}
        disabled={disabled}
        className={cn('form-select', error && 'error')}
        {...register(name, validationRules)}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
