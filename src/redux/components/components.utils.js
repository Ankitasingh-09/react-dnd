export const addComponetsToItem = (componentsItem, componentToAdd) => {
  //logic
  let { height, width, id, x, y } = componentToAdd;
  if (id.indexOf("Context") !== -1 || id.indexOf("AWS") !== -1) {
    x = x - 30;
    y = y - 30;
    width = parseFloat(width) + 30;
    height = parseFloat(height) + 30;
  }
  const calculateWidthHeight = () => {
    return {
      boxWidth: parseFloat(x) + parseFloat(width),
      boxHeight: parseFloat(y) + parseFloat(height),
    };
  };
  const widthHeight = calculateWidthHeight();
  componentsItem[id] = {
    x1: x,
    y1: y,
    x2: widthHeight.boxWidth,
    y2: widthHeight.boxHeight,
  };
  return componentsItem;
};

export const getBoundingAreaState = (componentsItem, currentComponent) => {
  //logic

  const validateCoordinates = (outerCoords, innerCoords) => {
    if (innerCoords.x1 >= outerCoords.x1 && innerCoords.x2 <= outerCoords.x2) {
      if (
        innerCoords.y1 >= outerCoords.y1 &&
        innerCoords.y2 <= outerCoords.y2
      ) {
        return true;
      }
    }
  };

  Object.keys(currentComponent).map((keys) => {
    if (keys.indexOf("Context") >= 0 || keys.indexOf("AWS") >= 0) {
      let outerBoundCoordinates = currentComponent[keys];
      const areaBoundedValues = [];
      Object.keys(currentComponent).map((content) => {
        if (keys !== content) {
          const validationCheck = validateCoordinates(
            outerBoundCoordinates,
            currentComponent[content]
          );
          if (validationCheck) {
            areaBoundedValues.push(content);
            componentsItem[keys] = areaBoundedValues;
          }
        }
        return null;
      });
    }
    return null;
  });

  Object.keys(componentsItem).map((key) => {
    if (key.includes("AWS")) {
      const chooseValuesToSlice = [];
      Object.keys(componentsItem).map((item) => {
        if (item.includes("Context")) {
          chooseValuesToSlice.push(componentsItem[item]);
        }
        return null;
      });
      const flatten = [].concat(...chooseValuesToSlice);
      if (flatten && flatten.length) {
        flatten.map((item) => {
          var index = componentsItem[key].indexOf(item);
          if (index !== -1) {
            componentsItem[key].splice(index, 1);
          }
          return null;
        });
      }
    }
    return null;
  });

  return componentsItem;
};
