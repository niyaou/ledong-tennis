/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-01-17 10:33:47
 * @content: edit your page content
 */
import { Button, Card, Fade, FormControl, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, Grow } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { Field, Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import ReactWEditor from 'wangeditor-for-react';
interface FormValues {
  username?: string;
  password?: string;
}
function DescriptEdit(props) {
  let editorRef = useRef(null)
  let size = function () { return Math.floor(0.5 + Math.random() * 8) * 100 }
  let navigate = useNavigate();
  const back = props.back
  const next = props.next
  const updateFormValue = props.updateFormValue
  const stepIndex = props.stepIndex
  const currentStepIndex = props.currentStepIndex
  const checked = stepIndex === currentStepIndex
  const defaultText = '<h2><font size="5">#Overview</font></h2><h2><font size="5" style="">#Content<br/></font></h2><h2><font size="5" style="">#Source</font></h2><h2><font size="5">#Citation</font></h2><div><b><span style="font-size: 32px;"><br/></span></b></div>'
  const [descript, setDescript] = React.useState<string>(props.manifest.dataSetDescribe || defaultText);

  const onSubmit = (auth: FormValues) => {
  }
  const textChange = (html) => {
    updateFormValue({ dataSetDescribe: html })
  }

  useEffect(() => {
    editorRef
  }, [])
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
                sx={{ width: 900, height: '50%', marginTop: '7%', mb: '10%' }}
                spacing={3}>

                <Typography variant="button" display="block" gutterBottom>
                  DataSet Description Settings

                </Typography >
                <ReactWEditor
                  ref={editorRef}
                  config={{
                    customUploadImg :(resultFiles, insertImgFn) =>{
                    var reader = new FileReader();
                    reader.readAsDataURL(resultFiles[0]);
                    reader.onload = function (e) { 
                      let base64 = e.target.result;
                      
                      insertImgFn(base64)
            
                }
            
                    },
                  
                    fontSizes: {
                      'x-small': { name: '10px', value: '1' },
                      small: { name: '12px', value: '2' },
                      normal: { name: '16px', value: '3' },
                      large: { name: '18px', value: '4' },
                      'x-large': { name: '24px', value: '5' },
                      'xx-large': { name: '32px', value: '6' },
                      'xxx-large': { name: '48px', value: '7' },
                    },
                  }}
                  defaultValue={descript}
                  linkImgCallback={(src, alt, href) => {
                    // 插入网络图片的回调事件
                    // console.log('图片 src ', src)
                    // console.log('图片文字说明', alt)
                    // console.log('跳转链接', href)
                  }}
                  onlineVideoCallback={(video) => {
                    // 插入网络视频的回调事件
                    // console.log('插入视频内容', video)
                  }}
                  onChange={textChange}
                  onBlur={(html) => {
                    // console.log('onBlur html:', html)
                  }}
                  onFocus={(html) => {
                    // console.log('onFocus html:', html)
                  }}
                />
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={5}>
                  <Button variant="contained" type="submit" color="secondary" onClick={back} >Back</Button>
                  <Button variant="contained" type="submit" color="primary" onClick={next}>Next</Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        )} />
    </Card>
  </Grow>)
}
export default DescriptEdit