import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  VideoCall as VideoCallIcon,
  MeetingRoom as MeetingRoomIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 고객 단계 정의
const CUSTOMER_STAGES = [
  { value: 'COLD', label: 'Cold Leads', color: 'info', description: '우리 제품/브랜드를 잘 모름, 연락처만 확보된 상태' },
  { value: 'WARM', label: 'Warm Leads', color: 'warning', description: '일정 관심 표현, 문의/자료 요청 등 일부 행동' },
  { value: 'HOT', label: 'Hot Leads', color: 'error', description: '구매 의사 확실, 예산/타이밍/결정권 보유' },
  { value: 'CONTRACTED', label: '계약 완료', color: 'success', description: '계약이 완료된 고객' },
];

// 고객 반응 정의
const CUSTOMER_RESPONSES = [
  { value: 'POSITIVE', label: '긍정적', color: 'success' },
  { value: 'NEUTRAL', label: '보류', color: 'warning' },
  { value: 'NEGATIVE', label: '부정적', color: 'error' },
];

// 연락 수단 정의
const CONTACT_METHODS = [
  { value: 'PHONE', label: '전화', icon: <PhoneIcon /> },
  { value: 'EMAIL', label: '이메일', icon: <EmailIcon /> },
  { value: 'VISIT', label: '방문', icon: <BusinessIcon /> },
  { value: 'VIDEO', label: '화상', icon: <VideoCallIcon /> },
  { value: 'MEETING', label: '회의', icon: <MeetingRoomIcon /> },
];

// 테스트 데이터 - 고객 목록
const testCustomers = [
  { id: 1, name: '김영업', company: '테크스타트', position: 'CEO', stage: 'HOT' },
  { id: 2, name: '이개발', company: '마케팅프로', position: '개발팀장', stage: 'WARM' },
  { id: 3, name: '박디자인', company: '디자인하우스', position: '디자이너', stage: 'COLD' },
  { id: 4, name: '최마케팅', company: '테크솔루션', position: '마케팅팀장', stage: 'HOT' },
  { id: 5, name: '정기획', company: '스타트업', position: '기획팀장', stage: 'WARM' },
];

