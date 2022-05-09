/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:48:11
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-15 15:20:47
 * @content: 数据集创建页面
 */
import { Box, Button, Divider, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { styled, ThemeProvider } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import configUrlDark from "../assert/configdark.png";
import configUrl from "../assert/configwhite.png";
import descriptUrlDark from "../assert/descriptdark.png";
import descriptUrl from "../assert/descriptwhite.png";
import folderUrlDark from "../assert/folderdark.png";
import folderUrl from "../assert/folderwhite.png";
import reviewUrlDark from "../assert/reviewdark.png";
import reviewUrl from "../assert/reviewwhite.png";
import useStyles from '../common/styles';
import { createThemes } from '../common/theme';
import DescriptEdit from "../components/createDs/descriptEdit";
import DsReviews from "../components/createDs/dsReviews";
import FilesEdit from "../components/createDs/fileEdit";
import Footer from '../components/nav/footer';
import Header from '../components/nav/header';
import ManifestInfoEdit from "../components/createDs/manifestInfoEdit";
import { useSelector } from "../redux/hooks";
import { dictionary, createDataSet, } from "../store/actions/inSensitiveActions"
import { clearDatasetFilesCache } from "../store/actions/filesAndFoldersActions"
import { ManifestInfoFormValues } from "../common/interface"
import { useSnackbar } from 'notistack';
import { datasetById, datasetFavorate } from '../store/actions/dsExploreActions'
function CreateDataSet() {
  const classes = useStyles();
  const state = useLocation().state

  let navigate = useNavigate();
  const dispatch = useDispatch()
  const { dsDictionary, createFolderSuccess, errorMsg, datasetInfo } = useSelector((state) => state.inSensitive)
  const [manifest, setManifest] = React.useState<ManifestInfoFormValues>({});
  const [checked, setChecked] = React.useState(true);
  const [datasetId, setDatasetId] = React.useState(-1);
  const paramStepIndex = state ? state.paramStepIndex||0 : 0
  const [stepIndex, setStepIndex] = React.useState(paramStepIndex);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const createDs = () => {
    dispatch(createDataSet(manifest, 'create'))
  }
  useEffect(() => {
    if (paramStepIndex!==stepIndex) {
      setStepIndex(paramStepIndex)
    }
  }, [paramStepIndex])


  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const updateFormValue = (value) => {
    setManifest({ ...manifest, ...value })
    setTimeout(() => {
    }, 100)
  }

  useEffect(() => {
    if (typeof dsDictionary === 'undefined' || Object.keys(dsDictionary).length === 0) {
      dispatch(dictionary())
    }
    if (createFolderSuccess) {
      // setStepIndex(3)
      dispatch(datasetById(datasetInfo.id))
      navigate(`/create/${datasetInfo.id}`, { state: { ds:datasetInfo, branch: true,modified:true,paramStepIndex:3 } })
   
      enqueueSnackbar('created success', {
        variant: 'success',
        autoHideDuration: 3000,
      })
    }
    if (datasetInfo && typeof datasetInfo.id !== 'undefined') {
      setDatasetId(datasetInfo.id)
    }
  }, [dsDictionary, createFolderSuccess, datasetInfo])

  useEffect(() => {
    if (errorMsg) {
      enqueueSnackbar(errorMsg, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  }, [errorMsg])

  const onSubmit = () => {
  }

  return (
    <ThemeProvider theme={createThemes}>
      {/* <img src={imgURL} className={classes.searchBanner} /> */}
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0}
      >
        <Header styleTyle={1} />

        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1} className={classes.createBannerWrap}>
          <Typography variant="h4" gutterBottom
            className={classes.createTitle}>CREATE A NEW DATASET</Typography>
          {/* <CreateButton size="large">create</CreateButton> */}
        </Stack>
        <Paper elevation={Paper6} sx={{
          marginTop: -10,
          height: 128,
        }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              '& > :not(style)': {
                height: 128,
              },
              '& hr': {
                mx: 0.5,
                mb: 3,
              },
            }}
          >
            <Box component="div" className={stepIndex === 0 ? classes.createIndexActive : classes.createIndexNormal}
              onClick={() => {
                // setStepIndex(0)
              }}
            >
              <Stack direction="column"
                justifyContent="center"
                alignItems="center">
                <img src={stepIndex === 0 ? configUrl : configUrlDark} />
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 900, fontFamily: 'Verdana, sans-serif', }}> Config Information</Typography>
                <Typography variant="caption" gutterBottom component="div" sx={{ fontWeight: 100, fontFamily: 'Verdana, sans-serif', }}> dataSet basic params</Typography>
              </Stack>
            </Box>
            {stepIndex === 0 || stepIndex === 1 ? null : (<Divider orientation="vertical" className={classes.dividedVC} />)}
            <Box component="div" className={stepIndex === 1 ? classes.createIndexActive : classes.createIndexNormal}
              onClick={() => {
                // setStepIndex(1)
              }}>
              <Stack direction="column"
                justifyContent="center"
                alignItems="center">
                <img src={stepIndex === 1 ? descriptUrl : descriptUrlDark} />
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 900, fontFamily: 'Verdana, sans-serif', }}> Descripttion</Typography>
                <Typography variant="caption" gutterBottom component="div" sx={{ fontWeight: 100, fontFamily: 'Verdana, sans-serif', }}> dataSet basic params</Typography>
              </Stack>
            </Box>
            {stepIndex === 2 || stepIndex === 1 ? null : (<Divider orientation="vertical" className={classes.dividedVC} />)}
            <Box className={stepIndex === 2 ? classes.createIndexActive : classes.createIndexNormal}
              onClick={() => {
                // setStepIndex(2)
              }}>
              <Stack direction="column"
                justifyContent="center"
                alignItems="center">
                <img src={stepIndex === 2 ? reviewUrl : reviewUrlDark} />
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 900, fontFamily: 'Verdana, sans-serif', }}>Reviews </Typography>
                <Typography variant="caption" gutterBottom component="div" sx={{ fontWeight: 100, fontFamily: 'Verdana, sans-serif', }}> dataSet review </Typography>
              </Stack>
            </Box>
            {stepIndex === 2 || stepIndex === 3 ? null : (<Divider orientation="vertical" className={classes.dividedVC} />)}
            <Box className={stepIndex === 3 ? classes.createIndexActive : classes.createIndexNormal}
              onClick={() => {
                if (createFolderSuccess) {
                  setStepIndex(3)
                } else {
                  // enqueueSnackbar("Files and Folders can't be set before the dataset is created", {
                  //   variant: 'info',
                  //   autoHideDuration: 3000,
                  // })
                }
              }}>
              <Stack direction="column"
                justifyContent="center"
                alignItems="center">
                <img src={stepIndex === 3 ? folderUrl : folderUrlDark} />
                <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 900, fontFamily: 'Verdana, sans-serif', }}>Folders & Files </Typography>
                <Typography variant="caption" gutterBottom component="div" sx={{ fontWeight: 100, fontFamily: 'Verdana, sans-serif', }}> dataSet files content</Typography>

              </Stack>
            </Box>
          </Box>
        </Paper>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ marginTop: '50px', marginBottom: '50px' }}
          className={classes.list}
        >
          {stepIndex === 0 ? (<ManifestInfoEdit updateFormValue={updateFormValue} manifest={manifest} dsDictionary={dsDictionary} currentStepIndex={stepIndex} stepIndex={0} next={() => { setStepIndex(1) }} />) :
            stepIndex === 1 ? (<DescriptEdit manifest={manifest} updateFormValue={updateFormValue}
              currentStepIndex={stepIndex} stepIndex={1} next={() => { setStepIndex(2) }} back={() => { setStepIndex(0) }} />) :
              stepIndex === 2 ? (<DsReviews manifest={manifest} dsDictionary={dsDictionary} currentStepIndex={stepIndex} stepIndex={2}
                buttonStr={'create'}
                back={() => { setStepIndex(1) }} create={createDs} />) :
                (<FilesEdit currentStepIndex={stepIndex}
                  datasetId={datasetId}
                  stepIndex={3} skip={() => {
                    // navigate(`/dataset/465`)
                    dispatch(clearDatasetFilesCache())
                    navigate(`/dataset/${datasetId}`)
                  }} done={() => {
                    dispatch(clearDatasetFilesCache())
                    navigate(`/dataset/${datasetId}`)
                  }} />)}


        </Stack>

      </Stack>
      <Footer />
    </ThemeProvider>
  )
}

const mapStateToProps = (state) => ({ createDs: state.inSensitive })

export default connect(mapStateToProps, {})(CreateDataSet)
