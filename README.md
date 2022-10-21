# jargon-splicer

Text statistics and manipulation via JavaScript/React

Currently published at: https://www.jonschneider.com/jsjsjs/

## Running locally

`npm run start`

## Publishing to production

1. `npm run build`
2. Copy the contents of the `build` folder to project's root folder (i.e. `/jsjsjs`) on the web server.

(Note: The project's folder on the web server must match the value of the `homepage` value in package.json. If there's a mismatch, the React components and the CSS won't render, and the published page will be a black-and-white page with just the title heading.)