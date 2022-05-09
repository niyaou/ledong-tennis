/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-28 15:57:46
 * @content: edit your page content
 */
import { Button, Card, Fade, Box, CardMedia, FormControl, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, CardActions, CardContent, Container, Grow } from '@mui/material';
import React, { useEffect } from 'react';
import { Field, Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import ReactWEditor from 'wangeditor-for-react';
import Draggable, { DraggableCore } from 'react-draggable';
import FsResourceManagement from './fsResourseManagement'
import DataFolderExplore from '../fileExplore/folderExploreComponent'
import { find } from 'lodash'
import Collapse from '@mui/material/Collapse';
interface FormValues {
  username?: string;
  password?: string;
}
function DsReviews(props) {
  const buttonStr = props.buttonStr
  const create = props.create
  const back = props.back
  const stepIndex = props.stepIndex
  const currentStepIndex = props.currentStepIndex
  const checked = stepIndex === currentStepIndex
  const { dataType, labelType, taskType, usedScene } = props.dsDictionary
  const [isExpanded, setIsExpanded] = React.useState(false);
  // const { } = props.manifest


  const parseDictionary = (dict, ids) => {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    let result = ''
    ids.map((id, i) => {
      let item = find(dict, { 'id': id })
      let t = result === '' ? '' : ','
      result += (t + typeof item !== 'undefined' ? (item.name+'\n') : '')
    })
    return result
  }
  const onSubmit = (auth: FormValues) => {
  }
  const [descript, setDescript] = React.useState<string>(props.manifest.dataSetDescribe || '');


  const description = (<Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="center"
    sx={{ width: 1100 }}
  >
    <Button disabled variant='outlined' fullWidth>Description</Button>
    <Card sx={{ width: 1100 }}>
      <CardContent>

        <Collapse in={isExpanded} collapsedSize={500}>
          <span dangerouslySetInnerHTML={{ __html: descript }} />
        </Collapse>
        <Button variant="text" fullWidth type="submit" color="secondary" sx={{ color: 'rgba(0, 0, 0, 0.26)' }} onClick={() => {
          setIsExpanded(!isExpanded);
        }}>{isExpanded ? 'collapse' : 'expand'}</Button>
      </CardContent>
    </Card>
  </Stack>)

  const card = (
    <React.Fragment >
      <CardContent >
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        spacing={1}
        >
          <Typography variant="subtitle1" component="div">
            Permission
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" >
            {parseDictionary([{ id: 1, name: '公开' }, { id: 2, name: '私有' }], props.manifest.dataSetProperty)}
          </Typography>
          <Typography variant="subtitle1" component="div">
            FileTypes
          </Typography>
          <Typography  variant="caption" sx={{  maxWidth: 200 }} color="text.secondary" >
            {parseDictionary(dataType, props.manifest.dataTypeIds)}
          </Typography>

          <Typography variant="subtitle1" component="div">
            LabelTypes
          </Typography>
          <Typography  variant="caption"  sx={{  maxWidth: 200 }} color="text.secondary" >
            {parseDictionary(labelType, props.manifest.labelTypeIds)}
          </Typography>
          <Typography variant="subtitle1" component="div">
            TaskTypes
          </Typography>
          <Typography  variant="caption"  sx={{  maxWidth: 200 }} color="text.secondary" >
            {parseDictionary(taskType, props.manifest.taskTypeIds)}
          </Typography>
          <Typography variant="subtitle1" component="div">
            UsedScene
          </Typography>
          <Typography  variant="caption"  sx={{  maxWidth: 200 }} color="text.secondary" >
            {parseDictionary(usedScene, props.manifest.usedSceneIds)}
          </Typography>
        </Stack>
      </CardContent>

    </React.Fragment>
  );


  const fileExplore = (<><DataFolderExplore /></>)

  return (<Grow in={checked}>
    <Card sx={{ minWidth: 1200, background: '#f4f4f4' }} raised>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center">
            <form onSubmit={handleSubmit} >
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{ width: 1100, height: '50%', marginTop: '7%', mb: '10%' }}
                spacing={3}>

                <Typography variant="button" display="block" gutterBottom>
                  DataSet Reviews before created
                </Typography >
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={3}
                >
                  {props.manifest.coverImg === '' || typeof props.manifest.coverImg === 'undefined' ? null : (<CardMedia
                    component="img"
                    sx={{
                      maxWidth: 300, maxHeight: 200
                    }}
                    image={`${props.manifest.coverImg}`}
                    alt="can not load img"
                  />)}
                  <Stack
                    direction="column"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Typography variant="subtitle1" sx={{
                      fontFamily: 'Tahoma, sans-serif'
                    }}>
                      {props.manifest.dataSetName || ''}
                    </Typography>
                    <Typography variant="body1" sx={{
                      fontFamily: 'Tahoma, sans-serif'
                    }}>
                      {props.manifest.dataSetSubName || ''}
                    </Typography>


                  </Stack>
                </Stack>

                <Card variant="outlined" sx={{ minWidth: 1100, }}>{card}</Card>

                {description}


                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={5}>
                  <Button variant="contained" type="submit" color="secondary" onClick={back}>Back</Button>

                  <Button variant="contained" type="submit" color="primary" onClick={create}>{buttonStr}</Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        )} />
    </Card>
  </Grow>)
}
export default DsReviews