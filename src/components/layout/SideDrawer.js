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
  Collapse,
} from '@mui/material';
import {
  Home as HomeIcon,
  Badge as BadgeIcon,
  Group as GroupIcon,
  Note as NoteIcon,
  Map as MapIcon,
  Upload as UploadIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: '홈', icon: <HomeIcon />, path: '/' },
  { text: '명함첩', icon: <GroupIcon />, path: '/group-cards' },
  { text: '업무일지', icon: <NoteIcon />, path: '/worklog' },
  { text: '지도', icon: <MapIcon />, path: '/map' },
];

const SideDrawer = ({ onExpandedChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(expanded);
    }
  }, [expanded, onExpandedChange]);

  const handleDrawerToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <IconButton onClick={handleDrawerToggle} color="primary">
          {expanded ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ justifyContent: 'center' }}>
            <Tooltip title={expanded ? "" : item.text} placement="right">
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{ 
                  minHeight: 48,
                  justifyContent: expanded ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: '50%',
                  width: expanded ? 'auto' : 48,
                  margin: '0 auto',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: expanded ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <ListItemText primary={item.text} />
                </Collapse>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem disablePadding sx={{ justifyContent: 'center' }}>
          <Tooltip title={expanded ? "" : "명함 업로드"} placement="right">
            <ListItemButton
              sx={{ 
                minHeight: 48,
                justifyContent: expanded ? 'initial' : 'center',
                px: 2.5,
                borderRadius: '50%',
                width: expanded ? 'auto' : 48,
                margin: '0 auto',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: expanded ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <UploadIcon />
              </ListItemIcon>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <ListItemText primary="명함 업로드" />
              </Collapse>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );
};

export default SideDrawer; 