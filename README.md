# Template vanilla JS Webpack repo
This is a repo to serve as a template in a webpack workflow to build simple web apps.
Follow these steps to set it up.
> **_NOTE:_**  This repo contains an index.js, template.html and reset.css file. Don't forget to import the css files in the index.js one for them to be effective.
In fact, remember that almost everything goes through the index.js file so make sure to import your modules that you want to run and the images in the appropriate js files.
1. After cloning the repo, we need to initialize npm <br>
`npm init -y`
2. Then, we install wepack and webpack CLI as dev dependancies <br>
`npm install --save-dev webpack webpack-cli`<br>
Normally, all the needed packages should be installed. Still, the css minimizer can cause problems, we should make sure : <br>
`npm install mini-css-extract-plugin`
3. We can make a new branch just for our deployments following these steps : <br>
    - We first make a new branch for github pages <br>
    `git branch gh-pages`
    - The we sync our two branches <br>
    `git checkout gh-pages && git merge main --no-edit`
    - We can then build our new branch with <br>
    `npm run build`
    - Then these commands that i still need to fully understand <br>
    `git add dist -f && git commit -m "Deployment commit"`<br>
    `git subtree push --prefix dist origin gh-pages`
    - Finally, we can go back to our main branch <br>
    `git checkout main` <br>
    Now we can run the deploy command normally.
4. Usefull commands : <br>
    - To build your dist through the prod webpack file (if you add any files in the repo for example) <br>
    `npm run build`
    - To start your page in the browser (will automatically refresh each time you save your files) <br>
    `npmm run dev`
    - To deploy your repo through github pages (be sure to build and push all changes before doing that) <br>
    `npm run deploy`
    - If there are any errors with this command, make sure you have installed the gh-pages package correctly <br>
    `npm install -D gh-pages`