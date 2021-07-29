import React, { createRef, useState } from "react";
import styled from "styled-components";
import * as htmlToImage from "html-to-image";
import "./Playground.css";
import awsIcon from "./assets/awsIcon.svg";
import Box from "./components/Box";
import TopBar from "./components/TopBar";
import { useSelector } from "react-redux";
import XArrow from "./components/Xarrow";
const YAML = require("json-to-pretty-yaml");

const BorderStyle = styled.div`
  border: ${props =>
    props.border === "AWS" ? "solid 2px #232F3F" : "dashed 2px #232F3F"};
  width: 4em;
  height: 4em;
`;

const Logo = styled.img`
  display: ${props => (props.border === "AWS" ? "block" : "none")};
  background: #232f3f;
  width: 28px;
  height: 20px;
  top: 0%;
  left: 0.9em;
  position: absolute;
`;

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
      "https://cdn2.iconfinder.com/data/icons/amazon-aws-stencils/100/Storage__Content_Delivery_Amazon_CloudFront-512.png"
  },
  {
    id: "3",
    name: "Users",
    type: "wideBox",
    friendlyName: "Users/Client",
    img: "https://image.flaticon.com/icons/png/512/149/149071.png"
  },
  {
    id: "4",
    name: "EC2",
    type: "wideBox",
    friendlyName: "EC2 Instance",
    img:
      "https://3.bp.blogspot.com/-FrICgv9QTCw/W4_6L1yivpI/AAAAAAAAAD8/HUckFVLJglUNBn_co1TaFHcwvxv7CPmUACLcBGAs/s1600/Compute_AmazonEC2.png"
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
  },
  {
    id: "7",
    name: "RDS",
    type: "wideBox",
    friendlyName: "RDS",
    img:
      "https://d1.awsstatic.com/icons/jp/rds_icon_concole.fe14dd124ff0ce7cd8f55f63e0112170c35885f1.png"
  },
  {
    id: "8",
    name: "REST",
    type: "wideBox",
    friendlyName: "API Gateway",
    img:
      "https://www.mbejda.com/content/images/2017/11/6a00d8341c534853ef01b7c7da8b25970b-800wi.png"
  }
];

const borders = [
  {
    id: "7",
    name: "AWS",
    type: "border",
    friendlyName: "Solid border"
  },
  {
    id: "8",
    name: "Context",
    type: "border-dashed",
    friendlyName: "Dashed border"
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
  const boundedArea = useSelector(state => state.components.getBoundingArea);

  const handleSelect = (e, type) => {
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else setSelected({ id: e.target.id, type: "box", connectionType: type });
  };

  const handleDropDynamic = e => {
    let shape = e.dataTransfer.getData("shape");
    const items = [...images, ...borders];
    let result = items.filter(item => item.name === shape);
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
          friendlyName: result[0].friendlyName,
          type: result[0].type
        };
        setBoxes([...boxes, newBox]);
      }
    }
  };

  const generateYml = () => {
    let models = [];
    setShowDownloadButton(false);

    const uniqueLines = Array.from(new Set(lines.map(a => a.props.start))).map(
      id => {
        return lines.find(a => a.props.start === id);
      }
    );

    console.log(uniqueLines);

    uniqueLines.map((item, index) => {
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

    let newModel = [];
    let uniqueLists = [];
    let componentSets = [];
    let keys = Object.keys(boundedArea);

    if (keys.length) {
      keys.map(item => {
        if (item.split("_")[0] === "Context") {
          let obj = {
            uniqueName: "innerBoundary",
            friendlyName: "innerBoundary/innerContext"
          };
          newModel.push({ ["boundary"]: obj });
        } else {
          let obj = {
            uniqueName: "awsBoundary",
            friendlyName: "awsBoundary/AwsContext"
          };
          newModel.push({ ["boundary"]: obj });
        }
        boundedArea[item].map(data => {
          if (uniqueLists.indexOf(data) === -1) {
            uniqueLists.push(data);
            componentSets.push(data.split("_")[0]);
            if (
              data.split("_")[0] !== "Context" &&
              data.split("_")[0] !== "AWS"
            ) {
              let obj = {
                uniqueName: images.find(
                  item => item.name === data.split("_")[0]
                ).name,
                friendlyName: images.find(
                  item => item.name === data.split("_")[0]
                ).friendlyName
              };
              let keyName = "User";
              if (data.split("_")[0] !== "User") {
                keyName = "component";
              }
              newModel.push({ [keyName]: obj });
            }
          }
        });
      });

      models.map(item => {
        if (item.hasOwnProperty("Users")) {
          newModel.unshift(item);
        }
        if (componentSets.indexOf(item.Component?.uniqueName) === -1) {
          newModel.unshift(item.Component);
        }
      });
    } else {
      newModel = models;
    }

    if (newModel && newModel.length) setShowDownloadButton(true);
    newModel = newModel.filter(item => item !== undefined);
    console.log(newModel);
    let yamlValue = YAML.stringify({ model: newModel });
    setYmlVal(yamlValue);
  };
  
  const downloadYml = () => {
    //  image download
    document.getElementsByClassName("topBarStyle")[0].style.display = "none";
    htmlToImage.toPng(ref.current).then(function(dataUrl) {
      let a = document.createElement("a");
      a.href = dataUrl;
      a.download = "image.png";
      a.click();
      document.getElementsByClassName("topBarStyle")[0].style.display = "block";
    });
   
    // file download
    let yamlContent = "data:text/yaml;charset=utf-8," + ymlVal;
    var encodedUri = encodeURI(yamlContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.yaml");
    document.body.appendChild(link);
    link.click(); // This will download the data file named "data.yaml".

    
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
          <div className="toolboxTitle">Elements Selector</div>
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
            {borders.map(shapeName => (
              <div
                key={shapeName.id}
                className="imgContainers"
                onDragStart={e =>
                  e.dataTransfer.setData("shape", shapeName.name)
                }
                draggable
              >
                <BorderStyle border={shapeName.name} />
                <Logo border={shapeName.name} src={awsIcon} />
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
        <button className="generateBtn" onClick={generateYml}>
          Generate Yml
        </button>
        {showDownloadButton && (
          <button className="generateBtn downloadBtn" onClick={downloadYml}>
            Download File
          </button>
        )}
        <div className="yamlContent">{ymlVal && <pre>{ymlVal}</pre>}</div>
      </div>
    </div>
  );
};
export default PlayGround;
