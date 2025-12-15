
import { useContext } from 'react'

import { LikesContext, type LikesContextType } from './likes-context' 

export function useLikes(): LikesContextType {
  const context = useContext(LikesContext)
  if (!context) {
    throw new Error('useLikes must be used within LikesProvider')
  }
  return context
}