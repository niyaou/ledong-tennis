/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-01 12:06:05
 * @content: edit your page content
 */
import { Box, Button, Card, CardContent, Grow, Select, Stack, Modal, TextField, Typography, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import React, { useState, useEffect } from 'react';
import DataFolderExplore from '../fileExplore/folderExploreComponent';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { ExpandCircleDown as ExpandMoreIcon } from '@mui/icons-material';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation, Navigate, Outlet, useParams } from 'react-router-dom';
import { styled, ThemeProvider } from '@mui/material/styles';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { connect, useDispatch } from 'react-redux';
import Avatar, { AvatarClasses, AvatarProps } from '@mui/material/Avatar';
import CommitIcon from '@mui/icons-material/Commit';
import moment from 'moment';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import { fileLengthFormat } from '../../common/utils/dateUtils'
import SellIcon from '@mui/icons-material/Sell';
import DeleteIcon from '@mui/icons-material/Delete';
import { dictionary, createDataSet, deleteDataSet } from "../../store/actions/inSensitiveActions"
import { useSelector } from "../../redux/hooks";
import { useSnackbar } from 'notistack';
import { datasetById, datasetFavorate } from '../../store/actions/dsExploreActions'
import { cloneDeep } from 'lodash'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import { pink } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
interface FormValues {
  username?: string;
  password?: string;
}


function createData(
  name: string,
  category: string,
  originNum: number,
  currentNum: number,
  originPercent: number,
  currentPercent: number,
  subClass
) {
  return {
    name,
    category,
    originNum,
    currentNum,
    originPercent,
    currentPercent,
    subClass
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            spacing={1}>
            <Typography variant="caption" >{row.originNum}</Typography>
            <ArrowRightAltIcon sx={{ fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: getCompareColor(row.originNum, row.currentNum) }}>{row.currentNum}</Typography>
          </Stack>
        </TableCell>
        <TableCell align="right">
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            spacing={1}>
            <Typography variant="caption" >{row.originPercent}%</Typography>
            <ArrowRightAltIcon sx={{ fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: getCompareColor(row.originPercent, row.currentPercent) }}>{row.currentPercent}%</Typography>
          </Stack>
        </TableCell>
      </TableRow>

      {open ? row.subClass.map((historyRow) => (
        <TableRow key={historyRow.name} hover>
          <TableCell>

          </TableCell>
          <TableCell component="th" scope="row">
            {historyRow.name}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={1}>
              <Typography variant="caption" >    {historyRow.originNum}</Typography>
              <ArrowRightAltIcon sx={{ fontSize: 20 }} color="action" />
              <Typography variant="caption" sx={{ color: getCompareColor(historyRow.originNum, historyRow.currentNum) }}>{historyRow.currentNum}</Typography>
            </Stack>
          </TableCell>
          <TableCell align="right">
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={1}>
              <Typography variant="caption" >    {historyRow.originPercent}%</Typography>
              <ArrowRightAltIcon sx={{ fontSize: 20 }} color="action" />
              <Typography variant="caption" sx={{ color: getCompareColor(historyRow.originPercent, historyRow.currentPercent) }}>   {historyRow.currentPercent}%</Typography>
            </Stack>
          </TableCell>
        </TableRow>
      )) : null}
    </React.Fragment>
  );
}

function getCompareColor(from: number, to: number) {
  if (from > to) {
    return 'orange'
  } else if (from < to) {
    return 'green'
  } else {
    return 'black'
  }
}

