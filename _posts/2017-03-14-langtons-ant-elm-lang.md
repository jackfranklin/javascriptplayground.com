---
layout: post
title: Building Langton's Ant in Elm
intro: Today we'll look at using Elm to build a browser version of Langton's Ant in the browser.
githubPath: 2017-03-14-langtons-ant-elm-lang
---

Last week I attended the [Elm London meetup](https://www.meetup.com/Elm-London-Meetup/), arranged by [Kris Jenkins](http://twitter.com/krisajenkins), who always produces a great selection of challenges for people to take on for all skill levels. Along with [Isaac](http://twitter.com/isaacseymour), we decided to take on Kris' challenge to build Langton's Ant in Elm.

## Langton's Ant

Langton's Ant is a game similar to [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) in that cells on a game board change from being alive to dead based on their surroundings and certain criteria. In Langton's Ant there is a small ant on the board that moves and changes squares as it goes. The ant starts on any random square, and on each move it:

1. Based on the colour of the square, it either turns 90 degrees right, or 90 degrees left.
2. Changes the colour of the square it's on from black to white, or vice versa.
3. Moves forward one square in the direction it's facing.

The fact that the game has well defined rules makes it perfect for a short hack event, so we set about building it in Elm.

## Getting started

I used [create-elm-app](https://github.com/halfzebra/create-elm-app) to quickly get the app going. It's a really handy way to get a working application and local server up without having to think about it, and I highly recommend it.

## Defining types

When working in Elm the first thing I always do is define the types for the key concepts of the application. Looking through Langton's ant, we could see we'd need to model:

* The concept of an `Ant`.
* `Cell`s on a game `Board`.
* `Coord`s which cells are positioned at on the board.
* The `Direction` of the ant.
* The `Colour` of a cell.

Starting with the easier ones, a `Direction` is a union type that can be one of `Up`, `Down`, `Left` or `Right`:

```haskell
type Direction
    = Up
    | Down
    | Left
    | Right
```

And similarly, a `Colour` is either `White` or `Black`:

```haskell
type Colour
    = White
    | Black
```

And a coordinate, or `Coord`, is a tuple of `(x, y)`:

```haskell
type alias Coord =
    ( Int, Int )
```

Once you have these, it's easy to combine them to make up the "bigger" types. A `cell` is a record that has a coordinate pair and a colour:

```haskell
type alias Cell =
    { position : Coord
    , colour : Colour
    }
```

And the `Ant` is a record with a position and a direction:

```haskell
type alias Ant =
    { position : Coord
    , direction : Direction
    }
```

The board is then a dictionary (quite similar to a JavaScript object, or a Ruby hash) that has coordinates as its keys, and then `Cell`s as its values. There's a bit of duplication here because you're using the coordinates for the keys of the dictionary, and then storing the keys in the cell, but we left it like that because it's nice to be able to have a cell tell you its position, without having to keep a reference to the coordinates around.

```haskell
type alias Board =
    Dict Coord Cell
```

Finally, the `Model` has a `board` and an `ant`:

```haskell
type alias Model =
    { board : Board
    , ant : Ant
    }
```

This method of defining the types is such a good way to think about your application and I highly recommend doing so. Even if you realise that you haven't quite modelled your types right later, it's easy to change them and let the compiler walk you through fixing them. They say if you define your types right, the rest of your application easily falls into place, and I'd say that's definitely true of Elm.

## Initial State

The initial state of the world is an ant at position `(0, 0)` facing `Left` (you could pick any direction, it doesn't matter) and an empty list of cells:

```haskell
initialCells : Board
initialCells =
    Dict.empty


initialAnt : Ant
initialAnt =
    Ant ( 0, 0 ) Left


init : ( Model, Cmd Msg )
init =
    ( Model initialCells initialAnt, Cmd.none )
```

The reason we have no cells to start with is because we don't actually need a cell to exist until the ant moves off it. When an ant reaches a square, it will turn the cell black if it's white, or white if it's black, and by default all cells are white. That means if there's no cell under the ant, we can just create a white one, and go from there.

## Moving on a tick

There is no user input in Langton's Ant, and as such we needed a way to run the game every millisecond to advance it to the next stage. We can use subscriptions in Elm to do this.

In The Elm Architecture we define a `subscriptions` function which we can use to subscribe to events. Elm's `Time` module provides a way to send a `Msg` at defined time intervals:

```haskell
subscriptions : Model -> Sub Msg
subscriptions model =
    Time.every (Time.millisecond) Tick
```

This instructs Elm's runtime to send a `Tick` message every millisecond.

## Dealing with a Tick

The first thing to do is define our `Msg` type, that is, the types of messages we expect to flow through our system. In our case it's just one, `Tick`:

```haskell
type Msg
    = Tick Time
```

When `Time.every` sends a `Tick` it will also send the current time with it, which we'll ignore, but we have to define our `Msg` type as `Tick Time` to keep the compiler happy. In our `update` function we'll simply hand off to a `tick` function that will run the actual game:

```haskell
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick _ ->
            ( tick model, Cmd.none )
```

## Defining `tick`

Recall that there are three parts to a move in Langton's Ant:

1. Based on the colour of the square, it either turns 90 degrees right, or 90 degrees left.
2. Changes the colour of the square it's on from black to white, or vice versa.
3. Moves forward one square in the direction it's facing.

Breaking that into code, the first thing we need to do is get the current cell that the ant is on. We can do that because an `Ant` has a `position` key that is a coordinate pair, so we can write a function that gets the cell for the ant:

```haskell
getCell : Board -> Coord -> Cell
getCell board coord =
    Dict.get coord board |> Maybe.withDefault (Cell coord White)
```

We try to get the cell for the given coordinates, and if it doesn't exist, we'll just default to a `White` cell at those coordinates.

Once we have that cell, we need to flip it's colour:

```haskell
tick : Model -> Model
tick { ant, board } =
    let
        currentCell =
            getCell board ant.position

        newCell =
            { currentCell | colour = flipColour currentCell.colour }
    ...
```

Where `flipColour` just swaps `Black` to `White` and vice-versa:

```haskell
flipColour : Colour -> Colour
flipColour colour =
    case colour of
        Black ->
            White

        White ->
            Black
```

Once we have the new cell we use `Dict.insert` to insert it back onto our board. `Dict.insert` will overwrite a cell if one already exists, so it's perfect because we don't need any custom logic depending on if the cell exists or not.

```haskell
newCell =
    { currentCell | colour = flipColour currentCell.colour }

newBoard =
    Dict.insert ant.position newCell board
```

Next, we need to deal with the ant. Depending on the colour of the cell when the ant arrived on it, it needs to either flip itself 90 degrees left or right, so we can update the ant and change its direction:

```haskell
newAnt1 =
    { ant | direction = getNextDirection ant currentCell }
```

Where `getNextDirection` looks like so:

```haskell
getNextDirection : Ant -> Cell -> Direction
getNextDirection { direction } { colour } =
    case ( colour, direction ) of
        ( White, Up ) ->
            Right

        ( White, Right ) ->
            Down

        ( White, Down ) ->
            Left

        ( White, Left ) ->
            Up

        ( Black, Up ) ->
            Left

        ( Black, Right ) ->
            Up

        ( Black, Down ) ->
            Right

        ( Black, Left ) ->
            Down
```

In the arguments note how we destructure the ant, pulling out just the `direction`, and do the same with the cell to pull its `direction`. We then combine them into a tuple and pattern match on them, encoding the rules of the ant and how it flips based on the colour.

Finally, now we have the ant facing the right direction, we need to update its positional coordinates to move it in the right direction:

```haskell
newAnt2 =
    { newAnt1 | position = getCoordInFront newAnt1 }
```

Where `getCoordInFront` maps the ant's positional coordinates, changing either the `x` or `y` by one, positively or negatively depending on the direction:

```haskell
getCoordInFront : Ant -> Coord
getCoordInFront { direction, position } =
    case direction of
        Up ->
            Tuple.mapSecond (\x -> x + 1) position

        Down ->
            Tuple.mapSecond (\x -> x - 1) position

        Left ->
            Tuple.mapFirst (\x -> x - 1) position

        Right ->
            Tuple.mapFirst (\x -> x + 1) position
```

Here `Tuple.mapFirst` and `Tuple.mapSecond` come in really handy to tidy this code up and keep it nice and succinct. We could have written `(\x -> x + 1)` as `((+) 1)`, but we didn't because doing `((-1) x)` ends up as `-1 + x` which is not what we want, so here we prefer the longer form to keep it clear.

With that, our `tick` function is done and we have the new model being generated. Next up, we'll render it onto the page.

```haskell
tick : Model -> Model
tick { ant, board } =
    let
        currentCell =
            getCell board ant.position

        newCell =
            { currentCell | colour = flipColour currentCell.colour }

        newBoard =
            Dict.insert ant.position newCell board

        newAnt1 =
            { ant | direction = getNextDirection ant currentCell }

        newAnt2 =
            { newAnt1 | position = getCoordInFront newAnt1 }
    in
        Model newBoard newAnt2
```

## Rendering the board

Rather than use HTML, we chose to use [elm-lang/svg](http://package.elm-lang.org/packages/elm-lang/svg/latest/Svg) for our board.

Our `view` function looks like so:

```haskell
view : Model -> Html Msg
view { board, ant } =
    svg [ width "600", height "600", viewBox "-500 -500 1000 1000" ]
        [ renderCells board
        , renderAnt ant
        ]
```

By creating the SVG with a `viewBox` attribute of `-500 -500 1000 1000` we create an SVG element that puts an element with `x "0", y "0"` in the middle of the box. This means when we render our first cell at `(0, 0)`, it will go in the middle of the SVG. [You can read more about scaling SVGs on CSS Tricks](https://css-tricks.com/scale-svg/).

## Rendering the cells

To render the cells, we map over all the values using `Dict.values` and render each one:

```haskell
renderCell : Cell -> Svg Msg
renderCell { position, colour } =
    renderItem position (colourToSvgFill colour)


renderCells : Board -> Svg Msg
renderCells board =
    g [] (Dict.values board |> List.map renderCell)
```

Notice how we use the SVG element `g` to group elements up. `g` is really handy for grouping related elements without it applying any extra styling or behaviour. It's akin to a `div` in HTML.

`renderCell` calls the generic `renderItem` function, passing in the position of the cell and the colour. `colourToSvgFill` just maps the type `Black` to `"black"`, and the same with `White`.

`renderCell` produces an SVG `rect`element with the right width, height and positions applied:

```haskell
renderItem : Coord -> String -> Svg Msg
renderItem ( xPos, yPos ) colour =
    rect
        [ stroke "black"
        , fill colour
        , x (toString (xPos * 10 - 5))
        , y (toString (yPos * 10 - 5))
        , width "10"
        , height "10"
        ]
        []
```

The `renderAnt` function also uses `renderItem`, just passing in a different colour depending on the ant's direction (which you don't need to do, we just did it so we could see the direction the ant was heading). `colourForAnt` just maps the ant's colour to a direction.

```haskell
renderAnt : Ant -> Svg Msg
renderAnt { position, direction } =
    renderItem position (colourForAnt direction)
```

## Fin

And with that, we have our ant!

![](/img/posts/langtons-ant/langtons-ant.png)

If you'd like to find the full code, you can [find it on Github](https://github.com/jackfranklin/langtons-ant-elm). I'd encourage you to have a try at building Langton's Ant, it's a well defined, contained challenge that has some really interesting parts. Elm's type system makes it a perfect fit for a challenge like this, and it was a neat way to explore and learn more about the language.
