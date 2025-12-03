import { ReactNode } from 'react';
import { FieldValues, FormProvider as RHFFormProvider, UseFormReturn } from 'react-hook-form';

/**
 * FormProvider Props
 */
interface FormProviderProps<T extends FieldValues> {
  /** React Hook Form의 useForm 반환값 */
  methods: UseFormReturn<T>;
  /** Form 내부 컴포넌트 */
  children: ReactNode;
  /** Form submit 핸들러 (선택적) */
  onSubmit?: (data: T) => void | Promise<void>;
  /** Form의 HTML 속성 (선택적) */
  formProps?: Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;
}

/**
 * FormProvider Component
 *
 * React Hook Form의 FormProvider를 래핑한 컴포넌트
 * useFormContext를 사용할 수 있도록 context를 제공합니다.
 *
 * **사용 이점:**
 * - Props drilling 제거
 * - 모든 Form 컴포넌트에서 register와 errors를 자동으로 사용 가능
 * - 깔끔한 컴포넌트 구조
 *
 * @example
 * ```tsx
 * function MyForm() {
 *   const methods = useForm<FormData>();
 *
 *   const onSubmit = (data: FormData) => {
 *     console.log(data);
 *   };
 *
 *   return (
 *     <FormProvider methods={methods} onSubmit={onSubmit}>
 *       <FormInput name="email" label="이메일" required />
 *       <FormInput name="password" label="비밀번호" required />
 *       <button type="submit">제출</button>
 *     </FormProvider>
 *   );
 * }
 * ```
 */
export function FormProvider<T extends FieldValues>({
  methods,
  children,
  onSubmit,
  formProps,
}: FormProviderProps<T>) {
  const handleSubmit = onSubmit ? methods.handleSubmit(onSubmit) : undefined;

  return (
    <RHFFormProvider {...methods}>
      {handleSubmit ? (
        <form onSubmit={handleSubmit} {...formProps}>
          {children}
        </form>
      ) : (
        <>{children}</>
      )}
    </RHFFormProvider>
  );
}
