# Umami Design System Report

This document describes the design and component system used in the Umami application.

## Overview

Umami uses **@umami/react-zen** (v0.203.0) as its primary UI component library. This is a custom design system built on top of React Aria Components, providing accessible and composable UI primitives. The app also uses:

- **React 19.2.0** as the core framework
- **Next.js 15.5.3** for the application framework
- **Chart.js 4.5.1** for data visualization
- **Lucide React** for icons
- **CSS Modules** with CSS variables for styling

---

## Components

### Layout Components

#### Box
Base layout component with comprehensive styling props.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `display` | `Responsive<Display>` | `none`, `inline`, `inline-block`, `block`, `flex`, `inline-flex`, `grid`, `inline-grid` |
| `position` | `Responsive<Position>` | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| `padding` | `Responsive<Padding>` | `0`-`12`, or `true` for default |
| `paddingX`, `paddingY` | `Responsive<Padding>` | Horizontal/vertical padding shortcuts |
| `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` | `Responsive<Padding>` | Individual side padding |
| `margin` | `Responsive<Spacing>` | `0`-`12` |
| `marginX`, `marginY` | `Responsive<Spacing>` | Horizontal/vertical margin shortcuts |
| `width`, `minWidth`, `maxWidth` | `Responsive<string>` | CSS width values |
| `height`, `minHeight`, `maxHeight` | `Responsive<string>` | CSS height values |
| `border` | `Responsive<Border>` | `true`, `top`, `right`, `bottom`, `left`, `none` |
| `borderWidth` | `Responsive<BorderWidth>` | `1`, `2`, `3`, `4` |
| `borderColor` | `BorderColor` | Base colors (`1`-`12`), accent colors, `primary`, `muted`, `disabled`, `transparent` |
| `borderRadius` | `Responsive<BorderRadius>` | `0`, `1`, `2`, `3`, `4`, `full`, or `true` |
| `shadow` | `Responsive<BoxShadow>` | `0`-`6`, `none` |
| `color` | `FontColor` | Font color options |
| `backgroundColor` | `BackgroundColor` | Background color options |
| `fontSize` | `Responsive<FontSize>` | `1`-`12` (size scale) |
| `fontWeight` | `Responsive<FontWeight>` | `thin`, `extra-light`, `light`, `regular`, `medium`, `semi-bold`, `bold`, `extra-bold`, `black` |
| `overflow`, `overflowX`, `overflowY` | `Responsive<Overflow>` | `visible`, `hidden`, `clip`, `scroll`, `auto` |
| `as` | `string` | HTML element to render as |
| `asChild` | `boolean` | Render as child component (Slot pattern) |
| `theme` | `string` | Theme name |

**Common use cases:**
- Base primitive for custom components
- Creating custom layout structures
- Responsive design with breakpoint-specific props

#### Row
Flexbox row layout component (extends `Flexbox`).

| Prop | Type | Options/Notes |
|------|------|---------------|
| `reverse` | `boolean` | Reverses flex direction |
| `justifyContent` | `Responsive<JustifyContent>` | `center`, `start`, `end`, `flex-start`, `flex-end`, `space-between`, `space-around`, `space-evenly`, `stretch` |
| `alignItems` | `AlignItems` | `center`, `start`, `end`, `flex-start`, `flex-end`, `stretch`, `baseline` |
| `gap` | `Responsive<Gap>` | `0`-`12`, or `true` for default |
| `gapX`, `gapY` | `Responsive<Gap>` | Horizontal/vertical gap |
| `wrap` | `Responsive<FlexWrap>` | `wrap`, `nowrap`, `wrap-reverse` |
| ...all `Box` props | | Inherits all Box properties |

**Common use cases:**
- Horizontal layouts
- Navigation bars
- Button groups
- Form layouts

**Example usage:**
```tsx
<Row justifyContent="space-between" alignItems="center" gap="3">
  <Text>Label</Text>
  <Button>Action</Button>
</Row>
```

#### Column
Flexbox column layout component (extends `Flexbox`).

| Prop | Type | Options/Notes |
|------|------|---------------|
| `reverse` | `boolean` | Reverses flex direction |
| `justifyContent` | `Responsive<JustifyContent>` | Same as Row |
| `alignItems` | `AlignItems` | Same as Row |
| `gap` | `Responsive<Gap>` | `0`-`12`, or `true` for default |
| ...all `Box` props | | Inherits all Box properties |

**Common use cases:**
- Vertical stacking
- Form fields
- Card content
- Sidebar layouts

#### Grid
CSS Grid layout component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `display` | `Responsive<GridDisplay>` | `none`, `grid`, `inline-grid` |
| `columns` | `Responsive<GridTemplateColumns>` | CSS grid template columns value |
| `rows` | `Responsive<GridTemplateRows>` | CSS grid template rows value |
| `areas` | `Responsive<GridTemplateAreas>` | CSS grid template areas value |
| `autoFlow` | `Responsive<GridAutoFlow>` | `row`, `column`, `dense`, `row-dense`, `column-dense` |
| `gap`, `gapX`, `gapY` | `Responsive<Gap>` | Grid gap spacing |
| `justifyContent`, `justifyItems` | | Grid alignment |
| ...all `Box` props | | Inherits all Box properties |

