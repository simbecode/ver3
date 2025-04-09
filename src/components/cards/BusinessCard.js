import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  AttachMoney as BudgetIcon,
  Person as AuthorityIcon,
  Help as NeedIcon,
  Schedule as TimelineIcon,
  Star as StarIcon,
  Note as NoteIcon,
  Chat as ChatIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// 고객 분류 단계 정의
const LEAD_TYPES = {
  COLD: { label: 'Cold Leads', color: 'info', icon: '🧊', description: '우리 제품/브랜드를 잘 모름, 연락처만 확보된 상태' },
  WARM: { label: 'Warm Leads', color: 'warning', icon: '🔥', description: '일정 관심 표현, 문의/자료 요청 등 일부 행동' },
  HOT: { label: 'Hot Leads', color: 'error', icon: '🔥', description: '구매 의사 확실, 예산/타이밍/결정권 보유' },
};

// BANT 평가 기준 정의
const BANT_CRITERIA = {
  BUDGET: { label: '예산', icon: <BudgetIcon fontSize="small" /> },
  AUTHORITY: { label: '의사결정권', icon: <AuthorityIcon fontSize="small" /> },
  NEED: { label: '필요성', icon: <NeedIcon fontSize="small" /> },
  TIMELINE: { label: '시기', icon: <TimelineIcon fontSize="small" /> },
};

// 리드 스코어링 기준
const LEAD_SCORING = {
  WEBSITE_VISIT: { points: 10, label: '웹사이트 방문' },
  QUOTE_REQUEST: { points: 20, label: '견적 요청' },
  DECISION_MAKER: { points: 30, label: '결정자임' },
  NO_BUDGET: { points: -10, label: '예산 없음' },
};

// 테스트 데이터 - 메모, 상담, 접촉 기록
const testRecords = {
  memos: [
    { id: 1, date: '2023-05-15', content: '첫 미팅에서 제품에 관심을 보임. 다음 주에 견적서 전달 예정.' },
    { id: 2, date: '2023-05-20', content: '견적서 검토 중. 예산 범위 내에서 조정 가능성 있음.' },
  ],
  consultations: [
    { id: 1, date: '2023-05-15', content: '초기 상담 진행. 현재 사용 중인 솔루션에 대한 불만점 파악.', result: '긍정적' },
    { id: 2, date: '2023-05-22', content: '제품 데모 진행. UI/UX 부분에서 높은 관심 보임.', result: '긍정적' },
  ],
  contacts: [
    { id: 1, date: '2023-05-10', type: '이메일', content: '첫 문의 메일 발송' },
    { id: 2, date: '2023-05-12', type: '전화', content: '상담 일정 조율' },
    { id: 3, date: '2023-05-15', type: '미팅', content: '초기 상담 미팅 진행' },
    { id: 4, date: '2023-05-20', type: '이메일', content: '견적서 전달' },
  ],
};

