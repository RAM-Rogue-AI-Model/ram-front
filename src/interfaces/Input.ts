export interface InputType {
  title?: string | null;
  value?: string;
  onChange: (str: string) => void;
  type?:
    | 'search'
    | 'textarea'
    | 'number'
    | 'password'
    | 'text'
    | 'email'
    | null;
  maxLength?: number | null;
  name: string;
  autocomplete?: string | null;
  onEnterKeyPress?: (() => void) | null;
  disabled?: boolean | null;
  placeholder?: string | null;
  error?: string | null;
  min?: number;
  max?: number;
  essential?: boolean | null;
}
