import type { ReactNode } from 'react';

export interface HeadingType {
  type?: null | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  size?: null | 'xl' | 'l' | 'm' | 's' | 'xs';
  uppercase?: boolean | null;
  centered?: boolean | null;
  children: ReactNode;
}
