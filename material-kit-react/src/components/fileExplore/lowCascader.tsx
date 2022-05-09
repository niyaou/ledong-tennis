/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2021-12-17 11:19:45
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-07 14:02:53
 * @content: edit your page content
 */
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';

import { MenuItem, Select, Stack } from '@mui/material';

import { findIndex } from 'lodash';





function LowCascader(props) {

    const items = props.items
    const tagsAndScenes = props.tagsAndScenes
    const title = props.title
    const callBack = props.callBack
    const initChoiceValue = (tagsAndScenes, position) => {

        if (tagsAndScenes.length === 0) {
            if (position === 0) {
                return { value: 0, label: '' }
            }
        }

        if (tagsAndScenes.length === 1) {
            let tagIndex = findIndex(items, (o) => o.label === tagsAndScenes[0])
            if (tagIndex < 0) {
                // setChoice0({ value: 0, label: '' })
                if (position === 0) {
                    return { value: 0, label: '' }
                }
            } else {
                if (position === 0) {
                    return items[tagIndex]
                }
                // setChoice0(items[tagIndex])
            }
        }
        if (tagsAndScenes.length === 2) {
            let tagIndex = findIndex(items, (o) => {
                return o.label === tagsAndScenes[0]
            })
            if (position === 0) {
                return items[tagIndex]
            }
            // setChoice0(items[tagIndex])
            let tagIndex1 = findIndex(items[tagIndex].children, (o) => o.label === tagsAndScenes[1])

            if (position === 1) {
                return items[tagIndex].children[tagIndex1]
            }
            // setChoice1(items[tagIndex].children[tagIndex1])

        }
        if (tagsAndScenes.length === 3) {
            let tagIndex = findIndex(items, (o) => o.label === tagsAndScenes[0])
            // setChoice0(items[tagIndex])
            if (position === 0) {
                return items[tagIndex]
            }
            let tagIndex1 = findIndex(items[tagIndex].children, (o) => o.label === tagsAndScenes[1])
            // setChoice1(items[tagIndex].children[tagIndex1])
            if (position === 1) {
                return items[tagIndex].children[tagIndex1]
            }
            if (position === 2) {
                let tagIndex2 = findIndex(items[tagIndex].children[tagIndex1].children, (o) => o.label === tagsAndScenes[2])
                return items[tagIndex].children[tagIndex1].children[tagIndex2]
            }
            // setChoice2(items[tagIndex].children[tagIndex1].children[tagIndex2])

        }
        if (tagsAndScenes.length === 4) {
            let tagIndex = findIndex(items, (o) => o.label === tagsAndScenes[0])
            // setChoice0(items[tagIndex])
            if (position === 0) {
                return items[tagIndex]
            }
            let tagIndex1 = findIndex(items[tagIndex].children, (o) => o.label === tagsAndScenes[1])
            // setChoice1(items[tagIndex].children[tagIndex1])
            if (position === 1) {
                return items[tagIndex].children[tagIndex1]
            }
            let tagIndex2 = findIndex(items[tagIndex].children[tagIndex1].children, (o) => o.label === tagsAndScenes[2])
            // setChoice2(items[tagIndex].children[tagIndex1].children[tagIndex2])
            if (position === 2) {
                return items[tagIndex].children[tagIndex1].children[tagIndex2]
            }

            let tagIndex3 = findIndex( items[tagIndex].children[tagIndex1].children[tagIndex2].children, (o) => o.label === tagsAndScenes[3])
            // setChoice3(items[tagIndex].children[tagIndex1].children[tagIndex2].children[tagIndex3])
            if (position === 3) {
                return items[tagIndex].children[tagIndex1].children[tagIndex2].children[tagIndex3]
            }

        }
        return { value: 0, label: '' }

    }

    const [choice0, setChoice0] = React.useState(initChoiceValue(tagsAndScenes,0));
    const [choice1, setChoice1] = React.useState(initChoiceValue(tagsAndScenes,1));
    const [choice2, setChoice2] = React.useState(initChoiceValue(tagsAndScenes,2));
    const [choice3, setChoice3] = React.useState(initChoiceValue(tagsAndScenes,3));
    const [choice4, setChoice4] = React.useState({ value: 0, label: '' });

    const [labelArr, setLabelArr] = React.useState([]);
    // let labelArr=[];



  
    // useEffect(() => {

    //     if (tagsAndScenes.length === 0) {
    //             setChoice0({ value: 0, label: '' })
    //     }

    //     if (tagsAndScenes.length === 1) {
    //         let tagIndex = findIndex(items, (o) => o.label === tagsAndScenes[0])
    //         if(tagIndex<0){
    //             setChoice0({ value: 0, label: '' })
    //         }else{
    //             setChoice0(items[tagIndex])
    //         }
    //     }
    //     if (tagsAndScenes.length === 2) {
    //         let tagIndex = findIndex(items, (o) => {
    //             return o.label === tagsAndScenes[0]
    //         })
    //         setChoice0(items[tagIndex])
    //         let tagIndex1 = findIndex(items[tagIndex].children, (o) => o.label === tagsAndScenes[1])
    //         setChoice1(items[tagIndex].children[tagIndex1])

    //     }
    //     if (tagsAndScenes.length === 3) {
    //         let tagIndex = findIndex(items, (o) => o.label === tagsAndScenes[0])
    //         setChoice0(items[tagIndex])
    //         let tagIndex1 = findIndex(items[tagIndex].children, (o) => o.label === tagsAndScenes[1])
    //         setChoice1(items[tagIndex].children[tagIndex1])
    //         let tagIndex2 = findIndex(items, (o) => o.label === tagsAndScenes[2])
    //         setChoice2(items[tagIndex].children[tagIndex1].children[tagIndex2])

    //     }
    //     if (tagsAndScenes.length === 4) {
    //         let tagIndex = findIndex(items, (o) => o.label === tagsAndScenes[0])
    //         setChoice0(items[tagIndex])
    //         let tagIndex1 = findIndex(items[tagIndex].children, (o) => o.label === tagsAndScenes[1])
    //         setChoice1(items[tagIndex].children[tagIndex1])
    //         let tagIndex2 = findIndex(items, (o) => o.label === tagsAndScenes[2])
    //         setChoice2(items[tagIndex].children[tagIndex1].children[tagIndex2])

    //         let tagIndex3 = findIndex(items, (o) => o.label === tagsAndScenes[3])
    //         setChoice3(items[tagIndex].children[tagIndex1].children[tagIndex2].children[tagIndex3])

    //     }
    // }, [])


    const parseLabelArr = () => {
        let labelArrs = []
        if (choice0 && choice0.label !== '') {
            labelArrs.push(choice0.label)
        } if (choice1 && choice1.label !== '') {
            labelArrs.push(choice1.label)
        } if (choice2 && choice2.label !== '') {
            labelArrs.push(choice2.label)
        } if (choice3 && choice3.label !== '') {
            labelArrs.push(choice3.label)
        }

        // labelArr=labelArrs
        setLabelArr(labelArrs)
    }

    useEffect(() => {
        parseLabelArr()
    }, [choice0, choice1, choice2, choice3])

    useEffect(() => {
        callBack(labelArr)
    }, [labelArr])

    const handleChange = (value, index) => {
        if (index === 0) {
            setChoice0(value)
            setChoice1({ value: 0, label: '' })
            setChoice2({ value: 0, label: '' })
            setChoice3({ value: 0, label: '' })
        } else if (index === 1) {
            setChoice1(value)
            setChoice2({ value: 0, label: '' })
            setChoice3({ value: 0, label: '' })
        } else if (index === 2) {
            setChoice2(value)
            setChoice3({ value: 0, label: '' })
        } else if (index === 3) { setChoice3(value) }
        else if (index === 4) { setChoice4(value) }


    };


    return (<Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ color: 'rgb(0,0,0,0.6)' }}>
        <Typography gutterBottom variant="body2">{title}</Typography>
        {choice0 && <Select
           sx={{ '& .MuiSelect-select':{   minWidth:100}}}
            value={choice0.value}
            size="small"
        
            onChange={(e: SelectChangeEvent) => {
                let index = findIndex(items, (o) => o.value === e.target.value)
                handleChange(items[index], 0)
            }}
        >

            {items.map((item, index) => { return (<MenuItem key={`level${index}-${index}`} value={item.value}>{item.label}</MenuItem>) })}


        </Select>}
        {choice0 && choice0.children && choice0.children.length > 0 && (<Select
            value={choice1 && choice1.value || -1}
            sx={{ '& .MuiSelect-select':{   minWidth:100}}}
            size="small"
            onChange={(e: SelectChangeEvent) => {
                let index = findIndex(choice0.children, (o) => o.value === e.target.value)
                handleChange(choice0.children[index], 1)
            }}
        >

            {choice0.children.map((item, index) => { return (<MenuItem key={`level${index}-${index}`} value={item.value}>{item.label}</MenuItem>) })}
        </Select>)}

        {choice1 && choice1.children && choice1.children.length > 0 && (<Select
            value={choice2 && choice2.value || -1}
            sx={{ '& .MuiSelect-select':{   minWidth:100}}}
            size="small"
            onChange={(e: SelectChangeEvent) => {
                let index = findIndex(choice1.children, (o) => o.value === e.target.value)
                handleChange(choice1.children[index], 2)
            }}
        >

            {choice1.children.map((item, index) => { return (<MenuItem key={`level${index}-${index}`} value={item.value}>{item.label}</MenuItem>) })}
        </Select>)}

        {choice2 && choice2.children && choice2.children.length > 0 && (<Select
            value={choice3 && choice3.value || -1}
            sx={{ '& .MuiSelect-select':{   minWidth:100}}}
            size="small"
            onChange={(e: SelectChangeEvent) => {
                let index = findIndex(choice2.children, (o) => o.value === e.target.value)
                handleChange(choice2.children[index], 2)
            }}
        >

            {choice2.children.map((item, index) => { return (<MenuItem key={`level${index}-${index}`} value={item.value}>{item.label}</MenuItem>) })}
        </Select>)}

    </Stack>
    )


}
export default LowCascader