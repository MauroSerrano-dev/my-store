import { ButtonGroup, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import styles from '@/styles/components/products/TableSize.module.css'
import { useAppContext } from '../contexts/AppContext'
import { useEffect, useState } from 'react'
import MyButton from '../material-ui/MyButton'

export default function TableSize(props) {
    const {
        type,
    } = props

    const {
        userLocation,
    } = useAppContext()

    const [unit, setUnit] = useState(userLocation?.country === 'US' ? 'imperial' : 'metric')
    const [firstTime, setFirstTime] = useState(true)

    useEffect(() => {
        if (firstTime && userLocation) {
            setUnit(userLocation?.country === 'US' ? 'imperial' : 'metric')
            setFirstTime(false)
        }
    }, [userLocation])

    const symbol = unit === 'imperial' ? 'in' : 'cm'

    const SIZES = {
        't-shirt': {
            head: ['S', 'M', 'L', 'XL', '2XL'],
            body: [
                { title: `Width, ${symbol}`, imperial: ['18.00', '20.00', '22.00', '24.00', '26.00'], metric: ['45.72', '50.80', '55.88', '60.96', '66.04'] },
                { title: `Length, ${symbol}`, imperial: ['28.00', '29.00', '30.00', '31.00', '32.00'], metric: ['71.12', '73.66', '76.20', '78.74', '81.28'] },
                { title: `Sleeve length, ${symbol}`, imperial: ['8.23', '8.50', '8.74', '9.02', '9.25'], metric: ['20.90', '21.60', '22.20', '22.90', '23.50'] },
            ],
        }
    }

    return (
        <Table
            aria-label="size table"
        >
            <TableHead>
                <TableRow>
                    <TableCell className={styles.tableCell} align="right">
                        <ButtonGroup>
                            <MyButton style={{ width: 90 }} onClick={() => setUnit('imperial')} variant={unit === 'imperial' ? 'contained' : 'outlined'}>imperial</MyButton>
                            <MyButton style={{ width: 90 }} onClick={() => setUnit('metric')} variant={unit === 'metric' ? 'contained' : 'outlined'}>metric</MyButton>
                        </ButtonGroup >
                    </TableCell>
                    {SIZES[type].head.map((hd, i) =>
                        <TableCell key={i} className={styles.tableCell} align="right">{hd}</TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {SIZES[type].body.map((bd, i) =>
                    <TableRow
                        key={i}
                    >
                        <TableCell
                            className={styles.tableCell}
                            component="th"
                            scope="row"
                        >
                            {bd.title}
                        </TableCell>
                        {bd[unit].map((value, j) =>
                            <TableCell
                                key={j}
                                className={styles.tableCell}
                            >
                                {value}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}