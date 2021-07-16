import React, { createRef, useState } from "react";
import * as htmlToImage from 'html-to-image';
import "./Playground.css";
import Box from "./components/Box";
import TopBar from "./components/TopBar";
import XArrow from "./components/Xarrow";
const YAML = require("json-to-pretty-yaml");


const images = [
  {
    id: "1",
    name: "S3",
    type: "wideBox",
    friendlyName: "S3 Bucket",
    img:
      "https://cdn.iconscout.com/icon/free/png-512/amazon-s3-2968702-2464706.png"
  },
  {
    id: "2",
    name: "Cloudfront",
    type: "wideBox",
    friendlyName: "Cloudfront Distribution",
    img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTBt_980KKQlrbjPhDP5uZND3Y_Jtv3ZLe3nbBomQUvQitIh2X9ket3rE_isWy20DfFk0&usqp=CAU"
  },
  {
    id: "3",
    name: "Users",
    type: "wideBox",
    friendlyName: "Users/Client",
    img: "https://static.thenounproject.com/png/428433-200.png"
  },
  {
    id: "4",
    name: "EC2",
    type: "wideBox",
    friendlyName: "EC2 Instance",
    img:
      "https://images.squarespace-cdn.com/content/v1/5500a991e4b0ed07e64029e1/1441073679931-NG5IMHQXY8PCNIIQ8LY6/image-asset.png?format=500w"
  },
  {
    id: "5",
    name: "DynamoDB",
    type: "wideBox",
    friendlyName: "Dynamo DB",
    img: "https://upload.wikimedia.org/wikipedia/commons/f/fd/DynamoDB.png"
  },
  {
    id: "6",
    name: "Lambda",
    type: "wideBox",
    friendlyName: "Lambda Function",
    img:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Orange_lambda.svg/980px-Orange_lambda.svg.png"
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
  const [ymlVal, setYmlVal] = useState("");
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [selected, setSelected] = useState(null);
  const [actionState, setActionState] = useState("Normal");
  const ref = createRef(null);

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
      let uniqueVal = new Date().getTime().toString();
      uniqueVal = uniqueVal.slice(uniqueVal.length - 2);
      var newName = result[0].name + "_" + uniqueVal;
      if (newName) {
        let newBox = {
          id: newName,
          name: result[0].name,
          x: e.clientX - x,
          y: e.clientY - y,
          shape,
          img: result[0].img,
          friendlyName: result[0].friendlyName
        };
        setBoxes([...boxes, newBox]);
      }
    }
  };

  const generateYml = () => {
    let models = [];
    setShowDownloadButton(false);
    lines.map((item, index) => {
      let startKey = item.props.start;
      let startObj = {
        uniqueName: boxes.find(item => item.id === startKey).name,
        friendlyName: boxes.find(item => item.id === startKey).friendlyName
      };
      if (startObj.uniqueName !== "Users") {
        startKey = "Component";
      } else {
        startKey = startObj.uniqueName;
      }
      models.push({ [startKey]: startObj });

      if (index === lines.length - 1) {
        let endKey = item.props.end;
        let endObj = {
          uniqueName: boxes.find(item => item.id === endKey).name,
          friendlyName: boxes.find(item => item.id === endKey).friendlyName
        };
        if (endObj.uniqueName !== "Users") {
          endKey = "Component";
        } else {
          endKey = endObj.uniqueName;
        }
        models.push({ [endKey]: endObj });
      }
    });
    if (models && models.length) setShowDownloadButton(true);
    let yamlValue = YAML.stringify({ model: models });
    setYmlVal(yamlValue);
  };

  const downloadYml = () => {
    // file download
    let yamlContent = "data:text/yaml;charset=utf-8," 
    + ymlVal;
    var encodedUri = encodeURI(yamlContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.yaml");
    document.body.appendChild(link);
    link.click(); // This will download the data file named "data.yaml".
  
   
  //  image download
    ref.current.style.background = 'white';
    ref.current.style.backgroundImage = "none";
     document.getElementsByClassName('topBarStyle')[0].style.display = 'none';
    htmlToImage.toPng(ref.current)
      .then(function (dataUrl) {
       
      let a = document.createElement("a");
        a.href = dataUrl;
         a.download = 'image.png';
        a.click();
       ref.current.style.backgroundImage = "url('https://cdn.shopify.com/s/files/1/2362/8001/products/Huacan-Diamond-Painting-Cross-Stitch-Accessories-Diamond-Embroidery-White-Canvas-DIY-Full-Square-Diamond-Mosaic-Pasted_19c77bd0-3092-4924-8a57-c39a9b3feae5_800x.jpg?v=1582230362')";
      ref.current.style.backgroundSize = 'cover';
        document.getElementsByClassName('topBarStyle')[0].style.display = 'none';
      });
    
 
  }

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
          ref={ref}
        >
          <TopBar {...props} />

          {boxes.map(box => (
            <Box
              {...boxProps}
              key={box.id}
              box={box}
              position="absolute"
              sidePos="middle"
              setActionState={props.setActionState}
            />
          ))}

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

      <div className="scriptContainer">
        <button onClick={generateYml}>Generate Yml</button>
        {showDownloadButton && <button onClick={downloadYml}>Download File</button>}
        <div>
          <pre>{ymlVal}</pre>
        </div>
      
      </div>
    </div>
  );
};
export default PlayGround;
