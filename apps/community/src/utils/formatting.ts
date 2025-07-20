export type ValueFormattingOption = 'percent' | 'none';
export type LabelFormattingOption = 'pluralise' | 'none';

export const getFormattedValue = (
  value: number | undefined,
  formattingOption: ValueFormattingOption,
) => {
  switch (formattingOption) {
    case 'percent':
      return value && value >= 0 ? `${value * 100}%` : '-';
    default:
      return value?.toString() || '-';
  }
};

export const getFormattedLabel = (
  label: string,
  value: number | undefined,
  formattingOption: LabelFormattingOption,
) => {
  switch (formattingOption) {
    case 'pluralise':
      return `${label}${value === 1 ? '' : 's'}`;
    default:
      return label;
  }
};
