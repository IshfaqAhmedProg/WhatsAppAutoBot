export function getObjectWithMostKeys(arr) {
    let maxKeys = -Infinity;
    let maxObj = null;
  
    for (let obj of arr) {
      const objKeys = Object.keys(obj);
      if (objKeys.length > maxKeys) {
        maxKeys = objKeys.length;
        maxObj = obj;
      }
    }
  
    return maxObj ? Object.keys(maxObj) : null;
  }