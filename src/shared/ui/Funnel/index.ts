/**
 * Funnel 패턴 구현을 위한 컴포넌트와 훅
 *
 * @example
 * ```tsx
 * import { useFunnel, FunnelProgressBar } from '@/shared/ui/Funnel';
 *
 * type Steps = {
 *   email: { email?: string };
 *   password: { email: string; password?: string };
 * };
 *
 * function SignupFlow() {
 *   const [Funnel, state] = useFunnel<Steps>(
 *     ['email', 'password'] as const,
 *     { initialStep: 'email' }
 *   );
 *
 *   return (
 *     <>
 *       <FunnelProgressBar
 *         totalSteps={state.steps.length}
 *         currentStep={state.steps.indexOf(state.currentStep) + 1}
 *       />
 *       <Funnel>
 *         <Funnel.Step name="email">
 *           {({ history }) => (
 *             <EmailForm onNext={(data) => history.push('password', data)} />
 *           )}
 *         </Funnel.Step>
 *         <Funnel.Step name="password">
 *           {({ context, history }) => (
 *             <PasswordForm
 *               email={context.email}
 *               onNext={(data) => history.push('complete', data)}
 *             />
 *           )}
 *         </Funnel.Step>
 *       </Funnel>
 *     </>
 *   );
 * }
 * ```
 */

// Main Hook
export { useFunnel } from './useFunnel';

// Types
export type {
  FunnelHistory,
  FunnelState,
  UseFunnelOptions,
  FunnelStepRenderProps,
  FunnelStepProps,
} from './useFunnel';

export type { FunnelComponent } from './useFunnel';

// Progress Components
export {
  FunnelProgressBar,
  ProgressTrack,
  ProgressText,
  FunnelStepLabels,
  StepLabel,
  calculateProgress,
} from './FunnelProgressBar';
