import noop from 'lodash/noop'
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'
import { ReactNode } from 'react'

export interface Settings {
  rows: number
  columns: number
}

interface SettingsContextTypes {
  settings: Settings
  setSettings: Dispatch<SetStateAction<Settings>>
}

const initialSettings = { rows: 0, columns: 0 }

const initialValue: SettingsContextTypes = {
  settings: initialSettings,
  setSettings: noop,
}

const SettingsContext = React.createContext(initialValue)

interface Props {
  children: ReactNode
}

export const SettingsProvider = ({ children }: Props): ReactElement => {
  const [settings, setSettings] = useState(initialSettings)

  const value = useMemo(
    () => ({
      settings,
      setSettings,
    }),
    [settings],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = (): SettingsContextTypes =>
  useContext(SettingsContext)
