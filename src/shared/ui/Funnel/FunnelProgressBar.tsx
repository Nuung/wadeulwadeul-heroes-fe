/**
 * 진행률을 계산하는 순수 함수
 * @param current - 현재 단계 번호 (1부터 시작)
 * @param total - 전체 단계 수
 * @returns 진행률 (0-100)
 */
export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

/**
 * ProgressTrack 컴포넌트 Props
 */
interface ProgressTrackProps {
  /** 진행률 (0-100) */
  progress: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * ProgressTrack 컴포넌트
 *
 * 진행 상태를 시각적으로 표시하는 트랙 바입니다.
 */
export function ProgressTrack({ progress, className = '' }: ProgressTrackProps) {
  return (
    <div className={`progress-track ${className}`.trim()}>
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}

/**
 * ProgressText 컴포넌트 Props
 */
interface ProgressTextProps {
  /** 현재 단계 */
  current: number;
  /** 전체 단계 수 */
  total: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * ProgressText 컴포넌트
 *
 * 현재 단계와 전체 단계를 텍스트로 표시합니다.
 */
export function ProgressText({ current, total, className = '' }: ProgressTextProps) {
  return (
    <div className={`progress-text ${className}`.trim()}>
      {current} / {total}
    </div>
  );
}

/**
 * StepLabel 컴포넌트 Props
 */
interface StepLabelProps {
  /** 레이블 텍스트 */
  label: string;
  /** 활성 상태 여부 */
  isActive: boolean;
  /** 완료 상태 여부 */
  isCompleted: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * StepLabel 컴포넌트
 *
 * 개별 단계의 레이블을 표시합니다.
 */
export function StepLabel({ label, isActive, isCompleted, className = '' }: StepLabelProps) {
  const statusClass = isActive ? 'active' : isCompleted ? 'completed' : '';
  return <span className={`progress-label ${statusClass} ${className}`.trim()}>{label}</span>;
}

/**
 * FunnelStepLabels 컴포넌트 Props
 */
interface FunnelStepLabelsProps {
  /** 각 단계의 레이블 배열 */
  labels: string[];
  /** 현재 단계 (1부터 시작) */
  currentStep: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * FunnelStepLabels 컴포넌트
 *
 * 모든 단계의 레이블을 렌더링합니다.
 * 각 레이블은 현재 단계에 따라 active/completed 상태를 표시합니다.
 */
export function FunnelStepLabels({ labels, currentStep, className = '' }: FunnelStepLabelsProps) {
  return (
    <div className={`progress-labels ${className}`.trim()}>
      {labels.map((label, index) => (
        <StepLabel
          key={index}
          label={label}
          isActive={index + 1 === currentStep}
          isCompleted={index + 1 < currentStep}
        />
      ))}
    </div>
  );
}

/**
 * FunnelProgressBar 컴포넌트 Props
 */
interface FunnelProgressBarProps {
  /** 전체 단계 수 */
  totalSteps: number;
  /** 현재 단계 (1부터 시작) */
  currentStep: number;
  /** 각 단계의 레이블 (선택적) */
  stepLabels?: string[];
  /** 진행률 트랙 표시 여부 (기본값: true) */
  showTrack?: boolean;
  /** 진행률 텍스트 표시 여부 (기본값: true) */
  showText?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * Funnel 진행 상태를 표시하는 ProgressBar 컴포넌트
 *
 * SRP 원칙에 따라 하위 컴포넌트로 분리되었습니다:
 * - ProgressTrack: 진행률 트랙 표시
 * - ProgressText: 현재/전체 단계 텍스트 표시
 * - FunnelStepLabels: 단계 레이블 목록 표시
 *
 * @example
 * ```tsx
 * <FunnelProgressBar
 *   totalSteps={3}
 *   currentStep={2}
 *   stepLabels={['이메일', '비밀번호', '프로필']}
 * />
 * ```
 */
export function FunnelProgressBar({
  totalSteps,
  currentStep,
  stepLabels,
  showTrack = true,
  showText = true,
  className = '',
}: FunnelProgressBarProps) {
  const progress = calculateProgress(currentStep, totalSteps);

  return (
    <div className={`funnel-progress-bar ${className}`.trim()}>
      {showTrack && <ProgressTrack progress={progress} />}
      {stepLabels && <FunnelStepLabels labels={stepLabels} currentStep={currentStep} />}
      {showText && <ProgressText current={currentStep} total={totalSteps} />}
    </div>
  );
}
