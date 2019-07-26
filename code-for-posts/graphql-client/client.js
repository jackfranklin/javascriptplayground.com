import React from 'react'
const api = 'http://faker-graphql-api.herokuapp.com/graphql'

export const useGraphQL = ({ variables, query }) => {
  const [data, setData] = React.useState(null)

  const stringifiedVars = JSON.stringify(variables)
  React.useEffect(
    () => {
      request({ variables, query }).then(setData)
    },
    [stringifiedVars, query]
  )

  return [data]
}

export const request = ({ variables, query }) => {
  return fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then(response => response.json())
}
