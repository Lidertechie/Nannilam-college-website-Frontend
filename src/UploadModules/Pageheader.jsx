// Pageheader.jsx
import { Box, Typography, Container } from '@mui/material';
import { alpha } from '@mui/material/styles';

const PageHeader = ({ title, subtitle, backgroundImage = '/image1.jpeg' }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: '#1a2a4a',
        backgroundImage: `linear-gradient(135deg, rgba(16, 25, 46, 0.9) 0%, rgba(5, 15, 34, 0.7) 100%), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: { xs: 6, md: 8 },
        borderBottom: `4px solid #f0c93a`,
        mb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              letterSpacing: 2,
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', md: '2.5rem' },
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 3,
                bgcolor: '#f0c93a',
                borderRadius: 2,
              },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                color: alpha('#fff', 0.85),
                fontSize: '1.1rem',
                mt: 3,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
                letterSpacing: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PageHeader;