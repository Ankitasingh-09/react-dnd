const calculateWidthHeight = (x, y, width, height) => {
  return {
    boxWidth: parseFloat(x) + parseFloat(width),
    boxHeight: parseFloat(y) + parseFloat(height),
  };
};

export default calculateWidthHeight;
