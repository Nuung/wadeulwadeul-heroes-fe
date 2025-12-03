import { VStack, Field, TextInput, Select } from '@vapor-ui/core'
import { get } from 'react-hook-form'
// import { FormInput } from '../shared/ui/Form'

export default function Form() {
  const getYears = () => Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { value: year.toString(), label: year.toString() }
  })

  const years = getYears()

  return <>
  <VStack>
    <Field.Root>
      <Field.Label>이름</Field.Label>
      <TextInput />
      <Field.Label>출생 연도</Field.Label>
      <Select.Root placeholder="출생연도를 선택하세요">
            <Select.Trigger width="400px" />
            <Select.Popup>
                <Select.Group>
                    <Select.GroupLabel>폰트</Select.GroupLabel>
                    {years.map(year => (
                      <Select.Item key={year.value} value={year.value}>{year.label}</Select.Item>
                    ))}
                </Select.Group>
            </Select.Popup>
        </Select.Root>
    </Field.Root>
  </VStack>
  </>
}
