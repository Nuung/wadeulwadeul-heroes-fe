import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Field,
  TextInput,
  Textarea,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Sheet,
} from "@vapor-ui/core";
import { useFunnel } from "@use-funnel/react-router-dom";
import { NumberStepper } from "../shared/ui/Number/NumberStepper";
import { CategoryCard, CategoryOption } from "../shared/ui/CategoryCard";
import TimeSelector from "../shared/ui/select/TimeSelector";
import PriceSelector from "../shared/ui/select/PriceSelector";
import {
  useSuggestMaterialsMutation,
  useSuggestStepsMutation,
  useGenerateExperiencePlanMutation,
} from "../shared/api/queries/experience-plan.hooks";
import { useCreateClassMutation } from "../shared/api/queries/class.hooks";

// 10단계 Funnel 타입 정의
type ExperienceFormSteps = {
  category: { category?: string };
  experience: { category: string; experienceYears?: number };
  occupation: {
    category: string;
    experienceYears: number;
    occupation?: string;
  };
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
    value: "stone",
    label: "돌담",
    icon: <span style={{ fontSize: "48px" }}>🪨</span>,
  },
  {
    value: "tangerine",
    label: "감귤",
    icon: <span style={{ fontSize: "48px" }}>🍊</span>,
  },
  {
    value: "haenyeo",
    label: "해녀",
    icon: <span style={{ fontSize: "48px" }}>🤿</span>,
  },
  {
    value: "cooking",
    label: "요리",
    icon: <span style={{ fontSize: "48px" }}>👨‍🍳</span>,
  },
  {
    value: "woodworking",
    label: "목공",
    icon: <span style={{ fontSize: "48px" }}>🪚</span>,
  },
];

