import { ReactNode, createContext, useContext } from 'react';
import { cn } from './utils';
import { FormFieldContextValue } from './types';

/**
 * FormField Context
 * Compound Component 패턴을 위한 Context
 */
const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/**
 * FormField Context Hook
 */
function useFormFieldContext() {
  const context = useContext(FormFieldContext);
  if (!context) {
    throw new Error('FormField의 하위 컴포넌트는 FormField 내부에서만 사용할 수 있습니다.');
  }
  return context;
}

/**
 * FormField Root Component Props
 */
interface FormFieldProps {
  children: ReactNode;
  name: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * FormField Root Component
 *
 * Compound Component 패턴의 루트 컴포넌트
 * Label, Description, Error 등의 하위 컴포넌트에 context를 제공합니다.
 *
 * @example
 * ```tsx
 * <FormField name="email" error={error} required>
 *   <FormField.Label>이메일</FormField.Label>
 *   <FormField.Description>회사 이메일을 입력해주세요</FormField.Description>
 *   <input {...register('email')} />
 *   <FormField.Error />
 * </FormField>
 * ```
 */
function FormFieldRoot({ children, name, error, required, disabled, className }: FormFieldProps) {
  return (
    <FormFieldContext.Provider value={{ name, error, required, disabled }}>
      <div className={cn('form-field-wrapper', className)}>{children}</div>
    </FormFieldContext.Provider>
  );
}

/**
 * FormField.Label Component Props
 */
interface FormFieldLabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  showRequired?: boolean;
}

/**
 * FormField.Label Component
 *
 * 폼 필드의 라벨을 렌더링합니다.
 * Context에서 required 정보를 가져와 자동으로 필수 표시를 추가합니다.
 */
function FormFieldLabel({ children, htmlFor, className, showRequired = true }: FormFieldLabelProps) {
  const { name, required } = useFormFieldContext();

  return (
    <label htmlFor={htmlFor || name} className={cn('form-label', className)}>
      {children}
      {showRequired && required && <span className="required-mark"> *</span>}
    </label>
  );
}

/**
 * FormField.Description Component Props
 */
interface FormFieldDescriptionProps {
  children: ReactNode;
  className?: string;
}

/**
 * FormField.Description Component
 *
 * 폼 필드의 설명을 렌더링합니다.
 */
function FormFieldDescription({ children, className }: FormFieldDescriptionProps) {
  return <p className={cn('form-description', className)}>{children}</p>;
}

/**
 * FormField.Error Component Props
 */
interface FormFieldErrorProps {
  className?: string;
  children?: ReactNode;
}

/**
 * FormField.Error Component
 *
 * 폼 필드의 에러 메시지를 렌더링합니다.
 * Context에서 error를 가져오거나, children으로 직접 전달받을 수 있습니다.
 */
function FormFieldError({ className, children }: FormFieldErrorProps) {
  const { error } = useFormFieldContext();
  const message = children || error;

  if (!message) return null;

  return <span className={cn('error-message', className)}>{message}</span>;
}

/**
 * FormField Compound Component
 *
 * 단일 책임 원칙(SRP)을 준수하는 Compound Component 패턴
 * 각 하위 컴포넌트는 하나의 책임만 가집니다.
 */
export const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Description: FormFieldDescription,
  Error: FormFieldError,
});
