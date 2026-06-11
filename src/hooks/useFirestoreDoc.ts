import { useEffect, useReducer } from 'react'
import { fetchDocument } from '../services/firestore'

export interface DocState<T> {
  status: 'loading' | 'success' | 'error'
  data: T | null
}

type DocAction<T> = { type: 'SUCCESS'; data: T | null } | { type: 'ERROR' }

export function useFirestoreDoc<T>(collectionName: string, id: string | undefined): DocState<T> {
  const initialState: DocState<T> = { status: 'loading', data: null }

  const [state, dispatch] = useReducer(
    (_state: DocState<T>, action: DocAction<T>): DocState<T> => {
      switch (action.type) {
        case 'SUCCESS':
          return { status: 'success', data: action.data }
        case 'ERROR':
          return { status: 'error', data: null }
      }
    },
    initialState,
  )

  useEffect(() => {
    if (!id) {
      dispatch({ type: 'ERROR' })
      return
    }

    let cancelled = false

    fetchDocument<T>(collectionName, id)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'SUCCESS', data })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'ERROR' })
      })

    return () => {
      cancelled = true
    }
  }, [collectionName, id])

  return state
}
