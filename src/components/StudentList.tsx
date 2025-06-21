import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  Typography,
  Toolbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { Student } from '../types/Student';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (nim: number) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    student: Student | null;
  }>({ open: false, student: null });

  const filteredStudents = students.filter((student) =>
    student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nim.toString().includes(searchTerm) ||
    student.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.jurusan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (student: Student) => {
    setDeleteDialog({ open: true, student });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.student) {
      onDelete(deleteDialog.student.nim);
      setDeleteDialog({ open: false, student: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, student: null });
  };

  const getJurusanColor = (jurusan: string) => {
    const colors = {
      'Teknik Informatika': 'primary',
      'Sistem Informasi': 'secondary',
      'Teknik Komputer': 'success',
      'Ilmu Komputer': 'warning',
      'Teknologi Informasi': 'info',
      'Teknik Elektro': 'error',
      'Teknik Mesin': 'primary',
      'Teknik Sipil': 'secondary',
      'Manajemen': 'success',
      'Akuntansi': 'warning',
    } as const;
    return colors[jurusan as keyof typeof colors] || 'default';
  };

  if (students.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Belum ada data mahasiswa
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Klik tombol "Tambah Mahasiswa" untuk menambah data baru
        </Typography>
      </Paper>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
          <TextField
            fullWidth
            placeholder="Cari mahasiswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Grid container spacing={2}>
          {paginatedStudents.map((student) => (
            <Grid item xs={12} key={student.nim}>
              <Card elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" component="div" gutterBottom>
                        {student.nama}
                      </Typography>
                      <Box display="flex" alignItems="center" mb={1}>
                        <BadgeIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          NIM: {student.nim}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => onEdit(student)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <IconButton onClick={() => handleDeleteClick(student)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <HomeIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{student.alamat}</Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={student.jurusan}
                      color={getJurusanColor(student.jurusan)}
                      size="small"
                      icon={<SchoolIcon />}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={2}>
          <TablePagination
            component="div"
            count={filteredStudents.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Baris per halaman:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
            }
          />
        </Box>
      </Box>
    );
  }

  // Desktop Table View
  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Toolbar sx={{ p: 2 }}>
        <TextField
          placeholder="Cari mahasiswa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {filteredStudents.length} mahasiswa ditemukan
        </Typography>
      </Toolbar>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 600 }}>NIM</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nama</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Jurusan</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Alamat</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.nim} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {student.nim}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {student.nama}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={student.jurusan}
                    color={getJurusanColor(student.jurusan)}
                    size="small"
                    icon={<SchoolIcon />}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {student.alamat}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(student)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <IconButton onClick={() => handleDeleteClick(student)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredStudents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Baris per halaman:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
        }
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Konfirmasi Hapus
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Tindakan ini tidak dapat dibatalkan!
          </Alert>
          <Typography>
            Apakah Anda yakin ingin menghapus data mahasiswa{' '}
            <strong>{deleteDialog.student?.nama}</strong> dengan NIM{' '}
            <strong>{deleteDialog.student?.nim}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Batal
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StudentList;