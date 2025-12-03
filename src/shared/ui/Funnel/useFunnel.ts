import { useState, useCallback, useMemo, ReactNode } from 'react';
import { FunnelComponent, createFunnelComponent } from './FunnelComponent';

/**
 * History API 인터페이스
 * 단계 이동을 위한 메서드들을 제공합니다.
 */
export interface FunnelHistory<TSteps extends Record<string, any>> {
  /**
   * 다음 단계로 이동하면서 데이터를 업데이트합니다.
   * @param step - 이동할 단계
   * @param data - 업데이트할 데이터
   */
  push: <TStep extends keyof TSteps>(step: TStep, data?: Partial<TSteps[TStep]>) => void;

  /**
   * 이전 단계로 돌아갑니다.
   * 뒤로 가기 시 이후 단계의 데이터는 자동으로 정리됩니다.
   */
  back: () => void;

  /**
   * 특정 단계로 직접 이동합니다.
   * @param step - 이동할 단계
   */
  go: (step: keyof TSteps) => void;

  /**
   * 현재 단계의 데이터를 업데이트합니다 (단계 이동 없이).
   * @param data - 업데이트할 데이터
   */
  replace: (data: Partial<TSteps[keyof TSteps]>) => void;
}

/**
 * useFunnel의 반환 상태
 */
export interface FunnelState<TSteps extends Record<string, any>> {
  /** 현재 활성화된 단계 */
  currentStep: keyof TSteps;
  /** 현재 단계의 context 데이터 */
  context: TSteps[keyof TSteps];
  /** 단계 이동 히스토리 */
  history: ReadonlyArray<keyof TSteps>;
  /** 뒤로 가기가 가능한지 여부 */
  canGoBack: boolean;
  /** 전체 단계 목록 */
  steps: ReadonlyArray<keyof TSteps>;
}

/**
 * useFunnel 옵션
 */
export interface UseFunnelOptions<TSteps extends Record<string, any>> {
  /** 시작 단계 */
  initialStep: keyof TSteps;
  /** 초기 context 데이터 */
  initialContext?: Partial<TSteps[keyof TSteps]>;
  /**
   * 뒤로가기 시 이후 단계 데이터 정리 여부 (기본값: true)
   * true로 설정하면 비선형 퍼널에서 일관된 상태를 유지할 수 있습니다.
   */
  cleanupOnBack?: boolean;
}

/**
 * Funnel의 상태를 관리하는 커스텀 훅 (Compound Component 패턴)
 *
 * @param steps - 단계 목록 (as const로 선언 권장)
 * @param options - 초기 설정
 * @returns [Funnel 컴포넌트, 상태, history API] 튜플
 *
 * @example
 * ```tsx
 * type Steps = {
 *   email: { email?: string };
 *   password: { email: string; password?: string };
 * };
 *
 * const [Funnel, state, history] = useFunnel<Steps>(
 *   ['email', 'password'] as const,
 *   { initialStep: 'email' }
 * );
 *
 * return (
 *   <Funnel>
 *     <Funnel.Step name="email">
 *       {({ history }) => (
 *         <EmailForm onNext={(data) => history.push('password', data)} />
 *       )}
 *     </Funnel.Step>
 *     <Funnel.Step name="password">
 *       {({ context, history }) => (
 *         <PasswordForm
 *           email={context.email}
 *           onNext={(data) => history.push('complete', data)}
 *           onPrev={history.back}
 *         />
 *       )}
 *     </Funnel.Step>
 *   </Funnel>
 * );
 * ```
 */
