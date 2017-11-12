# shanjing012.github.io
https://collab-whiteboard.herokuapp.com/

This is my simple collaborative whiteboard app which I host on heroku!

Final Project Documentation
GET1033: Exploring Computational Media Literacy
Project Name: Collab-Whiteboard

Introduction
The purpose of my final project is an online collaborative whiteboard which anyone can draw and edit. I decided on this as my final project as I wanted to learn how to create a fully functional website since we learnt a bit about HTML and CSS in one of our tutorials. I also wanted to create something interactive for the user(s), so that the user(s) can interact with my project! For this project, it is created with:

•	Node.js
o	Server framework
•	Express.js
o	Web Application framework
•	Express-ejs-layouts
o	Allow reusing of HTML code on the web application 
•	Socket.io.js
o	Allows for communication between server and clients
•	Jscolor.js
o	A miniature colour picker interface
•	Bootstrap
o	A toolkit for creating webpages which includes HTML, CSS and JavaScript
•	Github
o	A version control software that also helps deploy apps on Heroku
•	Heroku
o	A cloud based web deployment service provider

Features
Although it is a simple online whiteboard, there are a few features, such as:

•	An interactive whiteboard, which the user can draw on
o	Users can freely sketch their thoughts and whatever comes to their mind!
•	Multiple users can draw contribute to the whiteboard
o	The whiteboard is collaborative, users can share their thoughts on the same canvas.
•	A colour picker, which allows the changing of the brush colour
o	Thanks to Jscolour.js, users can change the brush colour to whatever they fancy.
•	Brush size picker, increase or decrease width of the brush
o	Max brush size: 9!
•	Various touch devices/browsers are supported
o	Tested with Safari and Chrome browsers!
•	Resizing of browser window
o	The canvas will stay at the same aspect ratio! (16:9)
•	Download your sketches
o	After drawing together with your friends, you can download the image!