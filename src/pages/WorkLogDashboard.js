import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Badge,
  Tooltip,
  Pagination,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  CalendarToday as CalendarIcon,
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
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';

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

// 테스트 데이터 - 사용자 목록
const testUsers = [
  { id: 1, name: '홍길동', role: '영업사원' },
  { id: 2, name: '김영업', role: '영업팀장' },
  { id: 3, name: '이마케팅', role: '마케팅팀장' },
  { id: 4, name: '박개발', role: '개발팀장' },
];

// 테스트 데이터 - 업무일지 목록
const testWorkLogs = [
  {
    id: 1,
    userId: 1,
    userName: '홍길동',
    date: new Date(2023, 5, 15),
    workHours: '9:00 - 18:00',
    todayGoal: '신규 고객 3명 접촉, 기존 고객 2명 Follow-up',
    customerResponses: [
      {
        id: 1,
        customerId: 1,
        customerName: '김영업',
        company: '테크스타트',
        position: 'CEO',
        contactMethod: 'PHONE',
        summary: '신규 제품에 관심을 보임. 다음 주에 데모 일정 조율 예정.',
        response: 'POSITIVE',
        stage: 'HOT',
        notes: '예산 확보 가능성 높음',
        followUpDate: new Date(2023, 5, 20),
        followUpTime: new Date(2023, 5, 20, 14, 0),
        createdAt: new Date(2023, 5, 15, 10, 30),
      },
      {
        id: 2,
        customerId: 2,
        customerName: '이개발',
        company: '마케팅프로',
        position: '개발팀장',
        contactMethod: 'EMAIL',
        summary: '견적서 검토 중. 추가 기능 요청 있음.',
        response: 'NEUTRAL',
        stage: 'WARM',
        notes: '기술적 요구사항 정리 필요',
        followUpDate: new Date(2023, 5, 18),
        followUpTime: new Date(2023, 5, 18, 11, 0),
        createdAt: new Date(2023, 5, 15, 14, 15),
      },
    ],
    meetings: [
      {
        id: 1,
        title: '주간 영업 회의',
        participants: '홍길동, 김영업, 이마케팅',
        summary: '이번 주 영업 목표 설정 및 전략 논의',
        createdAt: new Date(2023, 5, 15, 9, 0),
      },
    ],
    otherTasks: [
      {
        id: 1,
        title: '신규 제품 소개 자료 준비',
        status: 'COMPLETED',
        createdAt: new Date(2023, 5, 15, 16, 0),
      },
      {
        id: 2,
        title: '고객 피드백 분석',
        status: 'PENDING',
        createdAt: new Date(2023, 5, 15, 17, 0),
      },
    ],
    tomorrowPlan: '고객 피드백 분석 완료, 데모 자료 보완',
  },
  {
    id: 2,
    userId: 2,
    userName: '김영업',
    date: new Date(2023, 5, 15),
    workHours: '9:00 - 19:00',
    todayGoal: '팀 내 업무 일정 조율, 고객 미팅 2건',
    customerResponses: [
      {
        id: 3,
        customerId: 3,
        customerName: '박디자인',
        company: '디자인하우스',
        position: '디자이너',
        contactMethod: 'VISIT',
        summary: '현장 방문으로 제품 시연 진행. 높은 관심 보임.',
        response: 'POSITIVE',
        stage: 'WARM',
        notes: 'UI/UX 부분에서 높은 평가',
        followUpDate: new Date(2023, 5, 22),
        followUpTime: new Date(2023, 5, 22, 15, 0),
        createdAt: new Date(2023, 5, 15, 11, 0),
      },
    ],
    meetings: [
      {
        id: 2,
        title: '주간 영업 회의',
        participants: '홍길동, 김영업, 이마케팅',
        summary: '이번 주 영업 목표 설정 및 전략 논의',
        createdAt: new Date(2023, 5, 15, 9, 0),
      },
      {
        id: 3,
        title: '팀 내 업무 회의',
        participants: '김영업, 홍길동, 박개발',
        summary: '다음 주 업무 일정 조율',
        createdAt: new Date(2023, 5, 15, 16, 0),
      },
    ],
    otherTasks: [
      {
        id: 3,
        title: '영업 보고서 작성',
        status: 'COMPLETED',
        createdAt: new Date(2023, 5, 15, 18, 0),
      },
    ],
    tomorrowPlan: '고객 미팅 1건, 팀 내 교육 진행',
  },
  {
    id: 3,
    userId: 1,
    userName: '홍길동',
    date: new Date(2023, 5, 16),
    workHours: '9:00 - 18:00',
    todayGoal: '고객 피드백 분석 완료, 데모 자료 보완',
    customerResponses: [
      {
        id: 4,
        customerId: 4,
        customerName: '최마케팅',
        company: '테크솔루션',
        position: '마케팅팀장',
        contactMethod: 'VIDEO',
        summary: '화상 미팅으로 제품 소개. 마케팅 협력 가능성 논의.',
        response: 'POSITIVE',
        stage: 'HOT',
        notes: '협력 제안서 준비 필요',
        followUpDate: new Date(2023, 5, 23),
        followUpTime: new Date(2023, 5, 23, 10, 0),
        createdAt: new Date(2023, 5, 16, 11, 0),
      },
    ],
    meetings: [],
    otherTasks: [
      {
        id: 4,
        title: '고객 피드백 분석',
        status: 'COMPLETED',
        createdAt: new Date(2023, 5, 16, 14, 0),
      },
      {
        id: 5,
        title: '데모 자료 보완',
        status: 'COMPLETED',
        createdAt: new Date(2023, 5, 16, 16, 0),
      },
    ],
    tomorrowPlan: '신규 고객 접촉 2명, 기존 고객 Follow-up 1명',
  },
];

