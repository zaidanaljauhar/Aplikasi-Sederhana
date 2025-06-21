import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Student, StudentFormData } from '../types/Student';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
  student?: Student | null;
  mode: 'add' | 'edit';
}

const jurusanOptions = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Teknik Komputer',
  'Ilmu Komputer',
  'Teknologi Informasi',
  'Teknik Elektro',
  'Teknik Mesin',
  'Teknik Sipil',
  'Manajemen',
  'Akuntansi',
];

const StudentForm: React.FC<StudentFormProps> = ({
  open,
  onClose,
  onSubmit,
  student,
  mode,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    nim: 0,
    nama: '',
    alamat: '',
    jurusan: '',
  });

  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    if (student && mode === 'edit') {
      setFormData({
        nim: student.nim,
        nama: student.nama,
        alamat: student.alamat,
        jurusan: student.jurusan,
      });
    } else {
      setFormData({
        nim: 0,
        nama: '',
        alamat: '',
        jurusan: '',
      });
    }
    setErrors({});
    setSubmitError('');
  }, [student, mode, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {};

    if (!formData.nim || formData.nim <= 0) {
      newErrors.nim = 'NIM harus diisi dengan angka positif';
    }

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama harus diisi';
    } else if (formData.nama.length < 2) {
      newErrors.nama = 'Nama minimal 2 karakter';
    } else if (formData.nama.length > 50) {
      newErrors.nama = 'Nama maksimal 50 karakter';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat harus diisi';
    } else if (formData.alamat.length > 255) {
      newErrors.alamat = 'Alamat maksimal 255 karakter';
    }

    if (!formData.jurusan) {
      newErrors.jurusan = 'Jurusan harus dipilih';
    } else if (formData.jurusan.length > 50) {
      newErrors.jurusan = 'Jurusan maksimal 50 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (validateForm()) {
      try {
        onSubmit(formData);
        onClose();
      } catch (error) {
        setSubmitError('Terjadi kesalahan saat menyimpan data');
      }
    }
  };

  const handleChange = (field: keyof StudentFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'nim' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '60vh',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {mode === 'add' ? 'Tambah Mahasiswa Baru' : 'Edit Data Mahasiswa'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {mode === 'add' 
            ? 'Lengkapi form berikut untuk menambah data mahasiswa baru'
            : 'Perbarui informasi mahasiswa di form berikut'
          }
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NIM"
                type="number"
                value={formData.nim || ''}
                onChange={handleChange('nim')}
                error={!!errors.nim}
                helperText={errors.nim}
                variant="outlined"
                placeholder="Masukkan NIM mahasiswa"
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nama Lengkap"
                value={formData.nama}
                onChange={handleChange('nama')}
                error={!!errors.nama}
                helperText={errors.nama}
                variant="outlined"
                placeholder="Masukkan nama lengkap"
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.jurusan}>
                <InputLabel>Jurusan</InputLabel>
                <Select
                  value={formData.jurusan}
                  label="Jurusan"
                  onChange={(e) => setFormData(prev => ({ ...prev, jurusan: e.target.value }))}
                >
                  {jurusanOptions.map((jurusan) => (
                    <MenuItem key={jurusan} value={jurusan}>
                      {jurusan}
                    </MenuItem>
                  ))}
                </Select>
                {errors.jurusan && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.jurusan}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alamat"
                multiline
                rows={4}
                value={formData.alamat}
                onChange={handleChange('alamat')}
                error={!!errors.alamat}
                helperText={errors.alamat}
                variant="outlined"
                placeholder="Masukkan alamat lengkap"
                inputProps={{ maxLength: 255 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            size="large"
            sx={{ minWidth: 100 }}
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            sx={{ minWidth: 100 }}
          >
            {mode === 'add' ? 'Tambah' : 'Simpan'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentForm;