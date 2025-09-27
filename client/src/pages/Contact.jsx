// src/pages/Contact.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  
  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Frontend Lead',
      email: 'alex.j@financetracker.com',
      github: 'github.com/alexj',
      linkedin: 'linkedin.com/in/alexj',
      avatar: 'AJ',
    },
    {
      id: 2,
      name: 'Taylor Kim',
      role: 'Backend Lead',
      email: 'taylor.k@financetracker.com',
      github: 'github.com/taylork',
      linkedin: 'linkedin.com/in/taylork',
      avatar: 'TK',
    },
  ];

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear submit status when user starts typing again
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Simulate API call
    setSubmitStatus('loading');
    setTimeout(() => {
      // Mock success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      setSubmitStatus(isSuccess ? 'success' : 'error');
      
      if (isSuccess) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }
    }, 1500);
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 }, 
      bgcolor: '#e2e2e2', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6, 
        pt: { xs: 2, sm: 4 },
        maxWidth: '800px',
        mx: 'auto'
      }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          sx={{ 
            color: '#500b28', 
            fontWeight: 700,
            mb: 2
          }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          We'd love to hear from you. Reach out for support, feedback, or collaboration.
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Card sx={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            height: '100%'
          }}>
            <CardContent>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#500b28', 
                  fontWeight: 600, 
                  mb: 3,
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Send us a Message
              </Typography>
              
              {submitStatus && (
                <Alert 
                  severity={submitStatus === 'success' ? 'success' : 'error'}
                  sx={{ mb: 3 }}
                  onClose={() => setSubmitStatus(null)}
                >
                  {submitStatus === 'success' 
                    ? 'Thank you! Your message has been sent successfully.'
                    : 'Oops! Something went wrong. Please try again.'
                  }
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      disabled={submitStatus === 'loading'}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email *"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      disabled={submitStatus === 'loading'}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject *"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      error={!!formErrors.subject}
                      helperText={formErrors.subject}
                      disabled={submitStatus === 'loading'}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message *"
                      multiline
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      error={!!formErrors.message}
                      helperText={formErrors.message}
                      disabled={submitStatus === 'loading'}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={submitStatus === 'loading'}
                      sx={{ 
                        bgcolor: '#500b28',
                        '&:hover': { bgcolor: '#3c081e' },
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Contact Info */}
        <Grid item xs={12} md={5}>
          <Card sx={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            height: '100%'
          }}>
            <CardContent>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#500b28', 
                  fontWeight: 600, 
                  mb: 3,
                  textAlign: 'center'
                }}
              >
                Contact Information
              </Typography>
              
              {/* General Contact Info */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ color: '#2e7d32', mr: 2, fontSize: 20 }} />
                  <Typography variant="body1">
                    support@financetracker.com
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ color: '#2e7d32', mr: 2, fontSize: 20 }} />
                  <Typography variant="body1">
                    +1 (234) 567-8900
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ color: '#2e7d32', mr: 2, fontSize: 20 }} />
                  <Typography variant="body1">
                    123 Finance Street, New York, NY 10001
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Team Members */}
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#500b28', 
                  fontWeight: 600, 
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                Project Leads
              </Typography>
              
              <Grid container spacing={2}>
                {teamMembers.map((member) => (
                  <Grid item xs={12} key={member.id}>
                    <Card 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 2,
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: '#2e7d32', 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          fontWeight: 600
                        }}
                      >
                        {member.avatar}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.role}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton 
                          size="small" 
                          component="a" 
                          href={`mailto:${member.email}`}
                          sx={{ color: '#2e7d32' }}
                        >
                          <EmailIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          component="a" 
                          href={`https://${member.github}`}
                          target="_blank"
                          rel="noopener"
                          sx={{ color: '#500b28' }}
                        >
                          <GitHubIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          component="a" 
                          href={`https://${member.linkedin}`}
                          target="_blank"
                          rel="noopener"
                          sx={{ color: '#0077b5' }}
                        >
                          <LinkedInIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Map/Illustration Section */}
      <Card sx={{ 
        mb: 5, 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Placeholder for map - in real app you'd use Google Maps iframe */}
          <Box 
            sx={{ 
              height: isMobile ? 200 : 300, 
              bgcolor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(46, 125, 50, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#500b28',
                  textAlign: 'center',
                  px: 2
                }}
              >
                Our Office Location<br/>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  123 Finance Street, New York, NY 10001
                </Typography>
              </Typography>
            </Box>
            
            {/* Simple finance illustration */}
            <Box sx={{ 
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center',
              p: 2
            }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                bgcolor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AccountBalanceWalletIcon sx={{ color: '#2e7d32', fontSize: 32 }} />
              </Box>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                bgcolor: '#f3e5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUpIcon sx={{ color: '#500b28', fontSize: 32 }} />
              </Box>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                bgcolor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SecurityIcon sx={{ color: '#1976d2', fontSize: 32 }} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Footer */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 3, 
        mt: 'auto',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        bgcolor: 'white',
        borderRadius: '12px'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Personal Finance Tracker • {new Date().getFullYear()}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#500b28', 
            fontStyle: 'italic',
            fontWeight: 500
          }}
        >
          "Your journey to financial freedom starts here."
        </Typography>
      </Box>
    </Box>
  );
};

// Icons for illustration
const AccountBalanceWalletIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9z"/>
    <path d="M21 16h-9c-1.1 0-2-.9-2-2V6h11v10z" opacity=".3"/>
    <path d="M21 14h-9v-4h11v4z" opacity=".3"/>
  </svg>
);

const TrendingUpIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
);

const SecurityIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
  </svg>
);

export default Contact;