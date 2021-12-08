import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {tomorrowNight as syntaxStyle} from 'react-syntax-highlighter/dist/esm/styles/hljs';

const renderImage = (path) => {
  return <img src={path} />;
};

const renderVideo = (path) => {
  return <video controls src={path} />;
};

const renderAudio = (path) => {
  return <audio controls src={path} />;
};

// For some filetypes, we can pass the path to other components for rendering.
const pathRenderers = {
  '.jpg': renderImage,
  '.png': renderImage,
  '.gif': renderImage,
  '.svg': renderImage,
  '.mp4': renderVideo,
  '.mp3': renderAudio,
};

const renderMarkdown = (data) => {
  return <ReactMarkdown source={data} />;
};

const renderText = (data) => {
  return <pre style={{whiteSpace: 'pre-wrap'}}>{data}</pre>;
};

const renderGoCode = (data) => {
  return <SyntaxHighlighter language="go" style={syntaxStyle}>{data}</SyntaxHighlighter>;
};

const renderJsCode = (data) => {
  return <SyntaxHighlighter language="javascript" style={syntaxStyle}>{data}</SyntaxHighlighter>;
};

// For some filetypes, we will download the file contents to render via React.
const dataRenderers = {
  '.md': renderMarkdown,
  '.txt': renderText,
  '.go': renderGoCode,
  '.js': renderJsCode,
};

const shouldLoadContents = (path) => {
  return Object.keys(dataRenderers).some((x) => path.endsWith(x));
};

const FileContents = ({path}) => {
  const [fetchState, setFetchState] = useState({loading: false, data: '', error: null});

  useEffect(() => {
    setFetchState({loading: true, data: null, error: null});

    if (shouldLoadContents(path)) {
      fetch(path).then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        return response.text();
      }).then((text) => {
        setFetchState({loading: false, data: text, error: null});
      }).catch((err) => {
        setFetchState({loading: false, data: null, error: `Failed to fetch file contents: ${err}`});
      });
    }
  }, [path, setFetchState]);

  if (!path) {
    return <div>No file selected.</div>;
  }

  for (const [extension, renderer] of Object.entries(pathRenderers)) {
    if (path.endsWith(extension)) {
      return renderer(path);
    }
  }

  // These renderers require us to have downloaded the file contents, so there
  // is extra handling for loading and error states
  for (const [extension, renderer] of Object.entries(dataRenderers)) {
    if (path.endsWith(extension)) {
      if (fetchState.error) {
        return <div>Error loading file contents: {fetchState.error}</div>;
      } else if (fetchState.loading) {
        return <div>Loading file contents…</div>;
      }
      return renderer(fetchState.data);
    }
  }

  return <div>Unsupported file type: {path}</div>;
};

export default FileContents
