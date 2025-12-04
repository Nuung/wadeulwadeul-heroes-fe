import React, { ReactNode, ReactElement, Children, isValidElement } from 'react';
import { useFunnel as useOriginalFunnel } from '@use-funnel/react-router-dom';

/**
 * Funnel Step의 Render Props 타입
 */
export interface FunnelStepRenderProps<TContext> {
  /** 현재 단계의 context */
  context: TContext;
  /** History API */
  history: {
    push: <TNextContext extends TContext>(
      step: string,
      context?: Partial<TNextContext>
    ) => void;
    replace: (context: Partial<TContext>) => void;
    back: () => void;
  };
}

/**
 * Funnel Step 컴포넌트의 Props
 */
export interface FunnelStepProps<TSteps extends Record<string, any>, TStep extends keyof TSteps> {
  /** 단계 이름 */
  name: TStep;
  /** Render Props 함수 */
  children: (props: FunnelStepRenderProps<TSteps[TStep]>) => ReactNode;
}

/**
 * Funnel 컴포넌트의 타입
 */
export interface FunnelComponent<TSteps extends Record<string, any>> {
  (props: { children: ReactNode }): ReactElement | null;
  Step: <TStep extends keyof TSteps>(props: FunnelStepProps<TSteps, TStep>) => null;
}

/**
 * Funnel State 타입
 */
export interface FunnelState<TSteps extends Record<string, any>> {
  /** 현재 활성화된 단계 */
  currentStep: keyof TSteps;
  /** 현재 단계의 context 데이터 */
  context: TSteps[keyof TSteps];
  /** 뒤로 가기가 가능한지 여부 */
  canGoBack: boolean;
  /** 전체 단계 목록 */
  steps: ReadonlyArray<keyof TSteps>;
}

/**
 * useFunnel 옵션
 */
export interface UseFunnelOptions<TSteps extends Record<string, any>> {
  /** Funnel 식별자 (URL에 사용됨) */
  id: string;
  /** 시작 단계 */
  initialStep: keyof TSteps;
  /** 초기 context 데이터 */
  initialContext?: Partial<TSteps[keyof TSteps]>;
}

/**
 * History API 인터페이스
 */
export interface FunnelHistory<TSteps extends Record<string, any>> {
  /**
   * 다음 단계로 이동하면서 데이터를 업데이트합니다.
   * @param step - 이동할 단계
   * @param data - 업데이트할 데이터
   */
  push: <TStep extends keyof TSteps>(step: TStep, data?: Partial<TSteps[TStep]>) => void;

  /**
   * 현재 단계의 데이터를 업데이트합니다 (단계 이동 없이).
   * @param data - 업데이트할 데이터
   */
  replace: (data: Partial<TSteps[keyof TSteps]>) => void;

  /**
   * 이전 단계로 돌아갑니다.
   */
  back: () => void;
}

/**
 * @use-funnel 기반 Funnel 훅
 *
 * Toss의 @use-funnel 패키지를 사용하여 다단계 Funnel을 관리합니다.
 * 기존 커스텀 Funnel과 동일한 API를 유지하면서 더 강력한 타입 안전성과
 * 브라우저 히스토리 통합을 제공합니다.
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
 *   { id: 'signup', initialStep: 'email' }
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
  const { id, initialStep, initialContext = {} } = options;

  // @use-funnel 훅 사용
  const funnel = useOriginalFunnel<TSteps>({
    id,
    initial: {
      step: initialStep as string,
      context: initialContext as any,
    },
  });

  // History API 래핑
  const history: FunnelHistory<TSteps> = {
    push: (step, data) => {
      funnel.history.push(step as any, data as any);
    },
    replace: (data) => {
      funnel.history.push(funnel.step as any, { ...funnel.context, ...data } as any);
    },
    back: () => {
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    },
  };

  // State 객체 생성
  const state: FunnelState<TSteps> = {
    currentStep: funnel.step as keyof TSteps,
    context: funnel.context as TSteps[keyof TSteps],
    canGoBack: typeof window !== 'undefined' && window.history.length > 1,
    steps,
  };

  // Funnel Root 컴포넌트 생성
  function FunnelRoot({ children }: { children: ReactNode }): ReactElement | null {
    const stepElements = Children.toArray(children);

    // 현재 step과 일치하는 Step을 찾습니다
    const currentStepElement = stepElements.find((step) => {
      if (!isValidElement(step)) return false;
      return (step.props as FunnelStepProps<TSteps, keyof TSteps>).name === funnel.step;
    });

    if (!currentStepElement) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `[Funnel] Step "${String(funnel.step)}" not found in Funnel children.\n` +
            `Make sure you have a <Funnel.Step name="${String(funnel.step)}"> component.`
        );
      }

      // Fallback UI
      return (
        <div className="funnel-error" style={{ padding: '20px', textAlign: 'center' }}>
          <h2>단계를 찾을 수 없습니다</h2>
          <p>요청한 단계: {String(funnel.step)}</p>
        </div>
      );
    }

    if (!isValidElement(currentStepElement)) {
      return null;
    }

    // Step의 children (render function)을 실행
    const stepProps = currentStepElement.props as FunnelStepProps<TSteps, keyof TSteps>;
    const renderProps: FunnelStepRenderProps<any> = {
      context: funnel.context,
      history: {
        push: (step: string, context?: any) => {
          funnel.history.push(step as any, context as any);
        },
        replace: (context: any) => {
          funnel.history.push(funnel.step as any, { ...funnel.context, ...context } as any);
        },
        back: () => {
          if (typeof window !== 'undefined') {
            window.history.back();
          }
        },
      },
    };

    return <div className="funnel-container">{stepProps.children(renderProps)}</div>;
  }

  /**
   * Funnel.Step 컴포넌트
   *
   * 실제로는 렌더링하지 않고, Funnel Root가 children을 순회하며 처리합니다.
   * 타입 체크와 구조를 위한 마커 컴포넌트입니다.
   */
  function Step<TStep extends keyof TSteps>(_props: FunnelStepProps<TSteps, TStep>): null {
    return null;
  }

  // Compound Component 패턴: Funnel.Step 형태로 사용 가능
  FunnelRoot.Step = Step;

  const FunnelComp = FunnelRoot as FunnelComponent<TSteps>;

  return [FunnelComp, state, history];
}