**Common use cases:**
- Complex responsive layouts
- Data cards
- Gallery grids

#### Container
Centered container with max-width constraints.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `isFluid` | `boolean` | Full width container |
| `isCentered` | `boolean` | Center the container |
| ...all `Box` props | | Inherits all Box properties |

---

### Form Components

#### Form
Form wrapper with React Hook Form integration.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `onSubmit` | `SubmitHandler<any>` | Form submission handler |
| `error` | `ReactNode \| Error` | Display form-level errors |
| `preventSubmit` | `boolean` | Prevent form submission |
| `autoComplete` | `string` | HTML autocomplete attribute |
| `mode` | | React Hook Form validation mode |
| `defaultValues` | | Default form values |
| `children` | `ReactNode \| ((form: UseFormReturn) => ReactNode)` | Form content or render function |

**Common use cases:**
- All form implementations
- Login/registration forms
- Settings forms
- Data entry forms

**Example usage from codebase:**
```tsx
<Form onSubmit={handleSubmit}>
  <FormField name="email" label="Email">
    <TextField />
  </FormField>
  <FormButtons>
    <FormSubmitButton>Submit</FormSubmitButton>
  </FormButtons>
</Form>
```

#### FormField
Wrapper for form fields with label and validation.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `name` | `string` | Field name (required) |
| `label` | `string` | Field label |
| `description` | `string` | Help text |
| `rules` | `RegisterOptions` | React Hook Form validation rules |
| `children` | | Input component |

#### FormController
Controller for custom form inputs.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `name` | `string` | Field name |
| `rules` | `RegisterOptions` | Validation rules |
| `children` | `({ field, fieldState, formState }) => ReactElement` | Render function |

#### FormFieldArray
For dynamic field arrays.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `name` | `string` | Array field name |
| `label` | `string` | Field label |
| `children` | `(props: any) => ReactNode` | Render function |

#### TextField
Text input component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Input label |
| `placeholder` | `string` | Placeholder text |
| `value` | `string` | Controlled value |
| `defaultValue` | `string` | Initial value |
| `allowCopy` | `boolean` | Show copy button |
| `asTextArea` | `boolean` | Render as textarea |
| `resize` | `'vertical' \| 'horizontal' \| 'both' \| 'none'` | Textarea resize behavior |
| `onChange` | `(e: any) => void` | Change handler |
| `isReadOnly` | `boolean` | Read-only state |
| `isDisabled` | `boolean` | Disabled state |

**Common use cases:**
- Text inputs
- Multi-line text areas
- Read-only value displays

#### PasswordField
Password input with show/hide toggle.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Input label |
| ...all `TextField` props | | Inherits TextField properties |

#### SearchField
Search input with debounce.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Input label |
| `placeholder` | `string` | Placeholder text |
| `value` | `string` | Controlled value |
| `defaultValue` | `string` | Initial value |
| `delay` | `number` | Debounce delay in ms (default: 600) |
| `onChange` | `(value: string) => void` | Change handler |
| `onSearch` | `(value: string) => void` | Debounced search handler |

**Common use cases:**
- Table search/filter
- Real-time search
- Autocomplete inputs

#### Select
Dropdown select component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `items` | `any[]` | Select options |
| `value` | `string \| number` | Selected value |
| `defaultValue` | `string \| number` | Initial value |
| `label` | `string` | Select label |
| `isLoading` | `boolean` | Loading state |
| `allowSearch` | `boolean` | Enable search filtering |
| `searchValue` | `string` | Search input value |
| `searchDelay` | `number` | Search debounce delay |
| `isFullscreen` | `boolean` | Fullscreen mobile view |
| `onSearch` | `(value: string) => void` | Search handler |
| `onChange` | `(e: any) => void` | Change handler |
| `renderValue` | `ReactNode \| ((values) => ReactNode)` | Custom value renderer |

**Common use cases:**
- Dropdown selects
- Searchable selects
- Custom option rendering

#### Checkbox
Checkbox input component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Checkbox label |
| `isSelected` | `boolean` | Checked state |
| `isDisabled` | `boolean` | Disabled state |
| `onChange` | `(isSelected: boolean) => void` | Change handler |

#### Switch
Toggle switch component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Switch label |
| `isSelected` | `boolean` | Toggle state |
| `isDisabled` | `boolean` | Disabled state |
| `onChange` | `(isSelected: boolean) => void` | Change handler |

**Common use cases:**
- Settings toggles
- Feature flags
- On/off states

#### RadioGroup
Radio button group.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Group label |
| `variant` | `'circle' \| 'box'` | Visual style |
| `value` | `string` | Selected value |
| `onChange` | `(value: string) => void` | Change handler |

#### Slider
Range slider input.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `ReactNode` | Slider label |
| `showValue` | `boolean` | Display current value |
| `minValue` | `number` | Minimum value |
| `maxValue` | `number` | Maximum value |
| `step` | `number` | Step increment |
| `value` | `number` | Current value |
| `onChange` | `(value: number) => void` | Change handler |

