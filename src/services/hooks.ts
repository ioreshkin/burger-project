import {useDispatch, useSelector} from 'react-redux'
import type { AppDispatch, RootState } from './store'

// Use throughout your app instead of plain `useAppDispatch` and `useAppSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()