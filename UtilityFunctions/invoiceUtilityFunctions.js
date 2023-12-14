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

// Function to handle PC login logic
async function handlePCLogin(user, deviceName, devicePlatform, deviceType) {
  try {
    if (user.deviceName || user.devicePlatform || user.deviceType) {
      if (
        (user.deviceName && user.deviceName === deviceName) ||
        (user.devicePlatform && user.devicePlatform === devicePlatform) ||
        (user.deviceType && user.deviceType === deviceType)
      ) {
        return true; // PC details match, allow access
      } else {
        return false; // PC details mismatch, deny access
      }
    } else if (!user.deviceName || !user.devicePlatform || !user.deviceType) {
      // Update the user's record with PC details for future logins
      if (deviceName || deviceType || devicePlatform) {
        user.deviceName = deviceName;
        user.devicePlatform = devicePlatform;
        user.deviceType = deviceType;

        await user.save();
        return true;
      } else {
        return false;
      }
    } else {
      return false; // Neither PC details exist, prevent login
    }
  } catch (error) {
    throw new Error("Error handling PC login");
  }
}

// Function to handle mobile login logic
async function handleMobileLogin(user, mobileDevice) {
  try {
    if (user.mobileDevice) {
      if (user.mobileDevice === mobileDevice) {
        return true;
      } else {
        return false;
      }
    } else if (!user.mobileDevice) {
      // Update the user's record with mobile details for future logins
      user.mobileDevice = mobileDevice;

      await user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error("Error handling mobile login");
  }
}

module.exports = {
  getWrappedTextLines,
  totalMoney,
  totalCount,
  handlePCLogin,
  handleMobileLogin,
};