#### FormButtons
Container for form action buttons.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `fill` | `boolean` | Full width buttons |
| ...all `Row` props | | Inherits Row properties |

**Common use cases:**
- Submit/cancel button groups
- Form action areas

#### FormSubmitButton
Submit button with loading state.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `isLoading` | `boolean` | Loading state |
| `isDisabled` | `boolean` | Disabled state |
| ...all `Button` props | | Inherits Button properties |

#### FormResetButton
Reset button for forms.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `values` | `FieldValues` | Values to reset to |
| ...all `Button` props | | Inherits Button properties |

---

### Button Components

#### Button
Primary button component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `variant` | `'primary' \| 'outline' \| 'quiet' \| 'danger' \| 'zero'` | Visual style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Button size |
| `isDisabled` | `boolean` | Disabled state |
| `onPress` | `() => void` | Click handler |
| `asChild` | `boolean` | Render as child (Slot pattern) |

**Variant descriptions:**
- `primary`: Blue filled button (default)
- `outline`: Bordered button
- `quiet`: Minimal button without border
- `danger`: Red/destructive action button
- `zero`: Completely unstyled button

**Common use cases:**
- Primary actions (Submit, Save, Create)
- Secondary actions (Cancel, Back)
- Icon-only buttons with `variant="quiet"`
- Destructive actions with `variant="danger"`

#### LoadingButton
Button with loading state and spinner.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `isLoading` | `boolean` | Show loading spinner |
| `isDisabled` | `boolean` | Disabled state |
| `showText` | `boolean` | Show button text while loading |
| ...all `Button` props | | Inherits Button properties |

**Common use cases:**
- Async operations (API calls, file uploads)
- Form submissions

#### CopyButton
Button that copies value to clipboard.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `value` | `string` | Value to copy |
| `timeout` | `number` | Success state duration (ms) |

**Common use cases:**
- Copy API keys
- Copy URLs
- Copy tracking codes

---

### Modal & Dialog Components

#### Modal
Modal overlay container.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `placement` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'fullscreen'` | Modal position |
| `offset` | `string` | CSS offset value |
| `isDismissable` | `boolean` | Allow click-outside to close |
| `isOpen` | `boolean` | Open state |
| `onOpenChange` | `(isOpen: boolean) => void` | State change handler |
| `children` | `ReactNode \| ((values) => ReactNode)` | Modal content |

**Common use cases:**
- Form dialogs
- Confirmation dialogs
- Detail views
- Settings panels

**Usage pattern:**
```tsx
<DialogTrigger>
  <Button>Open Modal</Button>
  <Modal placement="center">
    <Dialog>
      <Heading>Modal Title</Heading>
      {/* Content */}
    </Dialog>
  </Modal>
</DialogTrigger>
```

#### Dialog
Dialog content container (used inside Modal).

| Prop | Type | Options/Notes |
|------|------|---------------|
| `title` | `ReactNode` | Dialog title |
| `variant` | `'sheet'` | Visual variant |

#### AlertDialog
Pre-configured confirmation dialog.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `title` | `ReactNode` | Dialog title |
| `description` | `ReactNode` | Dialog message |
| `isDanger` | `boolean` | Destructive action styling |
| `isConfirmDisabled` | `boolean` | Disable confirm button |
| `confirmLabel` | `ReactNode` | Confirm button text |
| `cancelLabel` | `ReactNode` | Cancel button text |
| `onConfirm` | `() => void` | Confirm handler |
| `onCancel` | `() => void` | Cancel handler |

**Common use cases:**
- Delete confirmations
- Destructive action warnings
- Simple yes/no dialogs

#### ConfirmationDialog
Dialog requiring typed confirmation.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `value` | `string` | Required confirmation text |
| `confirmMessage` | `ReactNode` | Instructions message |
| ...all `AlertDialog` props | | Inherits AlertDialog properties |

**Common use cases:**
- Delete important resources
- Irreversible actions
- Type-to-confirm patterns

#### Popover
Floating popover container.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `isFullscreen` | `boolean` | Mobile fullscreen mode |
| `placement` | | Popover placement relative to trigger |
| `offset` | `number` | Distance from trigger |

**Common use cases:**
- Dropdown menus
- Date pickers
- Context menus

---

### Navigation Components

#### Menu
Dropdown menu component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `children` | `ReactNode` | Menu items |

**Usage pattern:**
```tsx
<MenuTrigger>
  <Button>Menu</Button>
  <Menu>
    <MenuItem>Action 1</MenuItem>
    <MenuItem>Action 2</MenuItem>
  </Menu>
