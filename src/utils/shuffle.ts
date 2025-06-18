const range = (from: number, to: number) => {
  return Math.floor(Math.random() * (to - from) + from);
};

const shuffle = (arr: number[]) => {
  for (let i = 0; i < arr.length; i++) {
    const j = range(0, arr.length);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

export default shuffle;