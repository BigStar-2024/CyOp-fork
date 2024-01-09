import React, { ReactNode, useEffect, useState, FC } from 'react'
import Context from "./Context"

const Provider: FC = ({ children }) => {

  const [route, setRoute] = useState('/')

  return (
    <Context.Provider
      value={{
        route,
        setRoute
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Provider
