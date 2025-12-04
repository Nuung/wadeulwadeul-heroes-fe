import { VStack, Select } from '@vapor-ui/core';
import { FormField, FormInput, FormRadioGroup } from '../shared/ui/Form';

export default function Form() {
  const getYears = () =>
    Array.from({ length: 100 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return { value: year.toString(), label: year.toString() };
    });

  const years = getYears();

  const genderOptions = [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
    { value: 'other', label: '기타' },
  ];

  return (
    <VStack className="v-gap-6 v-p-6">
      <FormField name="name" label="이름" required>
        <FormInput placeholder="이름을 입력하세요" />
      </FormField>

      <FormField name="birthYear" label="출생 연도" description="출생 연도를 선택해주세요">
        <Select.Root placeholder="출생연도를 선택하세요">
          <Select.Trigger width="400px" />
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
      </FormField>

      <FormField
        name="gender"
        label="성별"
        description="개인정보 보호를 위해 선택사항입니다."
      >
        <FormRadioGroup name="gender" options={genderOptions} direction="horizontal" />
      </FormField>
    </VStack>
  );
}
