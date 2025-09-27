// src/pages/About.jsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Insights as InsightsIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: 'Mariam Hasanat',
      role: 'Full Stack Developer',
      description: 'Led dashboard UI/UX design and implemented responsive transaction forms.',
      avatar: 'MH',
    },
    {
      id: 2,
      name: 'Bahaa Abbas',
      role: 'Backend Developer',
      description: `I am a dedicated Computer Engineering graduate from An-Najah National University with a strong foundation in full-stack 
development. Skilled in modern technologies like React, Node.js, and MongoDB, I thrive on solving complex problems and 
delivering reliable software solutions through collaboration. With experience as a Frontend Developer Intern at Foothill 
Technology Solutions, LLC, and an AI Engineer at Fratello Software House, I have honed my abilities in responsive design, API 
development, and optimizing machine learning models. My personal projects, such as BahaaStockJournal and a MERN-based 
E-Commerce Website, reflect my passion for creating innovative, user-focused applications. Fluent in Arabic and proficient in 
English, I am eager to contribute my technical expertise and teamwork skills to impactful projects.
`,
      avatar: 'BA',
    },
    {
      id: 3,
      name: 'Bassel Fares',
      role: 'Backend Developer',
      description: 'A 4th-year Computer Science student at Palestine Polytechnic University and a motivated junior .NET backend developer with a strong passion for building scalable and efficient backend systems. Skilled in C#, ASP.NET, and SQL, with practical experience gained through university projects and personal practice, including working with databases and designing REST APIs. Always eager to learn, grow, and gain real-world experience by contributing to impactful projects.',
      avatar: 'BF',
    },
    {
      id: 4,
      name: 'Noor Moqady',
      role: 'Frontend Developer',
      description: 'Experienced Senior GIS System Administrator and Business Analyst with over 8 years of expertise in developing and managing enterprise GIS applications. Skilled in business analysis, workflow automation, and geospatial database management, I deliver innovative solutions for urban planning and infrastructure projects.',
      avatar: 'NM',
    },
  ];

  // Features with icons
  const features = [
    {
      icon: <WalletIcon sx={{ fontSize: 36, color: '#2e7d32' }} />,
      title: 'Track Income & Expenses',
      description: 'Record and categorize all your financial transactions with ease.'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 36, color: '#2e7d32' }} />,
      title: 'Manage Budgets',
      description: 'Set spending limits and receive alerts when you exceed your budget.'
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 36, color: '#2e7d32' }} />,
      title: 'View Reports & Analytics',
      description: 'Gain insights through interactive charts and comprehensive financial reports.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 36, color: '#2e7d32' }} />,
      title: 'Secure Authentication',
      description: 'Your financial data is protected with industry-standard security measures.'
    }
  ];

  // Tech stack info
  const techStack = {
    frontend: ['React', 'Vite', 'Material-UI', 'Recharts', 'React Router'],
    backend: ['Node.js', 'Express', 'RESTful APIs'],
    database: ['MongoDB', 'Mongoose'],
    auth: ['JWT', 'Bcrypt', 'Secure Password Hashing']
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
          About Personal Finance Tracker
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          Helping you take control of your finances with ease and clarity.
        </Typography>
      </Box>

      {/* Project Overview */}
      <Card sx={{ mb: 5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
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
            Project Overview
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
            Personal Finance Tracker is a comprehensive financial management application 
            designed to help individuals monitor their income, track expenses, manage budgets, 
            and gain valuable insights through detailed analytics.
          </Typography>
          
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  p: 2
                }}>
                  {feature.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Project Info */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#500b28', 
                  fontWeight: 600, 
                  mb: 3 
                }}
              >
                Technology Stack
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                  Frontend
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {techStack.frontend.map((tech, index) => (
                    <Chip 
                      key={index} 
                      label={tech} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 500
                      }} 
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                  Backend
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {techStack.backend.map((tech, index) => (
                    <Chip 
                      key={index} 
                      label={tech} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 500
                      }} 
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                  Database
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {techStack.database.map((tech, index) => (
                    <Chip 
                      key={index} 
                      label={tech} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 500
                      }} 
                    />
                  ))}
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2e7d32', mb: 1 }}>
                  Authentication
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {techStack.auth.map((tech, index) => (
                    <Chip 
                      key={index} 
                      label={tech} 
                      size="small" 
                      sx={{ 
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 500
                      }} 
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#500b28', 
                  fontWeight: 600, 
                  mb: 3 
                }}
              >
                Key Outcomes
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Secure User Authentication:</strong> Implemented robust login system with password encryption and JWT tokens.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Comprehensive Dashboard:</strong> Created intuitive overview with financial summaries and visual analytics.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Transaction Management:</strong> Developed full CRUD functionality for income and expense tracking.
                </Typography>
                <Typography variant="body1">
                  <strong>Budget Monitoring:</strong> Built budget system with category limits and alert notifications.
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#500b28', 
                  fontWeight: 600, 
                  mb: 2 
                }}
              >
                Development Timeline
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Phase 1:</strong> Authentication & User Management<br/>
                <strong>Phase 2:</strong> Transaction System & Dashboard<br/>
                <strong>Phase 3:</strong> Budget Features & Reporting<br/>
                <strong>Phase 4:</strong> Testing & Optimization
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Members */}
      <Card sx={{ mb: 5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#500b28', 
              fontWeight: 600, 
              mb: 4,
              textAlign: 'center'
            }}
          >
            Meet Our Team
          </Typography>
          
          <Grid container spacing={3}>
            {teamMembers.map((member) => (
              <Grid item xs={12} sm={6} md={3} key={member.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center',
                    flexGrow: 1,
                    p: 3
                  }}>
                    <Avatar 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        mb: 2, 
                        bgcolor: '#2e7d32',
                        fontSize: '1.5rem',
                        fontWeight: 600
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: '#500b28', 
                        fontWeight: 500, 
                        mb: 2 
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        flexGrow: 1,
                        lineHeight: 1.5
                      }}
                    >
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
          "Financial freedom is available to those who learn about it and work for it."
        </Typography>
      </Box>
    </Box>
  );
};

export default About;