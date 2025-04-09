import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Badge,
  Fab,
  Zoom,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

// 테스트 데이터
const testWorkLogs = [
  {
    id: 1,
    date: new Date(2025, 3, 9),
    author: '홍길동',
    customerName: '㈜ABC',
    stage: 'WARM',
    content: '제품 견적 요청',
    followUpDate: new Date(2025, 3, 11, 10, 0),
  },
  {
    id: 2,
    date: new Date(2025, 3, 9),
    author: '김민지',
    customerName: '㈜XYZ',
    stage: 'HOT',
    content: '계약 협상 중',
    followUpDate: new Date(2025, 3, 10, 15, 0),
  },
  {
    id: 3,
    date: new Date(2025, 3, 8),
    author: '이영희',
    customerName: '테크솔루션',
    stage: 'COLD',
    content: '신규 제품 소개 및 데모 진행',
    followUpDate: new Date(2025, 3, 15, 14, 0),
  },
  {
    id: 4,
    date: new Date(2025, 3, 8),
    author: '박지훈',
    customerName: '마케팅프로',
    stage: 'HOT',
    content: '계약서 검토 및 수정 요청',
    followUpDate: new Date(2025, 3, 9, 11, 0),
  },
  {
    id: 5,
    date: new Date(2025, 3, 7),
    author: '홍길동',
    customerName: '디자인하우스',
    stage: 'WARM',
    content: 'UI/UX 디자인 컨설팅 제안',
    followUpDate: new Date(2025, 3, 12, 16, 0),
  },
  {
    id: 6,
    date: new Date(2025, 3, 7),
    author: '김민지',
    customerName: '스타트업A',
    stage: 'CONTRACTED',
    content: '계약 완료 및 프로젝트 킥오프 미팅',
    followUpDate: new Date(2025, 3, 14, 10, 0),
  },
  {
    id: 7,
    date: new Date(2025, 3, 6),
    author: '이영희',
    customerName: '㈜ABC',
    stage: 'HOT',
    content: '추가 기능 개발 요청',
    followUpDate: new Date(2025, 3, 8, 15, 0),
  },
  {
    id: 8,
    date: new Date(2025, 3, 6),
    author: '박지훈',
    customerName: '인터넷서비스',
    stage: 'COLD',
    content: '신규 서비스 소개 및 가격 협의',
    followUpDate: new Date(2025, 3, 13, 11, 0),
  },
  {
    id: 9,
    date: new Date(2025, 3, 5),
    author: '홍길동',
    customerName: '㈜XYZ',
    stage: 'WARM',
    content: '기존 시스템 업그레이드 제안',
    followUpDate: new Date(2025, 3, 10, 14, 0),
  },
  {
    id: 10,
    date: new Date(2025, 3, 5),
    author: '김민지',
    customerName: '테크솔루션',
    stage: 'HOT',
    content: '계약 조건 협의 및 수정',
    followUpDate: new Date(2025, 3, 7, 16, 0),
  },
  {
    id: 11,
    date: new Date(2025, 3, 4),
    author: '이영희',
    customerName: '마케팅프로',
    stage: 'CONTRACTED',
    content: '프로젝트 진행 상황 보고',
    followUpDate: new Date(2025, 3, 11, 10, 0),
  },
  {
    id: 12,
    date: new Date(2025, 3, 4),
    author: '박지훈',
    customerName: '디자인하우스',
    stage: 'COLD',
    content: '신규 디자인 툴 소개',
    followUpDate: new Date(2025, 3, 18, 15, 0),
  },
  {
    id: 13,
    date: new Date(2025, 3, 3),
    author: '홍길동',
    customerName: '스타트업A',
    stage: 'WARM',
    content: '투자 유치 관련 컨설팅',
    followUpDate: new Date(2025, 3, 9, 11, 0),
  },
  {
    id: 14,
    date: new Date(2025, 3, 3),
    author: '김민지',
    customerName: '인터넷서비스',
    stage: 'HOT',
    content: '서비스 통합 계약 협의',
    followUpDate: new Date(2025, 3, 5, 14, 0),
  },
  {
    id: 15,
    date: new Date(2025, 3, 2),
    author: '이영희',
    customerName: '㈜ABC',
    stage: 'CONTRACTED',
    content: '유지보수 계약 갱신',
    followUpDate: new Date(2025, 3, 16, 10, 0),
  }
];

