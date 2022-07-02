---
title: text user interfaces in golang with bubbletea
draft: true
---

# Text User Interfaces in Golang with Bubbletea

#### and why I care about learning how to code one

Recently I have spent a lot of my productive time using a terminal emulator, as I made a comeback to vim and tmux. After a quick search I realised that there are many really well made tools that run in text mode, some of them with nice and beautiful interfaces, such as `tig`, a git interface, or the famous `htop`.

Then I thought it would be a fun endeavor to go after learning how to code a tool like this. The problem is that the last time I wrote a complete terminal based application was about 15 years ago, using Pascal, and I wanted to see what tools for what languages are available today (Pascal was already dead then, so now it might be a nostalgic run, but with little real benefit)

So I set my goals:

- Find a few libraries that could create text interfaces
- Learn a bit about the language this library uses
- Create a simple todo list app
- Integrate this app to my vim/tmux workflow

## Part 1 - Finding a library

Back in the day with Pascal, all I really used was a function named gotoXY, that basically positioned the cursor in a set coordinate in the terminal.

Of course I know the famous `ncurses` library is what all the serious text based interfaces used, but I honestly had little to no interest in C, but that would be a nice starting point.

I have in my shelf an untouched book about Go (maybe because it's in German and I've been procrastinating my German studies), and I really wanted to give it a try, so I searched for any ncurses bindings for Go.

I tried a project called `tview`, that claimed to have widgets and a whole lot of functionality, and the example applications that I found all have that ncurses feel. The library is actually very good, and when I was starting some research on it, I stumbled upon something that immediately called my attention: another library by the name `bubbletea`.

Why did it looked so promising? Because it claimed that it used the **Elm architcture**, applied to creating text user interfaces, all in Go.

I think a detour is needed, so I can talk (write, actually) a bit about the Elm architcture and why I switched from the super promising `tview` to `bubbletea`

### The Elm Architecture

A couple of years ago, when I was all into functional programming, I started reading about a little language called Elm. This was a language that borrowed a lot from Haskell, but simplified a lot of things, so it would be easier to get into.

Elm was a language, a platform and an architcture, all at the same time, and the architecture was all about creating components that were both independent and composable. In Elm, the application is one component, the same way as the smallest of the input boxes on screen, creating a nice consistency between the large and tiny aspects of the user interface.

Every component would need to implement a **model**, an **init** function, an **update** function and a **view** function.

The `model` is just a data structure that contains every single state element necessary for the rendering and behavior of the component.

The `init` function had to be a function that receives no argument (but had access to the model) and returned something called a `command`

This command was really a way to invoke side effects, such as writing/reading from cookies or calling an API. Anything really, that would be necessary for the correct initialization of the component.

The `update` function received something called a  `message`,
