import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const Notes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 업무일지 목록 페이지로 리다이렉트
    navigate('/worklog');
  }, [navigate]);

  return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
};

export default Notes; 