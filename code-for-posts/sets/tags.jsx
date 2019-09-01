import React from 'react'

const Tags = ({ tags, addTag }) => {
  const [inputValue, setInputValue] = React.useState('')
  const onSubmit = e => {
    e.preventDefault()
    addTag(inputValue)
    setInputValue('')
  }
  return (
    <div>
      <div>
        {tags.map((tag, index) => (
          <span
            className="bg-transparent hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded mr-2"
            key={index}
          >
            {tag}
          </span>
        ))}
      </div>

      <form className="w-full max-w-sm mt-4" onSubmit={onSubmit}>
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
          <input
            type="text"
            placeholder="web development"
            value={inputValue}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            onChange={e => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default Tags
