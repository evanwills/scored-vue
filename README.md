# Scored

Scored is a simple web app that keeps scores for any number of players in a game.

It was built over a weekend as a way of teaching myself more about Vue.

Checkout __[this CodePen](https://codepen.io/evanwills/pen/BaVGqYB)__ to see a working demo.

As with all my projects it is fully responsive and should also be fully accessible to assistive technologies. However, as my focus was on using/learning Vue, aesthetics have taken a back seat so it may look a bit dull.

## How to use

* When _Scored_ is first loaded you need to
  * add at least two players' names and
  * select a game type.
  * Then click the "Start new game" button.
* In play mode you will see boxes with each player displaying their name, along with their current score (zero) plus an input box
* As each player gets a score:
  * enter that score into the "Latest score box" and
  * click the "Add" button (which will appear once you enter a score)

Scored shows the latest score for each player plus a running total and the players rank in the game.

If you selected "500" as the game type, when one player reaches 500 or -500, the game will end and a winner will be declared.

## Vue 3 + TypeScript + Vite

Scored was built with Vue 3, Typescript and Vite
