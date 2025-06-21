import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Fab,
  Snackbar,
  Alert,
  Fade,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import { useStudents } from './hooks/useStudents';
import { Student, StudentFormData } from './types/Student';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    checkNimExists,
  } = useStudents();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAddStudent = () => {
    setFormMode('add');
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setFormMode('edit');
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleDeleteStudent = (nim: number) => {
    deleteStudent(nim);
    showSnackbar('Data mahasiswa berhasil dihapus', 'success');
  };

  const handleFormSubmit = (data: StudentFormData) => {
    try {
      if (formMode === 'add') {
        // Check for duplicate NIM
        if (checkNimExists(data.nim)) {
          showSnackbar('NIM sudah terdaftar', 'error');
          return;
        }
        
        addStudent(data);
        showSnackbar('Mahasiswa berhasil ditambahkan', 'success');
      } else if (selectedStudent) {
        // Check for duplicate NIM (excluding current student)
        if (checkNimExists(data.nim, selectedStudent.nim)) {
          showSnackbar('NIM sudah terdaftar', 'error');
          return;
        }
        
        updateStudent(selectedStudent.nim, data);
        showSnackbar('Data mahasiswa berhasil diperbarui', 'success');
      }
      setFormOpen(false);
    } catch (error) {
      showSnackbar('Terjadi kesalahan saat menyimpan data', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Box sx={{ mb: 4 }}>
            <Dashboard students={students} />
          </Box>
          
          <Fade in={true} timeout={800}>
            <Box>
              <StudentList
                students={students}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            </Box>
          </Fade>
        </Container>

        <Fab
          color="primary"
          aria-label="Tambah mahasiswa"
          onClick={handleAddStudent}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>

        <StudentForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          student={selectedStudent}
          mode={formMode}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;