const keysValuesFlip = (obj) => {
  return Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));
};

export {keysValuesFlip};
