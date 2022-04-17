// material
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
// components
import { Outlet,Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

// ----------------------------------------------------------------------
const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0)
  }
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  const navigate = useNavigate();


  useEffect(() => {
    const key = localStorage.getItem('jwt');
  console.log(key)
  if (!key) {
    navigate('/login');
  }
  }, [])

  return (
    <>
      <HeaderStyle>
        <Logo />
      </HeaderStyle>
      <Outlet />
    </>
  );
}
