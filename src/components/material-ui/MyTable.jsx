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
    } = props

    const inputRef = useRef(null)

    const [editableCell, setEditableCell] = useState(null)

    useEffect(() => {
        if (editableCell !== null)
            inputRef.current?.focus()
    }, [editableCell])

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
                                        padding: 0
                                    }}
                                >
                                    {editableCell === `${i}${j}`
                                        ? <div
                                            className={styles.editableCell}
                                        >
                                            <input
                                                className={styles.editInput}
                                                ref={inputRef}
                                                value={rec[head.id].id === undefined ? rec[head.id] : rec[head.id].id}
                                                onChange={e => handleCellChange(i, j, e.target.value)}
                                                onBlur={() => setEditableCell(null)}
                                                style={{
                                                    width: '80px',
                                                }}
                                            />
                                        </div>
                                        : <div
                                            onClick={() => handleEditCell(`${i}${j}`)}
                                            className={styles.noEditableCell}
                                        >
                                            {rec[head.id].title === undefined ? rec[head.id] : rec[head.id].title}
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