import React from 'react'
import ReactDOM from 'react-dom'
import { request, useGraphQL } from './client'

const App = props => {
  const [data] = useGraphQL({
    variables: {},
    query: `{ people { name } }`,
  })
  return <div>{JSON.stringify(data || {}, null, 4)}</div>
}

ReactDOM.render(<App />, document.getElementById('root'))

// request({
//   query: `query fetchPerson($id: Int!) {
//     person(id: $id) {
//       name,
//     }
//   }`,
//   variables: {
//     id: 1,
//   },
// })

// request({
//   query: `{ people { name } }`,
// })
