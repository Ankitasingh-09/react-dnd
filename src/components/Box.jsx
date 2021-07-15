import React, { useState } from "react";
import "./Box.css";
import validateConnection from "../ruleEngine";
import { Rnd } from "react-rnd";

const Box = props => {
  const [config, setConfig] = useState({
    width: "200",
    height: "200"
  });

  const handleDrag = (e, d) => {
    props.setBoxes(boxes => {
      return boxes.map(box =>
        box.id === props.box.id ? { ...box, x: d.x, y: d.y } : box
      );
    });
  };

  const handleClick = e => {
    e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
    if (props.actionState === "Normal") {
      props.handleSelect(e);
    } else if (
      props.actionState === "Add Connections" &&
      props.selected.id !== props.box.id
    ) {
      const validBoolState = validateConnection(
        "awsComponent",
        props.selected.id,
        props.box.id.toLowerCase()
      );
      if (!validBoolState) return props.setActionState("Error");
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
      <Rnd
        size={{ width: config.width, height: config.height }}
        position={{ x: props.box.x, y: props.box.y }}
        onDragStart={() => props.position !== "static"}
        // bounds="parent"
        onDragStop={(e, d) => handleDrag(e, d)}
        onResize={(e, direction, ref, delta, position) => {
          setConfig({
            width: ref.style.width,
            height: ref.style.height,
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
          <img alt="src" src={props.box.img} id={props.box.id} />
          <p>{props.box.name}</p>
        </div>
      </Rnd>
    </React.Fragment>
  );
};

export default Box;
