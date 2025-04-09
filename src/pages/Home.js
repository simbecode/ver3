import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

// 공지사항 타입 정의
const NOTICE_TYPES = {
  GENERAL: { label: '일반', color: 'default' },
  IMPORTANT: { label: '중요', color: 'error' },
  EVENT: { label: '이벤트', color: 'success' },
  UPDATE: { label: '업데이트', color: 'info' },
};

// 테스트 데이터
const initialNotices = [
  {
    id: 1,
    title: '시스템 점검 안내',
    content: '2024년 3월 15일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.',
    type: 'IMPORTANT',
    author: '시스템 관리자',
    createdAt: '2024-03-10',
    isRead: false,
  },
  {
    id: 2,
    title: '신규 기능 안내',
    content: '명함첩 기능이 업데이트되었습니다. 팀별 관리 기능이 추가되었습니다.',
    type: 'UPDATE',
    author: '제품 관리자',
    createdAt: '2024-03-09',
    isRead: true,
  },
  {
    id: 3,
    title: '연말 행사 안내',
    content: '2024년 연말 행사가 12월 20일부터 22일까지 진행될 예정입니다.',
    type: 'EVENT',
    author: '행사 담당자',
    createdAt: '2024-03-08',
    isRead: false,
  },
];

const Home = () => {
  const [notices, setNotices] = useState(initialNotices);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [dialogMode, setDialogMode] = useState('view'); // view, edit, create
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'GENERAL',
  });

  const handleOpenDialog = (notice = null, mode = 'view') => {
    setSelectedNotice(notice);
    setDialogMode(mode);
    if (mode === 'create') {
      setNewNotice({
        title: '',
        content: '',
        type: 'GENERAL',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotice(null);
    setDialogMode('view');
  };

  const handleCreateNotice = () => {
    const notice = {
      id: notices.length + 1,
      ...newNotice,
      author: '현재 사용자',
      createdAt: new Date().toISOString().split('T')[0],
      isRead: false,
    };
    setNotices([notice, ...notices]);
    handleCloseDialog();
  };

  const handleEditNotice = () => {
    const updatedNotices = notices.map(notice =>
      notice.id === selectedNotice.id
        ? { ...notice, ...newNotice }
        : notice
    );
    setNotices(updatedNotices);
    handleCloseDialog();
  };

  const handleDeleteNotice = (noticeId) => {
    setNotices(notices.filter(notice => notice.id !== noticeId));
  };

  const handleMarkAsRead = (noticeId) => {
    setNotices(notices.map(notice =>
      notice.id === noticeId
        ? { ...notice, isRead: true }
        : notice
    ));
  };

  const renderNoticeCard = (notice) => (
    <Card key={notice.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
            {notice.title}
          </Typography>
          <Chip
            label={NOTICE_TYPES[notice.type].label}
            color={NOTICE_TYPES[notice.type].color}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {notice.content}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            작성자: {notice.author} | 작성일: {notice.createdAt}
          </Typography>
          {!notice.isRead && (
            <Chip
              icon={<NotificationsIcon />}
              label="새 공지"
              color="primary"
              size="small"
            />
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => handleOpenDialog(notice, 'view')}>
          상세보기
        </Button>
        {!notice.isRead && (
          <Button size="small" onClick={() => handleMarkAsRead(notice.id)}>
            읽음 표시
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <IconButton size="small" onClick={() => handleOpenDialog(notice, 'edit')}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" onClick={() => handleDeleteNotice(notice.id)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          공지사항
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null, 'create')}
        >
          새 공지 작성
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {notices.map(renderNoticeCard)}
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' ? '새 공지 작성' :
           dialogMode === 'edit' ? '공지 수정' : '공지 상세'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'view' ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedNotice?.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedNotice?.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                작성자: {selectedNotice?.author} | 작성일: {selectedNotice?.createdAt}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="제목"
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="내용"
                multiline
                rows={4}
                value={newNotice.content}
                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth>
                <InputLabel>공지 유형</InputLabel>
                <Select
                  value={newNotice.type}
                  label="공지 유형"
                  onChange={(e) => setNewNotice({ ...newNotice, type: e.target.value })}
                >
                  {Object.entries(NOTICE_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? '닫기' : '취소'}
          </Button>
          {dialogMode !== 'view' && (
            <Button
              variant="contained"
              onClick={dialogMode === 'create' ? handleCreateNotice : handleEditNotice}
            >
              {dialogMode === 'create' ? '작성' : '수정'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home; 