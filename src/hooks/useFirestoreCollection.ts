import { useEffect, useReducer } from 'react'
import { fetchCollection } from '../services/firestore'

export interface CollectionState<T> {
  status: 'loading' | 'success' | 'error'
  data: T[]
}

type CollectionAction<T> = { type: 'SUCCESS'; data: T[] } | { type: 'ERROR' }

export function useFirestoreCollection<T>(collectionName: string): CollectionState<T> {
  const initialState: CollectionState<T> = { status: 'loading', data: [] }

  const [state, dispatch] = useReducer(
    (_state: CollectionState<T>, action: CollectionAction<T>): CollectionState<T> => {
      switch (action.type) {
        case 'SUCCESS':
          return { status: 'success', data: action.data }
        case 'ERROR':
          return { status: 'error', data: [] }
      }
    },
    initialState,
  )

  useEffect(() => {
    let cancelled = false

    fetchCollection<T>(collectionName)
      .then((data) => {
        if (!cancelled) dispatch({ type: 'SUCCESS', data })
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: 'ERROR' })
      })

    return () => {
      cancelled = true
    }
  }, [collectionName])

  return state
}
