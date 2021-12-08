import React, {useState} from 'react'

import FileContents from 'components/FileContents'
import DirectoryTreeContainer from './DirectoryTree';



const App = () => {
  const [selectedFile, setSelectedFile] = useState('')

  const getSelectedFile = (file = '') => {
    setSelectedFile('files/' + file)
  }

  return (
    <div style={{display: 'flex'}}>
      <div style={{minWidth: '25%'}}>
        Directory tree goes here
        <DirectoryTreeContainer getSelectedFile={getSelectedFile}/>
      </div>
      <div style={{flex: 'auto', minWidth: '50%'}}>
        <FileContents path={selectedFile} />
      </div>
    </div>
  );
}

export default App