</MenuTrigger>
```

#### MenuItem
Individual menu item.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `icon` | `ReactNode` | Leading icon |
| `label` | `string` | Item text |
| `showChecked` | `boolean` | Show checkmark when selected |
| `showSubMenuIcon` | `boolean` | Show submenu indicator |
| `onAction` | `() => void` | Click handler |

#### MenuSection
Grouped menu items.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `title` | `string` | Section title |
| `maxHeight` | `number` | Max height in pixels |

#### SubMenuTrigger
Nested submenu trigger.

**Common use cases:**
- Context menus
- Action menus
- Cascading menus

#### Navbar
Top navigation bar.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `showArrow` | `boolean` | Show active item indicator |

#### NavbarItem
Individual navbar item.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Item text |

#### Sidebar
Side navigation panel.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `itemBackgroundColor` | `string` | Item background |
| `isCollapsed` | `boolean` | Collapsed state |
| `muteItems` | `boolean` | Muted styling |

#### SidebarItem
Individual sidebar item.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Item text |
| `icon` | `ReactNode` | Leading icon |
| `isSelected` | `boolean` | Selected state |

#### SidebarSection
Grouped sidebar items.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `title` | `string` | Section title |

#### SidebarHeader
Sidebar header area.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Header text |
| `icon` | `ReactNode` | Header icon |

#### NavMenu
Alternative navigation menu style.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `itemBackgroundColor` | `string` | Item background |
| `muteItems` | `boolean` | Muted styling |
| `onItemClick` | `() => void` | Item click handler |

#### NavMenuGroup
Grouped navigation menu items.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `title` | `string` | Group title |
| `allowMinimize` | `boolean` | Allow collapse |
| `isMinimized` | `boolean` | Collapsed state |

#### NavMenuItem
Individual navigation menu item.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `isSelected` | `boolean` | Selected state |

#### Breadcrumbs
Breadcrumb navigation.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `children` | `<Breadcrumb>` items | Breadcrumb items |

#### Breadcrumb
Individual breadcrumb item.

**Usage:**
```tsx
<Breadcrumbs>
  <Breadcrumb href="/">Home</Breadcrumb>
  <Breadcrumb href="/settings">Settings</Breadcrumb>
  <Breadcrumb>Current Page</Breadcrumb>
</Breadcrumbs>
```

---

### Data Display Components

#### DataTable
Table component with card view support.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `data` | `any[]` | Table data |
| `displayMode` | `'table' \| 'cards'` | Display mode |
| `children` | `<DataColumn>` items | Column definitions |

**Usage with DataColumn:**
```tsx
<DataTable data={items}>
  <DataColumn id="name" label="Name" width="200px" />
  <DataColumn id="value" label="Value">
    {(row) => <Text>{row.value}</Text>}
  </DataColumn>
</DataTable>
```

#### DataColumn
Column definition for DataTable.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `id` | `string` | Column identifier (required) |
| `label` | `ReactNode` | Column header |
| `align` | `'start' \| 'center' \| 'end'` | Text alignment |
| `width` | `string` | Column width |
| `hidden` | `boolean` | Hide column |
| `children` | `ReactNode \| ((row, index) => ReactNode)` | Cell renderer |

#### Table
Basic table component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `children` | | Table content |

**Structure:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableColumn>Name</TableColumn>
      <TableColumn>Value</TableColumn>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell>100</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### DataCard
Key-value pair display card.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `data` | `{ label: ReactNode, value: any }[]` | Data pairs |
| `labelWidth` | `string` | Label column width |

**Common use cases:**
- Detail views
- Property displays
- Summary cards

#### List
Selectable list component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `items` | `any[]` | List items |
| `idProperty` | `string` | Item ID property name |
| `labelProperty` | `string` | Item label property name |
| `showCheckmark` | `boolean` | Show selection checkmark |
| `isFullscreen` | `boolean` | Fullscreen mobile view |
| `value` | `string[]` | Selected values |
| `onChange` | `(value: string[]) => void` | Selection handler |

#### ListItem
Individual list item.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `id` | `string` | Item ID |
| `showCheckmark` | `boolean` | Show checkmark |

#### ListSection
Grouped list items.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `title` | `string` | Section title |

---

### Typography Components

#### Heading
Heading text component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `size` | `Responsive<FontSize>` | `1`-`12` |
| `weight` | `Responsive<FontWeight>` | Font weight |
| `align` | `Responsive<TextAlign>` | `left`, `center`, `right` |
| `spacing` | `Responsive<LetterSpacing>` | Letter spacing |
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | HTML element |

**Common use cases:**
- Page titles
- Section headers
- Card titles

#### Text
Text content component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `color` | `FontColor` | Text color |
| `size` | `Responsive<FontSize>` | `1`-`12` |
| `weight` | `Responsive<FontWeight>` | Font weight |
| `align` | `Responsive<TextAlign>` | Text alignment |
| `wrap` | `Responsive<TextWrap>` | `wrap`, `nowrap`, `pretty`, `balance` |
| `transform` | `Responsive<TextTransform>` | `capitalize`, `uppercase`, `lowercase`, `none` |
| `truncate` | `Responsive<boolean>` | Truncate with ellipsis |
| `italic` | `Responsive<boolean>` | Italic style |
| `underline` | `Responsive<boolean>` | Underline text |
| `strikethrough` | `Responsive<boolean>` | Strikethrough text |
| `as` | `'span' \| 'div' \| 'label' \| 'p'` | HTML element |
| `asChild` | `boolean` | Slot pattern |

**Common use cases:**
- Body text
- Labels
- Descriptions
- Inline text

#### Code
Inline code display.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `asChild` | `boolean` | Slot pattern |

#### Blockquote
Block quote component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `asChild` | `boolean` | Slot pattern |

---

### Feedback Components

#### Toast
Toast notification component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `id` | `string` | Toast ID |
| `message` | `string` | Notification message |
| `title` | `string` | Notification title |
| `actions` | `string[]` | Action button labels |
| `allowClose` | `boolean` | Show close button |
| `variant` | `'success' \| 'error'` | Visual style |
| `onClose` | `(action?: string) => void` | Close handler |

**Usage via hook:**
```tsx
const { toast } = useToast();

