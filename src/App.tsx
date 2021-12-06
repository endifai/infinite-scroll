import { ReactElement } from 'react'

import { DataTable } from './components/data-table'
import { Settings } from './components/settings'
import { DataProvider } from './context/data-provider'
import { SettingsProvider } from './context/settings-context'

export const App = (): ReactElement => (
  <SettingsProvider>
    <DataProvider>
      <div className="App">
        <Settings />
        <DataTable />
      </div>
    </DataProvider>
  </SettingsProvider>
)
