import { Paper, Table, TableBody, TableContainer } from '@mui/material'
import { memo, useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'

import { useData } from '../context/data-provider'
import { MAX_ITEMS_RENDERED_PER_TIME } from '../utils/constants'
import { TableHeader } from './table-header'
import { TableRow } from './table-row'

const ROW_HEIGHT = 53

export const DataTable = memo(() => {
  const { data } = useData()

  const columns = useMemo(() => Object.keys(data[0] ?? {}), [data])

  if (data.length === 0) {
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
            height={ROW_HEIGHT * MAX_ITEMS_RENDERED_PER_TIME}
            itemSize={ROW_HEIGHT}
            itemCount={data.length}
            itemData={data}
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
