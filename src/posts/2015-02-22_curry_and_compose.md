---
title: Curry and compose
date: 2015-02-22
draft: false
---

# Curry and compose

#### or why you should use something like Ramda in your code.

When it comes to functional programming, the main cornerstone is composability, the ability to create new functions only by composing the existing ones. For example, we can use a function that returns true given a certain condition, and then reuse it in combination with a filter function, to select items in an array.

In javascript, though, this may lead to the creation of several functions that look like the following:

```js
var isGreaterThan = function(limit) {
  return function(value) {
    return value > limit;
  };
};
```

In that example, we have a function that creates another function. The first only binds a configuration value, the limit, and returns the second one, that in fact makes the comparison happen and return a boolean.

This function is in a curried form, that is, a function that always takes one single argument and returns a value, if it needs more arguments to compute the value, it returns another function to take the next argument, until all are passed, and then the final result is computed.

Using ES6’s arrow function syntax, this can be much less verbose:

```js
var isGreaterThan = (limit) => (value) => value > limit;
```

If not using ES6 yet, one excellent solution is to use a curry making function, like lodash’s \_.curry, or ramda’s R.curry. What these functions do is take a multiple arguments function and return a curried version of it;

```js
//Using ramda's curry
var isGreaterThan = R.curry(function(limit, value) {
    return value > limit;
});
Using this last form has the advantage that we can still pass two arguments to it, and it will work:

greaterThan(10)(20); //true
greaterThan(10, 20); //true
var greaterThanTen = greaterThan(10);
greaterThanTen(20); //true
```

With curried forms, we have something like a factory of functions, we pass configuration data, receive a function to use in our compositions, and then we pass values to it. As the excellent talk by Brian Lonsdorf, *Hey Underscore, You’re Doing it Wrong*, we need to pass the data last, and the support values first.

Take for example the filter function. In lodash it takes the colletion as the first argument, and then a function to filter it as the second. They’re passing the data first, making it more difficult to compose with other functions, as we can see below:

```js
//Using lodash here. 
//We flip the order of the arguments in the filter
//function, passing the data last, and curry it.
var filter = _.curry(function(fn, collection) {
  return _.filter(collection, fn);
});
```

Now we have a more composable filter function, and we can combine with greaterThan easy as a breeze.

```js
var onlyPositives = filter(greaterThan(0));
onlyPositives([-1, 4, 2, -5]); // [4, 5]
```

This is gold! And this is precisely what Ramda does with these base functions like map and filter. The final move is to take advantage of the fact they receive their data last and use a function to compose several functions. Underscore, lodash and ramda have it, and they’re all similar: you pass a lot of functions to it, and it returns a function that will pass the result of one function as arguments to the next, and return the result of the last, all right to left:

```js
//read from bottom to top

//+ getFirstPositivePlusOne :: [Number] => Number
var getFirstPositivePlusOne = R.compose(
  R.add(1),                 // 4
  R.get(0),                 // 3
  filter(greaterThan(0))); // [3, 6]

  getFirstPositive([-2, -1, 3, 6]); // 4
```

Only by combining data-last curried functions with compose, we can write much more concise and reasonable code, and all with pure functions, and that is precisely what Ramda does, that underscore and lodash are doing wrong. It offers several pieces of behaviour, properly curried, so we can compose this way, which is called point free way. Point free code is code that does not declare “glue” variables, like this:

```js
//lodash way

var onlyPositives = function(data){ //glue variable (data)
  return data.filter(function(item) {  //glue variable (item)
    return greaterThan(0, item);
  });
} 

//pointfree ramda way
var onlyPositivesPF = R.filter(greaterThan(0)); //no glue variables
```

Even if your code would not be totally point free, by doing this you can remove a LARGE portion of boilerplate code and most of your unnecessary variables, thus producing smaller, more concise code, and also easier to identify flaws and bugs when they show up.
