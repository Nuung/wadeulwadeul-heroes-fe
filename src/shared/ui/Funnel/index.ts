/**
 * Funnel 패턴 구현을 위한 컴포넌트와 훅
 *
 * 이 프로젝트는 Toss의 @use-funnel/react-router-dom 라이브러리를 사용합니다.
 *
 * @example
 * ```tsx
 * import { useFunnel } from '@use-funnel/react-router-dom';
 * // 또는
 * import { useFunnel } from '@/shared/ui/Funnel';
 *
 * type Steps = {
 *   email: { email?: string };
 *   password: { email: string; password?: string };
 * };
 *
 * function SignupFlow() {
 *   const funnel = useFunnel<Steps>({
 *     id: 'signup',
 *     initial: { step: 'email', context: {} }
 *   });
 *
 *   return (
 *     <funnel.Render
 *       email={({ history }) => (
 *         <EmailForm onNext={(data) => history.push('password', data)} />
 *       )}
 *       password={({ context, history }) => (
 *         <PasswordForm
 *           email={context.email}
 *           onNext={(data) => history.push('complete', data)}
 *         />
 *       )}
 *     />
 *   );
 * }
 * ```
 *
 * 공식 문서: https://use-funnel.slash.page/ko/docs/funnel-render
 */

// Re-export @use-funnel library (편의성을 위한 선택적 re-export)
export { useFunnel } from '@use-funnel/react-router-dom';

// Progress Bar Components (독립적으로 유지)
export {
  FunnelProgressBar,
  ProgressTrack,
  ProgressText,
  FunnelStepLabels,
  StepLabel,
  calculateProgress,
} from './FunnelProgressBar';
