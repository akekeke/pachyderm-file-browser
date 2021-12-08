const promisify = require('promisify-node');
const path = require('path');
const fs = promisify('fs');

// Error type for silently shortcutting middleware
class PassthroughError extends Error { }

// convert an fs.Stat object to the JSON object we return for a file when we
// list a directory:
// {
//   name: string, // the filename of the entry, not the full path
//   type: 'dir' | 'file',
//   size: number, // only for files
//   created: number, // timestamp in ms since the unix epoch, only for files
//   modified: number, // timestamp in ms since the unix epoch, only for files
// }
const statsToFileData = (name, stats) => {
  const result = {name};

  if (stats.isDirectory()) {
    Object.assign(result, {type: 'dir'})
    return {name, type: 'dir'};
  } else {
    Object.assign(result, {
      type: 'file',
      size: stats.size,
      created: stats.birthtimeMs,
      modified: stats.mtimeMs,
    });
  }

  return result;
};

const dirList = (staticDir) => (req, res, next) => {
  const dirname = path.join(staticDir, req.path);
  Promise.resolve().then(() => {
    // Skip this middleware for non-GET responses or anything that escapes our
    // statics dir - express will probably 404 these.
    if (req.method !== 'GET' || !dirname.startsWith(staticDir)) {
      throw new PassthroughError();
    }

    // Stat the target path so we can check if it's a directory
    return fs.stat(dirname)
  }).then((dirStats) => {
    // Skip this middleware if the path is not a directory, the express static
    // middleware will handle serving files.
    if (!dirStats.isDirectory()) {
      throw new PassthroughError();
    }
    
    // Get a list of entry names in the directory
    return fs.readdir(dirname)
  }).then((filenames) => {
    // Stat every filename in the directory and zip the stats with the filename
    return Promise.all(
      filenames.map((x) => fs.stat(path.join(dirname, x)))
    ).then((fileStats) => 
      filenames.map((x, i) => [x, fileStats[i]])
    );
  }).then((entries) => {
    // Convert the entries into the JSON response format
    const result = {
      path: req.path,
      entries: entries.map(([name, stats]) => statsToFileData(name, stats)),
    };
    res.json(result);
  }).catch((err) => {
    // In general, any error should pass through to the next middleware, but if
    // it was not an explicit passthrough, log it for observability purposes.
    if (!(err instanceof PassthroughError)) {
      console.log(`Error in directory listing middleware: ${err}`);
    }
    next();
  });
};

module.exports = {dirList};