const WorkLogDashboard = () => {
  // 상태 관리
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [workLogs, setWorkLogs] = useState(testWorkLogs);
  const [filteredWorkLogs, setFilteredWorkLogs] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedWorkLog, setSelectedWorkLog] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // 뷰 모드 변경 핸들러
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue);
  };
  
  // 날짜 변경 핸들러
  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };
  
  // 사용자 필터 변경 핸들러
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };
  
  // 고객 단계 필터 변경 핸들러
  const handleStageChange = (event) => {
    setSelectedStage(event.target.value);
  };
  
  // 페이지 변경 핸들러
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // 페이지당 행 수 변경 핸들러
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // 업무일지 상세 보기 핸들러
  const handleViewWorkLog = (workLog) => {
    setSelectedWorkLog(workLog);
    setOpenViewDialog(true);
  };
  
  // 업무일지 삭제 핸들러
  const handleDeleteWorkLog = (id) => {
    setWorkLogs(workLogs.filter(log => log.id !== id));
    setSnackbar({
      open: true,
      message: '업무일지가 삭제되었습니다.',
      severity: 'info',
    });
  };
  
  // 스낵바 닫기 핸들러
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // 필터링된 업무일지 계산
  useEffect(() => {
    let filtered = [...workLogs];
    
    // 날짜 필터링
    if (viewMode === 'daily') {
      filtered = filtered.filter(log => isSameDay(log.date, selectedDate));
    } else if (viewMode === 'weekly') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      filtered = filtered.filter(log => isWithinInterval(log.date, { start, end }));
    }
    
    // 사용자 필터링
    if (selectedUser !== 'all') {
      filtered = filtered.filter(log => log.userId === parseInt(selectedUser));
    }
    
    // 고객 단계 필터링
    if (selectedStage !== 'all') {
      filtered = filtered.filter(log => 
        log.customerResponses.some(response => response.stage === selectedStage)
      );
    }
    
    setFilteredWorkLogs(filtered);
  }, [viewMode, selectedDate, selectedUser, selectedStage, workLogs]);
  
  // 통계 계산
  const stats = {
    totalCustomerResponses: filteredWorkLogs.reduce((sum, log) => sum + log.customerResponses.length, 0),
    hotLeads: filteredWorkLogs.reduce((sum, log) => 
      sum + log.customerResponses.filter(response => response.stage === 'HOT').length, 0
    ),
    pendingFollowUps: filteredWorkLogs.reduce((sum, log) => 
      sum + log.customerResponses.filter(response => 
        response.followUpDate && response.followUpDate > new Date()
      ).length, 0
    ),
    completedTasks: filteredWorkLogs.reduce((sum, log) => 
      sum + log.otherTasks.filter(task => task.status === 'COMPLETED').length, 0
    ),
    totalMeetings: filteredWorkLogs.reduce((sum, log) => sum + log.meetings.length, 0),
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
          업무일지 대시보드
        </Typography>
        
        {/* 필터 및 뷰 모드 선택 */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <ToggleButtonGroup
                value={viewMode}
                onChange={handleViewModeChange}
                aria-label="view mode tabs"
                centered
              >
                <ToggleButton 
                  value="daily" 
                  aria-label="daily" 
                >
                  <CalendarIcon />
                </ToggleButton>
                <ToggleButton 
                  value="weekly" 
                  aria-label="weekly" 
                >
                  <CalendarIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label={viewMode === 'daily' ? "날짜 선택" : "주 선택"}
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>작성자</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={handleUserChange}
                  label="작성자"
                >
                  <MenuItem value="all">전체</MenuItem>
                  {testUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>고객 단계</InputLabel>
                <Select
                  value={selectedStage}
                  onChange={handleStageChange}
                  label="고객 단계"
                >
                  <MenuItem value="all">전체</MenuItem>
                  {CUSTOMER_STAGES.map((stage) => (
                    <MenuItem key={stage.value} value={stage.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label={stage.label} 
                          size="small" 
                          color={stage.color}
                          sx={{ mr: 1 }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {/* 통계 카드 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  고객 대응 건수
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.totalCustomerResponses}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    일일 평균: {(stats.totalCustomerResponses / (filteredWorkLogs.length || 1)).toFixed(1)}건
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Hot 리드 수
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.hotLeads}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    label="Hot Leads" 
                    size="small" 
                    color="error"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  예정된 Follow-up
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.pendingFollowUps}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <NotificationsIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    알림 설정됨
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  완료된 업무
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.completedTasks}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    업무 효율성: {(stats.completedTasks / (filteredWorkLogs.reduce((sum, log) => sum + log.otherTasks.length, 0) || 1) * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  회의 수
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.totalMeetings}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <MeetingRoomIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    일일 평균: {(stats.totalMeetings / (filteredWorkLogs.length || 1)).toFixed(1)}건
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* 업무일지 목록 */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              업무일지 목록
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                sx={{ mr: 1 }}
              >
                새로고침
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                내보내기
              </Button>
            </Box>
          </Box>
          
          {filteredWorkLogs.length === 0 ? (
            <Alert severity="info">
              선택한 조건에 맞는 업무일지가 없습니다.
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>작성일</TableCell>
                      <TableCell>작성자</TableCell>
                      <TableCell>근무 시간</TableCell>
                      <TableCell>고객 대응</TableCell>
                      <TableCell>회의</TableCell>
                      <TableCell>업무</TableCell>
                      <TableCell>내일 계획</TableCell>
                      <TableCell>작업</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWorkLogs
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((workLog) => (
                        <TableRow key={workLog.id}>
                          <TableCell>
                            {format(workLog.date, 'yyyy-MM-dd')}
                          </TableCell>
                          <TableCell>{workLog.userName}</TableCell>
                          <TableCell>{workLog.workHours}</TableCell>
                          <TableCell>
                            <Badge badgeContent={workLog.customerResponses.length} color="primary">
                              <PersonIcon />
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge badgeContent={workLog.meetings.length} color="info">
                              <MeetingRoomIcon />
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              badgeContent={workLog.otherTasks.filter(task => task.status === 'COMPLETED').length} 
                              color="success"
                            >
                              <AssignmentIcon />
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                              {workLog.tomorrowPlan}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="상세 보기">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewWorkLog(workLog)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="수정">
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="삭제">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteWorkLog(workLog.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredWorkLogs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>
        
        {/* 업무일지 상세 보기 다이얼로그 */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedWorkLog && (
            <>
              <DialogTitle>
                업무일지 상세 보기 - {format(selectedWorkLog.date, 'yyyy-MM-dd')}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        기본 정보
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">
                            작성자
                          </Typography>
                          <Typography variant="body1">
                            {selectedWorkLog.userName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">
                            근무 시간
                          </Typography>
                          <Typography variant="body1">
                            {selectedWorkLog.workHours}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            오늘의 목표
                          </Typography>
                          <Typography variant="body1">
                            {selectedWorkLog.todayGoal}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        고객 대응 내역
                      </Typography>
                      {selectedWorkLog.customerResponses.length === 0 ? (
                        <Alert severity="info">
                          고객 대응 내역이 없습니다.
                        </Alert>
                      ) : (
                        <List>
                          {selectedWorkLog.customerResponses.map((response) => (
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
                                    </Box>
                                  }
                                />
                              </ListItem>
                              <Divider component="li" />
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        내부 업무 내용
                      </Typography>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        회의 참석 내역
                      </Typography>
                      
                      {selectedWorkLog.meetings.length === 0 ? (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          회의 내역이 없습니다.
                        </Alert>
                      ) : (
                        <List>
                          {selectedWorkLog.meetings.map((meeting) => (
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
                                    </Box>
                                  }
                                />
                              </ListItem>
                              <Divider component="li" />
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                        기타 처리 업무
                      </Typography>
                      
                      {selectedWorkLog.otherTasks.length === 0 ? (
                        <Alert severity="info">
                          처리 업무가 없습니다.
                        </Alert>
                      ) : (
                        <List>
                          {selectedWorkLog.otherTasks.map((task) => (
                            <React.Fragment key={task.id}>
                              <ListItem>
                                <ListItemText
                                  primary={task.title}
                                />
                                <ListItemSecondaryAction>
                                  <Chip 
                                    label={task.status === 'PENDING' ? '진행중' : '완료'} 
                                    color={task.status === 'PENDING' ? 'warning' : 'success'} 
                                    size="small"
                                  />
                                </ListItemSecondaryAction>
                              </ListItem>
                              <Divider component="li" />
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        내일 계획
                      </Typography>
                      <Typography variant="body1">
                        {selectedWorkLog.tomorrowPlan}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenViewDialog(false)}>닫기</Button>
              </DialogActions>
            </>
          )}
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

export default WorkLogDashboard; 