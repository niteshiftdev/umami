'use client';

import { useState } from 'react';
import {
  Column,
  Row,
  Form,
  FormField,
  FormButtons,
  FormSubmitButton,
  FormResetButton,
  TextField,
  PasswordField,
  SearchField,
  Select,
  ListItem,
  Checkbox,
  Switch,
  RadioGroup,
  Radio,
  Slider,
  Text,
} from '@umami/react-zen';
import { ShowcaseSection } from '../components/ShowcaseSection';

export function FormsShowcase() {
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('option1');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="Complete Form"
        description="Full form with validation and submission"
        code={`<Form onSubmit={handleSubmit}>
  <FormField name="email" label="Email" rules={{ required: true }}>
    <TextField />
  </FormField>
  <FormButtons>
    <FormSubmitButton>Submit</FormSubmitButton>
  </FormButtons>
</Form>`}
      >
        <Form onSubmit={data => alert(JSON.stringify(data, null, 2))}>
          <Column gap="4">
            <FormField name="name" label="Name" rules={{ required: true }}>
              <TextField placeholder="Enter your name" />
            </FormField>

            <FormField name="email" label="Email" rules={{ required: true }}>
              <TextField placeholder="email@example.com" />
            </FormField>

            <FormField name="password" label="Password">
              <PasswordField placeholder="Enter password" />
            </FormField>

            <FormButtons>
              <FormResetButton variant="outline">Reset</FormResetButton>
              <FormSubmitButton>Submit</FormSubmitButton>
            </FormButtons>
          </Column>
        </Form>
      </ShowcaseSection>

      <ShowcaseSection
        title="Text Fields"
        description="Text input variations"
        code='<TextField placeholder="Enter text" />'
      >
        <Column gap="4">
          <TextField placeholder="Default text field" />
          <TextField value="Read-only text" isReadOnly />
          <TextField placeholder="Disabled field" isDisabled />
          <TextField placeholder="Textarea" asTextArea resize="vertical" />
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Search Field"
        description="Search input with debounce"
        code='<SearchField value={value} onSearch={handleSearch} delay={600} />'
      >
        <Column gap="3">
          <SearchField
            value={searchValue}
            onSearch={setSearchValue}
            placeholder="Type to search..."
            delay={300}
          />
          {searchValue && (
            <Text color="muted" size="3">
              Search value: {searchValue}
            </Text>
          )}
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Select Dropdown"
        description="Select component with options"
        code={`<Select value={value} onChange={handleChange}>
  <ListItem id="1">Option 1</ListItem>
  <ListItem id="2">Option 2</ListItem>
</Select>`}
      >
        <Column gap="3">
          <Select value={selectValue} onChange={e => setSelectValue(e.target.value)}>
            <ListItem id="option1">Option 1</ListItem>
            <ListItem id="option2">Option 2</ListItem>
            <ListItem id="option3">Option 3</ListItem>
            <ListItem id="option4">Option 4</ListItem>
          </Select>
          <Text color="muted" size="3">
            Selected: {selectValue}
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Checkbox & Switch"
        description="Checkbox and toggle switch components"
      >
        <Column gap="4">
          <Row gap="6">
            <Checkbox
              label="Checkbox option"
              isSelected={checkboxValue}
              onChange={setCheckboxValue}
            />
            <Text color="muted">
              Checked: {checkboxValue ? 'Yes' : 'No'}
            </Text>
          </Row>

          <Row gap="6">
            <Switch
              label="Toggle switch"
              isSelected={switchValue}
              onChange={setSwitchValue}
            />
            <Text color="muted">
              Enabled: {switchValue ? 'Yes' : 'No'}
            </Text>
          </Row>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Radio Group"
        description="Radio button group"
        code={`<RadioGroup value={value} onChange={setValue}>
  <Radio value="1">Option 1</Radio>
  <Radio value="2">Option 2</Radio>
</RadioGroup>`}
      >
        <Column gap="3">
          <RadioGroup value={radioValue} onChange={setRadioValue}>
            <Radio value="option1">First Option</Radio>
            <Radio value="option2">Second Option</Radio>
            <Radio value="option3">Third Option</Radio>
          </RadioGroup>
          <Text color="muted" size="3">
            Selected: {radioValue}
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Slider"
        description="Range slider input"
        code='<Slider value={value} onChange={setValue} minValue={0} maxValue={100} />'
      >
        <Column gap="3">
          <Slider
            value={sliderValue}
            onChange={setSliderValue}
            minValue={0}
            maxValue={100}
            step={5}
            showValue
            label="Select a value"
          />
          <Text color="muted" size="3">
            Value: {sliderValue}
          </Text>
        </Column>
      </ShowcaseSection>
    </Column>
  );
}
