import { useContext } from 'react'
import { RouteContext } from '../context/Router'

const useRoute = () => {
  return {
    ...useContext(RouteContext),
  }
}

export default useRoute
