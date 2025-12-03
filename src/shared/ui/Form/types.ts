import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

/**
 * 공통 Form Field Props
 * 모든 Form 컴포넌트가 공유하는 기본 인터페이스
 */
export interface BaseFormFieldProps<T extends FieldValues> {
  /** 필드 이름 (React Hook Form의 Path 타입) */
  name: Path<T>;
  /** 필드 라벨 */
  label?: string;
  /** 필드 설명 (선택적) */
  description?: string;
  /** 필수 입력 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * Validation Rules
 * React Hook Form의 RegisterOptions를 직접 사용
 */
export type ValidationRules<T extends FieldValues> = Omit<
  RegisterOptions<T>,
  'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;

/**
 * Select/Radio 옵션 타입
 */
export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * 에러 메시지 타입
 */
export type ErrorMessage = string | undefined;

/**
 * Form Field Context 타입
 * useFormContext를 사용할 때의 컨텍스트 타입
 */
export interface FormFieldContextValue {
  name: string;
  error?: ErrorMessage;
  required?: boolean;
  disabled?: boolean;
}
