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
  Fade,
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

  const teamMembers = [
    {
      id: 1,
      name: 'Mariam Hasanat',
      role: 'Full Stack Developer',
      description: 'A passionate and dedicated Computer Engineering graduate from Palestine Polytechnic University, I specialize in full-stack development with a strong focus on creating efficient and user-friendly web applications. Proficient in technologies such as React, Node.js, and MongoDB, I enjoy solving complex problems and delivering high-quality software solutions. My experience includes working as a Full Stack Developer at High Software, where I contributed to building responsive web applications and RESTful APIs. I am eager to continue growing my skills and making a positive impact through technology.',
      avatar: 'MH',
    },
    {
      id: 2,
      name: 'Bahaa Abbas',
      role: 'Backend Developer',
      description: `I am a dedicated Computer Engineering graduate from An-Najah National University with a strong foundation in full-stack development. Skilled in modern technologies like React, Node.js, and MongoDB, I thrive on solving complex problems and delivering reliable software solutions through collaboration. With experience as a Frontend Developer Intern at Foothill Technology Solutions, LLC, and an AI Engineer at Fratello Software House, I have honed my abilities in responsive design, API development, and optimizing machine learning models. My personal projects, such as BahaaStockJournal and a MERN-based E-Commerce Website, reflect my passion for creating innovative, user-focused applications. Fluent in Arabic and proficient in English, I am eager to contribute my technical expertise and teamwork skills to impactful projects.`,
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

  const features = [
    {
      icon: <WalletIcon sx={{ fontSize: 36 }} />,
      title: 'Track Income & Expenses',
      description: 'Record and categorize all your financial transactions with ease.'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 36 }} />,
      title: 'Manage Budgets',
      description: 'Set spending limits and receive alerts when you exceed your budget.'
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 36 }} />,
      title: 'View Reports & Analytics',
      description: 'Gain insights through interactive charts and comprehensive financial reports.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 36 }} />,
      title: 'Secure Authentication',
      description: 'Your financial data is protected with industry-standard security measures.'
    }
  ];

  const techStack = {
    frontend: ['React', 'Vite', 'Material-UI', 'Recharts', 'React Router'],
    backend: ['Node.js', 'Express', 'RESTful APIs'],
    database: ['MongoDB', 'Mongoose'],
    auth: ['JWT', 'Bcrypt', 'Secure Password Hashing']
  };

  return (
    <Box sx={{
      p: { xs: 2, sm: 3 },
      bgcolor: 'background.default',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hero Section */}
      <Box sx={{
        textAlign: 'center',
        mb: 6,
        pt: { xs: 3, sm: 5 },
        maxWidth: '800px',
        mx: 'auto'
      }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h1"
          sx={{
            color: '#500b28',
            fontWeight: 700,
            mb: 2,
            lineHeight: 1.3
          }}
        >
          About Personal Finance Tracker
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            lineHeight: 1.7
          }}
        >
          Helping you take control of your finances with ease and clarity.
        </Typography>
      </Box>

      {/* Project Overview */}
      <Fade in timeout={500}>
        <Card sx={{
          mb: 5,
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(80, 11, 40, 0.12)',
          overflow: 'hidden',
          border: '1px solid rgba(80, 11, 40, 0.08)'
        }}>
          <Box sx={{
            bgcolor: '#500b28',
            p: { xs: 2, sm: 3 },
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Project Overview
            </Typography>
          </Box>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
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
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: 'rgba(80, 11, 40, 0.03)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(80, 11, 40, 0.06)',
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(80, 11, 40, 0.1)',
                      mb: 2
                    }}>
                      {React.cloneElement(feature.icon, { sx: { color: '#500b28', fontSize: 32 } })}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#500b28' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Project Info */}
      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6}>  {/* Changed from xs={10} md={5} to xs={12} md={6} */}
          <Card sx={{
            height: '100%',
            width: '40vw',
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(80, 11, 40, 0.12)',
            border: '1px solid rgba(80, 11, 40, 0.08)'
          }}>
            <Box sx={{
              bgcolor: '#500b28',
              p: { xs: 2, sm: 3 },
              borderRadius: '20px 20px 0 0'
            }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                Technology Stack
              </Typography>
            </Box>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {Object.entries(techStack).map(([category, techs], idx) => (
                <Box key={idx} sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#500b28', mb: 1.5, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    {category}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {techs.map((tech, i) => (
                      <Chip
                        key={i}
                        label={tech}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(80, 11, 40, 0.08)',
                          color: '#500b28',
                          fontWeight: 500,
                          borderRadius: '8px'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>  {/* Changed from xs={10} md={5} to xs={12} md={6} */}
          <Card sx={{
            height: '100%',
            borderRadius: '20px',
            width: '50vw',
            boxShadow: '0 8px 30px rgba(80, 11, 40, 0.12)',
            border: '1px solid rgba(80, 11, 40, 0.08)'
          }}>
            <Box sx={{
              bgcolor: '#500b28',
              p: { xs: 2, sm: 3 },
              borderRadius: '20px 20px 0 0'
            }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                Key Outcomes
              </Typography>
            </Box>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}>
                  <strong style={{ color: '#500b28' }}>Secure User Authentication:</strong> Implemented robust login system with password encryption and JWT tokens.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}>
                  <strong style={{ color: '#500b28' }}>Comprehensive Dashboard:</strong> Created intuitive overview with financial summaries and visual analytics.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}>
                  <strong style={{ color: '#500b28' }}>Transaction Management:</strong> Developed full CRUD functionality for income and expense tracking.
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  <strong style={{ color: '#500b28' }}>Budget Monitoring:</strong> Built budget system with category limits and alert notifications.
                </Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'divider' }} />

              <Typography variant="h6" sx={{ color: '#500b28', fontWeight: 600, mb: 2 }}>
                Development Timeline
              </Typography>

              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Phase 1:</strong> Authentication & User Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Phase 2:</strong> Transaction System & Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Phase 3:</strong> Budget Features & Reporting
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Phase 4:</strong> Testing & Optimization
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Members */}
      <Fade in timeout={800}>
        <Card sx={{
          mb: 5,
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(80, 11, 40, 0.12)',
          border: '1px solid rgba(80, 11, 40, 0.08)'
        }}>
          <Box sx={{
            bgcolor: '#500b28',
            p: { xs: 2, sm: 3 },
            textAlign: 'center',
            borderRadius: '20px 20px 0 0'
          }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Meet Our Team
            </Typography>
          </Box>
          <CardContent>
            <Grid container spacing={3}>
              {teamMembers.map((member) => (
                <Grid item xs={12} sm={6} md={3} key={member.id}>
                  <Fade in timeout={1000 + member.id * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px',
                        boxShadow: '0 4px 16px rgba(80, 11, 40, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 25px rgba(80, 11, 40, 0.18)'
                        },
                        overflow: 'hidden'
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
                            width: 72,
                            height: 72,
                            mb: 2,
                            bgcolor: '#500b28',
                            fontSize: '1.6rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(80, 11, 40, 0.2)'
                          }}
                        >
                          {member.avatar}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#500b28' }}>
                          {member.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                            mb: 2,
                            fontSize: '0.95rem'
                          }}
                        >
                          {member.role}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            flexGrow: 1,
                            lineHeight: 1.6,
                            fontSize: '0.9rem'
                          }}
                        >
                          {member.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Fade>

      {/* Footer */}
      <Box sx={{
        textAlign: 'center',
        py: 3,
        mt: 'auto',
        borderTop: '1px solid rgba(80, 11, 40, 0.12)',
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