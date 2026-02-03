export interface ButtonType {
  type?: 'primary' | 'secondary' | 'nude' | 'link' | null;
  animation?: 'scale' | null;
  label?: string | null;
  image?: string | null;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  size?: 'large' | 'veryLarge' | 'small' | null;
  full?: boolean | null;
  disabled?: boolean | null;
}
