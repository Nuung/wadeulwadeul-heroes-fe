import React from 'react';
import './Skeleton.css';

export interface SkeletonProps {
  /** 스켈레톤의 너비 (px, %, rem 등) */
  width?: string | number;
  /** 스켈레톤의 높이 (px, %, rem 등) */
  height?: string | number;
  /** 스켈레톤 형태 variant */
  variant?: 'rectangular' | 'circular' | 'text' | 'rounded';
  /** 애니메이션 여부 */
  animation?: 'wave' | 'pulse' | false;
  /** 추가 className */
  className?: string;
  /** 인라인 스타일 */
  style?: React.CSSProperties;
}

const formatSize = (size: string | number | undefined): string | undefined => {
  if (typeof size === 'number') return `${size}px`;
  return size;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  variant = 'rectangular',
  animation = 'wave',
  className = '',
  style = {},
}) => {
  const variantClasses = {
    rectangular: 'skeleton-rectangular',
    circular: 'skeleton-circular',
    text: 'skeleton-text',
    rounded: 'skeleton-rounded',
  };

  const animationClasses = {
    wave: 'skeleton-wave',
    pulse: 'skeleton-pulse',
  };

  const classes = [
    'skeleton',
    variantClasses[variant],
    animation && animationClasses[animation],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const skeletonStyle: React.CSSProperties = {
    width: formatSize(width),
    height: formatSize(height),
    ...style,
  };

  return <span className={classes} style={skeletonStyle} />;
};

// 스켈레톤 그룹 컴포넌트 (여러 개의 스켈레톤을 묶어서 사용)
export interface SkeletonGroupProps {
  /** 스켈레톤 개수 */
  count?: number;
  /** 스켈레톤 사이의 간격 */
  gap?: string | number;
  /** 세로 정렬 여부 */
  vertical?: boolean;
  /** 자식 컴포넌트 */
  children?: React.ReactNode;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 1,
  gap = '8px',
  vertical = true,
  children,
}) => {
  const groupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    gap: formatSize(gap),
  };

  if (children) {
    return <div style={groupStyle}>{children}</div>;
  }

  return (
    <div style={groupStyle}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  );
};

// 카드 스켈레톤 프리셋
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`skeleton-card ${className}`}>
      <Skeleton variant="rectangular" height={200} />
      <div className="skeleton-card-content">
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" width="40%" height={16} />
      </div>
    </div>
  );
};

// 리스트 아이템 스켈레톤 프리셋
export const SkeletonListItem: React.FC<{ avatar?: boolean; className?: string }> = ({
  avatar = false,
  className = '',
}) => {
  return (
    <div className={`skeleton-list-item ${className}`}>
      {avatar && <Skeleton variant="circular" width={40} height={40} />}
      <div className="skeleton-list-item-content">
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="90%" height={16} />
      </div>
    </div>
  );
};

// 이미지와 텍스트 스켈레톤 프리셋 (Airbnb 스타일)
export const SkeletonImageCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`skeleton-image-card ${className}`}>
      <Skeleton variant="rounded" height={240} />
      <div className="skeleton-image-card-content">
        <SkeletonGroup gap={6}>
          <Skeleton variant="text" width="70%" height={18} />
          <Skeleton variant="text" width="50%" height={14} />
          <Skeleton variant="text" width="30%" height={14} />
        </SkeletonGroup>
      </div>
    </div>
  );
};