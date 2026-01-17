import React, { createContext, useContext, useState } from 'react';
import PaymentModal from '../components/PaymentModal';
import type { Course } from '../types';

interface PaymentModalContextType {
  openModal: (course: Course, price?: number, source?: string) => void;
  closeModal: () => void;
  isOpen: boolean;
}

const PaymentModalContext = createContext<PaymentModalContextType | undefined>(undefined);

export const usePaymentModal = () => {
  const context = useContext(PaymentModalContext);
  if (context === undefined) {
    throw new Error('usePaymentModal must be used within a PaymentModalProvider');
  }
  return context;
};

interface PaymentModalProviderProps {
  children: React.ReactNode;
}

export const PaymentModalProvider: React.FC<PaymentModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [coursePrice, setCoursePrice] = useState<number>(0);
  const [source, setSource] = useState<string>('unknown');

  const openModal = (course: Course, price?: number, source?: string) => {
    setCurrentCourse(course);
    setCoursePrice(price || 0);
    setSource(source || 'unknown');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentCourse(null);
    setCoursePrice(0);
    setSource('unknown');
  };

  return (
    <PaymentModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      {currentCourse && (
        <PaymentModal
          isOpen={isOpen}
          onClose={closeModal}
          course={currentCourse}
          coursePrice={coursePrice}
          source={source}
        />
      )}
    </PaymentModalContext.Provider>
  );
};