export function useFunnel<TSteps extends Record<string, any>>(
  steps: ReadonlyArray<keyof TSteps>,
  options: UseFunnelOptions<TSteps>
): [FunnelComponent<TSteps>, FunnelState<TSteps>, FunnelHistory<TSteps>] {
  const { initialStep, initialContext = {} as TSteps[keyof TSteps], cleanupOnBack = true } = options;

  const [currentStep, setCurrentStep] = useState<keyof TSteps>(initialStep);
  const [context, setContext] = useState<TSteps[keyof TSteps]>(initialContext);
  const [historyStack, setHistoryStack] = useState<ReadonlyArray<keyof TSteps>>([initialStep]);

  /**
   * 단계 순서를 기반으로 인덱스를 계산합니다.
   */
  const getStepIndex = useCallback(
    (step: keyof TSteps): number => {
      return steps.indexOf(step);
    },
    [steps]
  );

  /**
   * 다음 단계로 이동하면서 context를 업데이트합니다.
   */
  const push = useCallback(
    <TStep extends keyof TSteps>(step: TStep, data?: Partial<TSteps[TStep]>) => {
      setCurrentStep((prevStep) => {
        // 동일한 단계로 이동하는 경우
        if (prevStep === step) {
          if (data) {
            setContext((prev) => ({ ...prev, ...data }));
          }
          return prevStep;
        }

        // 데이터 업데이트
        if (data) {
          setContext((prev) => ({ ...prev, ...data }));
        }

        // 히스토리 업데이트
        setHistoryStack((prev) => {
          // 이미 방문한 단계로 돌아가는 경우 (비선형 퍼널)
          const existingIndex = prev.indexOf(step);
          if (existingIndex !== -1) {
            return prev.slice(0, existingIndex + 1);
          }
          return [...prev, step];
        });

        return step;
      });
    },
    []
  );

  /**
   * 이전 단계로 돌아갑니다.
   */
  const back = useCallback(() => {
    if (historyStack.length <= 1) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Funnel] Cannot go back: already at the first step.');
      }
      return;
    }

    const newHistory = historyStack.slice(0, -1);
    const previousStep = newHistory[newHistory.length - 1];

    setCurrentStep(previousStep);
    setHistoryStack(newHistory);

    // 뒤로 가기 시 이후 단계의 데이터 정리
    if (cleanupOnBack) {
      const currentIndex = getStepIndex(previousStep);
      setContext((prev) => {
        const cleanedContext = { ...prev };
        steps.forEach((step, index) => {
          if (index > currentIndex) {
            delete cleanedContext[step as string];
          }
        });
        return cleanedContext;
      });
    }
  }, [historyStack, cleanupOnBack, getStepIndex, steps]);

  /**
   * 특정 단계로 직접 이동합니다.
   */
  const go = useCallback((step: keyof TSteps) => {
    setCurrentStep(step);
    setHistoryStack((prev) => [...prev, step]);
  }, []);

  /**
   * 현재 단계의 context를 업데이트합니다 (단계 이동 없이).
   */
  const replace = useCallback((data: Partial<TSteps[keyof TSteps]>) => {
    setContext((prev) => ({ ...prev, ...data }));
  }, []);

  /**
   * History API 객체
   */
  const history = useMemo<FunnelHistory<TSteps>>(
    () => ({
      push,
      back,
      go,
      replace,
    }),
    [push, back, go, replace]
  );

  /**
   * 상태 객체
   */
  const state = useMemo<FunnelState<TSteps>>(
    () => ({
      currentStep,
      context,
      history: historyStack,
      canGoBack: historyStack.length > 1,
      steps,
    }),
    [currentStep, context, historyStack, steps]
  );

  /**
   * Funnel 컴포넌트 생성
   */
  const FunnelComp = useMemo(
    () => createFunnelComponent<TSteps>(currentStep, context, history),
    [currentStep, context, history]
  );

  return [FunnelComp, state, history];
}

/**
 * Funnel Step의 Render Props 타입
 */
export interface FunnelStepRenderProps<TSteps extends Record<string, any>, TStep extends keyof TSteps> {
  /** 현재 단계의 context */
  context: TSteps[TStep];
  /** History API */
  history: FunnelHistory<TSteps>;
}

/**
 * Funnel Step 컴포넌트의 Props
 */
export interface FunnelStepProps<TSteps extends Record<string, any>, TStep extends keyof TSteps> {
  /** 단계 이름 */
  name: TStep;
  /** Render Props 함수 */
  children: (props: FunnelStepRenderProps<TSteps, TStep>) => ReactNode;
}
