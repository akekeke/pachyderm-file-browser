# File system explorer

Pachyderm is divided into two parts: the Pachyderm File System (PFS) and the Pachyderm Processing System (PPS). In the spirit of PFS, we're going to be working with a file system API to build a simple file browser.


## Working Conditions

This type of problem is utilized to simulate a realistic working interaction. So, please ask questions, discuss design decisions, and feel free to use whatever internet resources (including open source tools) you wish.

We expect you to spend roughly 3 hours, meaning when you wrap up, there will likely be more you _could_ have done. We leave it to you to decide how to trade off polish and styling for more functionality (though we're happy to consult if you have specific questions or tradeoffs you'd like to discuss). If you'd like to take a bit longer, that's OK too, but if you choose to do so, please consult with us about extending the time before the three-hour mark.

Additionally, several pieces of code are provided, like the backend server and the `FileContents` component.  You should not need to modify these, but you may if it would improve your solution.  If you come across a bug in these which is blocking your progress, you should bring it up with your interviewer.


## Getting started

While we're not expecting you to be a graphic designer, we are looking for you to have some sense of UX tradeoffs/sensible layout, so we will be looking at the way you choose to present the information, as well as the raw JS code written.

To get started:

* Fork this repository so you can make changes.
* Check out one of the prepared branches with your framework of choice (e.g. `git checkout react`), or install your own framework.
* Run `npm install` to download the dependencies.
* Run `npm run serve` to run the backend server and serve frontend assets.
* Direct your browser to `localhost:8080` to view the frontend.


## Requirements

Following the provided wireframes [1](wireframe_main.png) [2](wireframe_modal.png), write a single-page application that can browse through the files served by the backend.  This should show two panels, the left one showing a hierarchy of directories and files, and the right one showing the contents of the selected file.

It is encouraged to use third-party libraries where appropriate, such as state management, icons, file-type rendering, etc.

### Basic Requirements

It is your goal to fulfill these basic requirements in this project. 

#### Directory tree

The left panel shows a tree of directories and files that can be fetched from the backend.  This should be lazily populated as the user opens and closes directories.  The frontend should cache this data in local state management of some kind (e.g. redux, mobx, etc).

The currently open filepath should be encoded in the URL and kept up-to-date so that if the user refreshes, the same file will be open.  In addition, this should work with the browser history so that the back button will look at the previously opened file (if any).

#### File contents

When a file has been selected, its contents should be shown in the panel on the right.  A component is provided to display the contents, the `FileContents` component should be passed the path of the file in the `path` prop.

#### File metadata

The 'Details' button for a file in the directory tree should open up a [modal](wireframe_modal.png) showing the file metadata fetched from the directory entry on the backend.

### Stretch Requirements

If the basic requirements are filled and you still have time, you can add from the list of features below.

#### Style

The application should be styled in a user friendly way and use the following color guide:

| Color     |
| --------- |
|![#c4c3c4](https://placehold.it/15/c4c3c4/000000?text=+) `#c4c3c4` |
|![#a498a6](https://placehold.it/15/a498a6/000000?text=+) `#a498a6` |
|![#fe9b7c](https://placehold.it/15/fe9b7c/000000?text=+) `#fe9b7c` |
|![#c36d69](https://placehold.it/15/c36d69/000000?text=+) `#c36d69` |
|![#533868](https://placehold.it/15/533868/000000?text=+) `#533868` |

#### Error States

When a request to the server fails, the application should show a reasonable error message and provide a way for the user to reattempt or otherwise resolve the problem.

#### Loading States

When data is loading from the server (specifically from the API endpoint), the frontend should show some indication that the request is ongoing.

#### Empty States

When there are no directory entries, the frontend should visually indicate that the directory is empty to avoid confusing users.


## Backend API

The backend is a fairly simple server serving the files found in `frontend-interview/files` under `localhost:8080/files`.  In addition, `GET` requests to any directories in that path will return a JSON listing on the entries in the directory:

```js
{
  path: string // the requested path within the statics directory
  entries: array // an array of entries in the directory
}
```

```js
{
  name: string, // the filename of the entry, not the full path
  type: 'dir' | 'file',
  size: number, // only for files
  created: number, // timestamp in ms since the unix epoch, only for files
  modified: number, // timestamp in ms since the unix epoch, only for files
}
```


## Scoring

When you are done, push to your fork on github and notify us so we can make sure the frontend works in our environment.  We will go over the code and design.  Your design will be judged based on these factors, in order of importance:

* fulfilling basic requirements
* lack of defects
* component design, future-proofing, extensibility, and maintainability of your code
* adherence to the wireframe and style guidelines
* additional features implemented

[wireframe-reference]: https://wireframe.cc/pro/pp/8c09cab40300197
