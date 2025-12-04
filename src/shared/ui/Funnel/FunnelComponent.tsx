import { ReactNode, ReactElement, Children, isValidElement } from 'react';
import type { FunnelHistory, FunnelStepProps, FunnelStepRenderProps } from './useFunnel';

/**
 * Funnel 컴포넌트의 타입
 */
export interface FunnelComponent<TSteps extends Record<string, any>> {
  (props: { children: ReactNode }): ReactElement | null;
  Step: <TStep extends keyof TSteps>(props: FunnelStepProps<TSteps, TStep>) => null;
}

/**
 * Funnel 컴포넌트를 생성하는 팩토리 함수
 *
 * @param currentStep - 현재 활성화된 단계
 * @param context - 현재 context
 * @param history - History API
 * @returns Funnel 컴포넌트
 */
export function createFunnelComponent<TSteps extends Record<string, any>>(
  currentStep: keyof TSteps,
  context: TSteps[keyof TSteps],
  history: FunnelHistory<TSteps>
): FunnelComponent<TSteps> {
  /**
   * Funnel Root 컴포넌트
   *
   * children으로 받은 Funnel.Step 중 currentStep과 일치하는 것만 렌더링합니다.
   */
  function FunnelRoot({ children }: { children: ReactNode }): ReactElement | null {
    const steps = Children.toArray(children);

    // currentStep과 일치하는 Step을 찾습니다
    const currentStepElement = steps.find((step) => {
      if (!isValidElement(step)) return false;
      return (step.props as FunnelStepProps<TSteps, keyof TSteps>).name === currentStep;
    });

    if (!currentStepElement) {
      if (process.env.NODE_ENV === 'development') {
        console.error(
          `[Funnel] Step "${String(currentStep)}" not found in Funnel children.\n` +
            `Make sure you have a <Funnel.Step name="${String(currentStep)}"> component.`
        );
      }

      // Fallback UI
      return (
        <div className="funnel-error" style={{ padding: '20px', textAlign: 'center' }}>
          <h2>단계를 찾을 수 없습니다</h2>
          <p>요청한 단계: {String(currentStep)}</p>
        </div>
      );
    }

    if (!isValidElement(currentStepElement)) {
      return null;
    }

    // Step의 children (render function)을 실행
    const stepProps = currentStepElement.props as FunnelStepProps<TSteps, keyof TSteps>;
    const renderProps: FunnelStepRenderProps<TSteps, keyof TSteps> = {
      context,
      history,
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

  return FunnelRoot as FunnelComponent<TSteps>;
}
