import React from 'react'
import ReactDOM from 'react-dom'
import Tags from './tags'

const TagListWithArray = () => {
  const [tags, setTags] = React.useState(['react', 'javascript'])

  const addTag = newTag => {
    setTags(oldTags => [...oldTags, newTag])
  }

  return <Tags tags={tags} addTag={addTag} />
}

const TagListWithSet = () => {
  const [tags, setTags] = React.useState(new Set(['react', 'javascript']))

  const addTag = newTag => {
    setTags(oldTags => {
      const newSet = new Set([...oldTags])
      newSet.add(newTag)
      return newSet
    })
  }

  return <Tags tags={[...tags]} addTag={addTag} />
}

ReactDOM.render(
  <div>
    <div className="mt-4">
      <h3 className="font-bold text-xl mb-6">With arrays:</h3>
      <TagListWithArray />
    </div>
    <div className="mt-16">
      <h3 className="font-bold text-xl mb-6">With sets:</h3>
      <TagListWithSet />
    </div>
  </div>,
  document.getElementById('react-root')
)
