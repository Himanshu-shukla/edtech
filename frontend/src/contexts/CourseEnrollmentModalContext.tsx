import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CourseEnrollmentModalContextType {
  isOpen: boolean;
  openModal: (courseId: string, courseName: string, courseCategory?: string, source?: string) => void;
  closeModal: () => void;
  courseId: string;
  courseName: string;
  courseCategory?: string;
  source?: string;
}

const CourseEnrollmentModalContext = createContext<CourseEnrollmentModalContextType | undefined>(undefined);

interface CourseEnrollmentModalProviderProps {
  children: ReactNode;
}

export function CourseEnrollmentModalProvider({ children }: CourseEnrollmentModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCategory, setCourseCategory] = useState<string | undefined>('');
  const [source, setSource] = useState<string | undefined>('');

  const openModal = (
    courseIdParam: string, 
    courseNameParam: string, 
    courseCategoryParam?: string, 
    sourceParam?: string
  ) => {
    setCourseId(courseIdParam);
    setCourseName(courseNameParam);
    setCourseCategory(courseCategoryParam);
    setSource(sourceParam);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Reset after a delay to avoid flash
    setTimeout(() => {
      setCourseId('');
      setCourseName('');
      setCourseCategory('');
      setSource('');
    }, 300);
  };

  return (
    <CourseEnrollmentModalContext.Provider value={{
      isOpen,
      openModal,
      closeModal,
      courseId,
      courseName,
      courseCategory,
      source
    }}>
      {children}
    </CourseEnrollmentModalContext.Provider>
  );
}

export function useCourseEnrollmentModal() {
  const context = useContext(CourseEnrollmentModalContext);
  if (context === undefined) {
    throw new Error('useCourseEnrollmentModal must be used within a CourseEnrollmentModalProvider');
  }
  return context;
}