toast('Operation successful', {
  variant: 'success',
  duration: 3000
});
```

#### AlertBanner
Alert banner component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `title` | `ReactNode` | Banner title |
| `description` | `ReactNode` | Banner description |
| `icon` | `ReactNode` | Leading icon |
| `variant` | `'error' \| 'info'` | Visual style |
| `align` | `'start' \| 'center' \| 'end'` | Content alignment |
| `allowClose` | `boolean` | Show close button |
| `onClose` | `() => void` | Close handler |

**Common use cases:**
- Error messages
- Warning messages
- Information banners
- Dismissible alerts

#### Loading
Loading indicator component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `size` | `'sm' \| 'md' \| 'lg'` | Indicator size |
| `icon` | `'dots' \| 'spinner'` | Loading animation type |
| `placement` | `'absolute' \| 'center' \| 'inline'` | Positioning |

#### Spinner
Spinner loading indicator.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `size` | `'sm' \| 'md' \| 'lg'` | Spinner size |
| `quiet` | `boolean` | Reduced visibility |
| `isDisabled` | `boolean` | Disabled state |

#### Dots
Dots loading indicator.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `size` | `'sm' \| 'md' \| 'lg'` | Dots size |

#### ProgressBar
Linear progress indicator.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `value` | `number` | Progress value (0-100) |
| `showPercentage` | `boolean` | Display percentage |

#### ProgressCircle
Circular progress indicator.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `value` | `number` | Progress value (0-100) |
| `showPercentage` | `boolean` | Display percentage |

#### StatusLight
Status indicator dot.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `color` | `string` | Custom color |
| `variant` | `'success' \| 'warning' \| 'error' \| 'active' \| 'inactive' \| 'none'` | Preset colors |

**Common use cases:**
- Online/offline status
- Service health indicators
- Status badges

#### Tooltip
Tooltip overlay.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `showArrow` | `boolean` | Show arrow pointer |

**Usage:**
```tsx
<TooltipTrigger>
  <Button>Hover me</Button>
  <Tooltip>Helpful information</Tooltip>
</TooltipTrigger>
```

---

### Miscellaneous Components

#### Icon
Icon wrapper component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `color` | `FontColor` | Icon color |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Icon size |
| `variant` | `'input'` | Input icon styling |
| `rotate` | `number` | Rotation in degrees |
| `strokeWidth` | `string` | SVG stroke width |
| `strokeColor` | `StrokeColor` | SVG stroke color |
| `fillColor` | `FillColor` | SVG fill color |

**Common use cases:**
- Button icons
- Navigation icons
- Status indicators
- Decorative icons

**Example with Lucide React:**
```tsx
<Icon size="sm" color="primary">
  <ChevronRight />
</Icon>
```

#### IconLabel
Icon with label layout.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `icon` | `ReactNode` | Icon element |
| `label` | `ReactNode` | Label text |
| `showLabel` | `boolean` | Show/hide label |
| `iconProps` | `IconProps` | Icon component props |
| `labelProps` | `TextProps` | Label component props |

#### Image
Image component with styling.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `src` | `string` | Image source (required) |
| `alt` | `string` | Alt text |
| `objectFit` | `ObjectFit` | `fill`, `contain`, `cover`, `scale-down`, `none` |
| `isCentered` | `boolean` | Center image |
| `borderRadius` | `Responsive<BorderRadius>` | Border radius |
| `shadow` | `Responsive<BoxShadow>` | Box shadow |

#### Label
Form label component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| Standard HTML label props | | |

#### Calendar
Date picker calendar.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `value` | `Date` | Selected date |
| `minValue` | `Date` | Minimum selectable date |
| `maxValue` | `Date` | Maximum selectable date |
| `defaultValue` | `Date` | Initial date |
| `onChange` | `(date: Date) => void` | Date change handler |

#### Tabs
Tabbed interface component.

**Structure:**
```tsx
<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanel>Content 1</TabPanel>
  <TabPanel>Content 2</TabPanel>
</Tabs>
```

#### Accordion
Collapsible accordion component.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `type` | `'single' \| 'multiple'` | Allow multiple open (required) |

**Usage:**
```tsx
<Accordion type="single">
  <AccordionItem>
    <Heading>Section 1</Heading>
    <div>Content 1</div>
  </AccordionItem>
  <AccordionItem>
    <Heading>Section 2</Heading>
    <div>Content 2</div>
  </AccordionItem>
