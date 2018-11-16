export const getHyphenatedClassNames = (className, flag) => {
  return flag ? className.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : className;
};
