import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Field, TextInput, Button, VStack, HStack, Text, Box, Sheet } from '@vapor-ui/core';
import { useFunnel } from '@use-funnel/react-router-dom';
import { NumberStepper } from '../shared/ui/Number/NumberStepper';
import { CategoryCard, CategoryOption } from '../shared/ui/CategoryCard';

// 10단계 Funnel 타입 정의
type ExperienceFormSteps = {
  category: { category?: string };
  experience: { category: string; experienceYears?: number };
  occupation: { category: string; experienceYears: number; occupation?: string };
  ingredients: {
    category: string;
    experienceYears: number;
    occupation: string;
    ingredients?: string;
  };
  steps: {
    category: string;
    experienceYears: number;
    occupation: string;
    ingredients: string;
    steps?: string;
  };
  location: {
    category: string;
    experienceYears: number;
    occupation: string;
    ingredients: string;
    steps: string;
    address?: string;
  };
  duration: {
    category: string;
    experienceYears: number;
    occupation: string;
    ingredients: string;
    steps: string;
    address: string;
    duration?: number;
  };
  capacity: {
    category: string;
    experienceYears: number;
    occupation: string;
    ingredients: string;
    steps: string;
    address: string;
    duration: number;
    maxCapacity?: number;
  };
  price: {
    category: string;
    experienceYears: number;
    occupation: string;
    ingredients: string;
    steps: string;
    address: string;
    duration: number;
    maxCapacity: number;
    price?: number;
  };
  recommendation: {
    category: string;
    experienceYears: number;
    occupation: string;
    ingredients: string;
    steps: string;
    address: string;
    duration: number;
    maxCapacity: number;
    price: number;
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const funnel = useFunnel<ExperienceFormSteps>({
    id: 'experience-form',
    initial: {
      step: 'category',
      context: {},
    },
  });

  // useRef를 사용하여 occupation, ingredients, steps, address 필드의 값을 관리
  const occupationRef = useRef<HTMLInputElement>(null);
  const ingredientsRef = useRef<HTMLTextAreaElement>(null);
  const stepsRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    category: '',
    experienceYears: 0,
    occupation: '',
    ingredients: '',
    steps: '',
    address: '',
    duration: 60,
    maxCapacity: 1,
    price: 0,
  });


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('최종 제출 데이터:', formData);
    alert('체험이 등록되었습니다!');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Sheet가 닫히면 메인 페이지로 이동
      navigate('/');
    }
  };

  return (
    <Sheet.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Sheet.Popup
        positionerElement={<Sheet.PositionerPrimitive side="bottom" />}
        style={{
          maxHeight: 'calc(100vh - 110px)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        }}
      >
        <Sheet.Header>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Body style={{ overflow: 'auto' }}>
          <Box backgroundColor="$white" borderRadius="$300">
            <Form onSubmit={handleSubmit}>
              <funnel.Render
                category={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">어떤 종류의 체험을 제공하시나요?</Text>
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
                    >
                      다음
                    </Button>
                  </VStack>
                )}
                experience={({ context, history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">
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
                occupation={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">어떤 일을 하시나요?</Text>
                    <Field.Root name="occupation">
                      <Field.Label>직업</Field.Label>
                      <TextInput
                        ref={occupationRef}
                        placeholder="돌담 쌓기"
                        defaultValue={formData.occupation}
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const occupation = occupationRef.current?.value || '';
                          setFormData({ ...formData, occupation });
                          history.push('ingredients', { occupation });
                        }}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
                ingredients={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">준비해야 하는 재료는 무엇인가요?</Text>
                    <Field.Root name="ingredients">
                      <Field.Label>재료</Field.Label>
                      <textarea
                        ref={ingredientsRef}
                        placeholder="예: 돌, 시멘트, 흙손 등"
                        defaultValue={formData.ingredients}
                        rows={5}
                        className="v-w-full v-p-3 v-border v-border-neutral-300 v-rounded-md v-resize-y"
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const ingredients = ingredientsRef.current?.value || '';
                          setFormData({ ...formData, ingredients });
                          history.push('steps', { ingredients });
                        }}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
                steps={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">단계별로 하려면 어떻게 하면 되나요?</Text>
                    <Field.Root name="steps">
                      <Field.Label>진행 단계</Field.Label>
                      <textarea
                        ref={stepsRef}
                        placeholder="예: 1. 돌을 고르고 준비합니다&#10;2. 시멘트를 섞습니다&#10;3. 돌을 쌓아갑니다"
                        defaultValue={formData.steps}
                        rows={7}
                        className="v-w-full v-p-3 v-border v-border-neutral-300 v-rounded-md v-resize-y"
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const steps = stepsRef.current?.value || '';
                          setFormData({ ...formData, steps });
                          history.push('location', { steps });
                        }}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
                location={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">신청자와 만나는 장소가 어디인가요?</Text>
                    <Field.Root name="location">
                      <Field.Label>체험 장소</Field.Label>
                      <TextInput
                        ref={addressRef}
                        defaultValue={formData.address}
                        placeholder="체험 장소를 입력하세요"
                      />
                    </Field.Root>
                    <HStack gap="$150">
                      <Button type="button" variant="outline" onClick={() => history.back()}>
                        이전
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          const address = addressRef.current?.value || '';
                          setFormData({ ...formData, address });
                          history.push('duration', { address });
                        }}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
                duration={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">소요 시간 설정</Text>
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
                capacity={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">최대 인원 추가</Text>
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
                price={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">게스트 1인당 요금</Text>
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
                      <Button
                        type="button"
                        onClick={() => history.push('recommendation', { price: formData.price })}
                      >
                        다음
                      </Button>
                    </HStack>
                  </VStack>
                )}
                recommendation={({ history }) => (
                  <VStack gap="$300">
                    <Text typography="heading3">추천 수업 템플릿</Text>
                    <Box
                      padding="$400"
                      backgroundColor="$canvas-100"
                      borderRadius="$300"
                    >
                      <Text typography="body1">
                        입력하신 정보를 바탕으로 체험이 준비되었습니다!
                      </Text>
                    </Box>
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
              />
            </Form>

            {/* 진행 상황 표시 */}
            <Box marginTop="$400">
              <Text typography="body2" foreground="hint-100" className="v-text-center">
                현재 단계: {String(funnel.step)}
              </Text>
            </Box>
          </Box>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
