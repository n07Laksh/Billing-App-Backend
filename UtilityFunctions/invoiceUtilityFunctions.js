// Function to manually wrap text into lines based on specified width
const getWrappedTextLines = (text, maxWidth) => {
  const words = text.split(" ");
  let currentLine = "";
  const lines = [];

  words.forEach((word) => {
    const potentialLine = currentLine ? `${currentLine} ${word}` : word;
    const lineWidth = getStringWidth(potentialLine);

    if (lineWidth < maxWidth) {
      currentLine = potentialLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

// Function to estimate string width (you may need to implement this based on your environment)
const getStringWidth = (str) => {
  return str.length * 5;
};

const totalMoney = (data) => {
    let totalAmount = 0;
  
    try {
      if (Array.isArray(data)) {
        totalAmount = data.reduce((sum, item) => {
          return sum + parseFloat(item.amount || 0);
        }, 0);
      }
    } catch (error) {
      console.error("Error calculating total amount:", error);
    }
  
    return totalAmount;
  };
  



  const totalCount = (data) => {
    let totalQuantity = 0;
  
    try {
      if (Array.isArray(data)) {
        totalQuantity = data.reduce((sum, item) => {
          return sum + parseInt(item.quantity || 0, 10);
        }, 0);
      }
    } catch (error) {
      console.error("Error calculating total quantity:", error);
    }
  
    return totalQuantity;
  };

module.exports = {
  getWrappedTextLines,
  totalMoney,
  totalCount,
};
