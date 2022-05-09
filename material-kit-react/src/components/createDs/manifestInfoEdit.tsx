/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-23 16:12:05
 * @content: edit your page content
 */
import { Button, Card, Fade, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography, Slide, Zoom, Grow, SelectChangeEvent } from '@mui/material';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import ReactFileReader from "react-file-reader";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useSnackbar } from 'notistack';
function ManifestInfoEdit(props) {
  const required = (value) => {
    return (value === '' ? undefined : "Required")
  };
  const updateFormValue = props.updateFormValue
  const next = props.next
  const stepIndex = props.stepIndex
  const { dataType, labelType, taskType, usedScene } = props.dsDictionary
  const { } = props.manifest
  const disabled = props.disabled
  const currentStepIndex = props.currentStepIndex
  const checked = stepIndex === currentStepIndex

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const loadedFiles = (files: any) => {
    if (files.fileList[0].type.indexOf('image/') < 0) {
      enqueueSnackbar('cover image must be an image file', {
        variant: 'warning',
        autoHideDuration: 3000,
      })
      return
    }
    setCoverImg(files.base64)
    updateFormValue({ coverImg: files.base64 })
  }
  const onSubmit = () => {
  }
  const validation = () => {
    if (dataSetProperty.length === 0 || dataTypeIds.length === 0 || labelTypeIds.length === 0 ||
      taskTypeIds.length === 0 || usedSceneIds.length === 0
      || dataSetName.trim().length === 0 || dataSetSubName.trim().length === 0) {
      return true
    }
    return false
  }

  const [coverImg, setCoverImg] = React.useState<string>(props.manifest.coverImg || '');
  const [dataSetName, setDataSetName] = React.useState<string>(props.manifest.dataSetName || '');
  const [dataSetSubName, setDataSetSubName] = React.useState<string>(props.manifest.dataSetSubName || '');
  const [dataSetProperty, setDataSetProperty] = React.useState<string[]>(props.manifest.dataSetProperty || []);
  const [dataTypeIds, setDataTypeIds] = React.useState<string[]>(props.manifest.dataTypeIds || []);
  const [labelTypeIds, setLabelTypeIds] = React.useState<string[]>(props.manifest.labelTypeIds || []);
  const [taskTypeIds, setTaskTypeIds] = React.useState<string[]>(props.manifest.taskTypeIds || []);
  const [usedSceneIds, setUsedSceneIds] = React.useState<string[]>(props.manifest.usedSceneIds || []);

  const handleTextChange = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === 'dataSetName') {
      setDataSetName(value)
      updateFormValue({ dataSetName: value })
    } else if (name === 'DataSetSubName') {
      setDataSetSubName(value)
      updateFormValue({ dataSetSubName: value })
    }
  }


  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value, name },
    } = event;

    if (name === 'Permissions') {
      setDataSetProperty(typeof value === 'string' ? value.split(',') : value)
      updateFormValue({ dataSetProperty: value })
    } else if (name === 'FileTypes') {
      setDataTypeIds(typeof value === 'string' ? value.split(',') : value)
      updateFormValue({ dataTypeIds: value })
    } else if (name === 'LabelTypes') {
      setLabelTypeIds(typeof value === 'string' ? value.split(',') : value)
      updateFormValue({ labelTypeIds: value })
    } else if (name === 'UsedScene') {
      setUsedSceneIds(typeof value === 'string' ? value.split(',') : value)
      updateFormValue({ usedSceneIds: value })
    } else if (name === 'TaskTypes') {
      setTaskTypeIds(typeof value === 'string' ? value.split(',') : value)
      updateFormValue({ taskTypeIds: value })
    }
  }



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
                sx={{ width: 400, height: '50%', marginTop: '7%', mb: '10%' }}
                spacing={3}>

                <Typography variant="button" display="block" gutterBottom>
                  DataSet basic config information settings

                </Typography >
                <Field
                  name="dataSetName"
                  label="Dataset Name"
                  validate={required}
                  sx={{ m: 1, width: 300, mt: 3 }}
                >
                  {({ input, meta }) => {
                    return (
                      <TextField
                        disabled={disabled}
                        label="Dataset Name"
                        {...input}
                        error={meta.touched && (dataSetName === '' || !dataSetName)}
                        value={dataSetName}
                        sx={{ m: 1, width: 300, mt: 3, background: 'white' }}
                        onChange={handleTextChange}
                        name='dataSetName'
                        inputProps={{ maxLength: 20 }}
                        autoComplete='false'
                        required={true}
                        helperText={meta.touched && (dataSetName === '' || !dataSetName) ? '' : ''}
                      />
                      // should not be empty
                    )
                  }
                  }
                </Field>

                <Field
                  name="DataSetSubName"
                  label="DataSet SubName"
                  sx={{ m: 1, width: 300, mt: 3 }}
                >
                  {({ input, meta }) => {

                    return (<TextField
                      disabled={disabled}
                      sx={{ m: 1, width: 300, mt: 3, background: 'white' }}
                      required={true}
                      {...input}
                      error={meta.touched && (dataSetSubName === '' || !dataSetSubName)}
                      name='DataSetSubName'
                      label="DataSet SubName"
                      inputProps={{ maxLength: 50 }}
                      value={dataSetSubName}
                      onChange={handleTextChange} />
                    )
                  }}
                </Field>


                <Field name="Permissions" label="Permissions"  >
                  {({ input, meta }) => {
                    return (
                      <FormControl sx={{ m: 1, width: 300, mt: 3, background: 'white' }}>
                        <InputLabel id="demo-controlled-open-select-label1">Permissions</InputLabel>
                        <Select label="Permissions"
                          labelId="demo-controlled-open-select-label1"
                          name='Permissions'
                          disabled={disabled}
                          {...input}
                          error={meta.touched && (dataSetProperty.length === 0)}
                          onChange={handleChange}
                          value={dataSetProperty}>
                          {[{ id: 1, name: '公开' }, { id: 2, name: '私有' }].map((dict, index) => { return (<MenuItem key={index} value={dict.id}>{dict.name}</MenuItem>) })}
                        </Select>
                      </FormControl>
                    )
                  }}

                </Field>
                <Field name="FileTypes" label="FileTypes" >
                  {({ input, meta }) => (
                    <FormControl sx={{ m: 1, width: 300, mt: 3, background: 'white' }}>
                      <InputLabel id="demo-controlled-open-select-label1">FileTypes*</InputLabel>
                      <Select label="FileTypes" labelId="demo-controlled-open-select-label12"
                        name='FileTypes'
                        disabled={disabled}
                        multiple
                        {...input}
                        onChange={handleChange}
                        error={meta.touched && (dataTypeIds.length === 0)}
                        value={dataTypeIds}>
                        {dataType ? dataType.map((dict, index) => { return (<MenuItem key={index} value={dict.id}>{dict.name}</MenuItem>) }) : null}
                      </Select>
                    </FormControl>
                  )}
                </Field>
                <Field name="LabelTypes" label="LabelTypes name"  >
                  {({ input, meta }) => (
                    <FormControl sx={{ m: 1, width: 300, mt: 3, background: 'white' }}>
                      <InputLabel id="demo-controlled-open-select-label2">LabelTypes*</InputLabel>
                      <Select label="LabelTypes" labelId="demo-controlled-open-select-label2"
                        name='LabelTypes' multiple
                        disabled={disabled}
                        {...input}
                        error={meta.touched && (labelTypeIds.length === 0)}
                        onChange={handleChange}
                        value={labelTypeIds} >
                        {labelType ? labelType.map((dict, index) => { return (<MenuItem key={index} value={dict.id}>{dict.name}</MenuItem>) }) : null}
                      </Select>
                    </FormControl>
                  )}
                </Field>
                <Field name="UsedScene" label="UsedScene "  >
                  {({ input, meta }) => (
                    <FormControl sx={{ m: 1, width: 300, mt: 3, background: 'white' }}>
                      <InputLabel id="demo-controlled-open-select-label3">UsedScene*</InputLabel>
                      <Select label="UsedScene" labelId="demo-controlled-open-select-label3"
                        name='UsedScene' multiple
                        {...input}
                        error={meta.touched && (usedSceneIds.length === 0)}
                        onChange={handleChange} value={usedSceneIds}  >
                        {usedScene ? usedScene.map((dict, index) => { return (<MenuItem key={index} value={dict.id}>{dict.name}</MenuItem>) }) : null}
                      </Select>
                    </FormControl>
                  )}
                </Field>
                <Field name="TaskTypes" label="TaskTypes "  >
                  {({ input, meta }) => (
                    <FormControl sx={{ m: 1, width: 300, mt: 3, background: 'white' }}>
                      <InputLabel id="demo-controlled-open-select-label">TaskTypes*</InputLabel>
                      <Select label="TaskTypes" labelId="demo-controlled-open-select-label"
                        {...input}
                        error={meta.touched && (taskTypeIds.length === 0)}
                        name='TaskTypes' multiple onChange={handleChange} value={taskTypeIds}  >
                        {taskType ? taskType.map((dict, index) => { return (<MenuItem key={index} value={dict.id}>{dict.name}</MenuItem>) }) : null}
                      </Select>
                    </FormControl>
                  )}
                </Field>
                <Field name="CoverImage" label="dataSet name"  >
                  {props => (<FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <label htmlFor="contained-button-file">
                      {/* <Input accept="image/*" id="contained-button-file" multiple type="file" sx={{ display: 'none' }} onChange={loadedFiles}/> */}
                      <ReactFileReader
                        disabled={disabled}
                        fileTypes={[".png", ".bmp", ".jgp", ".jpge", ".gif"]} base64={true} multipleFiles={false} handleFiles={loadedFiles}>
                        <Button variant="contained"
                          disabled={disabled}
                          component="span" fullWidth>
                          Cover Image
                        </Button>
                      </ReactFileReader>
                    </label>
                  </FormControl>
                  )}
                </Field>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={5}>
                  <Button variant="contained" type="submit" color="secondary" disabled>Back</Button>
                  <Button variant="contained" type="submit" color="primary" disabled={validation()} onClick={next}>Next</Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        )} />
    </Card>
  </Grow>)
}
export default ManifestInfoEdit