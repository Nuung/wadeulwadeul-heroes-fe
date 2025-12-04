import { VStack, Select, Form, Button, Field, TextInput } from '@vapor-ui/core';
import { FormRadioGroup, RadioOption } from '../shared/ui/Form';
import { useState } from 'react';

interface FormData {
  name: string;
  birthYear: string;
  gender: string;
}

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthYear: '',
    gender: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const getYears = () =>
    Array.from({ length: 100 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year.toString(), label: year.toString() };
    });

  const years = getYears();

  const genderOptions: RadioOption[] = [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
    { value: 'other', label: '기타' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.birthYear) {
      newErrors.birthYear = '출생 연도를 선택해주세요.';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      setSubmittedData(formData);
      console.log('Form submitted:', formData);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      birthYear: '',
      gender: '',
    });
    setErrors({});
    setSubmittedData(null);
  };

  return (
    <div className="v-p-8 v-max-w-2xl v-mx-auto">
      <h1 className="v-text-3xl v-font-bold v-mb-6">폼 예시 페이지</h1>

      <Form onSubmit={handleSubmit}>
        <VStack className="v-gap-6">
          {/* TextInput 예시 - Field.Root 패턴 */}
          <Field.Root name="name" required invalid={!!errors.name}>
            <Field.Label>이름 *</Field.Label>
            <TextInput
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
            />
            {errors.name && <Field.Error>{errors.name}</Field.Error>}
          </Field.Root>

          {/* Select 예시 - Field.Root 패턴 */}
          <Field.Root name="birthYear" required invalid={!!errors.birthYear}>
            <Field.Label>출생 연도 *</Field.Label>
            <Field.Description>출생 연도를 선택해주세요</Field.Description>
            <Select.Root
              value={formData.birthYear}
              onValueChange={(value) => {
                if (typeof value === 'string') {
                  setFormData({ ...formData, birthYear: value });
                  if (errors.birthYear) {
                    setErrors({ ...errors, birthYear: undefined });
                  }
                }
              }}
              placeholder="출생연도를 선택하세요"
            >
              <Select.Trigger width="100%" />
              <Select.Popup>
                <Select.Group>
                  <Select.GroupLabel>출생 연도</Select.GroupLabel>
                  {years.map((year) => (
                    <Select.Item key={year.value} value={year.value}>
                      {year.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Popup>
            </Select.Root>
            {errors.birthYear && <Field.Error>{errors.birthYear}</Field.Error>}
          </Field.Root>

          {/* RadioGroup 예시 - Field.Root 패턴 */}
          <Field.Root name="gender" required invalid={!!errors.gender}>
            <Field.Label>성별 *</Field.Label>
            <FormRadioGroup
              name="gender"
              options={genderOptions}
              direction="horizontal"
              value={formData.gender}
              onChange={(value) => {
                setFormData({ ...formData, gender: value });
                if (errors.gender) {
                  setErrors({ ...errors, gender: undefined });
                }
              }}
            />
            <Field.Description>개인정보 보호를 위해 선택사항입니다.</Field.Description>
            {errors.gender && <Field.Error>{errors.gender}</Field.Error>}
          </Field.Root>

          {/* 제출 버튼 */}
          <div className="v-flex v-gap-3 v-pt-4">
            <Button type="submit" variant="fill">
              제출하기
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </VStack>
      </Form>

      {/* 제출된 데이터 표시 */}
      {submittedData && (
        <div className="v-mt-8 v-p-6 v-bg-success-50 v-rounded-lg v-border v-border-success-200">
          <h2 className="v-text-xl v-font-semibold v-mb-4 v-text-success-900">
            제출 완료!
          </h2>
          <dl className="v-space-y-2">
            <div>
              <dt className="v-font-medium v-text-success-800">이름:</dt>
              <dd className="v-text-success-700">{submittedData.name}</dd>
            </div>
            <div>
              <dt className="v-font-medium v-text-success-800">출생 연도:</dt>
              <dd className="v-text-success-700">{submittedData.birthYear}</dd>
            </div>
            <div>
              <dt className="v-font-medium v-text-success-800">성별:</dt>
              <dd className="v-text-success-700">
                {genderOptions.find((opt) => opt.value === submittedData.gender)?.label}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
