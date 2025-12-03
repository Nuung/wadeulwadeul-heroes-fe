import { FieldError, FieldErrors, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { ErrorMessage, ValidationRules } from './types';

/**
 * FieldErrors에서 안전하게 에러 메시지를 추출합니다.
 * Type assertion을 사용하지 않고 타입 가드로 안전하게 처리합니다.
 *
 * @param errors - React Hook Form의 FieldErrors 객체
 * @param name - 필드 이름
 * @returns 에러 메시지 문자열 또는 undefined
 */
export function getErrorMessage<T extends FieldValues>(
  errors: FieldErrors<T> | undefined,
  name: Path<T>
): ErrorMessage {
  if (!errors) return undefined;

  const error = errors[name];
  if (!error) return undefined;

  // FieldError 타입 가드
  if (isFieldError(error)) {
    return error.message;
  }

  return undefined;
}

/**
 * FieldError 타입 가드
 */
function isFieldError(error: unknown): error is FieldError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    (typeof (error as FieldError).message === 'string' || (error as FieldError).message === undefined)
  );
}

/**
 * Validation 규칙을 빌드하는 헬퍼 함수
 * 개별 validation props를 RegisterOptions로 변환합니다.
 *
 * @param options - Validation 옵션들
 * @returns RegisterOptions 객체
 */
export function buildValidationRules<T extends FieldValues>(options: {
  required?: boolean | string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  validate?: RegisterOptions<T>['validate'];
  rules?: ValidationRules<T>;
  label?: string;
  name?: string;
}): RegisterOptions<T> {
  const { required, pattern, minLength, maxLength, min, max, validate, rules, label, name } = options;

  // rules가 제공되면 우선 사용
  if (rules) {
    return rules as RegisterOptions<T>;
  }

  // 개별 옵션들을 RegisterOptions로 변환
  const validationRules: RegisterOptions<T> = {};

  if (required !== undefined) {
    validationRules.required =
      typeof required === 'string' ? required : required ? `${label || name || '이 필드'}은(는) 필수 입력 항목입니다.` : false;
  }

  if (pattern) {
    validationRules.pattern = {
      value: pattern.value,
      message: pattern.message,
    };
  }

  if (minLength) {
    validationRules.minLength = {
      value: minLength.value,
      message: minLength.message,
    };
  }

  if (maxLength) {
    validationRules.maxLength = {
      value: maxLength.value,
      message: maxLength.message,
    };
  }

  if (min) {
    validationRules.min = {
      value: min.value,
      message: min.message,
    };
  }

  if (max) {
    validationRules.max = {
      value: max.value,
      message: max.message,
    };
  }

  if (validate) {
    validationRules.validate = validate;
  }

  return validationRules;
}

/**
 * 클래스명을 안전하게 결합하는 헬퍼 함수
 *
 * @param classes - 클래스명 배열
 * @returns 결합된 클래스명 문자열
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
