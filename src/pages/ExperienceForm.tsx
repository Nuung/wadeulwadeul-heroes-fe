import { useMemo, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
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
import { ClassTemplate } from "../shared/ui/ClassTemplate";
import { Skeleton, SkeletonGroup } from "../shared/ui/Skeleton";
import {
  searchJusoAddress,
  sanitizeJusoKeyword,
  type JusoAddress,
} from "@/shared/api/juso";
import {
  useSuggestMaterialsMutation,
  useSuggestStepsMutation,
  useGenerateExperiencePlanMutation,
} from "../shared/api/queries/experience-plan.hooks";
import { useCreateClassMutation } from "../shared/api/queries/class.hooks";
import type { ClassTemplateData } from "../shared/api/queries/class.types";
import { FakeTextarea, FakeTextareaRef } from "../shared/ui/FakeTextarea";
import "@/shared/ui/addrlinkSample.css";

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

type CategoryValue = (typeof CATEGORY_OPTIONS)[number]["value"];

const CATEGORY_OCCUPATION_TITLES: Record<CategoryValue, string[]> = {
  stone: ["제주 돌담 복원 장인", "전통 돌쌓기 석공", "농가 돌담 설계 전문가"],
  tangerine: [
    "감귤 대농장 주인",
    "소소한 감귤 농장 운영자",
    "감귤 선과장 관리 매니저",
    "감귤 브랜드 디렉터",
  ],
  haenyeo: ["베테랑 해녀 선배", "해녀 물질 안전 강사", "초보 해녀 멘토"],
  cooking: [
    "제주 향토요리 셰프",
    "팜투테이블 쿠킹클래스 강사",
    "로컬 제철요리 연구 셰프",
  ],
  woodworking: [
    "수제 가구 목공방 마스터",
    "전통 목재 가공 장인",
    "생활 목공 DIY 강사",
  ],
};

const getOccupationTitle = (category: string) => {
  const option = CATEGORY_OPTIONS.find((opt) => opt.value === category);
  if (!option) {
    return "현장 전문가";
  }

  const titles = CATEGORY_OCCUPATION_TITLES[option.value];
  if (!titles?.length) {
    return `${option.label} 전문가`;
  }

  const randomIndex = Math.floor(Math.random() * titles.length);
  return titles[randomIndex];
};

interface ExperienceFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ExperienceForm({
  isOpen,
  setIsOpen,
}: ExperienceFormProps) {
  const navigate = useNavigate();

  const funnel = useFunnel<ExperienceFormSteps>({
    id: "experience-form",
    initial: {
      step: "category",
      context: {},
    },
  });

  // useRef를 사용하여 occupation, ingredients, steps, address 필드의 값을 관리
  const occupationRef = useRef<FakeTextareaRef>(null);
  const ingredientsRef = useRef<HTMLTextAreaElement>(null);
  const stepsRef = useRef<HTMLTextAreaElement>(null);
  const addressRef = useRef<FakeTextareaRef>(null);

  // 초기 formData 값을 상수로 정의
  const initialFormData = {
    category: "",
    experienceYears: 0,
    occupation: "",
    ingredients: "",
    steps: "",
    address: "",
    duration: 60,
    maxCapacity: 1,
    price: 0,
    template: null,
  };

  const [formData, setFormData] = useState<{
    category: string;
    experienceYears: number;
    occupation: string;
    ingredients: string;
    steps: string;
    address: string;
    duration: number;
    maxCapacity: number;
    price: number;
    template: ClassTemplateData | null;
  }>(initialFormData);
  const [addressKeyword, setAddressKeyword] = useState("");
  const [addressResults, setAddressResults] = useState<JusoAddress[]>([]);
  const [addressSearchError, setAddressSearchError] = useState<string | null>(
    null
  );
  const [isAddressSearching, setIsAddressSearching] = useState(false);

  const occupationPlaceholder = useMemo(
    () => getOccupationTitle(formData.category),
    [formData.category]
  );

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

    // Sheet가 닫힐 때 모든 값 초기화
    if (!open) {
      // formData 초기화
      setFormData(initialFormData);

      // ref 초기화
      occupationRef.current?.reset();
      if (ingredientsRef.current) {
        ingredientsRef.current.value = "";
      }
      if (stepsRef.current) {
        stepsRef.current.value = "";
      }
      addressRef.current?.reset();

      // funnel을 초기 단계로 리셋 (React Router의 navigate 사용)
      navigate("?", { replace: true });
    }
  };

  // Sheet가 열릴 때 funnel을 초기 단계로 강제 리셋
  useEffect(() => {
    if (isOpen) {
      // Sheet가 열릴 때마다 항상 funnel을 초기 step으로 설정
      const initialFunnelState = JSON.stringify({
        step: "category",
        context: {},
      });
      navigate(`?experience-form=${encodeURIComponent(initialFunnelState)}`, {
        replace: true,
      });
    }
  }, [isOpen, navigate]);

  const handleAddressSearch = async () => {
    const sanitizedKeyword = sanitizeJusoKeyword(addressKeyword);
    if (!sanitizedKeyword) {
      setAddressSearchError("검색어를 입력해주세요.");
      setAddressResults([]);
      return;
    }

    setIsAddressSearching(true);
    setAddressSearchError(null);
    try {
      const results = await searchJusoAddress(sanitizedKeyword);
      setAddressResults(results);
      if (!results.length) {
        setAddressSearchError(
          "검색 결과가 없습니다. 다른 키워드를 입력해주세요."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "주소 검색에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setAddressSearchError(message);
      setAddressResults([]);
    } finally {
      setIsAddressSearching(false);
    }
  };

  const handleSelectAddress = (item: JusoAddress) => {
    const composed = [
      item.zipNo ? `[${item.zipNo}]` : "",
      item.roadAddr || item.jibunAddr,
    ]
      .filter(Boolean)
      .join(" ");
    const nextAddress = composed || item.roadAddr || item.jibunAddr || "";

    setFormData((prev) => ({ ...prev, address: nextAddress }));
    setAddressKeyword(item.roadAddr || "");
    setAddressResults([]);
    if (addressRef.current) {
      addressRef.current.value = nextAddress;
      addressRef.current.focus();
    }
  };

  return (
    <Sheet.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      closeOnClickOverlay={true}
    >
      <Sheet.Popup
        positionerElement={<Sheet.PositionerPrimitive side="bottom" />}
        style={{
          height: "calc(100vh - 56px)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
      >
        <Sheet.Header>
          <Sheet.Close
            render={(props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
              <button
                {...props}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "16px",
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  padding: "8px",
                  lineHeight: "1",
                  color: "var(--vapor-color-text-secondary, #666)",
                }}
                aria-label="닫기"
              >
                ✕
              </button>
            )}
          />
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

                        <CategoryCard
                          name="category"
                          options={CATEGORY_OPTIONS}
                          value={formData.category}
                          onChange={(value) =>
                            setFormData({ ...formData, category: value })
                          }
                        />
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
                          }
                          분야에서 몇 년 동안 일하셨나요?
                        </Text>

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
                      {suggestMaterialsMutation.isPending ? (
                        <VStack gap="$300">
                          <Skeleton variant="text" width="60%" height={36} />
                          <SkeletonGroup gap={16} vertical>
                            <Skeleton variant="rounded" height={200} />
                            <Skeleton variant="text" width="80%" height={24} />
                            <Skeleton variant="text" width="40%" height={24} />
                          </SkeletonGroup>
                        </VStack>
                      ) : (
                        <VStack gap="$300">
                          <Text typography="heading3">어떤 일을 하시나요?</Text>

                          <FakeTextarea
                            ref={occupationRef}
                            placeholder={
                              CATEGORY_OPTIONS.find(
                                (opt) => opt.value === formData.category
                              )?.label + " 전문가"
                            }
                            defaultValue={
                              CATEGORY_OPTIONS.find(
                                (opt) => opt.value === formData.category
                              )?.label + " 전문가"
                            }
                            className="large-input-placeholder"
                            size="xl"
                            autoResize
                            style={{
                              fontSize: "38px",
                              lineHeight: "48px",
                              border: "none",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          />
                        </VStack>
                      )}
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
                      {suggestStepsMutation.isPending ? (
                        <VStack gap="$300">
                          <Skeleton variant="text" width="70%" height={36} />
                          <SkeletonGroup gap={12} vertical>
                            <Skeleton variant="text" width="30%" height={20} />
                            <Skeleton variant="rounded" height={300} />
                          </SkeletonGroup>
                        </VStack>
                      ) : (
                        <VStack gap="$300">
                          <Text typography="heading3">
                            준비해야 하는 재료는 무엇인가요?
                          </Text>

                          <Textarea
                            ref={ingredientsRef}
                            placeholder="예: 돌, 시멘트, 흙손 등"
                            defaultValue={formData.ingredients}
                            autoResize
                            size="xl"
                            style={{
                              fontSize: "32px",
                              lineHeight: "44px",
                              minHeight: "300px",
                              maxHeight: "630px",
                              fontWeight: "bold",
                            }}
                          />
                        </VStack>
                      )}
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

                        <Textarea
                          ref={stepsRef}
                          placeholder="예: 1. 돌을 고르고 준비합니다&#10;2. 시멘트를 섞습니다&#10;3. 돌을 쌓아갑니다"
                          defaultValue={formData.steps}
                          autoResize
                          size="xl"
                          style={{
                            fontSize: "32px",
                            lineHeight: "44px",
                            minHeight: "300px",
                            maxHeight: "630px",
                            fontWeight: "bold",
                          }}
                        />
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
                        <Box className="addrlink-search-box">
                          <div className="addrlink-search-form">
                            <TextInput
                              placeholder="도로명 / 건물명 / 지번으로 검색"
                              value={addressKeyword}
                              onChange={(event) =>
                                setAddressKeyword(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  void handleAddressSearch();
                                }
                              }}
                              className="addrlink-search-input"
                              size="lg"
                            />
                            <Button
                              type="button"
                              variant="fill"
                              size="lg"
                              onClick={() => void handleAddressSearch()}
                              disabled={isAddressSearching}
                            >
                              {isAddressSearching ? "검색 중..." : "주소 검색"}
                            </Button>
                          </div>
                          {addressSearchError ? (
                            <Text style={{ color: "#e11d48" }}>
                              {addressSearchError}
                            </Text>
                          ) : null}
                          {addressResults.length > 0 ? (
                            <div className="addrlink-result-list">
                              {addressResults.map((item) => (
                                <button
                                  key={`${item.zipNo}-${item.roadAddr}-${
                                    item.bdMgtSn ?? ""
                                  }`}
                                  type="button"
                                  className="addrlink-result-item"
                                  onClick={() => handleSelectAddress(item)}
                                >
                                  <span className="addrlink-zip">
                                    [{item.zipNo}]
                                  </span>
                                  <span className="addrlink-road">
                                    {item.roadAddr}
                                  </span>
                                  <span className="addrlink-jibun">
                                    {item.jibunAddr}
                                  </span>
                                  {item.bdNm ? (
                                    <span className="addrlink-extra">
                                      {item.bdNm}
                                    </span>
                                  ) : null}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </Box>

                        <FakeTextarea
                          ref={addressRef}
                          defaultValue="체험 장소를 입력하세요"
                          placeholder="체험 장소를 입력하세요"
                          className="large-input-placeholder"
                          size="xl"
                          autoResize
                          style={{
                            fontSize: "38px",
                            lineHeight: "48px",
                            border: "none",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        />
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
                            const addressValue =
                              addressRef.current?.value ??
                              formData.address ??
                              "";
                            const address = addressValue.trim();
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
                      {generateExperiencePlanMutation.isPending ? (
                        <VStack gap="$300">
                          <Skeleton variant="text" width="50%" height={36} />
                          <Box
                            display="flex"
                            justifyContent="center"
                            width="100%"
                          >
                            <Skeleton
                              variant="rounded"
                              width={200}
                              height={80}
                            />
                          </Box>
                        </VStack>
                      ) : (
                        <VStack gap="$300">
                          <Text typography="heading3">게스트 1인당 요금</Text>

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
                        </VStack>
                      )}
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
                                  template: response,
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
                      {createClassMutation.isPending || !formData.template ? (
                        <VStack gap="$300">
                          <Skeleton variant="text" width="50%" height={36} />
                          <Box
                            padding="$400"
                            backgroundColor="$canvas-100"
                            borderRadius="$300"
                          >
                            <SkeletonGroup gap={20} vertical>
                              <Skeleton
                                variant="text"
                                width="70%"
                                height={28}
                              />
                              <Skeleton variant="rounded" height={150} />
                              <SkeletonGroup gap={12} vertical>
                                <Skeleton
                                  variant="text"
                                  width="100%"
                                  height={20}
                                />
                                <Skeleton
                                  variant="text"
                                  width="90%"
                                  height={20}
                                />
                                <Skeleton
                                  variant="text"
                                  width="80%"
                                  height={20}
                                />
                              </SkeletonGroup>
                            </SkeletonGroup>
                          </Box>
                        </VStack>
                      ) : (
                        <VStack gap="$300">
                          <Text typography="heading3">추천 수업 템플릿</Text>
                          <Box
                            padding="$400"
                            backgroundColor="$canvas-100"
                            borderRadius="$300"
                          >
                            <ClassTemplate template={formData.template} />
                          </Box>
                        </VStack>
                      )}
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
          </Box>
        </Sheet.Body>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
