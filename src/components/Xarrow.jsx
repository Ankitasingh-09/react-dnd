import React, { useState } from "react";
import Xarrow from "react-xarrows";

const XArrow = ({ setSelected, selected, line: { props } }) => {
  const [state, setState] = useState({ color: "#000" });
  const defProps = {
    passProps: {
      className: "xarrow",
      onMouseEnter: () => setState({ color: "IndianRed" }),
      onMouseLeave: () => setState({ color: "#000" }),
      onClick: e => {
        e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
        setSelected({
          id: { start: props.root, end: props.end },
          type: "arrow"
        });
      },
      cursor: "pointer",
      strokeWidth: 1.5
    }
  };
  let color = state.color;
  if (
    selected &&
    selected.type === "arrow" &&
    selected.id.root === props.root &&
    selected.id.end === props.end
  )
    color = "#000";
  return (
    <Xarrow headSize={3} {...{ ...defProps, ...props, ...state, color }} />
  );
};

export default XArrow;
