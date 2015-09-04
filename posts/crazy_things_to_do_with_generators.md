---
title: Crazy things to do with generators
date: 2015-09-04
publish: false

---
# Crazy things to do with generators
*from iterators to control flow*

## Introduction
ES2015 brings many incredibly powerful features to the javascript world, and I'd like to discuss some interesting, non obvious uses of generators.

Generators are special functions, that can be paused and resumed arbitrarily to yield values back to their calling contexts.

Here is what a simple generator looks like:

```javascript
let foo = function* () {
  yield 1;
  yield 2;
  yield 3;
}
```

The generator function above can be used like this:

```javascript
for (let x of foo()) {
  console.log(x)
}
```

This is the common, boring, use case of generators. They couple well with the new *for of* loop. We can use this feature to create things like infinite collections and stuff.

## Control Flow
Creating iterators is boring. In fact, iterators can't help much when we move to the asynchronous world, such as yielding results of http calls or other io operations. To understand how these strange functions can help, we need to understand the asynchronous problem:

### A Brief History of Asynchronous Time

Back in the old days, humans started writing javascript in the browser and faced one __terrible__ fact: They had one and only one thread to to everything, and it __COULD. NOT. EVER. BLOCK.__. It turned out that the only way to do things in those environments was going asynchronous...

To enter the asynchronous realm in javascript, people first tried using callbacks. Things looked like this:

```javascript
getMyContent(function(error, content) {
  if (error) {
    console.log('Damn... Things went wrong... :(', error);
  }
  else {
    console.log('Wow, the content is here!', content)
  }
})
```

This simplistic approach solved the small problems such as single ajax calls and dom event handling. Problem arised when they used callbacks to solve more complex asynchronous operations. Then things start to get impractical because the callbacks got nested. 

Callbacks don't seem to like each other very much and when they get upset, they start messing up, bloating your entire code, spreading unreadability and exhaustive repetitions wherever they can, so our things started looking like this:

```javascript
// The famous CALLBACK HELL
fs.readFile('config.txt', function(err, content) {
  if (err) {
    console.log('Could not open config file', err)
  }
  else {
    makeHttp(content, function(httpErr, httpContent) {
      if (httpErr) {
        console.log('Error in http call', httpErr)
      }
      else {
        fs.writeFile('result.txt', httpContent, function(saveErr) {
          if (saveErr) {
            console.log('Error saving content', saveErr)
          }
          else {
            console.log('File successfully saved!! Yay \o/')
          }
        })
      }
   } 
  }
})
```

And this, my friend, is how people learned that callbacks are __evil__. They form a hell of a mess. We don't hear people talking about unicorn hell, or candy hell, but callbacks...

Having learned this lesson, some really smart people tried hard to come up with an abstraction good enough to avoid callback hells. They needed something that composed well, something that can play around nicely without messing everything up. So they learned about __promises__!

### Promises to the rescue!

Promises allowed more composability and avoided the nesting problem. This is what they looked like:

```javascript
readFile('config.txt')
  .then(function(config) {
    return makeHttp(config)
  })
  .then(function(content) {
    return writeFile('result.txt', content)
  })
  .catch(function(err) {
    console.log('Something went wrong: ' err)
  })
```

Promises are super cool because now asynchronous operations can return things, and people could write libraries that manipulate them and bring some order to the whole thing.

People now can compose and organize the asynchonous code better, in fact, in the ES2015 spec, promises had made their way into the standard library.

But not everything is beautiful, and not even the benevolent promises can free us completely from callbacks. They only separate them, so they cannot fight anymore, but they're still there, and doing nasty things such as mess with stack traces and recursive algorythms

If only we could use them without callbacks...

## Back to generators

We know the problem, and now we have a new tool to fight those evil callbacks.

Look at the following code snippet:

```javascript
Async(function* () {
  try {
    let config = yield Await(readFile('config.txt'));
    let httpContent = yield Await(makeHttp(config));
    yield Await(writeFile('result.txt', content);
    console.log('Job done!');
  }
  catch(err) {
    console.log('Something went wrong: ', err)
  }
})
```

This is awesomely awesome! It looks like we can exploit generators' ability to pause execution to make it *wait* for the promises to deliver their values, and can treat errors with simple try catch blocks! 

But how is it possible?

__TODOS__

- update gist code to throw errors when promises reject
- link tj/co
- talk briefly about js-csp
- do it in a funny way
