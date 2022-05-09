/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-11-29 17:48:11
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-30 15:41:45
 * @content: 首页列表编辑页面
 */
import AddCommentIcon from '@mui/icons-material/AddComment';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey';
import LastPageIcon from '@mui/icons-material/LastPage';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import { Backdrop, Box, Card, CardContent, CardMedia, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import imgUrl from '../assert/pexel.jpeg';
import useStyles from '../common/styles';
import { Themes } from '../common/theme';
import { fileLengthFormat, format } from '../common/utils/dateUtils';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Footer from '../components/nav/footer';
import Header from '../components/nav/header';
import { useSelector } from "../redux/hooks";
import Divider from '@mui/material/Divider';
import { add2SortList, getRecommandDataSetAction, openAddDataSetDialog, removeSortOrder, searchDataSetAction, sortDataSetAction, topSortOrder, upSortOrder } from '../store/slices/editListSlice';
import { cloneDeep } from 'lodash'

const editItem = (card, index, secondaryAction) => {
  return (
    <React.Fragment key={`fg-${index}`}>
        
      <ListItem
        button={!card.isChoicen}
        key={index}
        secondaryAction={
          secondaryAction
        }
      >
        {/* <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={card.coverImg|| imgUrl} />
      </ListItemAvatar> */}
        <CardMedia
          component='img'
          sx={{
            maxWidth: 80, height: 60, cursor: 'pointer', minHeight: 60, borderRadius: 3,
          }}
          src={card.coverImg || imgUrl}
          onClick={() => {
            // navigate(`/dataset/${card.id}`,{state:card})
          }}
        />
        <Stack direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={1} sx={{ ml: 5 }}>
          <Typography variant="caption" sx={{
            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '95%'
          }} >
            {card.dataSetName}
          </Typography>
          <Typography variant="caption" >
            {card.creatorFullName}
            <Typography variant="caption">
              &nbsp;
            </Typography>
            <Typography variant="caption">
              ·
            </Typography>
            <Typography variant="caption">
              &nbsp;
            </Typography>
            <Typography variant="caption">
              updated  {format(card.modifyTime, 'yyyy-MM-dd hh:mm')}
            </Typography>
          </Typography>

          <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={1} >
            <Typography variant="caption">
              Used       <span style={{ fontWeight: 'bolder' }}>{card.visitCount}</span>
            </Typography>

            <Typography variant="caption">
              <span style={{ fontWeight: 'bolder' }}>  {card.statistic ? fileLengthFormat(card.statistic.totalSize, 1) : '0 kb'}</span>
            </Typography>
            <Typography variant="caption">
              ·
            </Typography>
            <Typography variant="caption">
              <span style={{ fontWeight: 'bolder' }}>  {card.statistic ? card.statistic.totalCount : 0}Files</span> 
            </Typography>
          </Stack>
        </Stack>

      </ListItem>
      <Divider />
    </React.Fragment>
  )
}

function CustomPaginationActionsTable() {
  const dispatch = useDispatch()
  const searchPager = useSelector((state) => state.editList.searchPager)
  const [pager, setPager] = React.useState(searchPager);

  const editList = useSelector((state) => state.editList)
  const sortList = editList.sortList

  useEffect(() => {
    dispatch(searchDataSetAction({
      page: 0,
      size: 10,
    }))
  }, [])

  useEffect(() => {
    let comparePage = cloneDeep(searchPager)
    comparePage.content = comparePage.content.map((ds) => {
      let r = sortList.filter((s) => {
        return s.id === ds.id
      })
      ds.isChoicen = r.length > 0
      return ds
    })
    setPager(comparePage)
  }, [searchPager])


  const handleChangePage = (event, newPage) => {
    dispatch(searchDataSetAction({
      page: newPage,
      size: pager.size,
    }))
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(searchDataSetAction({
      page: 0,
      size: parseInt(event.target.value, 10),
    }))
  };

  const handleClickRow = (row: any) => {
    dispatch(add2SortList(row))
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        {/* <TableHead>
          <TableRow>
            <TableCell>数据集名称</TableCell>
            <TableCell align="right">版本</TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {pager.content.map((row, index) => (
            <TableRow key={row.id}
              hover={!row.isChoicen}
              onClick={() => {
                if(!row.isChoicen){
                  handleClickRow(row)
                }
              }
              }

            >
         
              {editItem(row, index, (<></>))}
              {/* <TableCell component="th" scope="row">
                {row.dataSetName}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.dataVersion}
              </TableCell> */}
            </TableRow>
          ))}

          {pager.empty && (
            <TableRow style={{ height: 53 * searchPager.size }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={pager.totalElements}
              rowsPerPage={pager.numberOfElements}
              page={pager.number}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

function SimpleDialog(props) {
  // const editList = useSelector((state) => state.editList)
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    selectedValue.push(value)
    onClose(selectedValue);
  };

  return (
    <Dialog maxWidth='md' fullWidth={true}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      onClose={handleClose} open={open}>
      <DialogTitle>Choice Recommanded DataSets</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem key={1}>
          <CustomPaginationActionsTable />
        </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.array.isRequired,
};


const ListEditor = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();


  const editList = useSelector((state) => state.editList)
  const sortList = editList.sortList
  const loading = useSelector((state) => state.editList.loading)

  const loadError = editList.loadError
  useEffect(() => {
    if (loadError) {
      enqueueSnackbar(editList.errorMsg, {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  }, [loadError])


  useEffect(() => {
    dispatch(getRecommandDataSetAction())
  }, [])

  const handleClickOpen = () => {
    dispatch(openAddDataSetDialog(true))
  }

  const handleClickSort = () => {
    let sortIndexVoList = []
    sortList.map((dataSet, index) => {
      sortIndexVoList.push({
        "datSetId": dataSet.id,
        "sortIndex": index + 1,
      })
    })
    dispatch(sortDataSetAction(sortIndexVoList))
  }

  const handleClose = (value) => {
    dispatch(openAddDataSetDialog(false))
  }








  return (
    <ThemeProvider theme={
      Themes
    }>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header styleTyle={3} />
      <Box sx={{ paddingTop: '75px' }}>
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"

        >
          <Stack direction="row" justifyContent="space-between"
            alignItems="flex-start"
            className={classes.list}
            spacing={2}>
           
            <Typography variant="h5" sx={{ fontWeight: 'bolder', fontFamily: 'Candara,Calibri,Segoe,Segoe UI,Optima,Arial,sans-serif' }} >
            <IconButton key={"del"} aria-label="delete" color="primary" size="small"   >
              <StorageOutlinedIcon />
            </IconButton>
             Data Scientist Recommanded Sets</Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={2} >
              <Tooltip title="Commit Update" placement="top">
                <IconButton
                  size="small"
                  color="primary"
                  aria-label="commit"
                  onClick={handleClickSort}>
                  <BookmarkAddedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="        Add DataSet" placement="top">
                <IconButton
                  size="small"
                  color="primary"
                  aria-label="add" onClick={handleClickOpen}>

                  <AddCommentIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Box
            sx={{ marginTop: '5px' }}
            className={classes.list}
          >

            <br />
            <List dense={true}>
              {sortList.map((row, index) => {
                let secondaryAction = [<IconButton key={"del"} edge="end" aria-label="delete" onClick={() => { dispatch(removeSortOrder(index)) }}>
                  <Tooltip title="delete">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>]
                if (index !== 0) {
                  secondaryAction.push(<IconButton key={"up"} edge="end" aria-label="up" onClick={() => { dispatch(upSortOrder(index)) }}>
                    <Tooltip title="up">
                      <KeyboardControlKeyIcon />
                    </Tooltip>
                  </IconButton>)
                  secondaryAction.push(<IconButton key={"top"} edge="end" aria-label="top" onClick={() => { dispatch(topSortOrder(index)) }}>
                    <Tooltip title="top">
                      <LastPageIcon sx={{
                        transform: 'rotate(-90deg)'
                      }} />
                    </Tooltip>
                  </IconButton>)
                }
                return editItem(row, index, secondaryAction)



              })}
            </List>
            <SimpleDialog
              selectedValue={sortList}
              open={editList.open}
              onClose={handleClose}
            />
          </Box>
          <Footer />
        </Stack>
      </Box >
    </ThemeProvider >
  )
}

export default ListEditor