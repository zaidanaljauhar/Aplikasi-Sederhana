import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <SchoolIcon sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="div" 
              sx={{ fontWeight: 700, lineHeight: 1.2 }}
            >
              Sistem Manajemen Mahasiswa
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.9,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Kelola data mahasiswa dengan mudah dan efisien
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;