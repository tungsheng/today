const sum = (limit = 1000) => {
  let num = 0;
  let sum = 0;
  while (num < limit) {
    if (num % 15 === 0) {
      sum += num;
    } else if (num % 5 === 0) {
      sum += num;
    } else if (num % 3 === 0) {
      sum += num;
    }
    num++;
  }

  return sum;
};

export default sum;