function computeRows(baseItem, compareItem): [] {
  let fileSuffixKeySet = new Set();
  for (let subKey in baseItem.statistic.suffix) {
    fileSuffixKeySet.add(subKey)
  }
  for (let subKey in compareItem.statistic.suffix) {
    fileSuffixKeySet.add(subKey)
  }

  const rows = []
  // 统计文件后缀
  const fileRow = createData('File quantities', 'File quantities', baseItem.statistic.totalCount, compareItem.statistic.totalCount,
    100, 100,
    [])

  for (let subKey of fileSuffixKeySet) {
    let baseValue = baseItem.statistic.suffix[subKey]
    let compareValue = compareItem.statistic.suffix[subKey]
    if (baseValue === undefined)
      baseValue = 0
    if (compareValue === undefined)
      compareValue = 0
    fileRow.subClass.push({
      name: subKey,
      originNum: baseValue,
      currentNum: compareValue,
      originPercent: baseItem.statistic.totalCount === 0 ? 0 : Math.round(baseValue / baseItem.statistic.totalCount * 100),
      currentPercent: compareItem.statistic.totalCount === 0 ? 0 : Math.round(compareValue / compareItem.statistic.totalCount * 100)
    })
  }
  rows.push(fileRow)

  // 统计标记图形-标记类型-数量
  let shapeLabelMap = new Map();
  for (let key in baseItem.statistic.category) {
    let entry = baseItem.statistic.category[key]
    let labelSet = shapeLabelMap.get(key)
    if (labelSet === undefined) {
      labelSet = new Set()
      shapeLabelMap.set(key, labelSet)
    }

    for (let subKey in entry) {
      labelSet.add(subKey)
    }
  }
  for (let key in compareItem.statistic.category) {
    let entry = compareItem.statistic.category[key]
    let labelSet = shapeLabelMap.get(key)
    if (labelSet === undefined) {
      labelSet = new Set()
      shapeLabelMap.set(key, labelSet)
    }

    for (let subKey in entry) {
      labelSet.add(subKey)
    }
  }

  let baseItemTotalShape = 0
  for (let key in baseItem.statistic.shape) {
    baseItemTotalShape += baseItem.statistic.shape[key]
  }

  let compareItemTotalShape = 0
  for (let key in compareItem.statistic.shape) {
    compareItemTotalShape += compareItem.statistic.shape[key]
  }

  for (let shape of shapeLabelMap.keys()) {
    let labelSet = shapeLabelMap.get(shape)
    let baseEntry = baseItem.statistic.category[shape]
    if (baseEntry === undefined) {
      baseEntry = {}
    }
    let compareEntry = compareItem.statistic.category[shape]
    if (compareEntry === undefined) {
      compareEntry = {}
    }

    let baseShapeCount = baseItem.statistic.shape[shape]
    if (baseShapeCount === undefined) {
      baseShapeCount = 0
    }
    let compareShapeCount = compareItem.statistic.shape[shape]
    if (compareShapeCount === undefined) {
      compareShapeCount = 0
    }

    let row = createData(shape, shape, baseShapeCount, compareShapeCount,
      baseItemTotalShape === 0 ? 0 : Math.round(baseShapeCount / baseItemTotalShape * 100),
      compareItemTotalShape === 0 ? 0 : Math.round(compareShapeCount / compareItemTotalShape * 100),
      [])

    for (let label of labelSet) {

      let baseCount = baseEntry[label];
      if (baseCount === undefined) {
        baseCount = 0
      }
      let compareCount = compareEntry[label];
      if (compareCount === undefined) {
        compareCount = 0
      }

      row.subClass.push({
        name: label,
        originNum: baseCount,
        currentNum: compareCount,
        originPercent: baseShapeCount === 0 ? 0 : Math.round(baseCount / baseShapeCount * 100),
        currentPercent: compareShapeCount === 0 ? 0 : Math.round(compareCount / compareShapeCount * 100)
      })
    }

    rows.push(row)
  }

  return rows;
}

interface BranchModal {
  open: boolean;
  branch?: object;
  callback?: Function;
}

