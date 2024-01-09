import { useContext } from 'react'
import { Web3Context } from '../context/Web3'

const useWeb3 = () => {
  return {
    ...useContext(Web3Context),
  }
}

export const useFakeWeb3 = () => {
  const walletAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  const chainId = '1'
  const connected = true

  return {
    walletAddress, chainId, connected
  }
}

export default useWeb3
