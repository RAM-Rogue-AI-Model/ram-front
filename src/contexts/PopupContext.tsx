import { createContext, useState, useEffect, useRef } from 'react';
import * as React from 'react';

const PopupContext = createContext<PopupContextType>({
  open: false,
  content: null,
  full: false,
  closePopup: () => {},
  openPopup: () => {},
});

export interface PopupContextType {
  open: boolean;
  content: React.ReactNode;
  full: boolean;
  closePopup: () => void;
  openPopup: (content: React.ReactNode | undefined, full: boolean) => void;
}

interface PopupContextProps {
  children: React.ReactNode;
}

export const PopupProvider = ({ children }: PopupContextProps) => {
  const openTimeout = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [full, setFull] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode | undefined>(null);

  useEffect(() => {
    return () => {
      clearTimeout(openTimeout.current);
    };
  }, []);

  useEffect(() => {
    setOpen(content != null);
    if (!content) setFull(false);
  }, [content]);

  useEffect(() => {
    clearTimeout(openTimeout.current);
    if (!open) {
      openTimeout.current = setTimeout(() => {
        setContent(null);
      }, 200);
    }
  }, [open]);

  const closePopup = () => {
    setOpen(false);
  };

  const openPopup = (_content: React.ReactNode | undefined, _full: boolean) => {
    setContent(_content);
    if (_full) setFull(true);
  };

  return (
    <PopupContext.Provider
      value={{ open, content, full, closePopup, openPopup }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export default PopupContext;
