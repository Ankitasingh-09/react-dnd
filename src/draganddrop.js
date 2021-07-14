import React, { useState } from "react";
import Draggable from "react-draggable";
import Xarrow from "react-xarrows";

const DragnDrop = () => {
  const data = [{ name: "box1" }, { name: "box2" }, { name: "box3" }];
  const [tasks, setTasks] = useState([]);
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});

  const handleDrag = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const onDragOver = e => {
    e.preventDefault();
  };

  const onDrop = e => {
    let id = e.dataTransfer.getData("id");

    let filteredTasks = data.filter(task => {
      return task.name === id;
    });

    if (tasks.length) {
      filteredTasks.unshift(...tasks);
    }

    if (tasks.length > 2) {
    }

    setTasks(filteredTasks);
  };

  const renderTasks = item => {
    return (
      <Draggable onStop={forceRerender} onDrag={forceRerender}>
        <div className="box taskbox" key={item.name} id={item.name}>
          {item.name}
        </div>
      </Draggable>
    );
  };

  const otherProps = {
    onClick: e => {
      e.stopPropagation();
      console.log(e);
    },
    cursor: "pointer"
  };

  return (
    <div className="container">
      <div className="palette">
        <div
          className="box"
          draggable
          onDragStart={e => handleDrag(e, "box1")}
        ></div>
        <div
          className="box"
          draggable
          onDragStart={e => handleDrag(e, "box2")}
        ></div>
        <div
          className="box"
          draggable
          onDragStart={e => handleDrag(e, "box3")}
        ></div>
      </div>
      <div
        className="canvas"
        onDragOver={e => onDragOver(e)}
        onDrop={e => onDrop(e)}
      >
        {tasks.map(renderTasks)}
        {tasks.length > 2 && (
          <Xarrow start="box1" end={"box2"} {...otherProps} />
        )}
      </div>
    </div>
  );
};

export default DragnDrop;
