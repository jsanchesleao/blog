---
title: Currying as a factory of functions
date: 2016-07-14
draft: false
---

Currying as a factory of functions
-----------------

In this post I would like to explore the use of a techique called `currying` to reduce some of the noise of using higher order functions such as `map`, `filter` and similar functions..

First of all, let's define what is currying, and we'll do so with examples. Imagine we have the following requirement: We need to count the oocurrencies of a given value inside an array. The traditional way of doing this in javascript would be something along these lines:

```javascript
function countOcurrencies(array, item) {
  let ocurrencies = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === item) {
      ocurrencies = ocurrencies + 1;
    }
  }
  return ocurrencies;
}
```

Nothing new here, only a good old for loop. There are better ways to achieve the same result and we could be exploring techiques to remove the mutable variable and to extract small reusable pieces of logic, but for now, let's stick with this implementation and move on with the requirement that we were assigned to: counting ocurrencies of values in lists.

So now, we're using that function to count how many times the number 1 appears in the each of the given arrays:

```javascript
const array1 = [0, 1, 2];
const array2 = [1, 3, 1, 2];
const array3 = [0, 2, 4, 6];

console.log('array1 :', countOcurrencies(1, array1));
console.log('array2 :', countOcurrencies(1, array2));
console.log('array3 :', countOcurrencies(1, array3));
```

Things seem to be working good here, but it would be good to be able to work with any number of arrays. So let's look at how it looks like:

```javascript
const arrays = [ [0, 1, 2],
                 [1, 3, 1, 2],
                 [0, 2, 4, 6] ];

for (let i = 0; i < arrays.length; i++) {
  console.log('array' + i + ': ', countOcurrencies(1, array[i]))
}
```

Okay. Not that we have a complete, working example with imperative code, let's refactor it to a more functional way. The first thing we need to think about is how to remove the for loops and come up with a more expression based solution:

```javascript
const arrays = [ [0, 1, 2],
                 [1, 3, 1, 2],
                 [0, 2, 4, 6] ];

function formatDisplay(frequency, index) {
  return `array${index}: ${frequency}`
}

arrays.map(array => countOcurrencies(1, array))
      .map(formatDisplay)
      .forEach(x => console.log(x))
```

Here we have separated the function that formats content from the rest of the code, so it can be tested independently. It now uses the string interpolation feature, so our code is now more concise. Also there are no for loops declared, as we are now using a forEach function, allowing us to avoid the creation of a temporary variable to loop through the array.

We can se more clearly now that our operation consists of three separate steps: the first one is calculating the frequency of the number 1 in each array; The second one is formatting the output string for each one of these results and the third and last step is printing them to the console.

The code is more functional now, but we can still go further by changing the `countOcurrencies` function.

```javascript
//old imperative version
function countOcurrencies(array, item) {
  let ocurrencies = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === item) {
      ocurrencies = ocurrencies + 1;
    }
  }
  return ocurrencies;
}

//refactored, more functional version
function countOcurrencies(item, array) {
  return array.filter(i => i === item).length
}
```

So again we removed the mutable part and the for loop. The entire solution now is a lot more functional, but to go even further we will explore the techique mentioned in the beginning: currying.

Quick explanation: A function is said to be in the curried form if it accepts one single argument. If the function needs to work with two arguments, it will return another function that accepts the next and so on. Back to the code, our `countOcurrencies` function would look like this:

```javascript
const countOcurrencies = function(item) {
  return function(array) {
    return array.filter(i => i === item).length
  }
}

// now we must call it like this: countOcurrencies(1)(array)
```

By writing the function in this form, it's clear that if we call `countOcurrencies(1)`, it returns a function that counts ocurrencies of the number 1 in arrays. Also, using arrow functions allows for a hugely lighter syntax than writing `function()` over and over again.

Notice that the filtering function `i => i === item` can also be rewritten as a curried function that performs equality check. Look the next iteration of our refactoring, using currying in the `countOcurrencies` function.

```javascript
// performs equality check
const equals = a => b => a === b

const countOcurrencies = item => array =>
  array.filter(equals(item)).length
```

Much lighter. Moving forward, let's use the final curried form of `countOcurrencies` in the actual solution. The complete code follows:

```javascript
const equals = a => b => a === b

const countOcurrencies = item => array =>
  array.filter(equals(item)).length

const formatDisplay = (frequency, index) => `array${index}: ${frequency}`

const outputLine = line => console.log(line)

const arrays = [ [0, 1, 2],
                 [1, 3, 1, 2],
                 [0, 2, 4, 6] ];

arrays.map(countOcurrencies(1))
      .map(formatDisplay)
      .forEach(outputLine)
```

So, our final solution has no mutability, no imperative loops and is based on small, easily testable and reusable functions. We have used currying to make the syntax for the `filter` and `map` functions become lighter, and used arrow functions to make currying easy to implement.

This is not the only use case of currying, as it can be used to make better function compositions, storing configuration parameters and many more techniques. Since functional programming is all about creating and passing functions around, currying can be faced as a factory of functions, a way to "build" functions to pass around.

One last thing: currying is just a techique, it's power will be revealed as you see it in use in different patterns and shapes. As with any functional constructs and techiques, it does not do much by itself, so don't worry if you don't find it very useful at first glance. Keep digging into functional programming and you will see the patterns emerging!
