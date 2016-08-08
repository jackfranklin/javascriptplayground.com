---
layout: post
title: Developing a street basketball game. (Part I. Getting workflow ready)
intro: Creating a 3D browser game with physics in a few steps.
author: Alexander Buzin
author_twitter: _alex_buzin
---

![](https://cdn-images-1.medium.com/max/1200/1*t_YNDcu8ZWgE5nDHPAKH5A.png)

Some days ago i released a new version of WhitestormJS framework named **r10** and decided to develop a game using almost all it’s functionality. *(Just was curious how easy it would be)*. The task was to make a 3D game that requires complex 3D physics parts like concave objects and softbodies.

## Setting up workflow 
Before starting developing the game i added a couple of directories that i will use later: **js, css, textures and img**. Difference between textures and img folders is that *textures* folder will be used for images that will be used in 3D part of app and *img* is for images that are used in html, css and stuff like that.

## Rollup 
Useful thing when you need to work with es6 models in front-end, especially when you use most of es6 features and want them even on old browser versions. I used it with two plugins: [babel for rollup](https://github.com/rollup/rollup-plugin-babel) and [uglify for rollup](https://github.com/rollup/rollup-plugin-babel) to develop a cross-browser 3D app.

## Bower 
Some libraries are getting updates regularly (yep, like *whitestorm.js*). For them i need front-end package manager like bower (You can use npm too, but bower will be enough). For tweening i used [**GSAP**](http://greensock.com/gsap) library, because of it’s performance and also we need [**basket.js**](https://addyosmani.com/basket.js/) to keep such a large library as WhitestormJS in *localStorage*.

…And also i wrote a small bower plugin that will help me make preloading. Check it out there.

```bash

bower install whitestormjs gsap progress-loader basket.js

```

## Okay, now seems to be ready… 
My index.html file will be simple and will contain just loaded scripts and *style.css* for featured usage. Note that we don’t load whitestorm.js yet. We will add it then using **basket.js**.

```html

<!DOCTYPE html>
<html>
  <head>
    <title>ThrowIntoBasket v1.0</title>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <link rel="stylesheet" type="text/css" href="css/style.css">
  </head>
  <body>

  <!-- Nothing there yet -->

  </body>
  <script type="text/javascript" src="bower_components/rsvp/rsvp.min.js"></script>
  <script type="text/javascript" src="bower_components/basket.js/dist/basket.js"></script>
  <script type="text/javascript" src="bower_components/gsap/src/minified/TweenLite.min.js"></script>
  <script type="text/javascript" src="bower_components/gsap/src/minified/plugins/CSSPlugin.min.js"></script>
  <script type="text/javascript" src="bower_components/ProgressLoader/progress-loader.js"></script>
  <!-- Main APP -->
  <script type="text/javascript" src="js/build/app.js"></script>
</html>

```

## app.js 
As you already noticed, we have *app.js* included. So, let’s create an empty 3D world with enabled softbody physics(will be used later for a net), autoresize, filled background, camera position and aspect, + gravity:

```javascript

const APP = {
  /* === APP: config === */
  /* APP */
  bgColor: 0xcccccc,
  /* BASKET */
  basketY: 20,
  
  /* === APP: variables === */
  isMobile: navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/),

  /* === APP: init === */

  init() {
    APP.world = new WHS.World({
      autoresize: "window",
      softbody: true,

      background: {
        color: APP.bgColor
      },

      fog: {
        type: 'regular',
        hex: 0xffffff
      },

      camera: {
        z: 50,
        y: APP.basketY,
        aspect: 45
      },

      gravity: {
        y: -200
      }
    });
    
    // Add ProgressLoader.
    APP.ProgressLoader = new ProgressLoader(APP.isMobile ? 12 : 14);

    // Lets make camera look at the basket.
    APP.camera = APP.world.getCamera();
    APP.camera.lookAt(new THREE.Vector3(0, APP.basketY, 0));

    APP.createScene(); // 1
    // TODO: Add other init funcs.

    APP.world.start(); // Ready.
    
    // TODO: Check for loading progress.
  }

  // ...TODO
};

basket.require({ url: 'bower_components/whitestorm/build/whitestorm.js' }).then(() => {
  APP.init();
});

```

Now we have a basic world that has *0xcccccc (grey)* as it’s background color, gravity set as `{x: 0, y: -200, z: 0}` and camera that will be at same height as our basket. Also we start the app only after we have whitestorm.js loaded.

I counted 14 objects that we will load for desktop devices. (I hope we’ll also have an optimized version for mobile devices, so i used **APP.isMobile** variable which is a boolean.

## Creating a scene. Ground and a wall. 
Next thing we’ll do is implementing a floor with just a ground and wall. Wall and ground will be very similar and we create them both from one object. We’ll create a default plane 1000x800 with buffer geometry (Actually no need for buffer geometry there, but somebody says it increase performance;), but it won’t be a big deal for a plane with 1x1 segments.

**0 mass** means that this object is not affected by gravity and won’t move when collides with other objects. And we need to rotate it’s by *(-Math.PI / 2, 0, 0)* euler.

```javascript

const APP = {
  // APP: config. <-
  // APP: init. <-
  // APP: variables. <-

  createScene() {
    /* GROUND OBJECT */
    APP.ground = new WHS.Plane({
      geometry: {
        buffer: true,
        width: 1000,
        height: 800
      },

      mass: 0,

      material: {
        kind: 'phong',
        color: APP.bgColor
      },

      pos: {
        y: -20,
        z: 120
      },

      rot: {
        x: -Math.PI / 2
      }
    });

    APP.ground.addTo(APP.world).then(() => APP.ProgressLoader.step());

    /* WALL OBJECT */
    APP.wall = APP.ground.clone();

    APP.wall.position.y = 180;
    APP.wall.position.z = -APP.basketDistance;
    APP.wall.rotation.x = 0;
    APP.wall.addTo(APP.world).then(() => APP.ProgressLoader.step());
  }
  
  // ...TODO
}

```

When we add each object to world — it returns a promise which is resolved when object is generated and added to world. Such stuff is very useful when work with models or object’s you want to know they are ready. Such as when we need to update loading status when each one is added.

## Lights 
We need just 2 simple lights to get a cool effect. Ambient light will cast light on the whole scene, Point light will cast only on objects near basket.

```javascript

const APP = {
  // APP: config. <-
  // APP: variables. <-
  // APP: init. <-
  // APP: createScene. <-
  
  addLights() {
    new WHS.PointLight({
      light: {
        distance: 100,
        intensity: 1,
        angle: Math.PI
      },

      shadowmap: {
        width: 1024,
        height: 1024,

        left: -50,
        right: 50,
        top: 50,
        bottom: -50,

        far: 80,

        fov: 90,
      },

      pos: {
        y: 60,
        z: -40
      },
    }).addTo(APP.world).then(() => APP.ProgressLoader.step());

    new WHS.AmbientLight({
      light: {
        intensity: 0.3
      }
    }).addTo(APP.world).then(() => APP.ProgressLoader.step());
  }
  
  // ...TODO
};

```

That’s how it looks now:

![Scene with wall, ground and lights.](https://cdn-images-1.medium.com/max/1200/1*BH9fCSY_A5x9PIYcWVEH7Q.png)

## Adding a basket 
After we added lights we need to have a basket in which we will throw a ball. Our basket will be a simple torus with thin tube radius. Also i experimented with material parameters to get it metal look.

```javascript

const APP = {
  // APP: config. <-

  /* BALL */
  ballRadius: 6,
  /* BASKET */
  basketColor: 0xff0000,
  getBasketRadius: () => APP.ballRadius + 2,
  basketTubeRadius: 0.5,
  basketY: 20,
  basketDistance: 80,
  getBasketZ: () => APP.getBasketRadius() + APP.basketTubeRadius * 2 - APP.basketDistance,
  
  // APP: variables. <-
  // APP: init. <-
  // APP: createScene. <-

  addBasket() {
    // TODO: Make a backboard.

    /* BASKET OBJECT */
    APP.basket = new WHS.Torus({
      geometry: {
        buffer: true,
        radius: APP.getBasketRadius(),
        tube: APP.basketTubeRadius,
        radialSegments: 16,
        tubularSegments: APP.isMobile ? 8 : 16
      },

      shadow: {
        cast: false
      },

      mass: 0,

      material: {
        kind: 'standard',
        color: APP.basketColor,
        metalness: 0.8,
        roughness: 0.5,
        emissive: 0xffccff,
        emissiveIntensity: 0.2
      },

      pos: {
        y: APP.basketY,
        z: APP.getBasketZ()
      },

      physics: {
        type: 'concave' // 'convex' by default.
      },

      rot: {
        x: Math.PI / 2
      }
    });

    APP.basket.addTo(APP.world).then(() => APP.ProgressLoader.step());

    // TODO: Make a net.
  }
  
  // ...TODO
};

```

One more thing is that we set a *“concave”* physics object type. By default, in performance reason each mesh with concave geometry works as a convex mesh for physics, but you can simply make it concave by setting this parameter. We make it static by applying 0 mass to this object.

##Adding a ball 
Now it’s time to make a ball. This time we are going to use optimization for mobile devices again (geometry with less vertices. It won’t work with physics because when we process sphere collisions it’s enough to have just a sphere radius)

This time we also have to apply x3 restitution to make out sphere jump like a basketball ball.

```javascript

const APP = {
  // APP: config. <-
  // APP: variables. <-
  // APP: createScene. <-
  // APP: addLights. <-
  // APP: addBasket. <-

  addBall() {
    /* BALL OBJECT */
    APP.ball = new WHS.Sphere({
      geometry: {
        buffer: true,
        radius: APP.ballRadius, 
        widthSegments: APP.isMobile ? 16 : 32,
        heightSegments: APP.isMobile ? 16 : 32
      },

      mass: 120,

      material: {
        kind: 'phong',
        map: WHS.texture('textures/ball.png'),
        normalMap: WHS.texture('textures/ball_normal.png'),
        shininess: 20,
        reflectivity: 2,
        normalScale: new THREE.Vector2(0.5, 0.5)
      },

      physics: {
        restitution: 3
      }
    });

    APP.ball.addTo(APP.world).then(() => APP.ProgressLoader.step());
  }
  
  // ...TODO
};

```

We use 2 textures for ball material. First one (in *map* parameter) is a default colored texture. Second one (*normalMap*) defines how light will be casted on this ball.

I generated a normal map using [this normal map generator](http://cpetry.github.io/NormalMap-Online/). I often use it. You can make a normal map not just from a black-white heightmap, for generating this one, i just used first texture.

![How ball map and normal map looks like.](https://cdn-images-1.medium.com/max/1200/1*x2f2M9oFNyFLhK-RaaNaQQ.png)





## Summary 
If everything done right, you should see something like this:

![](https://cdn-images-1.medium.com/max/1200/1*8m2Xu1wO-A8odWJDGlqf7w.png)

…And the ball will fall down…

Hopefully, second part will be next week.

## Links 
A result of this part is also [available on github](https://github.com/WhitestormJS/StreetBasketballGame/tree/part1).

Full game: [Github](https://github.com/WhitestormJS/StreetBasketballGame) | [Demo](http://whitestormjs.xyz/StreetBasketballGame/)
