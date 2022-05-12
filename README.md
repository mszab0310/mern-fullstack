# FULLSTACK MERN APP

## This is an online platform for managing activites with clients and mechanics for a car service

In order to run this project you will need to have Node version 16.14.0 installed ( I don't know if it's compatible with never version because of the node modules), you can get it from this [link](https://nodejs.org/download/release/v16.14.0/). <br/>
It uses React version 17.0.2 for the frontend. Technically it should work if you install all the node modules of the project (both server and client), but if it doesn't, try creating a separate react app to have it added to your global node dependencies. <br/>
In order to install all the necessary node modules for both the server and client, run the `npm -i` commands in a terminal opened in the respective folders.<br/>
For the server side, I used a locally hosted Mongo server, you can use Atlas if you want to, just dont forget the .env file, create it and add the `DB_URI` and `JWT_SECRET` fields to it and complete it with your data. <br/>
This is a project done for univeristy.
