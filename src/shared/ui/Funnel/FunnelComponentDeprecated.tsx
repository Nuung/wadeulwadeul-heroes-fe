import { ReactNode, ReactElement, Children, isValidElement } from 'react';
import type { FunnelHistoryDeprecated, FunnelStepPropsDeprecated, FunnelStepRenderPropsDeprecated } from './useFunnelDeprecated';

/**
 * @deprecated 이 구현은 더 이상 사용되지 않습니다. @use-funnel/react-router-dom을 사용하세요.
 *
 * Funnel 컴포넌트의 타입
 */
export interface FunnelComponentDeprecated<TSteps extends Record<string, any>> {
  (props: { children: ReactNode }): ReactElement | null;
  Step: <TStep extends keyof TSteps>(props: FunnelStepPropsDeprecated<TSteps, TStep>) => null;
}

/**
 * @deprecated 이 구현은 더 이상 사용되지 않습니다. @use-funnel/react-router-dom을 사용하세요.
 *
 * Funnel 컴포넌트를 생성하는 팩토리 함수
 *
 * @param currentStep - 현재 활성화된 단계
 * @param context - 현재 context
 * @param history - History API
 * @returns Funnel 컴포넌트
 */
export function createFunnelComponentDeprecated<TSteps extends Record<string, any>>(
  currentStep: keyof TSteps,
  context: TSteps[keyof TSteps],
  history: FunnelHistoryDeprecated<TSteps>
): FunnelComponentDeprecated<TSteps> {
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
      return (step.props as FunnelStepPropsDeprecated<TSteps, keyof TSteps>).name === currentStep;
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
    const stepProps = currentStepElement.props as FunnelStepPropsDeprecated<TSteps, keyof TSteps>;
    const renderProps: FunnelStepRenderPropsDeprecated<TSteps, keyof TSteps> = {
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
  function Step<TStep extends keyof TSteps>(_props: FunnelStepPropsDeprecated<TSteps, TStep>): null {
    return null;
  }

  // Compound Component 패턴: Funnel.Step 형태로 사용 가능
  FunnelRoot.Step = Step;

  return FunnelRoot as FunnelComponentDeprecated<TSteps>;
}
