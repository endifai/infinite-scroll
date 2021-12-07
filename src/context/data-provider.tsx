import noop from 'lodash/noop'
import React, {
  Dispatch,
  MutableRefObject,
  ReactElement,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  MAX_GENERATION_ITEMS_COUNT,
  MAX_ITEMS_IN_MEMORY_COUNT,
} from '../utils/constants'
import { generateDataset } from '../utils/generate-dataset'
import { getDatasetFromLS, saveDatasetToLS } from '../utils/local-storage'
import { useSettings } from './settings-context'

export type DataItem = Record<string, number>

export type DataSet = Record<string | number, DataItem>

interface DataContextType {
  data: DataSet
  setData: Dispatch<SetStateAction<DataSet>>
  generatedItemsCountRef: MutableRefObject<number>
  generateNextDataPage: () => Promise<void>
  updateInMemoryDataItems: (startIndex: number) => void
}

const initialValues: DataContextType = {
  data: {},
  setData: noop,
  generatedItemsCountRef: {
    current: 0,
  },
  generateNextDataPage: () => new Promise(noop),
  updateInMemoryDataItems: noop,
}

const DataContext = React.createContext(initialValues)

interface Props {
  children: ReactNode
}

export const DataProvider = ({ children }: Props): ReactElement => {
  const [data, setData] = useState<DataSet>({})
  const generatedItemsCountRef = useRef(0)

  const { settings } = useSettings()

  useEffect(() => {
    const init = async () => {
      const rowsCount =
        settings.rows > MAX_GENERATION_ITEMS_COUNT
          ? MAX_GENERATION_ITEMS_COUNT
          : settings.rows

      const data = await generateDataset(rowsCount, settings.columns, 0)

      saveDatasetToLS(data)

      generatedItemsCountRef.current = Object.values(data).length
      setData(data)
    }

    init()
  }, [settings])

  const generateNextDataPage = useCallback(async () => {
    const delta = settings.rows - generatedItemsCountRef.current
    const rowsCount =
      delta > MAX_GENERATION_ITEMS_COUNT ? MAX_GENERATION_ITEMS_COUNT : delta

    const startIndex = generatedItemsCountRef.current

    generatedItemsCountRef.current = startIndex + rowsCount

    await new Promise((resolve) => setTimeout(resolve, 100))
    const nextPage = await generateDataset(
      rowsCount,
      settings.columns,
      startIndex,
    )
    const cachedData = getDatasetFromLS()

    const newData = { ...cachedData, ...nextPage }

    saveDatasetToLS(newData)
  }, [data, settings])

  const updateInMemoryDataItems = useCallback((startIndex: number) => {
    const dataset = getDatasetFromLS()

    const newData: Record<number, DataItem> = {}

    for (let i = startIndex; i < startIndex + MAX_ITEMS_IN_MEMORY_COUNT; i++) {
      newData[i] = dataset[i]
    }

    setData(newData)
  }, [])

  const value = useMemo(
    () => ({
      data,
      setData,
      generatedItemsCountRef,
      generateNextDataPage,
      updateInMemoryDataItems,
    }),
    [data],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = (): DataContextType => useContext(DataContext)
