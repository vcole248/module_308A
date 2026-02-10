function countUp(n) {
  if (n === 50000) return "Done!";
  console.log(n)
  return n + " " + countUp(n + 1);
}

try {
    console.log(countUp(0))
} catch (error) {
    console.error(error)
}
 

function trampoline(fn) {}
let result = fn()
}
return result;  

function trampoline(fn) {
  let result = fn();
  while (typeof result === 'function') {
    result = result();
  }
  return result;
}

// Question 1: Write a recursive function that completely flattens an array of nested arrays
// Step 2: Write your recursive function so it returns a function (thunk) instead of calling itself directly
function flattenArray(arr, acc = []) {
  if (arr.length === 0) return acc;
  
  const [head, ...tail] = arr;
  
  if (Array.isArray(head)) {
    return () => flattenArray([...head, ...tail], acc);
  } else {
    return () => flattenArray(tail, [...acc, head]);
  }
}

// Question 2: Use the trampoline to run it
const nestedArray = [1, [2, 3, [4, 5, [6, 7, [8, 9, 10]]]]];
const flattened = trampoline(() => flattenArray(nestedArray));
console.log('Flattened array:', flattened);
```
const result = trampoline(() => recursiveCount(1000000));
console.log(result); // 1000000