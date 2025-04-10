import React, { useState, useMemo, useCallback } from 'react';
import {
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  Tooltip,
  Paper,
  IconButton,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import BusinessCard from '../components/cards/BusinessCard';

// 고객 분류 단계 정의
const LEAD_TYPES = {
  COLD: { label: 'Cold Leads', color: 'info', description: '우리 제품/브랜드를 잘 모름, 연락처만 확보된 상태' },
  WARM: { label: 'Warm Leads', color: 'warning', description: '일정 관심 표현, 문의/자료 요청 등 일부 행동' },
  HOT: { label: 'Hot Leads', color: 'error', description: '구매 의사 확실, 예산/타이밍/결정권 보유' },
};

// BANT 평가 기준 정의
const BANT_CRITERIA = {
  BUDGET: { label: '예산', icon: '💰', description: '예산이 확보되어 있는가?' },
  AUTHORITY: { label: '의사결정권', icon: '👤', description: '구매 결정을 할 수 있는 사람인가?' },
  NEED: { label: '필요성', icon: '❓', description: '우리 제품이 해결할 수 있는 문제나 니즈가 있는가?' },
  TIMELINE: { label: '시기', icon: '📅', description: '구매 결정이 언제쯤 이뤄지는가?' },
};

// 리드 스코어링 기준
const LEAD_SCORING = {
  WEBSITE_VISIT: { points: 10, label: '웹사이트 방문' },
  QUOTE_REQUEST: { points: 20, label: '견적 요청' },
  DECISION_MAKER: { points: 30, label: '결정자임' },
  NO_BUDGET: { points: -10, label: '예산 없음' },
};

// 테스트 데이터
const testCards = [
  {
    id: 1,
    name: '김철수',
    position: '대표이사',
    company: '테크스타트',
    companyLogo: 'https://via.placeholder.com/150?text=TechStart',
    phone: '010-1234-5678',
    email: 'kim@techstart.com',
    address: '서울시 강남구 테헤란로 123',
    tags: ['IT', '스타트업', '투자', '구매검토중', '예산확보', '결정자접촉중', '웹사이트방문'],
    team: '경영진',
  },
  {
    id: 2,
    name: '이영희',
    position: '마케팅팀장',
    company: '마케팅프로',
    companyLogo: 'https://via.placeholder.com/150?text=MarketingPro',
    phone: '010-2345-6789',
    email: 'lee@marketingpro.com',
    address: '서울시 서초구 반포대로 456',
    tags: ['마케팅', '브랜딩', '상담희망', '문의완료', '견적받음'],
    team: '마케팅팀',
  },
  {
    id: 3,
    name: '박지성',
    position: '개발팀장',
    company: '테크솔루션',
    companyLogo: 'https://via.placeholder.com/150?text=TechSolution',
    phone: '010-3456-7890',
    email: 'park@techsolution.com',
    address: '서울시 송파구 올림픽로 789',
    tags: ['개발', 'AI', '클라우드', '리스트만_있는', 'DM만보냄'],
    team: '개발팀',
  },
  {
    id: 4,
    name: '최수진',
    position: '디자인팀장',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-4567-8901',
    email: 'choi@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', 'UI/UX', '자료요청', '예산없음'],
    team: '디자인팀',
  },
  {
    id: 5,
    name: '정민준',
    position: '개발자',
    company: '테크스타트',
    companyLogo: 'https://via.placeholder.com/150?text=TechStart',
    phone: '010-5678-9012',
    email: 'jung@techstart.com',
    address: '서울시 강남구 테헤란로 123',
    tags: ['개발', '프론트엔드', '첫접촉대기'],
    team: '개발팀',
  },
  {
    id: 6,
    name: '한지은',
    position: '디자이너',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-6789-0123',
    email: 'han@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', '그래픽', '상담희망'],
    team: '디자인팀',
  },
  {
    id: 7,
    name: '송민재',
    position: '마케터',
    company: '마케팅프로',
    companyLogo: 'https://via.placeholder.com/150?text=MarketingPro',
    phone: '010-7890-1234',
    email: 'song@marketingpro.com',
    address: '서울시 서초구 반포대로 456',
    tags: ['마케팅', '소셜미디어', '구매검토중', '결정자접촉중'],
    team: '마케팅팀',
  },
  {
    id: 8,
    name: '강현우',
    position: '개발자',
    company: '테크솔루션',
    companyLogo: 'https://via.placeholder.com/150?text=TechSolution',
    phone: '010-8901-2345',
    email: 'kang@techsolution.com',
    address: '서울시 송파구 올림픽로 789',
    tags: ['개발', '백엔드', '문의완료', '예산없음'],
    team: '개발팀',
  },
  {
    id: 9,
    name: '임서연',
    position: '디자이너',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-9012-3456',
    email: 'lim@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', 'UI/UX', '첫접촉대기'],
    team: '디자인팀',
  },
  {
    id: 10,
    name: '윤도현',
    position: '개발팀장',
    company: '테크스타트',
    companyLogo: 'https://via.placeholder.com/150?text=TechStart',
    phone: '010-0123-4567',
    email: 'yoon@techstart.com',
    address: '서울시 강남구 테헤란로 123',
    tags: ['개발', 'AI', '구매검토중', '예산확보'],
    team: '개발팀',
  },
  {
    id: 11,
    name: '박지훈',
    position: '마케팅팀장',
    company: '마케팅프로',
    companyLogo: 'https://via.placeholder.com/150?text=MarketingPro',
    phone: '010-1234-5678',
    email: 'park@marketingpro.com',
    address: '서울시 서초구 반포대로 456',
    tags: ['마케팅', '소셜미디어', '상담희망', '문의완료'],
    team: '마케팅팀',
  },
  {
    id: 12,
    name: '김수아',
    position: '디자이너',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-2345-6789',
    email: 'kim@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', '그래픽', '자료요청', '견적받음'],
    team: '디자인팀',
  },
  {
    id: 13,
    name: '이준호',
    position: '개발자',
    company: '테크솔루션',
    companyLogo: 'https://via.placeholder.com/150?text=TechSolution',
    phone: '010-3456-7890',
    email: 'lee@techsolution.com',
    address: '서울시 송파구 올림픽로 789',
    tags: ['개발', '프론트엔드', '리스트만_있는', 'DM만보냄'],
    team: '개발팀',
  },
  {
    id: 14,
    name: '최유진',
    position: '마케터',
    company: '마케팅프로',
    companyLogo: 'https://via.placeholder.com/150?text=MarketingPro',
    phone: '010-4567-8901',
    email: 'choi@marketingpro.com',
    address: '서울시 서초구 반포대로 456',
    tags: ['마케팅', '소셜미디어', '첫접촉대기'],
    team: '마케팅팀',
  },
  {
    id: 15,
    name: '정태민',
    position: '개발자',
    company: '테크스타트',
    companyLogo: 'https://via.placeholder.com/150?text=TechStart',
    phone: '010-5678-9012',
    email: 'jung@techstart.com',
    address: '서울시 강남구 테헤란로 123',
    tags: ['개발', '백엔드', '상담희망', '문의완료'],
    team: '개발팀',
  },
  {
    id: 16,
    name: '한소연',
    position: '디자이너',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-6789-0123',
    email: 'han@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', 'UI/UX', '구매검토중', '결정자접촉중'],
    team: '디자인팀',
  },
  {
    id: 17,
    name: '송소연',
    position: '개발팀장',
    company: '테크솔루션',
    companyLogo: 'https://via.placeholder.com/150?text=TechSolution',
    phone: '010-7890-1234',
    email: 'song@techsolution.com',
    address: '서울시 송파구 올림픽로 789',
    tags: ['개발', '프론트엔드', '구매검토중', '결정자접촉중'],
    team: '개발팀',
  },
  {
    id: 18,
    name: '강현우',
    position: '마케터',
    company: '마케팅프로',
    companyLogo: 'https://via.placeholder.com/150?text=MarketingPro',
    phone: '010-8901-2345',
    email: 'kang@marketingpro.com',
    address: '서울시 서초구 반포대로 456',
    tags: ['마케팅', '소셜미디어', '예산없음'],
    team: '마케팅팀',
  },
  {
    id: 19,
    name: '임지민',
    position: '디자이너',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-9012-3456',
    email: 'lim@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', 'UI/UX', '자료요청', '견적받음'],
    team: '디자인팀',
  },
  {
    id: 20,
    name: '윤준호',
    position: '개발자',
    company: '테크스타트',
    companyLogo: 'https://via.placeholder.com/150?text=TechStart',
    phone: '010-0123-4567',
    email: 'yoon@techstart.com',
    address: '서울시 강남구 테헤란로 123',
    tags: ['개발', '백엔드', '리스트만_있는', 'DM만보냄'],
    team: '개발팀',
  },
  {
    id: 21,
    name: '박도현',
    position: '마케팅팀장',
    company: '마케팅프로',
    companyLogo: 'https://via.placeholder.com/150?text=MarketingPro',
    phone: '010-1234-5678',
    email: 'park@marketingpro.com',
    address: '서울시 서초구 반포대로 456',
    tags: ['마케팅', '소셜미디어', '상담희망', '문의완료'],
    team: '마케팅팀',
  },
  {
    id: 22,
    name: '김지훈',
    position: '디자이너',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-2345-6789',
    email: 'kim@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', 'UI/UX', '구매검토중', '예산확보'],
    team: '디자인팀',
  },
  {
    id: 23,
    name: '이수아',
    position: '개발자',
    company: '테크솔루션',
    companyLogo: 'https://via.placeholder.com/150?text=TechSolution',
    phone: '010-3456-7890',
    email: 'lee@techsolution.com',
    address: '서울시 송파구 올림픽로 789',
    tags: ['개발', '백엔드', '결정자접촉중', '웹사이트방문'],
    team: '개발팀',
  },
  {
    id: 24,
    name: '최준호',
    position: '마케터',
    company: '마케팅프로',
    companyLogo: 'https://via.placeholder.com/150?text=MarketingPro',
    phone: '010-4567-8901',
    email: 'choi@marketingpro.com',
    address: '서울시 서초구 반포대로 456',
    tags: ['마케팅', '브랜딩', '자료요청', '견적받음'],
    team: '마케팅팀',
  },
  {
    id: 25,
    name: '정유진',
    position: '개발자',
    company: '테크스타트',
    companyLogo: 'https://via.placeholder.com/150?text=TechStart',
    phone: '010-5678-9012',
    email: 'jung@techstart.com',
    address: '서울시 강남구 테헤란로 123',
    tags: ['개발', 'AI', '첫접촉대기'],
    team: '개발팀',
  },
  {
    id: 26,
    name: '한태민',
    position: '디자이너',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-6789-0123',
    email: 'han@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', '그래픽', '상담희망', '문의완료'],
    team: '디자인팀',
  },
  {
    id: 27,
    name: '송소연',
    position: '개발팀장',
    company: '테크솔루션',
    companyLogo: 'https://via.placeholder.com/150?text=TechSolution',
    phone: '010-7890-1234',
    email: 'song@techsolution.com',
    address: '서울시 송파구 올림픽로 789',
    tags: ['개발', '프론트엔드', '구매검토중', '결정자접촉중'],
    team: '개발팀',
  },
  {
    id: 28,
    name: '강현우',
    position: '마케터',
    company: '마케팅프로',
    companyLogo: 'https://via.placeholder.com/150?text=MarketingPro',
    phone: '010-8901-2345',
    email: 'kang@marketingpro.com',
    address: '서울시 서초구 반포대로 456',
    tags: ['마케팅', '소셜미디어', '예산없음'],
    team: '마케팅팀',
  },
  {
    id: 29,
    name: '임지민',
    position: '디자이너',
    company: '디자인하우스',
    companyLogo: 'https://via.placeholder.com/150?text=DesignHouse',
    phone: '010-9012-3456',
    email: 'lim@designhouse.com',
    address: '서울시 마포구 와우산로 321',
    tags: ['디자인', 'UI/UX', '자료요청', '견적받음'],
    team: '디자인팀',
  },
  {
    id: 30,
    name: '윤준호',
    position: '개발자',
    company: '테크스타트',
    companyLogo: 'https://via.placeholder.com/150?text=TechStart',
    phone: '010-0123-4567',
    email: 'yoon@techstart.com',
    address: '서울시 강남구 테헤란로 123',
    tags: ['개발', '백엔드', '리스트만_있는', 'DM만보냄'],
    team: '개발팀',
  }
];

const GroupCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedLeadType, setSelectedLeadType] = useState('all');
  const [showLeadInfo, setShowLeadInfo] = useState(true);
  const [showTagInfo, setShowTagInfo] = useState(true);
  const [showScoringInfo, setShowScoringInfo] = useState(false);

  // 리드 타입 결정 (태그 기반)
  const getLeadType = (card) => {
    if (card.tags.some(tag => ['구매검토중', '예산확보', '결정자접촉중'].includes(tag))) {
      return LEAD_TYPES.HOT;
    } else if (card.tags.some(tag => ['상담희망', '문의완료', '자료요청', '견적받음'].includes(tag))) {
      return LEAD_TYPES.WARM;
    } else {
      return LEAD_TYPES.COLD;
    }
  };

  // 리드 스코어 계산
  const calculateLeadScore = useCallback((card) => {
    let score = 0;
    
    // 기본 점수 (리드 타입에 따라)
    const leadType = getLeadType(card);
    if (leadType === LEAD_TYPES.HOT) score += 50;
    else if (leadType === LEAD_TYPES.WARM) score += 30;
    else score += 10;
    
    // 태그 기반 점수
    if (card.tags.includes('웹사이트방문')) score += LEAD_SCORING.WEBSITE_VISIT.points;
    if (card.tags.includes('견적받음')) score += LEAD_SCORING.QUOTE_REQUEST.points;
    if (card.tags.includes('결정자접촉중')) score += LEAD_SCORING.DECISION_MAKER.points;
    if (card.tags.includes('예산없음')) score += LEAD_SCORING.NO_BUDGET.points;
    
    // 최소 0, 최대 100으로 제한
    return Math.max(0, Math.min(100, score));
  }, []);

  // 회사별로 카드 그룹화
  const groupedCards = useMemo(() => {
    const filteredCards = testCards.filter(card => {
      // 검색어 필터링
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 태그 필터링
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => card.tags.includes(tag));
      
      // 리드 타입 필터링
      const leadType = getLeadType(card);
      const matchesLeadType = selectedLeadType === 'all' || 
                             (selectedLeadType === 'cold' && leadType === LEAD_TYPES.COLD) ||
                             (selectedLeadType === 'warm' && leadType === LEAD_TYPES.WARM) ||
                             (selectedLeadType === 'hot' && leadType === LEAD_TYPES.HOT);
      
      return matchesSearch && matchesTags && matchesLeadType;
    });

    // 정렬
    const sortedCards = [...filteredCards].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      } else if (sortBy === 'position') {
        return a.position.localeCompare(b.position);
      } else if (sortBy === 'leadScore') {
        return calculateLeadScore(b) - calculateLeadScore(a);
      } else if (sortBy === 'leadType') {
        const leadTypeA = getLeadType(a);
        const leadTypeB = getLeadType(b);
        const leadTypeOrder = { [LEAD_TYPES.HOT.label]: 0, [LEAD_TYPES.WARM.label]: 1, [LEAD_TYPES.COLD.label]: 2 };
        return leadTypeOrder[leadTypeA.label] - leadTypeOrder[leadTypeB.label];
      }
      return 0;
    });

    // 회사별로 그룹화
    const grouped = sortedCards.reduce((acc, card) => {
      if (!acc[card.company]) {
        acc[card.company] = {
          company: card.company,
          logo: card.companyLogo,
          cards: []
        };
      }
      acc[card.company].cards.push(card);
      return acc;
    }, {});

    // 회사 이름으로 정렬
    return Object.values(grouped).sort((a, b) => a.company.localeCompare(b.company));
  }, [searchTerm, selectedTags, sortBy, selectedLeadType, calculateLeadScore]);

  // 팀별로 카드 그룹화
  const groupedTeamCards = useMemo(() => {
    const filteredCards = testCards.filter(card => {
      // 검색어 필터링
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 태그 필터링
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => card.tags.includes(tag));
      
      // 리드 타입 필터링
      const leadType = getLeadType(card);
      const matchesLeadType = selectedLeadType === 'all' || 
                             (selectedLeadType === 'cold' && leadType === LEAD_TYPES.COLD) ||
                             (selectedLeadType === 'warm' && leadType === LEAD_TYPES.WARM) ||
                             (selectedLeadType === 'hot' && leadType === LEAD_TYPES.HOT);
      
      return matchesSearch && matchesTags && matchesLeadType;
    });

    // 정렬
    const sortedCards = [...filteredCards].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      } else if (sortBy === 'position') {
        return a.position.localeCompare(b.position);
      } else if (sortBy === 'leadScore') {
        return calculateLeadScore(b) - calculateLeadScore(a);
      } else if (sortBy === 'leadType') {
        const leadTypeA = getLeadType(a);
        const leadTypeB = getLeadType(b);
        const leadTypeOrder = { [LEAD_TYPES.HOT.label]: 0, [LEAD_TYPES.WARM.label]: 1, [LEAD_TYPES.COLD.label]: 2 };
        return leadTypeOrder[leadTypeA.label] - leadTypeOrder[leadTypeB.label];
      }
      return 0;
    });

    // 팀별로 그룹화
    const grouped = sortedCards.reduce((acc, card) => {
      if (!acc[card.team]) {
        acc[card.team] = {
          team: card.team,
          cards: []
        };
      }
      acc[card.team].cards.push(card);
      return acc;
    }, {});

    // 팀 이름으로 정렬
    return Object.values(grouped).sort((a, b) => a.team.localeCompare(b.team));
  }, [searchTerm, selectedTags, sortBy, selectedLeadType, calculateLeadScore]);

  // 모든 태그 추출
  const allTags = useMemo(() => {
    return [...new Set(testCards.flatMap(card => card.tags))];
  }, []);

  // 회사 아코디언 토글 핸들러
  const handleAccordionChange = (company) => (event, isExpanded) => {
    setExpandedCompany(isExpanded ? company : null);
  };

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 리드 타입 필터 핸들러
  const handleLeadTypeFilter = (type) => {
    setSelectedLeadType(type);
  };

  // 리드 타입 정보 토글 핸들러
  const handleLeadInfoToggle = () => {
    setShowLeadInfo(!showLeadInfo);
  };

  // 태그 정보 토글 핸들러
  const handleTagInfoToggle = () => {
    setShowTagInfo(!showTagInfo);
  };

  // 스코어링 정보 토글 핸들러
  const handleScoringInfoToggle = () => {
    setShowScoringInfo(!showScoringInfo);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        명함첩
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="명함첩 탭">
          <Tab label="내 명함첩" />
          <Tab label="팀 명함첩" />
        </Tabs>
      </Box>

      {/* 리드 타입 필터 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>
            고객 분류 필터:
          </Typography>
          <Tooltip title="고객 분류 기준 정보">
            <IconButton size="small" onClick={handleLeadInfoToggle}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <ButtonGroup variant="outlined" aria-label="고객 분류 필터">
          <Button 
            onClick={() => handleLeadTypeFilter('all')}
            variant={selectedLeadType === 'all' ? 'contained' : 'outlined'}
          >
            전체
          </Button>
          <Button 
            onClick={() => handleLeadTypeFilter('hot')}
            variant={selectedLeadType === 'hot' ? 'contained' : 'outlined'}
            color="error"
          >
            Hot Leads
          </Button>
          <Button 
            onClick={() => handleLeadTypeFilter('warm')}
            variant={selectedLeadType === 'warm' ? 'contained' : 'outlined'}
            color="warning"
          >
            Warm Leads
          </Button>
          <Button 
            onClick={() => handleLeadTypeFilter('cold')}
            variant={selectedLeadType === 'cold' ? 'contained' : 'outlined'}
            color="info"
          >
            Cold Leads
          </Button>
        </ButtonGroup>
      </Box>

      {/* 고객 분류 정보 팝업 */}
      {showLeadInfo && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              고객 분류 기준 (Leads)
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(LEAD_TYPES).map(([key, value]) => (
                <Grid item xs={12} md={4} key={key}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" color={`${value.color}.main`}>{value.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              BANT 평가 기준
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              BANT는 잠재 고객의 구매 가능성을 평가하는 영업 프레임워크로, 다음 네 가지 요소를 확인합니다:
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(BANT_CRITERIA).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                      {value.icon}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle2">{value.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.description}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleLeadInfoToggle}>
              닫기
            </Button>
          </Box>
        </Paper>
      )}

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="이름 또는 회사명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>정렬 기준</InputLabel>
              <Select
                value={sortBy}
                label="정렬 기준"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">이름순</MenuItem>
                <MenuItem value="company">회사순</MenuItem>
                <MenuItem value="position">직책순</MenuItem>
                <MenuItem value="leadScore">리드 스코어순</MenuItem>
                <MenuItem value="leadType">고객 분류순</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ mr: 1 }}>
              태그 필터:
            </Typography>
            <Tooltip title="태그 필터 정보">
              <IconButton size="small" onClick={handleTagInfoToggle}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {allTags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => {
                  setSelectedTags(prev =>
                    prev.includes(tag)
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  );
                }}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* 태그 필터 정보 팝업 */}
      {showTagInfo && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            태그 필터 사용 방법
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            태그는 고객의 특성, 산업, 상태 등을 나타내는 키워드입니다. 태그를 클릭하여 필터링할 수 있습니다.
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>고객 상태 태그</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip size="small" label="구매검토중" color="error" />
                  <Chip size="small" label="예산확보" color="error" />
                  <Chip size="small" label="결정자접촉중" color="error" />
                  <Chip size="small" label="상담희망" color="warning" />
                  <Chip size="small" label="문의완료" color="warning" />
                  <Chip size="small" label="자료요청" color="warning" />
                  <Chip size="small" label="견적받음" color="warning" />
                  <Chip size="small" label="리스트만_있는" color="info" />
                  <Chip size="small" label="DM만보냄" color="info" />
                  <Chip size="small" label="첫접촉대기" color="info" />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>산업/직무 태그</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip size="small" label="IT" />
                  <Chip size="small" label="개발" />
                  <Chip size="small" label="마케팅" />
                  <Chip size="small" label="디자인" />
                  <Chip size="small" label="스타트업" />
                  <Chip size="small" label="AI" />
                  <Chip size="small" label="프론트엔드" />
                  <Chip size="small" label="백엔드" />
                  <Chip size="small" label="UI/UX" />
                </Box>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>태그 사용 팁</Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  여러 태그를 선택하면 모든 태그를 포함하는 고객만 표시됩니다(AND 검색).
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  고객 상태 태그는 자동으로 고객 분류(Hot/Warm/Cold Leads)와 연결됩니다.
                </Typography>
              </li>
            </ul>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleTagInfoToggle}>
              닫기
            </Button>
          </Box>
        </Paper>
      )}

      {tabValue === 0 ? (
        // 회사별 보기
        <Box sx={{ mt: 4 }}>
          {groupedCards.map((group) => (
            <Accordion 
              key={group.company}
              expanded={expandedCompany === group.company}
              onChange={handleAccordionChange(group.company)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${group.company}-content`}
                id={`${group.company}-header`}
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {group.logo ? (
                    <Box
                      component="img"
                      src={group.logo}
                      alt={`${group.company} 로고`}
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        mr: 2,
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        mr: 2,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {group.company.charAt(0)}
                    </Box>
                  )}
                  <Typography variant="h6">
                    {group.company} ({group.cards.length}명)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  {group.cards.map(card => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                      <BusinessCard card={card} />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        // 팀별 보기
        <Box sx={{ mt: 4 }}>
          {groupedTeamCards.map((group) => (
            <Accordion 
              key={group.team}
              expanded={expandedCompany === group.team}
              onChange={handleAccordionChange(group.team)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${group.team}-content`}
                id={`${group.team}-header`}
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      mr: 2,
                      bgcolor: 'secondary.main',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {group.team.charAt(0)}
                  </Box>
                  <Typography variant="h6">
                    {group.team} ({group.cards.length}명)
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  {group.cards.map(card => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                      <BusinessCard card={card} />
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GroupCards; 