const BusinessCard = ({ card }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [newMemo, setNewMemo] = useState('');
  const [newConsultation, setNewConsultation] = useState({ content: '', result: '긍정적' });
  const [newContact, setNewContact] = useState({ type: '이메일', content: '' });
  const [records, setRecords] = useState(testRecords);

  // 리드 타입 결정 (태그 기반)
  const getLeadType = () => {
    if (card.tags.some(tag => ['구매검토중', '예산확보', '결정자접촉중'].includes(tag))) {
      return LEAD_TYPES.HOT;
    } else if (card.tags.some(tag => ['상담희망', '문의완료', '자료요청', '견적받음'].includes(tag))) {
      return LEAD_TYPES.WARM;
    } else {
      return LEAD_TYPES.COLD;
    }
  };

  // BANT 평가 상태 확인
  const getBantStatus = () => {
    return {
      BUDGET: card.tags.includes('예산확보') ? 'positive' : 'negative',
      AUTHORITY: card.tags.includes('결정자접촉중') ? 'positive' : 'negative',
      NEED: card.tags.includes('상담희망') || card.tags.includes('문의완료') ? 'positive' : 'negative',
      TIMELINE: card.tags.includes('구매검토중') ? 'positive' : 'negative',
    };
  };

  // 리드 스코어 계산
  const calculateLeadScore = () => {
    let score = 0;
    
    // 기본 점수 (리드 타입에 따라)
    if (getLeadType() === LEAD_TYPES.HOT) score += 50;
    else if (getLeadType() === LEAD_TYPES.WARM) score += 30;
    else score += 10;
    
    // 태그 기반 점수
    if (card.tags.includes('웹사이트방문')) score += LEAD_SCORING.WEBSITE_VISIT.points;
    if (card.tags.includes('견적받음')) score += LEAD_SCORING.QUOTE_REQUEST.points;
    if (card.tags.includes('결정자접촉중')) score += LEAD_SCORING.DECISION_MAKER.points;
    if (card.tags.includes('예산없음')) score += LEAD_SCORING.NO_BUDGET.points;
    
    // 최소 0, 최대 100으로 제한
    return Math.max(0, Math.min(100, score));
  };

  const handleOpenDialog = (tab) => {
    setDialogTab(tab);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setDialogTab(newValue);
  };

  const handleAddMemo = () => {
    if (newMemo.trim() === '') return;
    
    const newMemoObj = {
      id: records.memos.length + 1,
      date: new Date().toISOString().split('T')[0],
      content: newMemo
    };
    
    setRecords({
      ...records,
      memos: [newMemoObj, ...records.memos]
    });
    
    setNewMemo('');
  };

  const handleAddConsultation = () => {
    if (newConsultation.content.trim() === '') return;
    
    const newConsultationObj = {
      id: records.consultations.length + 1,
      date: new Date().toISOString().split('T')[0],
      content: newConsultation.content,
      result: newConsultation.result
    };
    
    setRecords({
      ...records,
      consultations: [newConsultationObj, ...records.consultations]
    });
    
    setNewConsultation({ content: '', result: '긍정적' });
  };

  const handleAddContact = () => {
    if (newContact.content.trim() === '') return;
    
    const newContactObj = {
      id: records.contacts.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: newContact.type,
      content: newContact.content
    };
    
    setRecords({
      ...records,
      contacts: [newContactObj, ...records.contacts]
    });
    
    setNewContact({ type: '이메일', content: '' });
  };

  const leadType = getLeadType();
  const bantStatus = getBantStatus();
  const leadScore = calculateLeadScore();

  return (
    <>
      <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="div"
          sx={{
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'white',
            position: 'relative',
          }}
        >
          {card.companyLogo ? (
            <Box
              component="img"
              src={card.companyLogo}
              alt={`${card.company} 로고`}
              sx={{
                height: '80%',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'secondary.main',
              }}
            >
              <BusinessIcon sx={{ fontSize: 40 }} />
            </Avatar>
          )}
          
          {/* 리드 타입 표시 */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: 1,
              px: 1,
              py: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ color: 'white', mr: 0.5 }}>
              {leadType.icon}
            </Typography>
            <Typography variant="caption" sx={{ color: 'white' }}>
              {leadType.label}
            </Typography>
          </Box>
        </CardMedia>
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="div">
              {card.name}
            </Typography>
            <Box>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
              <IconButton size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {card.position} at {card.company}
          </Typography>

          {/* 리드 스코어 표시 */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <StarIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="body2" component="span">
                리드 스코어: {leadScore}점
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={leadScore} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: leadScore > 70 ? 'error.main' : leadScore > 40 ? 'warning.main' : 'info.main',
                }
              }} 
            />
          </Box>

          {/* BANT 평가 표시 */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              BANT 평가:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(BANT_CRITERIA).map(([key, value]) => (
                <Tooltip 
                  key={key} 
                  title={`${value.label}: ${bantStatus[key] === 'positive' ? '확인됨' : '미확인'}`}
                >
                  <Chip
                    icon={value.icon}
                    label={value.label}
                    size="small"
                    color={bantStatus[key] === 'positive' ? 'success' : 'default'}
                    variant={bantStatus[key] === 'positive' ? 'filled' : 'outlined'}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">{card.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">{card.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">{card.address}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              태그:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {card.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          </Box>

          {/* 액션 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 'auto' }}>
            <Tooltip title="메모">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => handleOpenDialog(0)}
              >
                <NoteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="상담 기록">
              <IconButton 
                size="small" 
                color="warning"
                onClick={() => handleOpenDialog(1)}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="접촉 기록">
              <IconButton 
                size="small" 
                color="info"
                onClick={() => handleOpenDialog(2)}
              >
                <HistoryIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="편집">
              <IconButton size="small" color="default">
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
      
      {/* 메모, 상담, 접촉 기록 다이얼로그 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {dialogTab === 0 ? '메모' : dialogTab === 1 ? '상담 기록' : '접촉 기록'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Tabs 
            value={dialogTab} 
            onChange={handleTabChange} 
            sx={{ mb: 2 }}
          >
            <Tab label="메모" icon={<NoteIcon />} iconPosition="start" />
            <Tab label="상담 기록" icon={<ChatIcon />} iconPosition="start" />
            <Tab label="접촉 기록" icon={<HistoryIcon />} iconPosition="start" />
          </Tabs>
          
          {/* 메모 탭 */}
          {dialogTab === 0 && (
            <>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="새 메모 작성..."
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <IconButton 
                  color="primary" 
                  onClick={handleAddMemo}
                  sx={{ ml: 1 }}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              
              <List>
                {records.memos.map((memo) => (
                  <ListItem key={memo.id} divider>
                    <ListItemText
                      primary={memo.content}
                      secondary={memo.date}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          
          {/* 상담 기록 탭 */}
          {dialogTab === 1 && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="상담 내용..."
                  value={newConsultation.content}
                  onChange={(e) => setNewConsultation({...newConsultation, content: e.target.value})}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TextField
                    select
                    label="결과"
                    value={newConsultation.result}
                    onChange={(e) => setNewConsultation({...newConsultation, result: e.target.value})}
                    variant="outlined"
                    size="small"
                    sx={{ width: '30%' }}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="긍정적">긍정적</option>
                    <option value="중립적">중립적</option>
                    <option value="부정적">부정적</option>
                  </TextField>
                  <IconButton 
                    color="primary" 
                    onClick={handleAddConsultation}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <List>
                {records.consultations.map((consultation) => (
                  <ListItem key={consultation.id} divider>
                    <ListItemText
                      primary={consultation.content}
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">{consultation.date}</Typography>
                          <Chip 
                            label={consultation.result} 
                            size="small" 
                            color={
                              consultation.result === '긍정적' ? 'success' : 
                              consultation.result === '부정적' ? 'error' : 'default'
                            }
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          
          {/* 접촉 기록 탭 */}
          {dialogTab === 2 && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                <TextField
                  select
                  label="접촉 유형"
                  value={newContact.type}
                  onChange={(e) => setNewContact({...newContact, type: e.target.value})}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="이메일">이메일</option>
                  <option value="전화">전화</option>
                  <option value="미팅">미팅</option>
                  <option value="메시지">메시지</option>
                </TextField>
                <Box sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    placeholder="접촉 내용..."
                    value={newContact.content}
                    onChange={(e) => setNewContact({...newContact, content: e.target.value})}
                    variant="outlined"
                    size="small"
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleAddContact}
                    sx={{ ml: 1 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <List>
                {records.contacts.map((contact) => (
                  <ListItem key={contact.id} divider>
                    <ListItemIcon>
                      {contact.type === '이메일' && <EmailIcon color="primary" />}
                      {contact.type === '전화' && <PhoneIcon color="success" />}
                      {contact.type === '미팅' && <BusinessIcon color="warning" />}
                      {contact.type === '메시지' && <ChatIcon color="info" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={contact.content}
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">{contact.date}</Typography>
                          <Chip 
                            label={contact.type} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BusinessCard; 