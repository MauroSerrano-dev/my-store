import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import React from 'react';

export default function MyTable(props) {
    const {
        headers = [],
        records = [],
    } = props

    return (
        <Paper style={{ overflow: 'hidden' }}>
            <Table aria-label="admin users table">
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
                        <TableRow key={i}>
                            {headers.map(head =>
                                <TableCell
                                    key={head.id}
                                >
                                    {rec[head.id]}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}