/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-03-30 12:05:45
 * @content: edit your page content
 */
import { Favorite, MoreHoriz as ExpandMore } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import imgUrl from '../../assert/pexel.jpeg'

function DataSetList(props) {
    // let size = function(){return Math.floor(0.5+Math.random() * 8)*100}
    let navigate = useNavigate();
    const size = props.size

    let dslist
    if (props.dslist.length > size) {
        dslist = props.dslist.slice(0, size)
    } else {
        dslist = props.dslist
    }

    return (<Grid container spacing={4} >
        {dslist.map((card, index) => (
            <Grid item key={index} xs={3}>
                <Card
                    sx={{ display: 'flex', flexDirection: 'column', maxWidth: 300, maxHeight: 360 }}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            minWidth: 300, minHeight: 200,cursor: 'pointer'
                        }}
                        src={card.coverImg || imgUrl}
                        alt="random"
                        onClick={()=>{
                            navigate(`/dataset/${card.id}`)
                        }}
                    />
                    <CardContent sx={{ flexGrow: 0 }}>
                        <Typography gutterBottom variant="h6" >
                            {card.title}
                        </Typography>
                        <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={1} >
                            <Typography variant="caption">
                                {card.dataSetName}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={1} >
                            <Typography variant="caption">
                                {card.creator}
                            </Typography>
                            <Typography variant="caption">
                                ·
                            </Typography>
                            <Typography variant="caption">
                                {`Last updated ${moment(card.modifyTime).fromNow()}`}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={1} >
                            <Typography variant="caption">
                                Used  <span style={{ fontWeight: 'bolder' }}>{card.visitCount}</span>
                            </Typography>
                            <Typography variant="caption">
                                ·
                            </Typography>
                            <Typography variant="caption">
                                {card.fileSize}
                            </Typography>
                            <Typography variant="caption">
                                ·
                            </Typography>
                            <Typography variant="caption">
                                {card.statistic === null ? 0 : card.statistic.totalCount} Files
                            </Typography>
                        </Stack>

                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites" color={card.favourite ? "primary" : "default"}>
                            <Favorite />
                            <Typography variant="caption">
                                {card.favouriteCount}
                            </Typography>
                        </IconButton>
                        <IconButton aria-label="share" onClick={() => {
                            navigate(`/dataset/${card.id}`)
                        }}>
                            <ExpandMore />
                        </IconButton>
                        {/* <Button size="small" onClick={() => {
                            navigate(`/dataset/${card.id}`)
                        }}>View</Button> */}
                        {/* <Button size="small">Edit</Button> */}
                    </CardActions>
                </Card>
            </Grid>
        ))}
    </Grid>)
}
export default DataSetList