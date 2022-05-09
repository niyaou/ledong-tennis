/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-23 15:42:53
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-01-18 17:37:57
 * @content: edit your page content
 */
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Stack, ToggleButton, ToggleButtonGroup, Typography, Box, Grid, Zoom } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { connect, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from "../../redux/hooks";
import qs from 'qs'

function TopicBtn(props) {
  const CircleButton = styled(Button)({ borderRadius: '20px', })
  let navigate = useNavigate();

  let topicParams = [
    { id: 'favourite', name: "Favorite" },
    { id: 'hot', name: "Hot" },
    { id: 'trending', name: "Trending " },
    { id: 'recommend', name: "What's new" },
  ]

  let topicMap = new Map();
  topicParams.map(entry => {
    topicMap.set(entry.id, entry)
  })

  let params = props.params
  let paramTopic: string = params['topic']
  let currentTopic = topicMap.get(paramTopic)

  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} arrow placement="top" TransitionComponent={Zoom} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'white',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 'none',
      fontSize: theme.typography.pxToRem(12),
      border: '0px solid #dadde9',
    },
  }));

  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <div>
            {topicParams.map((content, index) => {
              return (
                <CircleButton
                  key={index}
                  value={content.id}
                  size="small"
                  variant={currentTopic && currentTopic.id === content.id.toString() ? "contained" : "outlined"}
                  sx={{ margin: '5px' }}
                  onClick={
                    (e) => {
                      if (currentTopic && currentTopic.id === e.target.value) {
                        navigate(`/explore`)
                      } else {
                        navigate(`/explore?topic=${e.target.value}`)
                      }
                    }
                  }
                >
                  {content.name}
                </CircleButton>
              )
            }
            )}
          </div>
        </ React.Fragment>} >
      <CircleButton variant={currentTopic !== undefined ? "contained" : "outlined"} size="small">
        {currentTopic !== undefined ? currentTopic.name : 'Select Topic'}
      </CircleButton>
    </HtmlTooltip>
  )
}
export default TopicBtn