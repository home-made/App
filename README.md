# [Homemade](https://github.com/home-made/App)

Homemade is a React Native iOS application that helps people find new types of food from talented neighborhood home chefs. The world is full of talened cooks that don't work in the restaurant industry. Homemade is the platform that helps users find neighborhood chefs by cuisine type so they can discover new and exciting dishes prepared by talented chefs. Just load up the app, find a chef that's within 5 miles of your location, and place an order! All transactions between users and chefs rely on a donation system between both parties. Bon appétit!

## Table of contents

- Starting the app
- What's included
- Bugs, feature requests, and contributing
- Creators

## Starting the app

- Fork a copy of the repo and then clone the repo locally to your computer by forking via the Github GUI, and then entering the following command into the Terminal: `$ git clone https://github.com/[your_username_here]/App`

- Make sure you have [npm](https://www.npmjs.com) installed.

This is the part that might get complicated, bear with us. 
- Once the repo has been cloned locally to your computer, enter `$ cd App` in the Terminal to enter into the project root directory and run the following command:
  - `$ npm install` to install the npm dependencies in the `package.json` file. Please be patient while the dependencies install, there are a lot of them.

- When the dependencies finish loading, run `$ react-native upgrade`. You'll be prompted with a series of questions. Answer 'n' (means no) to avoid changing our `.gitignore` file and answer 'y' (means yes) to all the other questions. 

   - Changing the `.gitignore` will cause you problems in the future when working on this projct from your project fork. We speak from experience, so please avoid changing the `.gitignore`.      

- Run `$ react-native run-ios` to fire up the iOS simulator. Two separate tabs will open in your Terminal. One tab displays the status of the Xcode build that creates the actual iOS application. You'll have to wait patiently while Xcode builds the app. The other tab opens the React Packager that loads the dependencies. 


-When the iOS simulator pops open, you'll get one of two red screens: 

   - If you get a screen that reads `Connection to http://localhost:8081 debugger-proxy?role=client timeed out`, go to your internet browser, close one of the React Native Debugger windows, and click `Command + r` in the simulator to refresh the screen.  

   - If you get a screen that reads `Cannot read property 'Aspect' of undefined`, click `Shift + Command + h` to zoom out to the iPhone Simulator Home Screen. Click on the Homemade iOS icon to reload the app. You should see spinning animation of Hommemade fire up and take you to the Login page.

   -Keep doing the above steps if you keep seeing the same red screens.

-Voila! You'll appear on the app Login Page.

## Current Homemade issues

- Here are some bugs we are aware of:
  - A sockets issue sometimes causes the `Cannot read property 'Aspect' of undefined`.


## Creators

**Ebrima Jobe, Product Owner**
[https://github.com/enjsmoove](https://github.com/enjsmoove)

**David de Sousa, Scrum Master**
[https://github.com/dsousadev](https://github.com/dsousadev)

**Joe Kim**
[https://github.com/joeekimm](https://github.com/joeekimm)

**Jaime Mendoza**
[https://github.com/jaimemendozadev](https://github.com/jaimemendozadev)