const WorkLog = () => {
  // 기본 정보 상태
  const [workDate, setWorkDate] = useState(new Date());
  const [workHours, setWorkHours] = useState('');
  const [todayGoal, setTodayGoal] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  
  // 고객 대응 내역 상태
  const [customerResponses, setCustomerResponses] = useState([]);
  const [newCustomerResponse, setNewCustomerResponse] = useState({
    customerId: '',
    contactMethod: 'PHONE',
    summary: '',
    response: 'POSITIVE',
    stage: 'COLD',
    notes: '',
    followUpDate: null,
    followUpTime: null,
  });
  
  // 내부 업무 내용 상태
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    participants: '',
    summary: '',
  });
  
  const [otherTasks, setOtherTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'PENDING',
  });
  
  // 다이얼로그 상태
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  
  // 알림 상태
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  
  // 고객 대응 내역 추가
  const handleAddCustomerResponse = () => {
    if (!newCustomerResponse.customerId || !newCustomerResponse.summary) {
      setSnackbar({
        open: true,
        message: '고객과 상담 요약을 입력해주세요.',
        severity: 'error',
      });
      return;
    }
    
    const customer = testCustomers.find(c => c.id === parseInt(newCustomerResponse.customerId));
    
    const response = {
      id: customerResponses.length + 1,
      customerId: newCustomerResponse.customerId,
      customerName: customer.name,
      company: customer.company,
      position: customer.position,
      contactMethod: newCustomerResponse.contactMethod,
      summary: newCustomerResponse.summary,
      response: newCustomerResponse.response,
      stage: newCustomerResponse.stage,
      notes: newCustomerResponse.notes,
      followUpDate: newCustomerResponse.followUpDate,
      followUpTime: newCustomerResponse.followUpTime,
      createdAt: new Date(),
    };
    
    setCustomerResponses([...customerResponses, response]);
    setNewCustomerResponse({
      customerId: '',
      contactMethod: 'PHONE',
      summary: '',
      response: 'POSITIVE',
      stage: 'COLD',
      notes: '',
      followUpDate: null,
      followUpTime: null,
    });
    setOpenCustomerDialog(false);
    
    setSnackbar({
      open: true,
      message: '고객 대응 내역이 추가되었습니다.',
      severity: 'success',
    });
  };
  
  // 회의 내역 추가
  const handleAddMeeting = () => {
    if (!newMeeting.title) {
      setSnackbar({
        open: true,
        message: '회의 제목을 입력해주세요.',
        severity: 'error',
      });
      return;
    }
    
    const meeting = {
      id: meetings.length + 1,
      title: newMeeting.title,
      participants: newMeeting.participants,
      summary: newMeeting.summary,
      createdAt: new Date(),
    };
    
    setMeetings([...meetings, meeting]);
    setNewMeeting({
      title: '',
      participants: '',
      summary: '',
    });
    setOpenMeetingDialog(false);
    
    setSnackbar({
      open: true,
      message: '회의 내역이 추가되었습니다.',
      severity: 'success',
    });
  };
  
  // 기타 업무 추가
  const handleAddTask = () => {
    if (!newTask.title) {
      setSnackbar({
        open: true,
        message: '업무 제목을 입력해주세요.',
        severity: 'error',
      });
      return;
    }
    
    const task = {
      id: otherTasks.length + 1,
      title: newTask.title,
      status: newTask.status,
      createdAt: new Date(),
    };
    
    setOtherTasks([...otherTasks, task]);
    setNewTask({
      title: '',
      status: 'PENDING',
    });
    setOpenTaskDialog(false);
    
    setSnackbar({
      open: true,
      message: '업무가 추가되었습니다.',
      severity: 'success',
    });
  };
  
  // 업무일지 저장
  const handleSaveWorkLog = () => {
    setIsLoading(true);
    
    // 실제로는 API 호출로 저장
    setTimeout(() => {
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: '업무일지가 저장되었습니다.',
        severity: 'success',
      });
    }, 1000);
  };
  
  // 고객 대응 내역 삭제
  const handleDeleteCustomerResponse = (id) => {
    setCustomerResponses(customerResponses.filter(response => response.id !== id));
    setSnackbar({
      open: true,
      message: '고객 대응 내역이 삭제되었습니다.',
      severity: 'info',
    });
  };
  
  // 회의 내역 삭제
  const handleDeleteMeeting = (id) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    setSnackbar({
      open: true,
      message: '회의 내역이 삭제되었습니다.',
      severity: 'info',
    });
  };
  
  // 기타 업무 삭제
  const handleDeleteTask = (id) => {
    setOtherTasks(otherTasks.filter(task => task.id !== id));
    setSnackbar({
      open: true,
      message: '업무가 삭제되었습니다.',
      severity: 'info',
    });
  };
  
  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // 고객 단계 색상 가져오기
  const getStageColor = (stage) => {
    const found = CUSTOMER_STAGES.find(s => s.value === stage);
    return found ? found.color : 'default';
  };
  
  // 고객 반응 색상 가져오기
  const getResponseColor = (response) => {
    const found = CUSTOMER_RESPONSES.find(r => r.value === response);
    return found ? found.color : 'default';
  };
  
  // 연락 수단 아이콘 가져오기
  const getContactMethodIcon = (method) => {
    const found = CONTACT_METHODS.find(m => m.value === method);
    return found ? found.icon : null;
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          업무일지 작성
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            기본 정보
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="작성일"
                value={workDate}
                onChange={(newValue) => setWorkDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="작성자"
                defaultValue="홍길동"
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="근무 시간"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                fullWidth
                placeholder="예: 9:00 - 18:00"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="오늘의 목표"
                value={todayGoal}
                onChange={(e) => setTodayGoal(e.target.value)}
                fullWidth
                multiline
                rows={2}
                placeholder="오늘 달성하고자 하는 목표를 입력하세요."
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              고객 대응 내역
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCustomerDialog(true)}
            >
              고객 대응 추가
            </Button>
          </Box>
          
          {customerResponses.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              아직 고객 대응 내역이 없습니다. 고객 대응 추가 버튼을 클릭하여 추가해주세요.
            </Alert>
          ) : (
            <List>
              {customerResponses.map((response) => (
                <React.Fragment key={response.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" component="span" sx={{ mr: 1 }}>
                            {response.customerName} ({response.company})
                          </Typography>
                          <Chip 
                            label={response.position} 
                            size="small" 
                            sx={{ mr: 1 }} 
                          />
                          <Chip 
                            label={CUSTOMER_STAGES.find(s => s.value === response.stage)?.label || response.stage} 
                            size="small" 
                            color={getStageColor(response.stage)}
                            sx={{ mr: 1 }} 
                          />
                          <Chip 
                            label={CUSTOMER_RESPONSES.find(r => r.value === response.response)?.label || response.response} 
                            size="small" 
                            color={getResponseColor(response.response)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {getContactMethodIcon(response.contactMethod)}
                            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                              {CONTACT_METHODS.find(m => m.value === response.contactMethod)?.label || response.contactMethod}
                            </Typography>
                          </Box>
                          <Typography variant="body2" paragraph>
                            {response.summary}
                          </Typography>
                          {response.notes && (
                            <Typography variant="body2" color="text.secondary" paragraph>
                              특이사항: {response.notes}
                            </Typography>
                          )}
                          {(response.followUpDate || response.followUpTime) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <NotificationsIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                Follow-up: {response.followUpDate ? format(response.followUpDate, 'yyyy-MM-dd') : ''} 
                                {response.followUpTime ? ` ${format(response.followUpTime, 'HH:mm')}` : ''}
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            작성일: {format(response.createdAt, 'yyyy-MM-dd HH:mm')}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteCustomerResponse(response.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              내부 업무 내용
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            회의 참석 내역
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenMeetingDialog(true)}
            >
              회의 추가
            </Button>
          </Box>
          
          {meetings.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              아직 회의 내역이 없습니다. 회의 추가 버튼을 클릭하여 추가해주세요.
            </Alert>
          ) : (
            <List>
              {meetings.map((meeting) => (
                <React.Fragment key={meeting.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {meeting.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          {meeting.participants && (
                            <Typography variant="body2" paragraph>
                              참석자: {meeting.participants}
                            </Typography>
                          )}
                          {meeting.summary && (
                            <Typography variant="body2" paragraph>
                              {meeting.summary}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            작성일: {format(meeting.createdAt, 'yyyy-MM-dd HH:mm')}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            기타 처리 업무
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenTaskDialog(true)}
            >
              업무 추가
            </Button>
          </Box>
          
          {otherTasks.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              아직 처리 업무가 없습니다. 업무 추가 버튼을 클릭하여 추가해주세요.
            </Alert>
          ) : (
            <List>
              {otherTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <ListItem>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          작성일: {format(task.createdAt, 'yyyy-MM-dd HH:mm')}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        label={task.status === 'PENDING' ? '진행중' : '완료'} 
                        color={task.status === 'PENDING' ? 'warning' : 'success'} 
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            내일 계획
          </Typography>
          
          <TextField
            label="내일 계획"
            value={tomorrowPlan}
            onChange={(e) => setTomorrowPlan(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="내일 진행할 업무 계획을 입력하세요."
          />
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
            onClick={handleSaveWorkLog}
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '업무일지 저장'}
          </Button>
        </Box>
        
        {/* 고객 대응 추가 다이얼로그 */}
        <Dialog 
          open={openCustomerDialog} 
          onClose={() => setOpenCustomerDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>고객 대응 내역 추가</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>고객</InputLabel>
                  <Select
                    value={newCustomerResponse.customerId}
                    onChange={(e) => setNewCustomerResponse({
                      ...newCustomerResponse,
                      customerId: e.target.value
                    })}
                    label="고객"
                  >
                    {testCustomers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.company}) - {customer.position}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>연락 수단</InputLabel>
                  <Select
                    value={newCustomerResponse.contactMethod}
                    onChange={(e) => setNewCustomerResponse({
                      ...newCustomerResponse,
                      contactMethod: e.target.value
                    })}
                    label="연락 수단"
                  >
                    {CONTACT_METHODS.map((method) => (
                      <MenuItem key={method.value} value={method.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {method.icon}
                          <Typography sx={{ ml: 1 }}>{method.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="상담 요약"
                  value={newCustomerResponse.summary}
                  onChange={(e) => setNewCustomerResponse({
                    ...newCustomerResponse,
                    summary: e.target.value
                  })}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>고객 반응</InputLabel>
                  <Select
                    value={newCustomerResponse.response}
                    onChange={(e) => setNewCustomerResponse({
                      ...newCustomerResponse,
                      response: e.target.value
                    })}
                    label="고객 반응"
                  >
                    {CUSTOMER_RESPONSES.map((response) => (
                      <MenuItem key={response.value} value={response.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {response.value === 'POSITIVE' && <CheckCircleIcon color="success" sx={{ mr: 1 }} />}
                          {response.value === 'NEUTRAL' && <WarningIcon color="warning" sx={{ mr: 1 }} />}
                          {response.value === 'NEGATIVE' && <ErrorIcon color="error" sx={{ mr: 1 }} />}
                          <Typography>{response.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>현재 단계</InputLabel>
                  <Select
                    value={newCustomerResponse.stage}
                    onChange={(e) => setNewCustomerResponse({
                      ...newCustomerResponse,
                      stage: e.target.value
                    })}
                    label="현재 단계"
                  >
                    {CUSTOMER_STAGES.map((stage) => (
                      <MenuItem key={stage.value} value={stage.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={stage.label} 
                            size="small" 
                            color={stage.color}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {stage.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="특이 사항"
                  value={newCustomerResponse.notes}
                  onChange={(e) => setNewCustomerResponse({
                    ...newCustomerResponse,
                    notes: e.target.value
                  })}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Follow-up 날짜"
                  value={newCustomerResponse.followUpDate}
                  onChange={(newValue) => setNewCustomerResponse({
                    ...newCustomerResponse,
                    followUpDate: newValue
                  })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Follow-up 시간"
                  value={newCustomerResponse.followUpTime}
                  onChange={(newValue) => setNewCustomerResponse({
                    ...newCustomerResponse,
                    followUpTime: newValue
                  })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCustomerDialog(false)}>취소</Button>
            <Button onClick={handleAddCustomerResponse} variant="contained">추가</Button>
          </DialogActions>
        </Dialog>
        
        {/* 회의 추가 다이얼로그 */}
        <Dialog 
          open={openMeetingDialog} 
          onClose={() => setOpenMeetingDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>회의 내역 추가</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="회의 제목"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({
                    ...newMeeting,
                    title: e.target.value
                  })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="참석자"
                  value={newMeeting.participants}
                  onChange={(e) => setNewMeeting({
                    ...newMeeting,
                    participants: e.target.value
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="회의 요약"
                  value={newMeeting.summary}
                  onChange={(e) => setNewMeeting({
                    ...newMeeting,
                    summary: e.target.value
                  })}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMeetingDialog(false)}>취소</Button>
            <Button onClick={handleAddMeeting} variant="contained">추가</Button>
          </DialogActions>
        </Dialog>
        
        {/* 업무 추가 다이얼로그 */}
        <Dialog 
          open={openTaskDialog} 
          onClose={() => setOpenTaskDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>업무 추가</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="업무 제목"
                  value={newTask.title}
                  onChange={(e) => setNewTask({
                    ...newTask,
                    title: e.target.value
                  })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>상태</InputLabel>
                  <Select
                    value={newTask.status}
                    onChange={(e) => setNewTask({
                      ...newTask,
                      status: e.target.value
                    })}
                    label="상태"
                  >
                    <MenuItem value="PENDING">진행중</MenuItem>
                    <MenuItem value="COMPLETED">완료</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTaskDialog(false)}>취소</Button>
            <Button onClick={handleAddTask} variant="contained">추가</Button>
          </DialogActions>
        </Dialog>
        
        {/* 스낵바 */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default WorkLog; 