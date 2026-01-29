import type { ReactNode } from 'react';

export type BodyType = {
  children: ReactNode;
  size?: 'small' | 'large' | 'veryLarge' | null;
  weight?:
    | 'thin'
    | 'light'
    | 'medium'
    | 'regular'
    | 'semiBold'
    | 'bold'
    | 'extraBold'
    | 'black'
    | null;
  overflow?: boolean | null;
  uppercase?: boolean | null;
  maxWidth?: string | null;
  primary?: boolean | null;
  underline?: boolean | null;
  error?: boolean | null;
  disabled?: boolean | null;
  hoverable?: boolean | null;
  hover?: 'primary' | 'secondary' | null;
  auto?: boolean | null;
};
