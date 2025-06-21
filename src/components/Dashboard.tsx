import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { Student } from '../types/Student';

interface DashboardProps {
  students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const theme = useTheme();

  const totalStudents = students.length;
  const uniqueJurusan = [...new Set(students.map(s => s.jurusan))].length;
  const recentStudents = students.filter(s => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(s.createdAt) > oneWeekAgo;
  }).length;
  const uniqueAlamat = [...new Set(students.map(s => s.alamat.split(',')[0].trim()))].length;

  const stats = [
    {
      title: 'Total Mahasiswa',
      value: totalStudents,
      icon: PeopleIcon,
      color: theme.palette.primary.main,
      bgcolor: theme.palette.primary.light + '20',
    },
    {
      title: 'Jurusan Aktif',
      value: uniqueJurusan,
      icon: SchoolIcon,
      color: theme.palette.success.main,
      bgcolor: theme.palette.success.light + '20',
    },
    {
      title: 'Mahasiswa Baru (7 hari)',
      value: recentStudents,
      icon: TrendingUpIcon,
      color: theme.palette.warning.main,
      bgcolor: theme.palette.warning.light + '20',
    },
    {
      title: 'Kota/Daerah',
      value: uniqueAlamat,
      icon: LocationIcon,
      color: theme.palette.info.main,
      bgcolor: theme.palette.info.light + '20',
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              elevation={3}
              sx={{
                borderRadius: 3,
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: stat.bgcolor,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 32, color: stat.color }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Dashboard;