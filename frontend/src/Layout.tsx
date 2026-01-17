import type { ReactNode } from 'react';
import WhatsAppWidget from './components/WhatsAppWidget';
import ContactModal from './components/ContactModal';
import CourseEnrollmentModal from './components/CourseEnrollmentModal';
import ScrollToTop from './components/ScrollToTop';
import { ContactModalProvider, useContactModal } from './contexts/ContactModalContext';
import { CourseEnrollmentModalProvider, useCourseEnrollmentModal } from './contexts/CourseEnrollmentModalContext';
import { PaymentModalProvider } from './contexts/PaymentModalContext';
import { Toaster } from 'react-hot-toast';
interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { isOpen, closeModal, title, subtitle } = useContactModal();
  const { 
    isOpen: isEnrollmentOpen, 
    closeModal: closeEnrollmentModal, 
    courseId, 
    courseName, 
    courseCategory, 
    source 
  } = useCourseEnrollmentModal();

  return (
    <>
      <ScrollToTop />
      {children}
      <WhatsAppWidget
      />
      <ContactModal 
        isOpen={isOpen}
        onClose={closeModal}
        title={title}
        subtitle={subtitle}
      />
      <CourseEnrollmentModal 
        isOpen={isEnrollmentOpen}
        onClose={closeEnrollmentModal}
        courseId={courseId}
        courseName={courseName}
        courseCategory={courseCategory}
        source={source}
      />
    </>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ContactModalProvider>
      <CourseEnrollmentModalProvider>
        <PaymentModalProvider>
          <LayoutContent>{children}</LayoutContent>
          <Toaster
            position="top-center"
            containerStyle={{
              top: 20,
              zIndex: 9999,
            }}
            gutter={12}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                zIndex: 9999,
                fontSize: '14px',
                maxWidth: '500px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  background: '#059669',
                  color: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#dc2626',
                  color: '#fff',
                },
              },
            }}
          />
        </PaymentModalProvider>
      </CourseEnrollmentModalProvider>
    </ContactModalProvider>
  );
}
