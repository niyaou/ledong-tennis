/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:48:11
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-09 10:38:48
 * @content: 数据集创建页面
 */
import { AccountCircle } from '@mui/icons-material';
import HttpsIcon from '@mui/icons-material/Https';
import { Button, Card, CardMedia, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import { Field, Form } from 'react-final-form';
import { connect, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import bg from '../assert/bg.png';
import loginImgURL from '../assert/ios.jpg';
import imgURL from '../assert/logo2.png';
import { useSelector } from "../redux/hooks";
import { directToPage, login } from '../store/actions/usersActions';
import { UserFormValues} from '../common/interface'

import { useSnackbar } from 'notistack';

const useStyles = makeStyles({
  root: {
    // background: 'linear-gradient(45deg, rgb(251,250,255) 30%, rgb(240,250,255) 90%)',
    backgroundImage: bg,
    height: '100vh',
  },
  img: {
    width: 200,
    paddingBottom: 50,
  },
  banner: {
  },
  bg: {
    width: '100%',
    position: 'absolute',
    height: '100%',
    top: 0,
    zIndex: -10,
  }
});

const baseTheme = createTheme({
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
});


// const { Form } = withTypes<FormValues>();

const TextFieldAdapter = ({ input, meta, ...rest }) => {
  
  return (
    <TextField
      {...input}
      {...rest}
      />)
    }


const renderInput = ({
  meta: { touched, error } = { touched: false, error: undefined },
  input: { ...inputProps },
  ...props
}) => (
  <TextField
    error={!!(touched && error)}
    helperText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
  />
);



const LoginPage = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  let navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";
  const dispatch = useDispatch()



  const onSubmit = (auth: UserFormValues) => {
    dispatch(login(auth))
  }
  const user = useSelector((state) => state.users)

  useEffect(() => {
    if (!user.isDirectToDomanitaion && user.userInfo && user.userInfo.token && user.userInfo.token.length > 0) {
      dispatch(directToPage())
      navigate(from, { replace: true });
    }
    if(user.loadError){
      enqueueSnackbar(user.errorMsg,{ 
        variant: 'warning',
        autoHideDuration:3000,
    });
    }

  }, [user])


  return (

    <ThemeProvider
      theme={{
        baseTheme
      }}
    >
      <img src={bg} className={classes.bg} />
      <Stack className={classes.root}
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Link to='/'>
          {/* <img src={imgURL} className={classes.img} /> */}
        </Link>
        <Card sx={{ display: 'flex' }}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <Stack
                direction="column"
                justifyContent="space-evenly"
                alignItems="stretch">
                <form onSubmit={handleSubmit} >
                  <Stack
                    direction="column"
                    justifyContent="space-evenly"
                    alignItems="stretch"
                    sx={{ width: 300, paddingLeft: 10, height: '50%', marginTop: '7%' }}
                    spacing={3}>
                    <Typography variant="caption" display="block" gutterBottom>
                      welcom to
                      <Typography variant="button" display="block" gutterBottom>
                        Ledong Tennis
                      </Typography>
                    </Typography >
                    <Field
                      name="username"
                      label="uid"
                      component={TextFieldAdapter}
                      id="input-with-icon-adornment"
                      size="small"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Field
                      name="password"
                      label="password"
                      type="password"
                      component={TextFieldAdapter}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HttpsIcon />
                          </InputAdornment>
                        ),
                      }}
                    >
      
                    </Field>
                    <Button variant="contained" type="submit" >Login</Button>
                  </Stack>
                </form>
              </Stack>
            )} />

          {/* </Form> */}


          <CardMedia
            component="img"
            image={loginImgURL}
            sx={{ width: 400, height: 400 }}
          />

        </Card>
        <Typography variant="overline" display="block" gutterBottom>pangooDM @ 2022 All rights reserved desay-sv CT_AML_DS</Typography>
      </Stack>

    </ThemeProvider>
  )
}

const mapStateToProps = (state) => ({ users: state.users })
export default connect(mapStateToProps, { login })(LoginPage)