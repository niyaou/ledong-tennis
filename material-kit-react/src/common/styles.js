/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-23 20:31:16
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-11 11:31:25
 * @content: edit your page content
 */
import { makeStyles, createStyles } from '@mui/styles';
import imgUrl from '../assert/ivvi6.jpg'
import auditUrl from '../assert/banner2.jpg'
import createImgUrl from '../assert/create-banner2.jpg'

const useStyles = makeStyles((theme)=>({
  root: {
    background: 'rgb(251,252,254)'
  },
  listContent: {
    background: 'rgb(255,255,255)',
  },
  list: {
    width: '70%'
  },
  img: {
    width: 200,
  },
  userName: {
    color: 'rgb(128,128,192)',
  },
  explore: {
    color: '#2e3457',
  },
  globalMarginTop: {
    marginTop: '2%'
  },
  dsMarginTop: {
    marginTop: '3%'
  },
  title: {
    color: '#2e3457',
    marginTop: '2%'
  },
  createTitle: {
    color: 'white',
    fontFamily: ' Verdana , sans-serif !important',
    fontWeight: 'bolder !important',
  },
  searchBannerWrap: {
    height: '20rem',
    width: '100%',
    backgroundImage: `url(${imgUrl})`,
  },
  auditBannerWrap: {
    height: '20rem',
    width: '100%',
    backgroundImage: `url(${auditUrl})`,
  },
  createBannerWrap: {
    height: '23rem',
    width: '100%',
    backgroundImage: `url(${createImgUrl})`,
    backgroundPosition: 'center',
  },
  searchBanner: {
    width: '100%',
    height: '30rem',
    objectFit: 'cover',
    objectPosition: '0% 12%',
    position: 'absolute,'
  },
  divided: {
    marginTop: '3rem !important',
    marginBottom: '1rem !important',
  },
  dividedVC: {
    height: '50px !important',
    alignSelf: 'center',
    marginBottom: '30px'
  },
  subtitle: {
    color: 'rgb(118,118,118)',
    fontFamily: 'Trebuchet MS, sans-serif',
  },
  imgDetail: {
    width: 600,
  },
  navBar: {
    width: '97%',
  
  },
  navBar2: {
    width: '97%',
   
  },
  content: {
    width: '100%',
    marginTop: '0%',
    height: '95vh',
  },
  bottom: {
    background: 'linear-gradient(180deg, rgb(129,153,202) 0%, rgb(94,123,182) 100%)',
    width: '100%',
    height: '50vh',
    color: '#fff',
    fontFamily:
      'Trebuchet MS, sans-serif',
  },
  createIndexNormal: {
    color: '#0080aa',
    background: 'white',
    '& > :not(style)': {
      height: '100%',
      width: 180,
    },
    cursor: 'pointer'
  },
  createIndexActive: {
    background: '#005d9a',
    height: '168px !important', marginTop: '-20px', borderRadius: '5px', '& > :not(style)': {
      width: 180,
      height: '100%',
    },
    cursor: 'pointer',
    fontFamily: 'Verdana, sans-serif', color: 'white'
  },
  dsTitle: {
    fontFamily: 'Tahoma, sans-serif',
  },
  backdropDisplay: {
    left: '30%',
    position: 'absolute',
    top: '50%',
    opacity: 0.5
  },
  appBarCustom: {
    '&.MuiAppBar-root': {boxShadow: 'none',color:'#ccc'},
    '&.MuiAppBar-colorPrimary': { backgroundColor: "#fff" },
    '&:hover': {
      backgroundColor: '#fff',
    }
  },
  appBarTitleCustom: {
    width:'100vw',
    color:'#ccc',
    textAlign: 'center',
    '&:hover': {
      color:'gray'
    },
    transition:theme.transitions.create(['color'])
  },
  listActiveText: {
   '& .MuiListItemText-secondary':{   color:'#6cabdc'}
  },
  listText: {
    '& .MuiListItemText-secondary':{   color:'#707070'}
   },
   copyrights: {
    color:'#707070',
    background:'#fff !important',
    '& .MuiTypography-root':{   color:'#555500'}
   },
}));


export default useStyles;