/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-14 14:31:01
 * @content: edit your page content
 */
import { Card, CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { datasetImg } from '../../store/actions/dsExploreActions'
import { format } from '../../common/utils/dateUtils'
import imgUrl from '../../assert/pexel.jpeg'
import { fileLengthFormat ,numberFormat} from '../../common/utils/dateUtils'
function ExploreList(props) {
    let navigate = useNavigate();
    const dslist = props.dslist


    
    return (<Grid container spacing={2} >
        {dslist.map((card, index) => (
            <Grid item key={index} xs={2}>
                <Card
                    sx={{ display: 'flex', flexDirection: 'column', maxWidth: 200, maxHeight: 250 }}
                >
                    <CardMedia
                        component='img'
                        sx={{
                            minWidth: 200, height: 150,cursor: 'pointer',minHeight:150,
                        }}
                        src={card.coverImg|| imgUrl}
                        onClick={() =>{ 
                            navigate(`/dataset/${card.id}`,{state:card})
                        }}
                    />
                    <CardContent sx={{ flexGrow: 0 }}>
                        <Stack direction="column" alignItems="flex-start" justifyContent="flex-start" spacing={0} >
                            <Typography variant="caption"  sx={{
                                whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',width:'95%'
                            }} >
                                {card.dataSetName}
                            </Typography>
                            <Typography variant="caption" >
                                {card.creatorFullName}
                            </Typography>
                            <Typography variant="caption">
                                updated  {format(card.modifyTime, 'yyyy-MM-dd hh:mm')}
                            </Typography>
                            <Stack direction="row" alignItems="flex-start" justifyContent="flex-start" spacing={1} >
                                <Typography variant="caption"><span style={{ fontWeight: 'bolder' }}>{card.visitCount}</span>Used</Typography>
                                <Typography variant="caption">·</Typography>
                                <Typography variant="caption">
                                <span style={{ fontWeight: 'bolder' }}>{card.statistic?fileLengthFormat(card.statistic.totalSize,1) :'0 kb'}</span>   
                                </Typography>
                                <Typography variant="caption">·</Typography>
                                <Typography variant="caption">
                                <span style={{ fontWeight: 'bolder' }}>{card.statistic? numberFormat(card.statistic.totalCount,1):0}Files</span>
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        ))
        }
    </Grid >)
}
export default ExploreList