</Accordion>
```

#### Toggle
Toggle button.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Toggle label |
| `value` | `string` | Toggle value |

#### ToggleGroup
Group of toggle buttons.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `label` | `string` | Group label |
| `value` | `string[]` | Selected values |
| `defaultValue` | `string[]` | Initial values |
| `variant` | `'primary'` | Visual variant |
| `onChange` | `(value: string[]) => void` | Change handler |

#### InlineEditField
Inline editable text field.

| Prop | Type | Options/Notes |
|------|------|---------------|
| `name` | `string` | Field name |
| `value` | `string` | Current value |
| `defaultEdit` | `boolean` | Start in edit mode |
| `onChange` | `(value: any) => void` | Change handler |
| `onCommit` | `(value: any) => void` | Commit handler |
| `onCancel` | `() => void` | Cancel handler |

#### ComboBox
Combo box (searchable select).

| Prop | Type | Options/Notes |
|------|------|---------------|
| `items` | `any[]` | Options |
| `renderEmptyState` | `(props) => ReactNode` | Empty state renderer |
| `listProps` | `ListProps` | List component props |
| `popoverProps` | `PopoverProps` | Popover component props |

---

## Custom Umami Components

These are custom components built for Umami using the @umami/react-zen primitives.

### DataGrid
Advanced data grid with search, pagination, and loading states.

**Location:** `src/components/common/DataGrid.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `query` | `UseQueryResult<PageResult<any>>` | React Query result |
| `searchDelay` | `number` | Search debounce (default: 600ms) |
| `allowSearch` | `boolean` | Enable search field |
| `allowPaging` | `boolean` | Enable pagination (default: true) |
| `autoFocus` | `boolean` | Auto-focus search |
| `renderActions` | `() => ReactNode` | Custom action buttons |
| `renderEmpty` | `() => ReactNode` | Empty state renderer |
| `children` | `ReactNode \| ((data) => ReactNode)` | Grid content |

**Common use cases:**
- Website listings
- User management tables
- Report listings
- Any paginated data display

**Example usage:**
```tsx
<DataGrid query={websitesQuery} allowSearch>
  {(data) => (
    <DataTable data={data.data}>
      <DataColumn id="name" label="Name" />
      <DataColumn id="domain" label="Domain" />
    </DataTable>
  )}
</DataGrid>
```

### Panel
Content panel with optional fullscreen mode.

**Location:** `src/components/common/Panel.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `title` | `string` | Panel title |
| `allowFullscreen` | `boolean` | Enable fullscreen toggle |
| ...all `Column` props | | Inherits Column properties |

**Common use cases:**
- Dashboard widgets
- Chart containers
- Report sections

### LoadingPanel
Panel with loading, error, and empty states.

**Location:** `src/components/common/LoadingPanel.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `data` | `any` | Data to display |
| `error` | `unknown` | Error object |
| `isEmpty` | `boolean` | Force empty state |
| `isLoading` | `boolean` | Initial loading state |
| `isFetching` | `boolean` | Refetching state |
| `loadingIcon` | `'dots' \| 'spinner'` | Loading indicator type |
| `loadingPlacement` | `'center' \| 'absolute' \| 'inline'` | Loading position |
| `renderEmpty` | `() => ReactNode` | Custom empty state |
| `children` | `ReactNode` | Content to display when loaded |

**Common use cases:**
- Wrapping async data displays
- Chart containers
- Table wrappers

### Empty
Empty state component.

**Location:** `src/components/common/Empty.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `message` | `string` | Custom empty message |

### Pager
Pagination controls.

**Location:** `src/components/common/Pager.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `page` | `string \| number` | Current page |
| `pageSize` | `string \| number` | Items per page |
| `count` | `string \| number` | Total item count |
| `onPageChange` | `(nextPage: number) => void` | Page change handler |

### Chart Components

#### Chart
Base chart component using Chart.js.

**Location:** `src/components/charts/Chart.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `type` | `string` | Chart.js chart type |
| `chartData` | `any` | Chart data |
| `chartOptions` | `any` | Chart.js options |
| `onTooltip` | `(params) => void` | Tooltip handler |

#### BarChart
Bar chart component with time series support.

**Location:** `src/components/charts/BarChart.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `chartData` | `any` | Chart data |
| `unit` | `string` | Time unit (for time series) |
| `stacked` | `boolean` | Stacked bars |
| `currency` | `string` | Currency code for formatting |
| `renderXLabel` | `(label, index, values) => string` | X-axis label formatter |
| `renderYLabel` | `(label, index, values) => string` | Y-axis label formatter |
| `XAxisType` | `string` | X-axis type (default: 'timeseries') |
| `YAxisType` | `string` | Y-axis type (default: 'linear') |
| `minDate` | `Date` | Minimum date |
| `maxDate` | `Date` | Maximum date |

#### PieChart
Pie/doughnut chart component.

**Location:** `src/components/charts/PieChart.tsx`

#### BubbleChart
Bubble chart component.

**Location:** `src/components/charts/BubbleChart.tsx`

#### ChartTooltip
Custom tooltip for charts.

