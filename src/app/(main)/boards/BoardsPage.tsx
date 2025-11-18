'use client';
import { Column } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { BoardAddButton } from './BoardAddButton';
import { useDynamicColor, useDynamicSpacing, useDynamicBoolean } from '@niteshift/dials';

export function BoardsPage() {
  // Demo dials for prototyping
  const titleColor = useDynamicColor('boards-title-color', {
    label: 'Page Title Color',
    description: 'Color for the "My Boards" heading',
    default: 'var(--font-color)',
    options: ['var(--font-color)', 'var(--primary-color)', '#0090ff', '#8e4ec6', '#30a46c'],
    allowCustom: true,
    group: 'Boards Page',
  });

  const columnSpacing = useDynamicSpacing('boards-column-spacing', {
    label: 'Content Spacing',
    description: 'Margin around the main content',
    default: 'var(--spacing-2)',
    options: [
      'var(--spacing-1)',
      'var(--spacing-2)',
      'var(--spacing-3)',
      'var(--spacing-4)',
      'var(--spacing-5)',
    ],
    group: 'Boards Page',
  });

  const showAddButton = useDynamicBoolean('boards-show-add-button', {
    label: 'Show Add Button',
    description: 'Toggle the board creation button',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Boards Page',
  });

  return (
    <PageBody>
      <Column margin={columnSpacing}>
        <PageHeader title="My Boards" style={{ color: titleColor }}>
          {showAddButton && <BoardAddButton />}
        </PageHeader>
      </Column>
    </PageBody>
  );
}
