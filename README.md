# Whats Delta?
A project made for a hackathon that tracks triangles on your webcam and centers your mouse on them.
Made in nodejs using OpenCV and RobotJS

TODO: Click feature by twisting your hands into the shape of a rectangle and then flipping them back to a triangle for a click, hold triangle for right click, etc


# Install+Run via copypasta into terminal
```
git clone https://github.com/rslay/Delta.git
cd Delta
npm install opencv robotjs
node index.js
```
Make sure your webcam isn't covered. 
As of now, things in the background and anything right behind your hands can throw off image analysis since this has no depth perception, including windows, doors, your torso, _your face_, and anything else - especially if it looks vaguely triangular shaped.