**Location:** `src/components/charts/ChartTooltip.tsx`

### Metrics Components

#### MetricsTable
Table displaying website metrics with filtering.

**Location:** `src/components/metrics/MetricsTable.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `websiteId` | `string` | Website ID |
| `type` | `string` | Metric type |
| `dataFilter` | `(data: any) => any` | Data filter function |
| `limit` | `number` | Result limit |
| `showMore` | `boolean` | Show "more" link |
| `filterLink` | `boolean` | Enable filter links |
| `params` | `Record<string, any>` | Additional query params |
| `onDataLoad` | `(data: any) => void` | Data load callback |

#### ListTable
Reusable list/table component.

**Location:** `src/components/metrics/ListTable.tsx`

#### MetricsBar
Horizontal bar for metric comparison.

**Location:** `src/components/metrics/MetricsBar.tsx`

#### MetricCard
Card displaying a single metric.

**Location:** `src/components/metrics/MetricCard.tsx`

#### MetricLabel
Label for metrics with type-specific formatting.

**Location:** `src/components/metrics/MetricLabel.tsx`

### Other Custom Components

#### Avatar
Generated avatar using Dicebear.

**Location:** `src/components/common/Avatar.tsx`

| Prop | Type | Options/Notes |
|------|------|---------------|
| `seed` | `string` | Avatar seed (required) |
| `size` | `number` | Avatar size in pixels (default: 128) |

#### LinkButton
Button styled as a link/anchor.

**Location:** `src/components/common/LinkButton.tsx`

#### FilterLink
Clickable filter link for metrics.

**Location:** `src/components/common/FilterLink.tsx`

#### SideMenu
Side navigation menu component.

**Location:** `src/components/common/SideMenu.tsx`

#### PageHeader
Standard page header layout.

**Location:** `src/components/common/PageHeader.tsx`

#### PageBody
Standard page body layout.

**Location:** `src/components/common/PageBody.tsx`

#### SectionHeader
Section header component.

**Location:** `src/components/common/SectionHeader.tsx`

#### ActionForm
Form with action confirmation flow.

**Location:** `src/components/common/ActionForm.tsx`

#### ConfirmationForm
Form requiring typed confirmation.

**Location:** `src/components/common/ConfirmationForm.tsx`

#### TypeConfirmationForm
Form with type-based confirmation.

**Location:** `src/components/common/TypeConfirmationForm.tsx`

#### ErrorMessage
Standard error message display.

**Location:** `src/components/common/ErrorMessage.tsx`

#### DateDisplay
Formatted date display.

**Location:** `src/components/common/DateDisplay.tsx`

#### DateDistance
Relative date display (e.g., "2 hours ago").

**Location:** `src/components/common/DateDistance.tsx`

---

## Styles

The application uses CSS variables for theming and a utility-class system provided by @umami/react-zen.

### CSS Variable Categories

#### Color System

**Base Colors** (Neutral scale):
- `--base-color-1` through `--base-color-12` (lightest to darkest)
- Used for backgrounds, borders, and neutral elements

**Accent Colors** (Named colors):
- `gray`, `gold`, `bronze`, `brown`, `yellow`, `amber`, `orange`, `tomato`
- `red`, `ruby`, `crimson`, `pink`, `plum`, `purple`, `violet`, `iris`
- `indigo`, `blue`, `cyan`, `teal`, `jade`, `green`, `grass`, `lime`, `mint`, `sky`

**Semantic Colors:**
- `--primary-color`: `#147af3` (blue)
- `--primary-font-color`: Light color for primary elements
- `--font-color`: Default text color
- `--light-color`: Light text color
- `--muted-color`: Muted/secondary text

**Background Colors:**
- `--base-color-2`: Page background
- `backgroundColor` prop accepts: `1`-`12`, accent colors, `primary`, `transparent`, or `true` (for default)

**Border Colors:**
- `borderColor` prop accepts: `1`-`12`, accent colors, `primary`, `muted`, `disabled`, `transparent`, or `true`

#### Spacing System

**Spacing Scale** (`0`-`12`):
- Maps to consistent spacing values
- Used for padding, margin, and gap
- Supports responsive values per breakpoint

**Example usage:**
```tsx
<Box padding="4" marginY="6" gap="2">
  {/* padding: var(--spacing-4) */}
  {/* margin-top/bottom: var(--spacing-6) */}
  {/* gap: var(--spacing-2) */}
</Box>
```

#### Typography

**Font Sizes** (`1`-`12`):
- `--font-size-1` (smallest) through `--font-size-12` (largest)
- Heading sizes: `--heading-size-1` through `--heading-size-6`

**Font Weights:**
- `thin`: 100
- `extra-light`: 200
- `light`: 300
- `regular`: 400
- `medium`: 500
- `semi-bold`: 600
- `bold`: 700
- `extra-bold`: 800
- `black`: 900

**Font Family:**
- `--font-family`: Inter (from @fontsource/inter)

#### Borders

**Border Width** (`1`-`4`):
- `--border-width-1` through `--border-width-4`

