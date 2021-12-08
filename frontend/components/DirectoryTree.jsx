import React, {useState, useEffect, Fragment, createContext, useContext} from 'react';

const fetchFiles = async (path = '') => {
  try {
    const response = await fetch('/files' + path)
    const files = await response.json()

    return files
  } catch(err) {
    console.error('error fetching files with error: ', error)
    return null
  }
}

const DetailsModal = ({entry}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Fragment> 
      <button onClick={(e) => {
        console.log('clciedk button')
        setIsOpen(true)
        e.stopPropagation()
        }}> Details</button> 
      <dialog open={isOpen}> 
        <table>
          <tbody>
          <tr>
            <td>Name</td>
            <td>{entry.name}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{entry.type}</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{(entry.size/1000).toFixed(2)} kB</td>
          </tr>
          <tr>
            <td>Created</td>
            <td>{(new Date(entry.created)).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td>Modified</td>
            <td>{(new Date(entry.modified)).toLocaleDateString()}</td>
          </tr>
          </tbody>
        </table>
        <button onClick={() => setIsOpen(false)}> Close</button>
      </dialog>
    </Fragment>
  )
}

const TreeItem = ({onSelectCallback, label, children, entry}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <div onClick={(e) => {
        onSelectCallback(e)
      }}>
        {entry.type === 'dir' ? 
          <button onClick={() => {
            console.log('clciedk button')
            setIsExpanded(!isExpanded)
            e.stopPropagation()
          }}>{!isExpanded ? '➡️' : '⬇️'}</button> : null
        }        
        {label}
        {entry.type === 'file' ? 
          <DetailsModal entry={entry}/>
          : null}
      </div>
      {isExpanded ? 
        <div style={{
          marginLeft: '10px'
        }}>
          {children}
        </div> : null
      }
    </div>
  )
}

const Tree = ({files, onSelectCallback}) => {
  const createTree = (entry) => {
    console.log('in create Tree: ', entry, entry.entries ? true : false)
    return ((
    <TreeItem
      label={entry.name}
      entry={entry}
      onSelectCallback={(e) => {
      onSelectCallback(entry)
    }}
    >
      {entry.entries ? entry.entries.map( (ent, idx) => (
        <Fragment key={idx}>
        {createTree(ent)}
        </Fragment>
        )) : null
      }
    </TreeItem>
    ))
  }

  console.log('in Tree')

  return (
    <div>
      <p> {files.path} </p>
      {files.entries.map( (entry, idx) => (
        <div key={idx}> 
        {createTree(entry) }
        </div>
      ))}
    </div>
  )
}


const FilesContext = createContext( {
    files: {},
    setFiles: () => {}
  }
)

const findFullPath = (node, searchTerm) => {
  let fullPath
  const dfs = (pathSoFar, searchTerm, obj) => {
    if (obj.name === searchTerm) {
      fullPath =  [...pathSoFar, searchTerm]
    } else if (!obj.entries) {
      return false
    } else {
      obj.entries.forEach((entry) => {
        return dfs([...pathSoFar, obj.name], searchTerm, entry)
      })
    }
  }
  dfs([], searchTerm, node)

  return fullPath.join('/')
}

const DirectoryTreeContainer = ({getSelectedFile}) => {
  const [files, setFiles] = useState(null)
  
  useEffect(() => {
    fetchFiles().then( (files) => {
      setFiles(files)
    })
  }, [])

  const onSelect = (value) => {
    console.log('clicked ', value)
    if (value.type === 'file') {
      const fullPath = findFullPath(files, value.name)
      getSelectedFile(fullPath)
    }

    if (value.type === 'dir') {
      const fullPath = findFullPath(files, value.name)
      fetchFiles(fullPath).then((res) => {
        const filesCopy = JSON.parse(JSON.stringify(files))
        const dfs2 = (obj, searchTerm) => {
          if (obj.name === searchTerm) {
            obj.entries = res.entries
            return
          } else if (!obj.entries) {
            return
          } else {
            obj.entries.forEach((entry) => {
            dfs2(entry, searchTerm)
          })}
        }
        dfs2(filesCopy, value.name)
        setFiles(filesCopy)
      })
    }
  }
  
  return (
    <div>
      {files ? 
        <FilesContext.Provider value={files, setFiles}>
          <Tree
            files={files}
            onSelectCallback={onSelect}
            />
        </FilesContext.Provider>
        : null
      }
    </div>
  )
};

export default DirectoryTreeContainer
