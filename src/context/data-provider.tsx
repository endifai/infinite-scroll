import noop from 'lodash/noop'
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { MAX_GENERATION_ITEMS_COUNT } from '../utils/constants'
import { generateDataset } from '../utils/generate-dataset'
import { useSettings } from './settings-context'

export type DataItem = Record<string, number>

interface DataContextType {
  data: DataItem[]
  generateNextDataPage: () => Promise<void>
}

const initialValues: DataContextType = {
  data: [],
  generateNextDataPage: () => new Promise(noop),
}

const DataContext = React.createContext(initialValues)

interface Props {
  children: ReactNode
}

export const DataProvider = ({ children }: Props): ReactElement => {
  const [data, setData] = useState<DataItem[]>([])

  const { settings } = useSettings()

  useEffect(() => {
    const init = async () => {
      const rowsCount =
        settings.rows > MAX_GENERATION_ITEMS_COUNT
          ? MAX_GENERATION_ITEMS_COUNT
          : settings.rows

      const data = await generateDataset(rowsCount, settings.columns)

      setData(data)
    }

    init()
  }, [settings])

  const generateNextDataPage = useCallback(async () => {
    const delta = settings.rows - data.length
    const rowsCount =
      delta > MAX_GENERATION_ITEMS_COUNT ? MAX_GENERATION_ITEMS_COUNT : delta

    const nextPage = await generateDataset(rowsCount, settings.columns)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setData([...data, ...nextPage])
  }, [data, settings])

  const value = useMemo(
    () => ({
      data,
      generateNextDataPage,
    }),
    [data],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = (): DataContextType => useContext(DataContext)
