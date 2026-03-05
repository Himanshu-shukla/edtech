import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ContactModalContextType {
  isOpen: boolean;
  openModal: (title?: string, subtitle?: string) => void;
  closeModal: () => void;
  title: string;
  subtitle: string;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

interface ContactModalProviderProps {
  children: ReactNode;
}

export function ContactModalProvider({ children }: ContactModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Book FREE Strategy Call");
  const [subtitle, setSubtitle] = useState("Connect with our career transformation experts to discuss your goals and create a personalized roadmap");

  const openModal = (customTitle?: string, customSubtitle?: string) => {
    if (customTitle) setTitle(customTitle);
    if (customSubtitle) setSubtitle(customSubtitle);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Reset to default after a delay to avoid flash
    setTimeout(() => {
      setTitle("Book FREE Strategy Call");
      setSubtitle("Connect with our career transformation experts to discuss your goals and create a personalized roadmap");
    }, 300);
  };

  return (
    <ContactModalContext.Provider value={{
      isOpen,
      openModal,
      closeModal,
      title,
      subtitle
    }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (context === undefined) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
}