function SelectCompareVersionComponent(props) {
  let { availableFamily, baseItem, setBaseItem, compareItem, setCompareItem } = props

  const [choiceComparing, setChoiceComparing] = React.useState(false);

  const [tempBaseItem, setTempBaseItem] = React.useState(baseItem);
  const [tempCompareItem, setTempCompareItem] = React.useState(compareItem);

  const handleBaseChange = (event: SelectChangeEvent) => {
    setTempBaseItem(event.target.value);
  };
  const handleCompareChange = (event: SelectChangeEvent) => {
    setTempCompareItem(event.target.value as string);
  };

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      sx={{ width: 1100, marginTop: '2%' }}
      spacing={1}
    >
      <Typography variant="body2" >
        Base:
      </Typography>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <CommitIcon color="disabled" />
        {!choiceComparing
          ? (<Typography variant="body2" >
            {tempBaseItem.tag || `#v${tempBaseItem.dataVersion}`}
          </Typography>)
          :
          (<Box>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel >Compare </InputLabel>
              <Select
                defaultValue={tempBaseItem}
                label="Base"
                size="small"
                onChange={handleBaseChange}
              >
                {availableFamily && availableFamily.map((item) => (<MenuItem key={`base-${item.id}`} value={item}>{item.tag || `#v${item.dataVersion}`}</MenuItem>))}
              </Select>
            </FormControl>
          </Box>)
        }
      </Stack>
      <ArrowRightAltIcon />
      <Typography variant="body2" >
        Compare:
      </Typography>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <CommitIcon color="disabled" />
        {!choiceComparing ?
          (<Typography variant="body2" >
            {tempCompareItem.tag || `#v${tempCompareItem.dataVersion}`}
          </Typography>)
          :
          (<Box>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel >Compare </InputLabel>
              <Select
                defaultValue={tempCompareItem}
                label="compare"
                size="small"
                onChange={handleCompareChange}
              >
                {availableFamily && availableFamily.map((item) => (<MenuItem key={`compare-${item.id}`} value={item}>{item.tag || `#v${item.dataVersion}`}</MenuItem>))}
              </Select>
            </FormControl>
          </Box>)
        }
      </Stack>
      {!choiceComparing ? (<RepeatOnIcon color="primary" sx={{ cursor: 'pointer' }} onClick={() => {
        setChoiceComparing(true)
      }} />) : null}
      {choiceComparing ? (<Paper variant="outlined" sx={{ width: '24px', height: '24px' }}
        onClick={() => {
          setBaseItem(tempBaseItem)
          setCompareItem(tempCompareItem)
          setChoiceComparing(false)
        }} >
        <CheckTwoToneIcon color={tempBaseItem.id === tempCompareItem.id ? 'disabled' : 'success'} sx={{ cursor: 'pointer' }} />
      </Paper>) : null}
      {choiceComparing ? (<Paper variant="outlined" square sx={{ width: '24px', height: '24px' }} >
        <ClearTwoToneIcon color="primary" sx={{ cursor: 'pointer', color: pink[500] }}
          onClick={() => {
            setChoiceComparing(false)
          }}
        />
      </Paper>) : null}
    </Stack>
  )
}

function DsDiffTab(props) {

  const [ds, setDs] = useState(props.ds)

  if (!ds.statistic) {
    return (<div></div>)
  }

  let availableFamily = ds.family.filter((s) => {
    return s.statistic !== null
  })

  let baseItemInFamily = null;
  for (let entry: any of ds.family) {
    if (entry.id === ds.id) {
      baseItemInFamily = entry
    }
  }

  const [baseItem, setBaseItem] = React.useState(baseItemInFamily);

  const [compareItem, setCompareItem] = React.useState(availableFamily[0]);

  const stepIndex = props.stepIndex
  const currentStepIndex = props.currentStepIndex
  const checked = stepIndex === currentStepIndex

  let rows = computeRows(baseItem, compareItem)

  const CollapsibleTable = (
    <Card sx={{ p: 1, width: 1100, borderColor: 'gainsboro', borderRadius: '0', m: '0 0 -1px -1px !important', borderStyle: 'solid', borderWidth: 0, boxShadow: 'none' }}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>

          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )

  return (<Grow in={checked}>
    <Box sx={{ minWidth: 1200, width: '100%' }} >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={3}
        sx={{ mb: 3 }}
      >
        <SelectCompareVersionComponent
          availableFamily={availableFamily}
          baseItem={baseItem}
          setBaseItem={setBaseItem}
          compareItem={compareItem}
          setCompareItem={setCompareItem}
        />
        {ds ?
          (<Stack direction="column" alignItems="flex-start" justifyContent="flex-start" sx={{ m: '50px !important' }} >
            {/* {ds.family && ds.family.map((item) => versionComponent(item))} */}
            {CollapsibleTable}
          </Stack>)
          :
          null}
      </Stack>
    </Box>
  </Grow>)
}
export default DsDiffTab