import React, { useState } from "react";
import "./Playground.css";
import Box from "./components/Box";
import TopBar from "./components/TopBar";
import XArrow from "./components/Xarrow";

const shapes = ["wideBox"];

const images = [
  {
    id: "1",
    name: "S3",
    type: "wideBox",
    img:
      "https://cdn.iconscout.com/icon/free/png-512/amazon-s3-2968702-2464706.png"
  },
  {
    id: "2",
    name: "Cloudfront",
    type: "wideBox",
    img: "https://logowik.com/content/uploads/images/aws-cloudfront6788.jpg"
  },
  {
    id: "3",
    name: "Users",
    type: "wideBox",
    img: "https://static.thenounproject.com/png/428433-200.png"
  }
];

const PlayGround = () => {
  const [interfaces, setInterfaces] = useState([
    {
      id: "static1",
      shape: "interfaceBox",
      type: "input"
    },
    {
      id: "static2",
      shape: "interfaceBox",
      type: "output"
    }
  ]);

  const [boxes, setBoxes] = useState([]);
  const [lines, setLines] = useState([]);

  const [selected, setSelected] = useState(null);
  const [actionState, setActionState] = useState("Normal");

  const handleSelect = e => {
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else setSelected({ id: e.target.id, type: "box" });
  };

  const handleDropDynamic = e => {
    let shape = e.dataTransfer.getData("shape");
    let result = images.filter(item => item.name === shape);
    if (result.length > 0) {
      let { x, y } = e.target.getBoundingClientRect();
      var newName = result[0].name;
      if (newName) {
        let newBox = {
          id: newName,
          x: e.clientX - x,
          y: e.clientY - y,
          shape,
          img: result[0].img
        };
        setBoxes([...boxes, newBox]);
      }
    }
  };

  const props = {
    interfaces,
    setInterfaces,
    boxes,
    setBoxes,
    selected,
    handleSelect,
    actionState,
    setActionState,
    lines,
    setLines
  };

  const boxProps = {
    boxes,
    setBoxes,
    selected,
    handleSelect,
    actionState,
    setLines,
    lines
  };

  return (
    <div className="container">
      <div
        className="canvasStyle"
        id="canvas"
        onClick={() => handleSelect(null)}
      >
        <div className="toolboxMenu">
          <div className="toolboxTitle">AWS Components</div>
          <hr />
          <div className="toolboxContainer">
            {images.map(shapeName => (
              <div
                key={shapeName.id}
                className="imgContainer"
                onDragStart={e =>
                  e.dataTransfer.setData("shape", shapeName.name)
                }
                draggable
              >
                <img alt="src" src={shapeName.img} />
                {shapeName.name}
              </div>
            ))}
          </div>
        </div>

        <div
          id="boxesContainer"
          className="boxesContainer"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropDynamic}
        >
          <TopBar {...props} />

          {boxes.map(box => (
            <Box
              {...boxProps}
              key={box.id}
              box={box}
              position="absolute"
              sidePos="middle"
            />
          ))}
        </div>

        {/* xarrow connections*/}
        {lines.map((line, i) => (
          <XArrow
            key={line.props.root + "-" + line.props.end + i}
            line={line}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
    </div>
  );
};
export default PlayGround;
