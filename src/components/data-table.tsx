import { Paper, Table, TableBody, TableContainer } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { FixedSizeList as List, ListOnItemsRenderedProps } from 'react-window'

import { useData } from '../context/data-provider'
import { useSettings } from '../context/settings-context'
import { MAX_ITEMS_RENDERED_PER_TIME } from '../utils/constants'
import { TableHeader } from './table-header'
import { TableRow } from './table-row'

const ROW_HEIGHT = 53

export const DataTable = memo(() => {
  const {
    data,
    generatedItemsCountRef,
    generateNextDataPage,
    updateInMemoryDataItems,
  } = useData()
  const { settings } = useSettings()
  const ref = useRef<List>(null)

  useEffect(() => {
    // reset scroll on change settings
    ref.current?.scrollTo(0)
  }, [settings])

  const columns = useMemo(() => {
    const firstDataItemIdInMemory = Object.keys(data)[0]

    return Object.keys(data[firstDataItemIdInMemory] ?? {})
  }, [data])

  const handleItemsRendered = useCallback(
    ({ overscanStartIndex, visibleStopIndex }: ListOnItemsRenderedProps) => {
      if (visibleStopIndex >= generatedItemsCountRef.current) {
        generateNextDataPage()
      }

      const startIndex = Math.max(overscanStartIndex - 10, 0)

      updateInMemoryDataItems(startIndex)
    },
    [generatedItemsCountRef, generateNextDataPage, updateInMemoryDataItems],
  )

  if (Object.values(data).length === 0) {
    return null
  }

  return (
    <TableContainer component={Paper}>
      <Table
        component="div"
        sx={{
          '& .MuiTableRow-root': {
            display: 'flex',
          },
          '& .MuiTableCell-root': { flex: 1 },
        }}
      >
        <TableHeader columns={columns} />

        <TableBody component="div">
          {/* 
            Virtualized list for render items in viewport
            In this case in table body will be rendered MAX_ITEMS_RENDERED_PER_TIME + 2 items 
            (one before and one after visible items for preventing flicker) 
          */}
          <List
            ref={ref}
            height={ROW_HEIGHT * MAX_ITEMS_RENDERED_PER_TIME}
            itemSize={ROW_HEIGHT}
            itemCount={settings.rows}
            onItemsRendered={handleItemsRendered}
            width="100%"
          >
            {TableRow}
          </List>
        </TableBody>
      </Table>
    </TableContainer>
  )
})

DataTable.displayName = 'DataTable'
