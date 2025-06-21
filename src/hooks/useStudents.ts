import { useState, useEffect } from 'react';
import { Student, StudentFormData } from '../types/Student';

const STORAGE_KEY = 'student-data';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setStudents(parsedData);
      } catch (error) {
        console.error('Error parsing stored student data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const addStudent = (data: StudentFormData) => {
    const newStudent: Student = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (nim: number, data: StudentFormData) => {
    setStudents(prev =>
      prev.map(student =>
        student.nim === nim
          ? { ...student, ...data, updatedAt: new Date() }
          : student
      )
    );
  };

  const deleteStudent = (nim: number) => {
    setStudents(prev => prev.filter(student => student.nim !== nim));
  };

  const getStudentByNim = (nim: number): Student | undefined => {
    return students.find(student => student.nim === nim);
  };

  const checkNimExists = (nim: number, excludeNim?: number): boolean => {
    return students.some(student => 
      student.nim === nim && student.nim !== excludeNim
    );
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentByNim,
    checkNimExists,
  };
};