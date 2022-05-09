/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-24 15:01:43
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-01-07 15:42:10
 * @content: edit your page content
 */
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {deepOrange,green,grey,cyan,indigo,purple,lightGreen,yellow,common,lightBlue} from '@mui/material/colors'
import { styled } from '@mui/material/styles';
export const Themes =  createTheme ({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    palette:{
        primary:{
            main:indigo[500],
        }
    }
})

export const createThemes =  createTheme ({
  palette:{
      secondary:{
          main:common['white'],
      }
  }
})

export const dsTheme =  createTheme ({
  palette:{
    primary:{
      main:'#192b6b',
    },
      secondary:{
          main:indigo[500],
      }
  }
})


export const Root = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      backgroundColor: theme.palette.secondary.main,
    },
    [theme.breakpoints.up('sm')]: {
      backgroundColor:purple[300],
    },
    [theme.breakpoints.up('lg')]: {
      backgroundColor: green[500],
    },
    [theme.breakpoints.up('xl')]: {
        backgroundColor: green[10],
      },
  }));