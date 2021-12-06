import { Box, Button, TextField } from '@mui/material'
import { FormEvent, memo } from 'react'

import {
  Settings as SettingsType,
  useSettings,
} from '../context/settings-context'

export const Settings = memo(() => {
  const { settings, setSettings } = useSettings()

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const formValues = Object.fromEntries(formData) as unknown as SettingsType

    setSettings({
      rows: Number(formValues.rows),
      columns: Number(formValues.columns),
    })
  }

  return (
    <Box
      component="form"
      display="flex"
      alignItems="center"
      justifyContent="center"
      my="20px"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Строки"
        variant="outlined"
        name="rows"
        defaultValue={settings.rows}
        type="number"
      />
      <TextField
        label="Столбцы"
        variant="outlined"
        name="columns"
        defaultValue={settings.columns}
        type="number"
      />

      <Button type="submit">Сгенерировать данные</Button>
    </Box>
  )
})

Settings.displayName = 'Settings'
