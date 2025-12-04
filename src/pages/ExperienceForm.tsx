import { useState } from 'react';
import { Form, Field, TextInput, Button, VStack, HStack, Text, Box } from '@vapor-ui/core';
import { useFunnel } from '../shared/ui/Funnel';
import { NumberStepper } from '../shared/ui/Number/NumberStepper';
import { CategoryCard, CategoryOption } from '../shared/ui/CategoryCard';

// 9단계 Funnel 타입 정의
type ExperienceFormSteps = {
  category: { category?: string };
  experience: { category: string; experienceYears?: number };
  occupation: { category: string; experienceYears: number; occupation?: string };
  expertise: { category: string; experienceYears: number; occupation: string };
  location: {
    category: string;
    experienceYears: number;
    occupation: string;
    address?: string;
  };
  name: {
    category: string;
    experienceYears: number;
    occupation: string;
    address: string;
    name?: string;
  };
  duration: {
    category: string;
    experienceYears: number;
    occupation: string;
    address: string;
    name: string;
    duration?: number;
  };
  capacity: {
    category: string;
    experienceYears: number;
    occupation: string;
    address: string;
    name: string;
    duration: number;
    maxCapacity?: number;
  };
  price: {
    category: string;
    experienceYears: number;
    occupation: string;
    address: string;
    name: string;
    duration: number;
    maxCapacity: number;
    price?: number;
  };
};

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: 'art',
    label: '예술 및 디자인',
  },
  {
    value: 'cooking',
    label: '요리',
  },
  {
    value: 'sports',
    label: '스포츠',
  },
  {
    value: 'nature',
    label: '자연 및 탐험',
  },
  {
    value: 'culture',
    label: '문화 및 역사',
  },
];

