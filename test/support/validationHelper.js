exports.nestedArray = function nestedArray(array) {
  let nestedArray = [];
  for (let elem of array.split('.'))
    nestedArray.push(Number(elem) ? Number(elem) : elem);
  return nestedArray;
};
