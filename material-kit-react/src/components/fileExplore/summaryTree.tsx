/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-05 15:49:06
 * @content: edit your page content
 */
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import HorizontalRuleSharpIcon from '@mui/icons-material/HorizontalRuleSharp';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText, { listItemTextClasses, ListItemTextProps } from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FileTree } from '../../common/interface';
import useStyles from '../../common/styles';
import { useSelector } from "../../redux/hooks";
import { loadLabelPoints,filteLabelPoints } from "../../store/actions/filesAndFoldersActions";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const FireNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 2,
  },
  '& .MuiListItemText-primary': {
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});



const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    border: '1px solid #dadde9',
  },
}));


export const ExpandListText = styled(({ classes, ...props }: ListItemTextProps) => (<ListItemText {...props} classes={classes} />))(({ theme }) => ({
  [`& .${listItemTextClasses.primary}`]: {
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}))

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',

  boxShadow: 0,
  p: 4,
};

interface folderModal {
  open: boolean;
  title?: string;
  type?: number;
  id?: number;
  callback?: Function;
}

function SummaryTree(props) {
  const { loading, datasets, needRefresh } = useSelector((state) => state.dsExplore)
  const [summaryTree, setSummaryTree] = React.useState([]);

  const [statistic, setStatistic] = React.useState(props.statistic);
  const { labelFilter} = useSelector((state) => state.filesAndFolders)
    
    

  const label = props.statistic?props.statistic.label || {}:{}
  // const shape = statistic?statistic.shape || {}:{}
  // const suffix = statistic?statistic.suffix || {}:{}
  // const totalSize = statistic?statistic.totalSize || 0:0
  // const totalCount = statistic?statistic.totalCount || 0:0



  let eventPup = false

  const classes = useStyles();

  const dispatch = useDispatch()

  const inputRef = useRef();


  
  
  useEffect(() => {
    parseSummaryTree()
  console.log("🚀 ~ file: summaryTree.tsx ~ line 147 ~ SummaryTree ~ props.statistic", props.statistic)

  }, [ props.statistic])



  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, tree: FileTree) => {
    if (eventPup) {
      eventPup = false
      return
    }
    setSummaryTree(summaryTree.map(loopTree => {
      if (tree.root.name === loopTree.root.name) {
        loopTree.expanded = !loopTree.expanded
      }
      return loopTree
    }))

  };





  const leafsListItem = (tree, level, isFiles) => {
    const marginRange = 1
    let id = tree.root.id
    let name = tree.root.name
    let value = tree.root.value
    if (tree.root.isDir) {
      let item = (<React.Fragment key={`${id}${name}`}><ListItemButton
        onClick={(event) => handleClick(event, tree)}
        key={`${id}`}
        sx={{ pl: marginRange * level, background: tree.choicen ? '#dedede' : 'transparent' }}>
        {tree.expanded ? <ArrowDropDownOutlinedIcon /> : < ArrowRightOutlinedIcon />}
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <Tooltip title={name} placement="top">
          <ListItemText primary={name} />
        </Tooltip>
      </ListItemButton>
        {tree.expanded ? tree.leaf.map((child) => leafsListItem(child, level + 1, name === 'Files')) : null}
      </React.Fragment>)
      return item
    } else {
      let item = (<React.Fragment key={`${name}${id}`} >
        <ListItemButton
          key={`${id}`}
          sx={{ pl: marginRange * level, background: tree.choicen ? '#dedede' : 'transparent' }}
          onClick={() =>{
            dispatch(filteLabelPoints(name))
          }}>
         {labelFilter.indexOf(name)<0 ?<VisibilityOffIcon sx={{ color: 'gray' }} />: <HorizontalRuleSharpIcon sx={{ color: 'white' }} />}
          <ListItemIcon>
            {isFiles ? <InsertDriveFileIcon /> : < TextSnippetIcon />}
          </ListItemIcon>
          <ListItemText primary={name} />
          <ListItemText primary={value} sx={{ textAlign: 'end' }} />
        </ListItemButton>
      </React.Fragment>)
      return item
    }
  }

  const parseSummaryTree = () => {
    let summary = [];
    if (!isEmpty(label)) {
      dispatch(loadLabelPoints(label))
      summary.push({
        root: { id: 'labeltree', name: 'Labels', value: '', isDir: true }, leaf: Object.keys(label).map((key, idx) => {
          dispatch(filteLabelPoints(key))
          return { root: { id: `${key}-${idx}`, name: key, value: Array.isArray(label[key])? label[key].length:label[key]||0 }, isDir: false }
        }), expanded: false
      })
    }
    // if (!isEmpty(shape)) {
    //   summary.push({
    //     root: { id: 'shapetree', name: 'Shapes', value: '', isDir: true }, leaf: Object.keys(shape).map((key, idx) => {
    //       return { root: { id: `${key}-${idx}`, name: key, value: shape[key] }, isDir: false }
    //     }), expanded: false
    //   })
    // }
    // if (!isEmpty(suffix)) {
    //   summary.push({
    //     root: { id: 'filetree', name: 'Files', value: totalCount, isDir: true }, leaf: Object.keys(suffix).map((key, idx) => {
    //       return { root: { id: `${key}-${idx}`, name: key, value: suffix[key] }, isDir: false }
    //     }), expanded: false
    //   })
    // }
    setSummaryTree(summary)
  }




  const parseFolderList = () => {
    return (<>{summaryTree.map((tree, idx) => {
      return leafsListItem(tree, 0, false)
    })}
    </>)


  }



  return parseFolderList()


}
export default SummaryTree