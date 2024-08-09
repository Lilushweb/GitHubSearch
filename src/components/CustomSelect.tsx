import React from 'react'
import { MenuItem, FormControl } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface CustomSelectProps {
    first: number,
    setFirst: React.Dispatch<React.SetStateAction<number>>
    setCursors: React.Dispatch<React.SetStateAction<(string | null)[]>>
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function CustomSelect({ first, setFirst, setCursors, setCurrentPage }: CustomSelectProps) {

    const handleChange = (event: SelectChangeEvent) => {
        setFirst(parseInt(event.target.value))
        setCurrentPage(0)
        setCursors([null])
    }

    return (
        <FormControl
            sx={{ m: 1, minWidth: 80 }}
            variant="standard"
        >
            <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={first.toString()}
                onChange={handleChange}
                autoWidth
                label="10"
            >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={50}>50</MenuItem>
            </Select>
        </FormControl>
    )
}
