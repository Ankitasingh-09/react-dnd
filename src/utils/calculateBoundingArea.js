const validateCoordinates = (outerCoords, innerCoords) => {
  if (innerCoords.x1 >= outerCoords.x1 && innerCoords.x2 <= outerCoords.x2) {
    if (innerCoords.y1 >= outerCoords.y1 && innerCoords.y2 <= outerCoords.y2) {
      return true;
    }
  }
};

const calculateBoundingAreas = (locationCoordinates) => {
  const areaBounds = {};
  Object.keys(locationCoordinates).map((keys) => {
    if (keys.indexOf("Dashed") >= 0 || keys.indexOf("Solid") >= 0) {
      let outerBoundCoordinates = locationCoordinates[keys];
      const areaBoundedValues = [];
      Object.keys(locationCoordinates).map((content) => {
        if (keys !== content) {
          const validationCheck = validateCoordinates(
            outerBoundCoordinates,
            locationCoordinates[content]
          );
          if (validationCheck) {
            areaBoundedValues.push(content);
            areaBounds[keys] = areaBoundedValues;
          }
        }
      });
    }
  });
  console.log({ areaBounds });
};

export default calculateBoundingAreas;
