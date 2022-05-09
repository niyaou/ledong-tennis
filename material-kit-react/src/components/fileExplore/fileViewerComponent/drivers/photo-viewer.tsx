/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-02-09 13:41:31
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-05-05 15:46:41
 * @content: edit your page content
 */
// Copyright (c) 2017 PlanGrid, Inc.


import React, { Component, useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { isEqual } from 'lodash'
import { G, SVG } from '@svgdotjs/svg.js'
import { useSelector } from "../../../../redux/hooks";
import { stringToColor } from '../../../../common/utils/dateUtils';
import '@svgdotjs/svg.draggable.js'
function PhotoViewer(props) {
  const ref = useRef()
  const container = document.getElementById('pg-viewer');
  const [height, setHeight] = React.useState(container.clientHeight);
  const [width, setWidth] = React.useState(container.clientWidth);
  const [imageScale, setImageScale] = React.useState(1);
  const [svg, setSvg] = React.useState(null);
  const [svgGroup, setSvgGroup] = React.useState(null);

  const [imgSvg, setImgSvg] = React.useState(null);
  const [labelSvg, setLabelSvg] = React.useState(null);
  let scale = 1
  const [url, setUrl] = React.useState('/');
  const [labelItem, setLabelItem] = React.useState([]);
  const { labelPoints, labelFilter } = useSelector((state) => state.filesAndFolders)

  const usePrevious = (value: any) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  const preProps = usePrevious(props)

  const getImageDimensions = () => {

    const loader = new THREE.TextureLoader();

    loader.load(
      // resource URL
      url,
      // Function when resource is   loaded
      (texture) => {

        const originalWidth = texture.image.width
        const originalHeight = texture.image.height
        if (originalWidth && originalHeight) {
          // Scale image to fit into viewer
          let imgHeight;
          let imgWidth;
          const viewerHeight = height
          const viewerWidth = width

          if (originalHeight <= viewerHeight && originalWidth <= viewerWidth) {
            imgWidth = originalWidth;
            imgHeight = originalHeight;
          } else {
            const heightRatio = viewerHeight / originalHeight;
            const widthRatio = viewerWidth / originalWidth;
            if (heightRatio < widthRatio) {
              imgHeight = originalHeight * heightRatio;
              imgWidth = originalWidth * heightRatio;
              setImageScale(heightRatio)
            } else {
              imgHeight = originalHeight * widthRatio;
              imgWidth = originalWidth * widthRatio;
              setImageScale(widthRatio)
            }
          }
          setHeight(imgHeight)
          setWidth(imgWidth)
        }
      }
    );

  }


  useEffect(() => {
    if (isEqual(preProps, props)) { return }
    if (props.data) {
      try {
        setUrl(window.URL.createObjectURL(props.data))
      } catch (e) {
      }
    }
  }, [props])



  const [lastPosition, setLastPosition] = React.useState({ x: 0, y: 0 });
  const [moveActive, setMoveActive] = React.useState(false);


  const renderSVG = () => {
    let svgNode = SVG().addTo('#svg-frame').size(width, height)
    setSvg(svgNode)
  }

  const componentScale = (event) => {
    scale = svgGroup.transform().scaleX * (event.deltaY > 0 ? 1.25 : 0.75)
    if (scale === 1) {
      scale = event.deltaY > 0 ? 1.25 : 0.75
    }
    if (event.deltaY > 0 && scale <= 1) {
      scale = 1.25
    }
    if (event.deltaY < 0 && scale >= 1) {
      scale = 0.75
    }
    if (svgGroup.transform().scaleX * scale > 5) {
      scale = 1
    }
    if (svgGroup.transform().scaleX * scale < 0.2) {
      scale = 1
    }
    svgGroup.scale(scale, 0, 0)
  }

  const resetScale = () => {
    if (svgGroup) {
      let resetScale = 1 / svgGroup.transform().scaleX
      console.log("🚀 ~ file: photo-viewer.tsx ~ line 134 ~ resetScale ~11111111 resetScale", resetScale,svgGroup.transform().scaleX)
      svgGroup.scale(resetScale, 0, 0)
      console.log("🚀 ~ file: photo-viewer.tsx ~ line 134 ~ resetScale ~ 2222222resetScale", resetScale,svgGroup.transform().scaleX)
    }
  }





  useEffect(() => {
    if (url !== '/') {
      getImageDimensions()
    }

    if (svgGroup) {
      if (url && !imgSvg) {
        var imageSvg = svgGroup.group()
        let img = imageSvg.image(url, width, height)
        img.on('load', (event): void => {
          console.log("🚀 ~ file: photo-viewer.tsx ~ line 149 ~ imageSvg.on ~ canvasInstance,addEventListener", event)
          let canvasInstance = document.getElementById('svg-frame')
          canvasInstance&&  canvasInstance.addEventListener('wheel', componentScale);
        })
        setImgSvg(imageSvg)
      }
    }
  }, [svgGroup, url])



  useEffect(() => {

    if (!svg) {
      renderSVG()

    }




    if (svg && labelPoints) {
      // let canvasInstance = document.getElementById('svg-frame')

      let ground = svgGroup

      if (!svgGroup) {
        ground = svg.group()
        resetScale()
        // ground.on('mousedown', (e) => {
        //   setMoveActive(true)
        //   setLastPosition({ x: e.clientX, y: e.clientY })
        //   console.log("🚀 ~ file: photo-viewer.tsx ~ line 111111111 ~ ground.on ~ e", e)
        // });
        ground.draggable()
        //   .on('dragstart', (): void => {
        //     console.log("🚀 ~ file: photo-viewer.tsx ~ line 184 ~ ground.draggable ~ dragstart")
        // })

        // ground.on('mouseup', (e) => {
        //   setMoveActive(false)
        //   console.log("🚀 ~ file: photo-viewer.tsx ~ line 22222222222 ~ ground.on ~ e", e)
        // });
        // ground.on('click', (e) => {

        //   console.log("🚀 ~ file: photo-viewer.tsx ~ line 333333333333 ~ ground.on ~ e", e)
        // });
        // ground.on('mousemove', (e) => {
        //   if (moveActive) {
        //     console.log("🚀 ~ file: photo-viewer.tsx ~ line 444444444444 ~ ground.on ~ e", (e.clientX - lastPosition.x), (e.clientY - lastPosition.y))
        //     setLastPosition({ x: e.clientX, y: e.clientY })
        //   }
        // });
        setSvgGroup(ground)
      }
      let g
      if (labelSvg) {
        labelSvg.remove()
        // canvasInstance.removeEventListener('wheel', componentScale)
      }
      g = ground.group()

      Object.keys(labelPoints).forEach((key) => {
        if (labelFilter.indexOf(key) > -1) {

          console.log("🚀 ~ file: photo-viewer.tsx ~ line 223 ~ labelPoints[key]&&labelPoints[key].forEach ~ labelPoints[key]", labelPoints[key])
         Array.isArray(labelPoints[key])&& labelPoints[key].forEach((label) => {
            g.polygon([]).plot([[label.boxPoint.left * 1, label.boxPoint.top * 1], [label.boxPoint.right * 1, label.boxPoint.top * 1],
            [label.boxPoint.right * 1, label.boxPoint.bottom * 1], [label.boxPoint.left * 1, label.boxPoint.bottom * 1]]).fill('none').stroke({ width: 2, color: stringToColor(key) });
          })
        }
      })
      setLabelSvg(g)
    }

  }, [svg, labelPoints, labelFilter, width, height])



  // useEffect(() => {
  // }, [ labelFilter])








  const render = () => {
    const containerStyles = {
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: '10px',
    };

    return (
      <div className="photo-viewer-container"  >
        <div id="svg-frame" style={{ ...containerStyles, background: 'transparent', position: 'absolute' }}></div>
        {/* <img src={url} style={containerStyles} id="pg-photo-container" alt="can not load this img" /> */}
      </div>
    );
  }

  return render()
}

export default PhotoViewer