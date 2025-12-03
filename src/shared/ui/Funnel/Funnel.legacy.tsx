import { ReactNode } from 'react';

/**
 * Funnel 컴포넌트의 Step별 Context 타입을 정의하기 위한 유틸리티 타입
 * 각 단계마다 필요한 데이터 구조를 명시할 수 있습니다.
 *
 * @example
 * type OnboardingSteps = {
 *   email: { email?: string; password?: string };
 *   password: { email: string; password?: string };
 *   profile: { email: string; password: string; nickname?: string };
 * };
 */
export type FunnelSteps<T extends Record<string, any>> = T;

/**
 * 각 Step의 Props 타입
 */
interface StepProps<TContext> {
  /** 현재 단계의 context 데이터 */
  context: TContext;
  /** 다음 단계로 이동하기 위한 함수 */
  onNext: (data: Partial<TContext>) => void;
  /** 이전 단계로 돌아가기 위한 함수 (선택적) */
  onPrev?: () => void;
}

/**
 * Funnel 컴포넌트의 Props 타입
 */
interface FunnelProps<TSteps extends Record<string, any>> {
  /** 현재 활성화된 단계 */
  currentStep: keyof TSteps;
  /** 각 단계의 렌더링 함수를 정의한 객체 */
  steps: {
    [K in keyof TSteps]: (props: StepProps<TSteps[K]>) => ReactNode;
  };
  /** 현재 단계의 context */
  context: TSteps[keyof TSteps];
  /** 다음 단계로 이동 */
  onNext: (step: keyof TSteps, data: any) => void;
  /** 이전 단계로 이동 */
  onPrev?: () => void;
}

/**
 * 다단계 폼(Funnel)을 구현하기 위한 컴포넌트
 *
 * 각 단계별로 필요한 데이터를 타입 안전하게 관리하며,
 * 단계 간 전환과 상태 관리를 쉽게 할 수 있습니다.
 *
 * @example
 * ```tsx
 * type Steps = {
 *   email: { email?: string };
 *   password: { email: string; password?: string };
 * };
 *
 * const [currentStep, setCurrentStep] = useState<keyof Steps>('email');
 * const [context, setContext] = useState<Steps[keyof Steps]>({});
 *
 * <Funnel
 *   currentStep={currentStep}
 *   context={context}
 *   steps={{
 *     email: ({ onNext }) => (
 *       <EmailForm onSubmit={(email) => onNext('password', { email })} />
 *     ),
 *     password: ({ context, onNext }) => (
 *       <PasswordForm email={context.email} onSubmit={(pwd) => onNext('complete', { password: pwd })} />
 *     ),
 *   }}
 *   onNext={(step, data) => {
 *     setCurrentStep(step);
 *     setContext(prev => ({ ...prev, ...data }));
 *   }}
 * />
 * ```
 */
export function Funnel<TSteps extends Record<string, any>>({
  currentStep,
  steps,
  context,
  onNext,
  onPrev,
}: FunnelProps<TSteps>) {
  const StepComponent = steps[currentStep];

  if (!StepComponent) {
    console.error(`Step "${String(currentStep)}" not found in steps configuration`);
    return null;
  }

  return (
    <div className="funnel-container">
      {StepComponent({
        context,
        onNext: (data) => onNext(currentStep, data),
        onPrev,
      })}
    </div>
  );
}

/**
 * Funnel 진행 상태를 표시하는 ProgressBar 컴포넌트
 */
interface ProgressBarProps {
  /** 전체 단계 수 */
  totalSteps: number;
  /** 현재 단계 (1부터 시작) */
  currentStep: number;
  /** 각 단계의 레이블 (선택적) */
  stepLabels?: string[];
}

export function FunnelProgressBar({ totalSteps, currentStep, stepLabels }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="funnel-progress-bar">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      {stepLabels && (
        <div className="progress-labels">
          {stepLabels.map((label, index) => (
            <span
              key={index}
              className={`progress-label ${index + 1 === currentStep ? 'active' : ''} ${
                index + 1 < currentStep ? 'completed' : ''
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="progress-text">
        {currentStep} / {totalSteps}
      </div>
    </div>
  );
}