**Border Radius** (`0`-`4`, `full`):
- `--border-radius`: Default radius
- `--border-radius-1` through `--border-radius-4`
- `--border-radius-full`: Fully rounded (pill shape)

#### Shadows

**Box Shadow** (`0`-`6`):
- `--box-shadow-1` (subtle) through `--box-shadow-6` (prominent)
- `none`: No shadow

#### Breakpoints

Responsive design breakpoints:

| Breakpoint | Min Width | Max Width |
|------------|-----------|-----------|
| `xs` | 0px | 639px |
| `sm` | 640px | 767px |
| `md` | 768px | 1023px |
| `lg` | 1024px | 1279px |
| `xl` | 1280px | ∞ |

**Usage:**
```tsx
<Box
  padding={{ xs: '2', md: '4', lg: '6' }}
  fontSize={{ xs: '2', md: '4' }}
>
  Responsive content
</Box>
```

### Utility Classes

The @umami/react-zen library generates utility classes for all design tokens. These are typically not used directly but are generated from component props.

**Examples:**
- `.vars_display-flex__ZDhhM` → `display: flex`
- `.vars_font-size-4__YjQ4M` → `font-size: var(--font-size-4)`
- `.vars_border-radius-3__Y2MzZ` → `border-radius: var(--border-radius-3)`
- `.vars_shadow-2__Zjc4O` → `box-shadow: var(--box-shadow-2)`

### Global Styles

**Location:** `src/styles/global.css`

Key global styles:
- Font family applied to `html, body`
- Base background color: `var(--base-color-2)`
- Custom scrollbar styling (webkit)
- Link styles (no underline, inherits color)

### Custom CSS Modules

The application uses CSS Modules for component-specific styles sparingly. Most styling is done via component props.

**Example:** `src/app/(main)/websites/[websiteId]/(reports)/journeys/Journey.module.css`

---

## Design Patterns

### Responsive Design

All spacing, sizing, and layout props support responsive values:

```tsx
<Column
  padding={{ xs: '2', md: '4', lg: '6' }}
  gap={{ xs: '2', md: '3' }}
>
  <Heading size={{ xs: '4', md: '6', lg: '8' }}>
    Responsive Heading
  </Heading>
</Column>
```

### Composition Pattern

Components use the "asChild" and Slot pattern for composition:

```tsx
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

### Form Patterns

Standard form pattern with React Hook Form:

```tsx
<Form onSubmit={handleSubmit}>
  <FormField name="email" label="Email" rules={{ required: true }}>
    <TextField />
  </FormField>

  <FormField name="password" label="Password">
    <PasswordField />
  </FormField>

  <FormButtons>
    <FormResetButton variant="outline">Reset</FormResetButton>
    <FormSubmitButton>Submit</FormSubmitButton>
  </FormButtons>
</Form>
```

### Modal Pattern

Standard modal/dialog pattern:

```tsx
<DialogTrigger>
  <Button>Open Dialog</Button>
  <Modal placement="center">
    <Dialog title="Dialog Title">
      <Column gap="4">
        {/* Content */}
        <FormButtons>
          <Button>Close</Button>
        </FormButtons>
      </Column>
    </Dialog>
  </Modal>
</DialogTrigger>
```

### Loading States

Pattern for async data loading:

```tsx
<LoadingPanel
  data={data}
  isLoading={isLoading}
  isFetching={isFetching}
  error={error}
  minHeight="300px"
>
  {/* Content rendered when data is loaded */}
</LoadingPanel>
```

---

## Theming

The app supports light and dark themes via the `useTheme` hook:

```tsx
const { theme, setTheme } = useTheme();

// Set theme
setTheme('dark');

// Or use the ThemeButton component
<ThemeButton />
```

Theme is persisted and applied automatically. CSS variables automatically adjust based on the theme.

---

## Icons

The app uses **Lucide React** for icons:

```tsx
import { ChevronRight, Check, X } from '@/components/icons';

<Icon size="sm" color="primary">
  <ChevronRight />
</Icon>
```

Common icons are re-exported from `src/components/icons`.

---

## Best Practices

1. **Use semantic components**: Prefer `Row`/`Column` over `Flexbox`, `Heading` over `Text` for headings
2. **Leverage responsive props**: Use object syntax for responsive design
3. **Consistent spacing**: Use the spacing scale (`0`-`12`) for all spacing needs
4. **Color semantics**: Use semantic colors (`primary`, `muted`) over numbered colors when possible
5. **Loading states**: Always wrap async content in `LoadingPanel`
6. **Form validation**: Use React Hook Form's `rules` prop for validation
7. **Accessibility**: @umami/react-zen components are accessible by default via React Aria
8. **Composition**: Use `asChild` prop for component composition
9. **TypeScript**: All components are fully typed with TypeScript

---

## Summary

The Umami design system is built on:
- **@umami/react-zen**: Modern, accessible component library
- **CSS variables**: Consistent theming and styling
- **Responsive utilities**: Breakpoint-aware props
- **React Aria**: Accessible component primitives
- **Composition patterns**: Flexible component composition

The system provides a comprehensive set of layout, form, navigation, data display, and feedback components with consistent APIs and full TypeScript support.
