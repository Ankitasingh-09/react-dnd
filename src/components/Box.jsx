import React,{useEffect, useState} from "react";
import styled from 'styled-components';
import "./Box.css";
import Draggable from "react-draggable";
import awsIcon from '../assets/awsIcon.svg';
import { Rnd } from "react-rnd";
import calculateWidthHeight from "../utils/calculateCoordinates";
import calculateBoundingAreas from "../utils/calculateBoundingArea";

const BorderStyle = styled.div`
border:${(props) => props.border === 'Solid' ? 'solid 2px #232F3F' : 'dashed 2px #008000'};
width:100%;
height:100%;
`;

const Logo = styled.img`
display:${(props) => props.border === 'Solid' ? 'block' : 'none'};
background:#232F3F;
width: calc(100% - 92%);
height: calc(100% - 95%);
min-height:20px;
min-width:30px;
top: 0%;
left: 0%;
position: absolute;
&:after{
  content: "Joe's Task: ";
}
`;



const Box = props => {
  const [config, setConfig] = useState({
    width: "100",
    height: "100"
  });

  const [coordSelectedBox, setCoordSelectedBox] = useState({
    x: props.box.x,
    y:props.box.y,
  })
  
  const [locationCoordinates, setLocationCoordinates] = useState({});

  
  useEffect(() => {
    calculateCoordinates();
},[])

  const calculateCoordinates = () => {
    const location = {};
    console.log("bbbbb", props);

    // props.boxes.map(box => {
      // console.log("calleddd again and again");
     const widthHeight = calculateWidthHeight(props.box.x,props.box.y,config.width,config.height);
      location[props.box.id] = {
        x1: props.box.x,
        y1: props.box.y,
        x2: widthHeight.boxWidth,
        y2:widthHeight.boxHeight,
      }
    // })
    setLocationCoordinates({
      ...locationCoordinates,
      ...location
    });
    
   
  }
  
  const handleDrag = () => props.setBoxes([...props.boxes]);

  const handleDragBox = (e, d) => {
    props.setBoxes(boxes => {
      return boxes.map(box => {
        if (box.id === props.box.id) {
          console.log("bbbbbbbb", box.id,d.x,d.y,config.width,config.height);
          setCoordSelectedBox({
            x: d.x,
            y:d.y,
          })
          calculateDragAndDropCoordinates(box.id, d.x, d.y,config.width,config.height)
          return { ...box, x: d.x, y: d.y }
        }
        else {return  box }
       } );
    });
  };

  const calculateDragAndDropCoordinates = (id,x,y,offsetWidth,offsetHeight) => {
    const location = [];
    console.log("coord",x,y,offsetWidth,offsetHeight,typeof x,typeof offsetWidth)
    const widthHeight = calculateWidthHeight(x, y,offsetWidth,offsetHeight);
    location[id] = {
      x1: x,
      y1: y,
      x2: widthHeight.boxWidth,
      y2: widthHeight.boxHeight,
    };
    setLocationCoordinates({
      ...locationCoordinates,
      ...location
})
    
}

  const handleClick = e => {
   
    e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
    if (props.actionState === "Normal") {
      props.handleSelect(e,props.box.type);
    } else if (
      props.actionState === "Add Connections" &&
      props.selected.id !== props.box.id
    ) {
      return props.setLines(lines => [
        ...lines,
        {
          props: { start: props.selected.id, end: props.box.id }
        }
      ]);
    } else if (props.actionState === "Remove Connections") {
      props.setLines(lines =>
        lines.filter(
          line =>
            !(line.root === props.selected.id && line.end === props.box.id)
        )
      );
    }
  };
 
  let background = null;
  if (props.selected && props.selected.id === props.box.id) {
    background = props?.box?.type==="wideBox"?"rgb(200, 200, 200)":"rgba(220, 240, 250,0.5)";
  } else if (
    (props.actionState === "Add Connections" &&
      // props.sidePos !== "right" &&
      props.box.type===props.selected.connectionType &&
      props.lines.filter(
        line => line.root === props.selected.id && line.end === props.box.id
      ).length === 0) ||
    (props.actionState === "Remove Connections" &&
      props.lines.filter(
        line => line.root === props.selected.id && line.end === props.box.id
      ).length > 0)
  ) {
    
    background = "LemonChiffon";
  }

  // if (locationCoordinates) {
  //    const boundedAreas = calculateBoundingAreas(locationCoordinates);
  // }
  console.log({locationCoordinates})
  return (
    <React.Fragment>
       <Rnd
        size={{ width: `${config.width}px`, height: `${config.height}px`}}
        position={{ x: props.box.x, y: props.box.y }}
        onDragStart={() => props.position !== "static"}
        // bounds="parent"
        onDragStop={(e, d) => handleDragBox(e, d)}
        onResize={(e, direction, ref, delta, position) => {
          calculateDragAndDropCoordinates(ref.id,coordSelectedBox.x,coordSelectedBox.y,ref.offsetWidth,ref.offsetHeight);
          setConfig({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position
          });
       
        }}
        className={`${props.box.shape} ${props.position} imageContainer`}
        id={props.box.id}
        ref={props.box.ref}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background
          }}
          onClick={handleClick}
        >
          {props.box.img && (
            <>
            <img alt="src" src={props.box.img} id={props.box.id} />
            <p> {props.box.name}</p>
            </>
          )}
          {!props.box.img && (
          <>
          <BorderStyle border={props.box.name} id={props.box.id} />
          <Logo border={props.box.name} src={awsIcon}/>
          </>
          )}
        </div>
      </Rnd>
    
    </React.Fragment>
  );
};

export default Box;