// 고객 단계 정의
const CUSTOMER_STAGES = [
  { value: 'COLD', label: 'Cold Lead', color: 'default' },
  { value: 'WARM', label: 'Warm Lead', color: 'warning' },
  { value: 'HOT', label: 'Hot Lead', color: 'error' },
  { value: 'CONTRACTED', label: '계약 완료', color: 'success' },
];

const WorkLogList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [workLogs] = useState(testWorkLogs);
  const [selectedWorkLog, setSelectedWorkLog] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openSortMenu, setOpenSortMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkLogs, setFilteredWorkLogs] = useState(workLogs);
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // 검색 및 필터링 적용
  useEffect(() => {
    let result = [...workLogs];
    
    // 검색어 필터링
    if (searchQuery) {
      result = result.filter(log => 
        log.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // 고객 단계 필터링
    if (selectedStage !== 'ALL') {
      result = result.filter(log => log.stage === selectedStage);
    }
    
    // 정렬 적용
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? b.date.getTime() - a.date.getTime()
          : a.date.getTime() - b.date.getTime();
      } else if (sortBy === 'customer') {
        return sortOrder === 'desc'
          ? b.customerName.localeCompare(a.customerName)
          : a.customerName.localeCompare(b.customerName);
      } else if (sortBy === 'author') {
        return sortOrder === 'desc'
          ? b.author.localeCompare(a.author)
          : a.author.localeCompare(b.author);
      }
      return 0;
    });
    
    setFilteredWorkLogs(result);
  }, [workLogs, searchQuery, selectedStage, sortBy, sortOrder]);

  // 고객 단계 색상 가져오기
  const getStageColor = (stage) => {
    const found = CUSTOMER_STAGES.find(s => s.value === stage);
    return found ? found.color : 'default';
  };

  // 업무일지 상세 보기
  const handleViewWorkLog = (workLog) => {
    setSelectedWorkLog(workLog);
    setOpenViewDialog(true);
  };

  // 업무일지 작성 페이지로 이동
  const handleCreateWorkLog = () => {
    navigate('/worklog/create');
  };

  // 필터 드로어 토글
  const toggleFilterDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenFilterDrawer(open);
  };

  // 정렬 메뉴 토글
  const handleSortMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setAnchorEl(null);
  };

  // 정렬 방식 변경
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    handleSortMenuClose();
  };

  // 고객 단계 필터 변경
  const handleStageFilterChange = (stage) => {
    setSelectedStage(stage);
  };

  // 검색어 변경
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 모바일 카드 뷰 렌더링
  const renderMobileCardView = () => {
    return (
      <List>
        {filteredWorkLogs.map((workLog) => (
          <React.Fragment key={workLog.id}>
            <ListItem 
              button 
              onClick={() => handleViewWorkLog(workLog)}
              sx={{ 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                py: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {format(workLog.date, 'yyyy-MM-dd')}
                </Typography>
                <Chip
                  label={CUSTOMER_STAGES.find(s => s.value === workLog.stage)?.label}
                  color={getStageColor(workLog.stage)}
                  size="small"
                />
              </Box>
              
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {workLog.customerName}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                작성자: {workLog.author}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                {workLog.content}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
                <Typography variant="caption" color="primary">
                  Follow-up: {workLog.followUpDate && format(workLog.followUpDate, 'M/d a h:mm')}
                </Typography>
                <IconButton size="small">
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
  };

  // 태블릿 카드 뷰 렌더링
  const renderTabletCardView = () => {
    return (
      <Grid container spacing={2}>
        {filteredWorkLogs.map((workLog) => (
          <Grid item xs={12} sm={6} key={workLog.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleViewWorkLog(workLog)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {format(workLog.date, 'yyyy-MM-dd')}
                  </Typography>
                  <Chip
                    label={CUSTOMER_STAGES.find(s => s.value === workLog.stage)?.label}
                    color={getStageColor(workLog.stage)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  {workLog.customerName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  작성자: {workLog.author}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {workLog.content}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Typography variant="caption" color="primary">
                  Follow-up: {workLog.followUpDate && format(workLog.followUpDate, 'M/d a h:mm')}
                </Typography>
                <IconButton size="small">
                  <ViewIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // 데스크톱 테이블 뷰 렌더링
  const renderDesktopTableView = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>날짜</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>고객명</TableCell>
              <TableCell>고객 단계</TableCell>
              <TableCell>주요내용</TableCell>
              <TableCell>Follow-up 일정</TableCell>
              <TableCell align="center">보기</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWorkLogs.map((workLog) => (
              <TableRow 
                key={workLog.id}
                hover
                onClick={() => handleViewWorkLog(workLog)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{format(workLog.date, 'yyyy-MM-dd')}</TableCell>
                <TableCell>{workLog.author}</TableCell>
                <TableCell>{workLog.customerName}</TableCell>
                <TableCell>
                  <Chip
                    label={CUSTOMER_STAGES.find(s => s.value === workLog.stage)?.label}
                    color={getStageColor(workLog.stage)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{workLog.content}</TableCell>
                <TableCell>
                  {workLog.followUpDate && format(workLog.followUpDate, 'M/d a h:mm')}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewWorkLog(workLog);
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        {/* 모바일 앱바 */}
        {isMobile && (
          <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                업무일지 목록
              </Typography>
              <IconButton color="inherit" onClick={toggleFilterDrawer(true)}>
                <FilterIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleSortMenuOpen}>
                <SortIcon />
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* 데스크톱 헤더 */}
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">
              업무일지 목록
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="검색..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mr: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={toggleFilterDrawer(true)}
              >
                필터
              </Button>
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={handleSortMenuOpen}
              >
                정렬
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateWorkLog}
              >
                업무일지 작성
              </Button>
            </Box>
          </Box>
        )}

        {/* 모바일 검색바 */}
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="검색..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
        )}

        {/* 컨텐츠 영역 */}
        {isMobile ? renderMobileCardView() : isTablet ? renderTabletCardView() : renderDesktopTableView()}

        {/* 모바일 플로팅 액션 버튼 */}
        {isMobile && (
          <Zoom in={true}>
            <Fab 
              color="primary" 
              aria-label="add" 
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
              onClick={handleCreateWorkLog}
            >
              <AddIcon />
            </Fab>
          </Zoom>
        )}

        {/* 필터 드로어 (모바일) */}
        <SwipeableDrawer
          anchor="right"
          open={openFilterDrawer}
          onClose={toggleFilterDrawer(false)}
          onOpen={toggleFilterDrawer(true)}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Box sx={{ width: 250, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              필터
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              고객 단계
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                label="전체" 
                onClick={() => handleStageFilterChange('ALL')}
                color={selectedStage === 'ALL' ? 'primary' : 'default'}
                variant={selectedStage === 'ALL' ? 'filled' : 'outlined'}
              />
              {CUSTOMER_STAGES.map((stage) => (
                <Chip 
                  key={stage.value}
                  label={stage.label}
                  onClick={() => handleStageFilterChange(stage.value)}
                  color={selectedStage === stage.value ? 'primary' : 'default'}
                  variant={selectedStage === stage.value ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
            
            <Button 
              fullWidth 
              variant="contained" 
              onClick={toggleFilterDrawer(false)}
              sx={{ mt: 2 }}
            >
              적용
            </Button>
          </Box>
        </SwipeableDrawer>

        {/* 정렬 메뉴 */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSortMenuClose}
        >
          <MenuItem onClick={() => handleSortChange('date')}>
            날짜 {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('customer')}>
            고객명 {sortBy === 'customer' && (sortOrder === 'desc' ? '↓' : '↑')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('author')}>
            작성자 {sortBy === 'author' && (sortOrder === 'desc' ? '↓' : '↑')}
          </MenuItem>
        </Menu>

        {/* 업무일지 상세 보기 다이얼로그 */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          {selectedWorkLog && (
            <>
              <DialogTitle>
                {isMobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={() => setOpenViewDialog(false)}
                      aria-label="close"
                      sx={{ mr: 1 }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      업무일지 상세 보기
                    </Typography>
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={() => setOpenViewDialog(false)}
                      aria-label="close"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                )}
                {!isMobile && `업무일지 상세 보기 - ${format(selectedWorkLog.date, 'yyyy-MM-dd')}`}
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
                            {selectedWorkLog.author}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">
                            고객명
                          </Typography>
                          <Typography variant="body1">
                            {selectedWorkLog.customerName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">
                            고객 단계
                          </Typography>
                          <Chip
                            label={CUSTOMER_STAGES.find(s => s.value === selectedWorkLog.stage)?.label}
                            color={getStageColor(selectedWorkLog.stage)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">
                            Follow-up 일정
                          </Typography>
                          <Typography variant="body1">
                            {selectedWorkLog.followUpDate && format(selectedWorkLog.followUpDate, 'yyyy-MM-dd a h:mm')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            주요내용
                          </Typography>
                          <Typography variant="body1">
                            {selectedWorkLog.content}
                          </Typography>
                        </Grid>
                      </Grid>
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
      </Box>
    </LocalizationProvider>
  );
};

export default WorkLogList; 