/**
 * Form과 Funnel 컴포넌트를 함께 사용하는 완전한 예제
 * 회원가입 온보딩 플로우 구현
 *
 * 개선된 Funnel 패턴 (Compound Component + History API)
 */

import { useForm } from 'react-hook-form';
import { FormInput, FormRadio, FormSelect } from './Form';
import { useFunnel, FunnelProgressBar } from './Funnel';

// 1. 단계별 타입 정의
type OnboardingSteps = {
  email: {
    email?: string;
  };
  password: {
    email: string;
    password?: string;
  };
  profile: {
    email: string;
    password: string;
    nickname?: string;
    gender?: string;
    region?: string;
  };
};

// 2. 메인 컴포넌트
export function OnboardingExample() {
  // ✅ 개선: useFunnel이 [Funnel 컴포넌트, state, history]를 반환
  const [Funnel, state] = useFunnel<OnboardingSteps>(
    ['email', 'password', 'profile'] as const, // as const로 타입 안전성 확보
    { initialStep: 'email' }
  );

  // 현재 단계 인덱스 계산
  const currentStepIndex = state.steps.indexOf(state.currentStep as keyof OnboardingSteps) + 1;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>회원가입</h1>

      {/* 진행 상황 표시 */}
      <FunnelProgressBar
        totalSteps={state.steps.length}
        currentStep={currentStepIndex}
        stepLabels={['이메일', '비밀번호', '프로필']}
      />

      {/* ✅ 개선: Funnel.Step으로 선언적으로 단계 정의 */}
      <Funnel>
        {/* 3-1. 이메일 입력 단계 */}
        <Funnel.Step name="email">
          {({ history }) => {
            const {
              register,
              handleSubmit,
              formState: { errors },
            } = useForm<{ email: string }>();

            return (
              <form
                onSubmit={handleSubmit((data) => {
                  // ✅ 개선: history.push로 명확한 의도 표현
                  history.push('password', data);
                })}
                style={{ marginTop: '30px' }}
              >
                <h2>이메일을 입력해주세요</h2>

                <FormInput
                  name="email"
                  label="이메일"
                  type="email"
                  register={register}
                  errors={errors}
                  required
                  placeholder="example@email.com"
                  pattern={{
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '올바른 이메일 형식이 아닙니다.',
                  }}
                />

                <button type="submit" style={{ marginTop: '20px', width: '100%' }}>
                  다음
                </button>
              </form>
            );
          }}
        </Funnel.Step>

        {/* 3-2. 비밀번호 입력 단계 */}
        <Funnel.Step name="password">
          {({ context, history }) => {
            const {
              register,
              handleSubmit,
              formState: { errors },
            } = useForm<{ password: string }>();

            return (
              <form
                onSubmit={handleSubmit((data) => {
                  history.push('profile', data);
                })}
                style={{ marginTop: '30px' }}
              >
                <h2>비밀번호를 설정해주세요</h2>
                {/* ✅ 개선: context의 타입이 정확히 추론됨 */}
                <p style={{ color: '#666' }}>이메일: {context.email}</p>

                <FormInput
                  name="password"
                  label="비밀번호"
                  type="password"
                  register={register}
                  errors={errors}
                  required
                  placeholder="8자 이상 입력해주세요"
                  minLength={{
                    value: 8,
                    message: '비밀번호는 최소 8자 이상이어야 합니다.',
                  }}
                  maxLength={{
                    value: 50,
                    message: '비밀번호는 최대 50자까지 가능합니다.',
                  }}
                />

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  {/* ✅ 개선: history.back()으로 간단한 뒤로가기 */}
                  <button type="button" onClick={history.back} style={{ flex: 1 }}>
                    이전
                  </button>
                  <button type="submit" style={{ flex: 1 }}>
                    다음
                  </button>
                </div>
              </form>
            );
          }}
        </Funnel.Step>

        {/* 3-3. 프로필 입력 단계 */}
        <Funnel.Step name="profile">
          {({ context, history }) => {
            const {
              register,
              handleSubmit,
              formState: { errors },
            } = useForm<{ nickname: string; gender: string; region: string }>();

            const onSubmit = (data: { nickname: string; gender: string; region: string }) => {
              const finalData = { ...context, ...data };
              console.log('회원가입 완료:', finalData);
              alert('회원가입이 완료되었습니다!');
              // 여기서 실제 회원가입 API를 호출할 수 있습니다.
            };

            return (
              <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }}>
                <h2>프로필 정보를 입력해주세요</h2>
                <p style={{ color: '#666' }}>
                  이메일: {context.email}
                  <br />
                  비밀번호: {'*'.repeat(context.password?.length || 0)}
                </p>

                <FormInput
                  name="nickname"
                  label="닉네임"
                  register={register}
                  errors={errors}
                  required
                  placeholder="사용할 닉네임을 입력해주세요"
                  minLength={{
                    value: 2,
                    message: '닉네임은 최소 2자 이상이어야 합니다.',
                  }}
                  maxLength={{
                    value: 20,
                    message: '닉네임은 최대 20자까지 가능합니다.',
                  }}
                />

                <FormRadio
                  name="gender"
                  label="성별"
                  register={register}
                  errors={errors}
                  required
                  direction="horizontal"
                  options={[
                    { value: 'male', label: '남성' },
                    { value: 'female', label: '여성' },
                    { value: 'other', label: '기타' },
                  ]}
                />

                <FormSelect
                  name="region"
                  label="지역"
                  register={register}
                  errors={errors}
                  required
                  placeholder="거주 지역을 선택해주세요"
                  options={[
                    { value: 'seoul', label: '서울' },
                    { value: 'busan', label: '부산' },
                    { value: 'incheon', label: '인천' },
                    { value: 'daegu', label: '대구' },
                    { value: 'gwangju', label: '광주' },
                    { value: 'daejeon', label: '대전' },
                    { value: 'ulsan', label: '울산' },
                    { value: 'sejong', label: '세종' },
                    { value: 'gyeonggi', label: '경기' },
                    { value: 'other', label: '기타' },
                  ]}
                />

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={history.back} style={{ flex: 1 }}>
                    이전
                  </button>
                  <button type="submit" style={{ flex: 1 }}>
                    회원가입 완료
                  </button>
                </div>
              </form>
            );
          }}
        </Funnel.Step>
      </Funnel>
    </div>
  );
}

/**
 * 개선사항 요약:
 *
 * 1. ✅ Compound Component 패턴
 *    - Before: <Funnel currentStep={...} context={...} steps={{...}} />
 *    - After: <Funnel><Funnel.Step name="email">{...}</Funnel.Step></Funnel>
 *
 * 2. ✅ History API
 *    - Before: onNext('password', data)
 *    - After: history.push('password', data)
 *
 * 3. ✅ 타입 안전성
 *    - Before: any 타입 사용
 *    - After: 각 단계별 context가 정확히 타입 추론됨
 *
 * 4. ✅ 간편한 뒤로가기
 *    - Before: onPrev={funnel.canGoBack ? funnel.goBack : undefined}
 *    - After: history.back (자동으로 첫 단계에서는 동작하지 않음)
 *
 * 5. ✅ 보일러플레이트 감소
 *    - 수동으로 연결해야 하는 props가 0개로 감소
 *    - 코드가 더 선언적이고 읽기 쉬워짐
 */