export default function ExperienceForm() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const funnel = useFunnel<ExperienceFormSteps>({
    id: "experience-form",
    initial: {
      step: "category",
      context: {},
    },
  });

  // useRef를 사용하여 occupation, ingredients, steps, address 필드의 값을 관리
  const occupationRef = useRef<HTMLTextAreaElement>(null);
  const ingredientsRef = useRef<HTMLTextAreaElement>(null);
  const stepsRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    category: "",
    experienceYears: 0,
    occupation: "",
    ingredients: "",
    steps: "",
    address: "",
    duration: 60,
    maxCapacity: 1,
    price: 0,
    template: "",
  });

  // TanStack Query Mutations
  const suggestMaterialsMutation = useSuggestMaterialsMutation();
  const suggestStepsMutation = useSuggestStepsMutation();
  const generateExperiencePlanMutation = useGenerateExperiencePlanMutation();
  const createClassMutation = useCreateClassMutation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form submission is now handled in the recommendation step
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Sheet가 닫히면 메인 페이지로 이동
      navigate("/");
    }
  };

  return (
    <Sheet.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Sheet.Popup
        positionerElement={<Sheet.PositionerPrimitive side="bottom" />}
        style={{
          maxHeight: "calc(100vh - 110px)",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        }}
      >
        <Sheet.Header>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Body
          style={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}
        >
          <Box
            backgroundColor="$white"
            borderRadius="$300"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <funnel.Render
                category={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">
                          어떤 종류의 체험을 제공하시나요?
                        </Text>
                        <Field.Root name="category">
                          <CategoryCard
                            name="category"
                            options={CATEGORY_OPTIONS}
                            value={formData.category}
                            onChange={(value) =>
                              setFormData({ ...formData, category: value })
                            }
                          />
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <Button
                        width="100%"
                        size="xl"
                        type="button"
                        onClick={() =>
                          history.push("experience", {
                            category: formData.category,
                          })
                        }
                      >
                        다음
                      </Button>
                    </Box>
                  </>
                )}
                experience={({ context, history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">
                          {
                            CATEGORY_OPTIONS.find(
                              (opt) => opt.value === context.category
                            )?.label
                          }{" "}
                          분야에서 몇 년 동안 일하셨나요?
                        </Text>
                        <Field.Root name="experienceYears">
                          <Box
                            display="flex"
                            justifyContent="center"
                            width="100%"
                          >
                            <NumberStepper
                              value={formData.experienceYears}
                              onChange={(value) =>
                                setFormData({
                                  ...formData,
                                  experienceYears: value,
                                })
                              }
                              min={0}
                              max={50}
                              showButtons={true}
                            />
                          </Box>
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <HStack gap="$150">
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          variant="outline"
                          onClick={() => history.back()}
                        >
                          이전
                        </Button>
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          onClick={() =>
                            history.push("occupation", {
                              experienceYears: formData.experienceYears,
                            })
                          }
                        >
                          다음
                        </Button>
                      </HStack>
                    </Box>
                  </>
                )}
                occupation={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">어떤 일을 하시나요?</Text>
                        <Field.Root name="occupation">
                          <Textarea
                            ref={occupationRef}
                            placeholder={
                              CATEGORY_OPTIONS.find(
                                (opt) => opt.value === formData.category
                              )?.label + " 전문가"
                            }
                            defaultValue={formData.occupation}
                            className="large-input-placeholder"
                            size="xl"
                            autoResize
                            style={{
                              fontSize: "38px",
                              lineHeight: "48px",
                              border: "none",
                              fontWeight: "normal",
                              textAlign: "center",
                            }}
                          />
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <HStack gap="$150">
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          variant="outline"
                          onClick={() => history.back()}
                          disabled={suggestMaterialsMutation.isPending}
                        >
                          이전
                        </Button>
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          onClick={async () => {
                            const occupation =
                              occupationRef.current?.value || "";
                            setFormData({ ...formData, occupation });

                            try {
                              const response =
                                await suggestMaterialsMutation.mutateAsync({
                                  category: formData.category,
                                  years_of_experience: String(
                                    formData.experienceYears
                                  ),
                                  job_description: occupation,
                                });

                              setFormData((prev) => ({
                                ...prev,
                                occupation,
                                ingredients: response.suggestion,
                              }));
                              history.push("ingredients", { occupation });
                            } catch (error) {
                              console.error("재료 추천 API 호출 실패:", error);
                              alert(
                                "재료 추천을 가져오는데 실패했습니다. 다시 시도해주세요."
                              );
                            }
                          }}
                          disabled={suggestMaterialsMutation.isPending}
                        >
                          {suggestMaterialsMutation.isPending
                            ? "추천 생성 중..."
                            : "다음"}
                        </Button>
                      </HStack>
                    </Box>
                  </>
                )}
                ingredients={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">
                          준비해야 하는 재료는 무엇인가요?
                        </Text>
                        <Field.Root name="ingredients">
                          <Field.Label>재료</Field.Label>
                          <Textarea
                            ref={ingredientsRef}
                            placeholder="예: 돌, 시멘트, 흙손 등"
                            value={formData.ingredients}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                ingredients: e.target.value,
                              })
                            }
                            autoResize
                            size="xl"
                            style={{
                              fontSize: "32px",
                              lineHeight: "44px",
                              minHeight: "300px",
                            }}
                          />
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <HStack gap="$150">
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          variant="outline"
                          onClick={() => history.back()}
                          disabled={suggestStepsMutation.isPending}
                        >
                          이전
                        </Button>
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          onClick={async () => {
                            const ingredients =
                              ingredientsRef.current?.value || "";
                            setFormData({ ...formData, ingredients });

                            try {
                              const response =
                                await suggestStepsMutation.mutateAsync({
                                  category: formData.category,
                                  years_of_experience: String(
                                    formData.experienceYears
                                  ),
                                  job_description: formData.occupation,
                                  materials: ingredients,
                                });

                              setFormData((prev) => ({
                                ...prev,
                                ingredients,
                                steps: response.suggestion,
                              }));
                              history.push("steps", { ingredients });
                            } catch (error) {
                              console.error(
                                "진행 단계 추천 API 호출 실패:",
                                error
                              );
                              alert(
                                "진행 단계 추천을 가져오는데 실패했습니다. 다시 시도해주세요."
                              );
                            }
                          }}
                          disabled={suggestStepsMutation.isPending}
                        >
                          {suggestStepsMutation.isPending
                            ? "추천 생성 중..."
                            : "다음"}
                        </Button>
                      </HStack>
                    </Box>
                  </>
                )}
                steps={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">
                          단계별로 하려면 어떻게 하면 되나요?
                        </Text>
                        <Field.Root name="steps">
                          <Field.Label>진행 단계</Field.Label>
                          <Textarea
                            ref={stepsRef}
                            placeholder="예: 1. 돌을 고르고 준비합니다&#10;2. 시멘트를 섞습니다&#10;3. 돌을 쌓아갑니다"
                            value={formData.steps}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                steps: e.target.value,
                              })
                            }
                            autoResize
                            size="xl"
                            style={{
                              fontSize: "32px",
                              lineHeight: "44px",
                              minHeight: "300px",
                            }}
                          />
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <HStack gap="$150">
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          variant="outline"
                          onClick={() => history.back()}
                        >
                          이전
                        </Button>
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          onClick={() => {
                            const steps = stepsRef.current?.value || "";
                            setFormData({ ...formData, steps });
                            history.push("location", { steps });
                          }}
                        >
                          다음
                        </Button>
                      </HStack>
                    </Box>
                  </>
                )}
                location={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">
                          신청자와 만나는 장소가 어디인가요?
                        </Text>
                        <Field.Root name="location">
                          <Textarea
                            ref={addressRef}
                            defaultValue={formData.address}
                            placeholder="체험 장소를 입력하세요"
                            className="large-input-placeholder"
                            size="xl"
                            autoResize
                            style={{
                              fontSize: "38px",
                              lineHeight: "48px",
                              border: "none",
                              fontWeight: "normal",
                              textAlign: "center",
                            }}
                          />
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <HStack gap="$150">
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          variant="outline"
                          onClick={() => history.back()}
                        >
                          이전
                        </Button>
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          onClick={() => {
                            const address = addressRef.current?.value || "";
                            setFormData({ ...formData, address });
                            history.push("duration", { address });
                          }}
                        >
                          다음
                        </Button>
                      </HStack>
                    </Box>
                  </>
                )}
                duration={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">소요 시간 설정</Text>
                        <Field.Root name="duration">
                          <VStack gap="$200" alignItems="center">
                            <Box
                              display="flex"
                              justifyContent="center"
                              width="100%"
                            >
                              <NumberStepper
                                value={formData.duration}
                                onChange={(value) =>
                                  setFormData({ ...formData, duration: value })
                                }
                                min={30}
                                max={480}
                                showButtons={true}
                              />
                            </Box>
                            <Text typography="body1">분</Text>
                          </VStack>
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <VStack gap="$300">
                        <HStack gap="$150">
                          <Button
                            type="button"
                            width="100%"
                            size="xl"
                            variant="outline"
                            onClick={() => history.back()}
                          >
                            이전
                          </Button>
                          <Button
                            type="button"
                            width="100%"
                            size="xl"
                            onClick={() =>
                              history.push("capacity", {
                                duration: formData.duration,
                              })
                            }
                          >
                            다음
                          </Button>
                        </HStack>
                        <TimeSelector
                          selectedTime={formData.duration}
                          onChange={(value) =>
                            setFormData({ ...formData, duration: value })
                          }
                        />
                      </VStack>
                    </Box>
                  </>
                )}
                capacity={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">최대 인원 추가</Text>
                        <Field.Root name="maxCapacity">
                          <Box
                            display="flex"
                            justifyContent="center"
                            width="100%"
                          >
                            <NumberStepper
                              value={formData.maxCapacity}
                              onChange={(value) =>
                                setFormData({ ...formData, maxCapacity: value })
                              }
                              min={1}
                              max={20}
                              showButtons={true}
                            />
                          </Box>
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <HStack gap="$150">
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          variant="outline"
                          onClick={() => history.back()}
                        >
                          이전
                        </Button>
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          onClick={() =>
                            history.push("price", {
                              maxCapacity: formData.maxCapacity,
                            })
                          }
                        >
                          다음
                        </Button>
                      </HStack>
                    </Box>
                  </>
                )}
                price={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">게스트 1인당 요금</Text>
                        <Field.Root name="price">
                          <Box
                            display="flex"
                            justifyContent="center"
                            width="100%"
                          >
                            <NumberStepper
                              value={formData.price}
                              showButtons={false}
                              onChange={(value) =>
                                setFormData({ ...formData, price: value })
                              }
                              min={5000}
                              max={1000000}
                            />
                          </Box>
                        </Field.Root>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <VStack gap="$300">
                        <HStack gap="$150">
                          <Button
                            type="button"
                            width="100%"
                            size="xl"
                            variant="outline"
                            onClick={() => history.back()}
                            disabled={generateExperiencePlanMutation.isPending}
                          >
                            이전
                          </Button>
                          <Button
                            type="button"
                            width="100%"
                            size="xl"
                            onClick={async () => {
                              try {
                                const response =
                                  await generateExperiencePlanMutation.mutateAsync(
                                    {
                                      category: formData.category,
                                      years_of_experience: String(
                                        formData.experienceYears
                                      ),
                                      job_description: formData.occupation,
                                      materials: formData.ingredients,
                                      location: formData.address,
                                      duration_minutes: String(
                                        formData.duration
                                      ),
                                      capacity: String(formData.maxCapacity),
                                      price_per_person: String(formData.price),
                                    }
                                  );

                                setFormData((prev) => ({
                                  ...prev,
                                  template: response.template,
                                }));
                                history.push("recommendation", {
                                  price: formData.price,
                                });
                              } catch (error) {
                                console.error(
                                  "체험 템플릿 생성 API 호출 실패:",
                                  error
                                );
                                alert(
                                  "체험 템플릿 생성에 실패했습니다. 다시 시도해주세요."
                                );
                              }
                            }}
                            disabled={generateExperiencePlanMutation.isPending}
                          >
                            {generateExperiencePlanMutation.isPending
                              ? "템플릿 생성 중..."
                              : "다음"}
                          </Button>
                        </HStack>
                        <PriceSelector
                          selectedPrice={formData.price}
                          onChange={(value) =>
                            setFormData({ ...formData, price: value })
                          }
                        />
                      </VStack>
                    </Box>
                  </>
                )}
                recommendation={({ history }) => (
                  <>
                    <Box
                      style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "24px",
                      }}
                    >
                      <VStack gap="$300">
                        <Text typography="heading3">추천 수업 템플릿</Text>
                        <Box
                          padding="$400"
                          backgroundColor="$canvas-100"
                          borderRadius="$300"
                        >
                          <Text
                            typography="body1"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {formData.template ||
                              "입력하신 정보를 바탕으로 체험이 준비되었습니다!"}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                    <Box
                      style={{
                        padding: "24px",
                        paddingBottom: "30px",
                        backgroundColor: "$white",
                      }}
                    >
                      <HStack gap="$150">
                        <Button
                          type="button"
                          width="100%"
                          size="xl"
                          variant="outline"
                          onClick={() => history.back()}
                          disabled={createClassMutation.isPending}
                        >
                          이전
                        </Button>
                        <Button
                          width="100%"
                          size="xl"
                          type="button"
                          colorPalette="success"
                          onClick={async () => {
                            try {
                              await createClassMutation.mutateAsync({
                                category: formData.category,
                                location: formData.address,
                                duration_minutes: formData.duration,
                                capacity: formData.maxCapacity,
                                years_of_experience: String(
                                  formData.experienceYears
                                ),
                                job_description: formData.occupation,
                                materials: formData.ingredients,
                                price_per_person: String(formData.price),
                                template: formData.template,
                              });

                              alert("체험이 성공적으로 등록되었습니다!");
                              navigate("/");
                            } catch (error) {
                              console.error("체험 등록 API 호출 실패:", error);
                              alert(
                                "체험 등록에 실패했습니다. 다시 시도해주세요."
                              );
                            }
                          }}
                          disabled={createClassMutation.isPending}
                        >
                          {createClassMutation.isPending
                            ? "등록 중..."
                            : "등록 완료"}
                        </Button>
                      </HStack>
                    </Box>
                  </>
                )}
              />
            </Form>

            {/* 진행 상황 표시 */}
            <Box marginTop="$400">
              <Text
                typography="body2"
                foreground="hint-100"
                className="v-text-center"
              >
                현재 단계: {String(funnel.step)}
              </Text>
            </Box>
          </Box>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
