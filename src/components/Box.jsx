import React, { useState } from "react";
import styled from "styled-components";
import "./Box.css";
import Draggable from "react-draggable";
import awsIcon from "../assets/awsIcon.svg";
import { Rnd } from "react-rnd";

const BorderStyle = styled.div`
  border: ${props =>
    props.border === "Solid" ? "solid 2px #232F3F" : "dashed 2px #008000"};
  width: 100%;
  height: 100%;
`;

const Logo = styled.img`
  display: ${props => (props.border === "Solid" ? "block" : "none")};
  background: #232f3f;
  width: calc(100% - 92%);
  height: calc(100% - 95%);
  min-height: 20px;
  min-width: 30px;
  top: 0%;
  left: 0%;
  position: absolute;
  &:after {
    content: "Joe's Task: ";
  }
`;

const Box = props => {
  const [config, setConfig] = useState({
    width: "100",
    height: "100"
  });

  const handleDrag = () => {
    props.setBoxes([...props.boxes]);
  };

  const handleDragBox = (e, d) => {
    props.setBoxes(boxes => {
      return boxes.map(box =>
        box.id === props.box.id ? { ...box, x: d.x, y: d.y } : box
      );
    });
  };

  const handleClick = e => {
    e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
    if (props.actionState === "Normal") {
      props.handleSelect(e, props.box.type);
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
    background =
      props?.box?.type === "wideBox"
        ? "rgb(200, 200, 200)"
        : "rgba(220, 240, 250,0.5)";
  } else if (
    (props.actionState === "Add Connections" &&
      // props.sidePos !== "right" &&
      props.box.type === props.selected.connectionType &&
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
      {/* {props.box.img && (
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
              zIndex: 1,
              background,
              borderRadius: "0.5em",
              padding: "0.3em"
            }}
            onClick={handleClick}
            id={props.box.id}
          >
            <img alt="src" src={props.box.img} id={props.box.id} />
            <p> {props.box.name}</p>
          </div>
        </Draggable>
      )} */}

      <Rnd
        size={{ width: config.width, height: config.height }}
        position={{ x: props.box.x, y: props.box.y }}
        onDragStart={() => props.position !== "static"}
        // bounds="parent"
        onDragStop={(e, d) => handleDragBox(e, d)}
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
          {!props.box.img && (
            <>
              <BorderStyle border={props.box.name} id={props.box.id} />
              <Logo border={props.box.name} src={awsIcon} />
            </>
          )}
          {props.box.img && (
            <>
              <img
                className="componentImage"
                alt="src"
                src={props.box.img}
                id={props.box.id}
              />
              <p> {props.box.name}</p>
            </>
          )}
        </div>
      </Rnd>
    </React.Fragment>
  );
};

export default Box;