export default function ExperienceForm() {
  const [Funnel, state, history] = useFunnel<ExperienceFormSteps>(
    ['category', 'experience', 'occupation', 'expertise', 'location', 'name', 'duration', 'capacity', 'price'] as const,
    {
      initialStep: 'category',
      initialContext: {},
    }
  );

  const [formData, setFormData] = useState({
    category: '',
    experienceYears: 0,
    occupation: '',
    address: '',
    name: '',
    duration: 60,
    maxCapacity: 1,
    price: 0,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('최종 제출 데이터:', formData);
    alert('체험이 등록되었습니다!');
  };

  return (
    <div className="v-min-h-screen v-bg-canvas-100 v-p-8">
      <div className="v-max-w-4xl v-mx-auto">
        <Box backgroundColor="$white" padding="$400" borderRadius="$300" className="v-shadow-lg">
          <Form onSubmit={handleSubmit}>
            <Funnel>
              {/* 1단계: 카테고리 선택 */}
              <Funnel.Step name="category">
                {({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">어떤 종류의 체험을 제공하시나요?</Text>
                    <Field.Root name="category">
                      <CategoryCard
                        name="category"
                        options={CATEGORY_OPTIONS}
                        value={formData.category}
                        onChange={(value) => setFormData({ ...formData, category: value })}
                      />
                    </Field.Root>
                    <Button
                      type="button"
                      onClick={() => history.push('experience', { category: formData.category })}
                      disabled={!formData.category}
                    >
                      다음
                    </Button>
                  </VStack>
                )}
              </Funnel.Step>

              {/* 2단계: 경력 입력 */}
              <Funnel.Step name="experience">
                {({ context, history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">
                      {CATEGORY_OPTIONS.find((opt) => opt.value === context.category)?.label} 분야에서 몇 년 동안
                      일하셨나요?
                    </Text>
                    <Field.Root name="experienceYears">
                      <NumberStepper
                        value={formData.experienceYears}
                        onChange={(value) => setFormData({ ...formData, experienceYears: value })}
                        min={0}
                        max={50}
                        showButtons={true}
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() =>
                          history.push('occupation', { experienceYears: formData.experienceYears })
                        }
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Funnel.Step>

              {/* 3단계: 직업 입력 */}
              <Funnel.Step name="occupation">
                {({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">어떤 일을 하시나요?</Text>
                    <Field.Root name="occupation">
                      <Field.Label>직업</Field.Label>
                      <TextInput
                        placeholder="돌담 쌓기"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => history.push('expertise', { occupation: formData.occupation })}
                        disabled={!formData.occupation.trim()}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Funnel.Step>

              {/* 4단계: 전문성 강조 (추후 확장) */}
              <Funnel.Step name="expertise">
                {({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">전문성을 강조하는 방법</Text>
                    <Box padding="$300" backgroundColor="$canvas-100" borderRadius="$200">
                      <Text typography="body1" foreground="hint-100">
                        이 섹션은 추후 확장 예정입니다.
                      </Text>
                    </Box>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button type="button" onClick={() => history.push('location', {})}>
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Funnel.Step>

              {/* 5단계: 장소 입력 */}
              <Funnel.Step name="location">
                {({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">신청자와 만나는 장소가 어디인가요?</Text>
                    <Field.Root name="location">
                      <Field.Label>체험 장소</Field.Label>
                      <TextInput
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="체험 장소를 입력하세요"
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => history.push('name', { address: formData.address })}
                        disabled={!formData.address.trim()}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Funnel.Step>

              {/* 6단계: 체험 이름 */}
              <Funnel.Step name="name">
                {({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">체험 이름 작성하기</Text>
                    <Field.Root name="experienceName">
                      <Field.Label>체험 이름</Field.Label>
                      <TextInput
                        placeholder="제주도 장인과 함께 돌담 쌓아보기"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => history.push('duration', { name: formData.name })}
                        disabled={!formData.name.trim()}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Funnel.Step>

              {/* 7단계: 소요 시간 */}
              <Funnel.Step name="duration">
                {({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">소요 시간 설정</Text>
                    <Field.Root name="duration">
                      <Field.Label>소요 시간</Field.Label>
                      <HStack gap="$100" alignItems="center">
                        <NumberStepper
                          value={formData.duration}
                          onChange={(value) => setFormData({ ...formData, duration: value })}
                          min={30}
                          max={480}
                          showButtons={false}
                        />
                        <Text typography="body1">분</Text>
                      </HStack>
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => history.push('capacity', { duration: formData.duration })}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Funnel.Step>

              {/* 8단계: 최대 인원 */}
              <Funnel.Step name="capacity">
                {({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">최대 인원 추가</Text>
                    <Field.Root name="maxCapacity">
                      <Field.Label>최대 참여 인원</Field.Label>
                      <NumberStepper
                        value={formData.maxCapacity}
                        onChange={(value) => setFormData({ ...formData, maxCapacity: value })}
                        min={1}
                        max={20}
                        showButtons={true}
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => history.push('price', { maxCapacity: formData.maxCapacity })}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Funnel.Step>

              {/* 9단계: 요금 설정 */}
              <Funnel.Step name="price">
                {({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading1">게스트 1인당 요금</Text>
                    <Field.Root name="price">
                      <Field.Label>가격 (원)</Field.Label>
                      <HStack gap="$100" alignItems="center">
                        <Text typography="body1">₩</Text>
                        <NumberStepper
                          value={formData.price}
                          onChange={(value) => setFormData({ ...formData, price: value })}
                          min={0}
                          max={1000000}
                          showButtons={true}
                        />
                      </HStack>
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button type="submit" colorPalette="success">
                        등록 완료
                      </Button>
                    </HStack>
                  </VStack>
                )}
              </Funnel.Step>
            </Funnel>
          </Form>

          {/* 진행 상황 표시 */}
          <Box marginTop="$400">
            <Text typography="body2" foreground="hint-100" className="v-text-center">
              {state.history.length} / 9 단계
            </Text>
          </Box>
        </Box>
      </div>
    </div>
  );
}
