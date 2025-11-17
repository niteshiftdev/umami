# Design System Interactive Showcase

This is an interactive design system page for exploring and testing all Umami components.

## Features

- **Interactive Controls**: Adjust component props in real-time to see variations
- **Code Examples**: View code snippets for each component configuration
- **Organized by Category**: Components grouped into logical sections
- **Responsive Preview**: See how components behave at different sizes

## Sections

1. **Buttons** - Button variants, sizes, loading states, copy buttons
2. **Layout** - Row, Column, Grid, Box with responsive controls
3. **Forms** - Complete form system with validation, all input types
4. **Modals** - Dialogs, alerts, confirmations with different placements
5. **Navigation** - Menus, tabs, breadcrumbs
6. **Data Display** - Tables, lists, data cards
7. **Typography** - Headings, text, code, blockquotes with customization
8. **Feedback** - Toasts, alerts, loading indicators, progress bars, tooltips
9. **Styles** - Color palette, spacing, typography, borders, shadows

## How to Use

1. Navigate to `/design-system` in your browser
2. Click through the tabs to explore different component categories
3. Use the interactive controls to modify component props
4. Copy code examples to use in your own components
5. Experiment with responsive props and styling options

## Component Structure

```
/design-system
├── page.tsx                    # Next.js route
├── DesignSystemPage.tsx        # Main page component
├── components/
│   ├── ShowcaseSection.tsx     # Wrapper for each demo section
│   └── PropControl.tsx         # Interactive prop controls
└── showcases/
    ├── ButtonsShowcase.tsx
    ├── LayoutShowcase.tsx
    ├── FormsShowcase.tsx
    ├── ModalsShowcase.tsx
    ├── NavigationShowcase.tsx
    ├── DataDisplayShowcase.tsx
    ├── TypographyShowcase.tsx
    ├── FeedbackShowcase.tsx
    └── StylesShowcase.tsx
```

## Design System Documentation

For complete documentation including all props and usage patterns, see `/DESIGN_SYSTEM.md` in the project root.
