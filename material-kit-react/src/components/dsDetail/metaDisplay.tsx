/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-28 15:58:34
 * @content: edit your page content
 */
import { CardContent, Stack, Typography } from '@mui/material';
import { find } from 'lodash';
import React from 'react';


function MetaDisplay(props) {

  const { dataType, labelType, taskType, usedScene ,dataSetProperty} = props.ds


  const parsePrivacy = (dict, ids) => {
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


  const parseDictionary = (dict) => {
    let result = ''
    if(typeof dict!=='undefined'){
      dict.map((item, i) => {
        let t = result === '' ? '' : ',\n'
        result += (t + typeof item !== 'undefined' ? (item.name+'\n') : '')
      })
    }
    return result
  }
  

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
            {parsePrivacy([{ id: 1, name: '公开' }, { id: 2, name: '私有' }], dataSetProperty)}
          </Typography>
          <Typography variant="subtitle1" component="div">
            FileTypes
          </Typography>
          <Typography  variant="caption"  sx={{  maxWidth: 300 }} color="text.secondary" >
            {parseDictionary(dataType)}
          </Typography>
          <Typography variant="subtitle1" component="div">
            LabelTypes
          </Typography>
          <Typography  variant="caption"   sx={{  maxWidth: 300 }} color="text.secondary" >
            {parseDictionary(labelType)}
          </Typography>
          <Typography variant="subtitle1" component="div">
            TaskTypes
          </Typography>
          <Typography  variant="caption"  sx={{  maxWidth: 300 }}  color="text.secondary" >
            {parseDictionary(taskType)}
          </Typography>
          <Typography variant="subtitle1" component="div">
            UsedScene
          </Typography>
          <Typography variant="caption"  sx={{  maxWidth: 300 }}  color="text.secondary" >
            {parseDictionary(usedScene)}
          </Typography>
        </Stack>
      </CardContent>
    </React.Fragment>
  );
  return (
      
        <>{card}</>
          
    )
}
export default MetaDisplay