const beautifyDate = async (time) => {
  const timeString = await time.toString();
  const index = (await timeString.indexOf("GMT")) - 1;
  const result = await timeString.substring(0, index);
  return result;
};

module.exports = {
  beautifyDate,
};
