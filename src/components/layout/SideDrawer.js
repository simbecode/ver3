import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Home as HomeIcon,
  Group as GroupIcon,
  Note as NoteIcon,
  Map as MapIcon,
  Upload as UploadIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import BadgeIcon from '@mui/icons-material/Badge';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: '홈', icon: <HomeIcon />, path: '/' },
  { text: '명함첩', icon: <GroupIcon />, path: '/group-cards' },
  { text: '업무일지', icon: <NoteIcon />, path: '/worklog' },
  { text: '지도', icon: <MapIcon />, path: '/map' },
];

const DRAWER_STATE_KEY = 'sideDrawerExpanded';

const SideDrawer = ({ onExpandedChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(() => {
    // localStorage에서 상태를 읽어와 초기값으로 설정
    const savedState = localStorage.getItem(DRAWER_STATE_KEY);
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    // expanded 상태가 변경될 때마다 localStorage에 저장
    localStorage.setItem(DRAWER_STATE_KEY, JSON.stringify(expanded));
    if (onExpandedChange) {
      onExpandedChange(expanded);
    }
  }, [expanded, onExpandedChange]);

  const handleDrawerToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box 
      sx={{ 
        width: expanded ? '240px' : '48px',
        transition: 'width 0.2s ease-in-out',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          height: '48px',
          mt: 1,
          position: 'relative',
          zIndex: 100,
        }}
      >
        <IconButton 
          onClick={handleDrawerToggle} 
          color="primary"
          sx={{
            padding: '12px',
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
          size="large"
        >
          {expanded ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ 
                minHeight: 48,
                justifyContent: expanded ? 'flex-start' : 'center',
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: expanded ? 2 : 0,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {expanded && (
                <ListItemText primary={item.text} />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ 
              minHeight: 48,
              justifyContent: expanded ? 'flex-start' : 'center',
              px: 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 2 : 0,
                justifyContent: 'center',
              }}
            >
              <UploadIcon />
            </ListItemIcon>
            {expanded && (
              <ListItemText primary="명함 업로드" />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default SideDrawer; 