import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import styles from '@/styles/components/material-ui/MyTable.module.css'

export default function MyTable(props) {
    const {
        headers = [],
        records = [],
        onChange,
        clearUpdates
    } = props

    const inputRef = useRef(null)

    const [editableCell, setEditableCell] = useState(null)
    const [cellsUpdated, setCellsUpdated] = useState([])

    useEffect(() => {
        if (editableCell !== null)
            inputRef.current?.focus()
    }, [editableCell])

    useEffect(() => {
        setCellsUpdated([])
    }, [clearUpdates])

    function handleEditCell(id) {
        setEditableCell(id === editableCell ? null : id);
    }

    function handleCellChange(rowIndex, columnIndex, value) {
        if (onChange)
            onChange(rowIndex, columnIndex, value)
    }

    return (
        <Paper style={{ overflow: 'hidden', '--text-color': 'var(--text-black)' }}>
            <Table aria-label="table">
                <TableHead>
                    <TableRow>
                        {headers.map(head =>
                            <TableCell
                                key={head.id}
                                style={{
                                    fontWeight: 700,
                                    width: `${100 / headers.length}%`,
                                }}
                            >
                                {head.title}
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((rec, i) => (
                        <TableRow
                            key={i}
                        >
                            {headers.map((head, j) =>
                                <TableCell
                                    key={head.id}
                                    height={50}
                                    style={{
                                        padding: 0,
                                        fontWeight: head.isHeader ? 700 : 500,
                                    }}
                                >
                                    {editableCell === `${i}${j}` && head.editable
                                        ? <div
                                            className={styles.editableCell}
                                        >
                                            <input
                                                className={styles.editInput}
                                                ref={inputRef}
                                                value={rec[head.id].id === undefined ? rec[head.id] : rec[head.id].id}
                                                onChange={e => {
                                                    handleCellChange(i, j, e.target.value)
                                                    setCellsUpdated(prev => prev.includes(`${i}${j}`) ? prev : [...prev, `${i}${j}`])
                                                }}
                                                onBlur={() => setEditableCell(null)}
                                                style={{
                                                    width: '80px',
                                                }}
                                                onKeyDown={event => {
                                                    if (event.key === 'Enter')
                                                        setEditableCell(null)
                                                }}
                                            />
                                        </div>
                                        : <div
                                            onClick={() => handleEditCell(`${i}${j}`)}
                                            className={styles.noEditableCell}
                                            style={{
                                                color: cellsUpdated.includes(`${i}${j}`)
                                                    ? 'var(--color-success)'
                                                    : 'var(--text-black)'
                                            }}
                                        >
                                            {
                                                rec[head.id].title === undefined
                                                    ? rec[head.id]
                                                    : rec[head.id].title
                                            }
                                        </div>
                                    }
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}