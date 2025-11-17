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
        description="Full form with validation and submission using React Hook Form"
        code={`import { Form, FormField, TextField, FormButtons, FormSubmitButton } from '@umami/react-zen';

// Form automatically handles React Hook Form setup
<Form onSubmit={(data) => {
  console.log(data); // { name: "...", email: "..." }
  // Handle form submission
}}>
  <Column gap="4">
    <FormField
      name="name"
      label="Name"
      rules={{ required: 'Name is required' }}
    >
      <TextField placeholder="Enter your name" />
    </FormField>

    <FormField
      name="email"
      label="Email"
      rules={{
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      }}
    >
      <TextField placeholder="email@example.com" />
    </FormField>

    <FormButtons>
      <FormResetButton variant="outline">Reset</FormResetButton>
      <FormSubmitButton>Submit</FormSubmitButton>
    </FormButtons>
  </Column>
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
        code={`// Basic text field
<TextField
  placeholder="Enter text"
  onChange={(e) => setValue(e.target.value)}
/>

// Read-only field
<TextField value="Read-only value" isReadOnly />

// Disabled field
<TextField placeholder="Disabled" isDisabled />

// Textarea
<TextField
  placeholder="Multi-line text"
  asTextArea
  resize="vertical"
  rows={4}
/>

// With copy button
<TextField
  value="text-to-copy"
  allowCopy
  isReadOnly
/>`}
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
        description="Search input with automatic debounce - perfect for filtering"
        code={`const [searchValue, setSearchValue] = useState('');

// onSearch triggers after delay (default: 600ms)
<SearchField
  value={searchValue}
  onSearch={(value) => {
    setSearchValue(value);
    // Perform search/filter operation
    filterResults(value);
  }}
  placeholder="Type to search..."
  delay={300} // Custom delay in milliseconds
/>

// Use with DataGrid for table filtering
<DataGrid query={query} allowSearch>
  {(data) => <DataTable data={data.data}>...</DataTable>}
</DataGrid>`}
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
        code={`const [value, setValue] = useState('option1');

<Select
  value={value}
  onChange={(e) => setValue(e.target.value)}
>
  <ListItem id="option1">First Option</ListItem>
  <ListItem id="option2">Second Option</ListItem>
  <ListItem id="option3">Third Option</ListItem>
</Select>

// With search functionality
<Select
  value={value}
  onChange={(e) => setValue(e.target.value)}
  allowSearch
  searchValue={searchTerm}
  onSearch={setSearchTerm}
>
  {filteredOptions.map(opt => (
    <ListItem key={opt.id} id={opt.id}>
      {opt.label}
    </ListItem>
  ))}
</Select>

// In a form
<FormField name="country" label="Country">
  <Select>
    <ListItem id="us">United States</ListItem>
    <ListItem id="uk">United Kingdom</ListItem>
    <ListItem id="ca">Canada</ListItem>
  </Select>
</FormField>`}
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
