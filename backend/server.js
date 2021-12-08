const express = require('express');
const path = require('path');

const {dirList} = require('./dirList');

const app = express();
const port = 8080;
const filesDir = path.resolve('files');
const staticDir = path.resolve('dist');

// Serve the file listing API, will pass through if the requested path is not a valid directory
app.use('/files', dirList(filesDir));

// Serve files in the `files` directory, will 404 for non-existent files within `files`
app.use('/files', express.static(filesDir, {index: false, fallthrough: false}));

// Serve files in the `dist` directory, will 404 for non-existent files within `dist`
app.use('/dist', express.static(staticDir, {fallthrough: false}));

// Catch-all to serve the single-page app
app.get('*', (req, res) => res.sendFile(path.resolve(staticDir, 'index.html')))

app.listen(port, () => console.log(`Server listening on port ${port}`));
