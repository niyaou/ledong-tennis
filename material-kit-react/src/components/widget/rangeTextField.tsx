/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-14 16:57:27
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-22 15:00:21
 * @content: edit your page content
 */
import { Card, CardContent, CardMedia, Grid, Stack, SelectChangeEvent, Typography, FormControl, Input, IconButton, InputLabel, InputAdornment } from '@mui/material';
import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Field, Form } from 'react-final-form';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DeleteIcon from '@mui/icons-material/Delete';
function RangeTextField(props) {
    const [minValue, setMinValue] = React.useState('');
    const [maxValue, setMaxValue] = React.useState('');
    const content = props.title
    const modified = props.modified

    const minCallBack = props.minCallBack
    const maxCallBack = props.maxCallBack

    const onSubmit = () => { }
    const handleSubmit = () => { }
    const validation = () => {

        return false
    }
    const required = (value) => {
        return (value === '' ? undefined : "Required")
    };
    return (<Stack
        direction="row"
        justifyContent="space-between"
        alignItems="end"
        spacing={1}
        sx={{ width: '100%' }}>
        <Form
            sx={{ width: '100%' }}
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit} >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="end"
                        spacing={1}
                        sx={{ width: '100%' }}
                    >
                        <Field
                            name="dataSetName"
                            label="Dataset Name"
                            validate={required}
                            sx={{ m: 1, width: '30%', mt: 3 }}
                        >
                            {({ input, meta }) => {

                                return (
                                    <FormControl variant="standard">
                                        <InputLabel htmlFor="input-with-icon-adornment">
                                            {content}大于
                                        </InputLabel>
                                        <Input
                                            inputProps={{ min: 0 }}
                                            value={minValue}
                                            onChange={(event: SelectChangeEvent) => {
                                                const {
                                                    target: { value, name },
                                                } = event;
                                                minCallBack(value)
                                                setMinValue(parseInt(value))
                                            }}
                                            error={minValue !== '' && (parseInt(minValue) < 0)}

                                            type="number"
                                            id="input-with-icon-adornment-start"

                                        />
                                    </FormControl>
                                )
                            }}

                        </Field>
                        <Typography gutterBottom variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }} >
                            &&
                        </Typography>
                        <Field
                            name="dataSetName"
                            label="Dataset Name"
                            validate={required}
                            sx={{ m: 1, width: '30%', mt: 3 }}
                        >
                            {({ input, meta }) => {
                                return (
                                    <FormControl variant="standard">
                                        <InputLabel htmlFor="input-with-icon-adornment">
                                            {content}小于
                                        </InputLabel>
                                        <Input
                                            {...input}
                                            value={maxValue}
                                            onChange={(event: SelectChangeEvent) => {
                                                const {
                                                    target: { value, name },
                                                } = event;
                                                maxCallBack(value)
                                                setMaxValue(parseInt(value))
                                            }}
                                            error={maxValue !== '' && (parseInt(maxValue) < 0 || maxValue <= minValue)}
                                            inputProps={{ min: 0 }}
                                            type="number"
                                            id="input-with-icon-adornment-end"

                                        />
                                    </FormControl>
                                )
                            }}


                        </Field>
                    </Stack>
                </form>
            )} />
      {modified &&  <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
                props.pop(content)
             }}
        >
            <DeleteIcon />
        </IconButton>} 
    </Stack>
    )
}
export default RangeTextField