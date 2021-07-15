import React from "react";
import "./Box.css";
import Draggable from "react-draggable";
import validateConnection from "../ruleEngine";

const Box = props => {
  const handleDrag = () => props.setBoxes([...props.boxes]);
  const handleClick = e => {
    e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
    if (props.actionState === "Normal") {
      props.handleSelect(e);
    } else if (
      props.actionState === "Add Connections" &&
      props.selected.id !== props.box.id
    ) {
      const validBoolState = validateConnection('awsComponent', props.selected.id, props.box.id.toLowerCase());
      if (!validBoolState) return ( props.setActionState('Error'));   
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
    background = "rgb(200, 200, 200)";
  } else if (
    (props.actionState === "Add Connections" &&
      // props.sidePos !== "right" &&
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

  return (
    <React.Fragment>
      <Draggable
        onStart={() => props.position !== "static"}
        bounds="parent"
        onDrag={e => handleDrag(e, props.box.id)}
      >
        <div
          ref={props.box.ref}
          className={`${props.box.shape} ${props.position} imgContainer`}
          style={{
            left: props.box.x,
            top: props.box.y,
            background
            // border: "black solid 2px",
          }}
          onClick={handleClick}
          id={props.box.id}
        >
          <img alt="src" src={props.box.img} id={props.box.id} />
          <p>{props.box.id}</p>
        </div>
      </Draggable>
    </React.Fragment>
  );
};

export default Box;
