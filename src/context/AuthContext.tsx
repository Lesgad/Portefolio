import { createContext, useEffect, useReducer, type ReactNode } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '../services/firebase'

export interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  user: User | null
  error: string | null
}

type AuthAction =
  | { type: 'AUTH_SUCCESS'; user: User }
  | { type: 'AUTH_SIGNED_OUT' }
  | { type: 'AUTH_ERROR'; error: string }

export interface AuthContextValue extends AuthState {
  login: () => Promise<void>
  logout: () => Promise<void>
}

const initialState: AuthState = { status: 'loading', user: null, error: null }

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return { status: 'authenticated', user: action.user, error: null }
    case 'AUTH_SIGNED_OUT':
      return { status: 'unauthenticated', user: null, error: null }
    case 'AUTH_ERROR':
      return { status: 'unauthenticated', user: null, error: action.error }
  }
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(user ? { type: 'AUTH_SUCCESS', user } : { type: 'AUTH_SIGNED_OUT' })
    })
    return unsubscribe
  }, [])

  async function login(): Promise<void> {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        error: error instanceof Error ? error.message : 'La connexion a échoué.',
      })
    }
  }

  async function logout(): Promise<void> {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
