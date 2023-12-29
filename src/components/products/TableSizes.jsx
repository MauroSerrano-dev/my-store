import { ButtonGroup, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import styles from '@/styles/components/products/TableSizes.module.css'
import { useAppContext } from '../contexts/AppContext'
import { useEffect, useState } from 'react'
import MyButton from '../material-ui/MyButton'
import { useTranslation } from 'next-i18next'

export default function TableSizes(props) {
    const {
        type,
    } = props

    const {
        userLocation,
        windowWidth
    } = useAppContext()

    const tTableSizes = useTranslation('table-sizes').t

    const [unit, setUnit] = useState(userLocation?.country === 'US' ? 'imperial' : 'metric')
    const [firstTime, setFirstTime] = useState(true)

    useEffect(() => {
        if (firstTime && userLocation) {
            setUnit(userLocation?.country === 'US' ? 'imperial' : 'metric')
            setFirstTime(false)
        }
    }, [userLocation])

    const UNITS = {
        metric: {
            value: 1,
            symbol: 'cm'
        },
        imperial: {
            value: 0.3937,
            symbol: 'in',
        }
    }

    const SIZES = {
        't-shirt': {
            head: ['S', 'M', 'L', 'XL', '2XL'],
            body: [
                { title: `${tTableSizes('width')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [45.72, 50.8, 55.88, 60.96, 66.04] },
                { title: `${tTableSizes('length')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [71.12, 73.66, 76.2, 78.74, 81.28] },
                { title: `${tTableSizes('sleeve')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [20.9, 21.6, 22.2, 22.9, 23.5] },
            ],
        },
        'hoodie': {
            head: ['S', 'M', 'L', 'XL', '2XL'],
            body: [
                { title: `${tTableSizes('width')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [51, 56, 61, 66, 71.1] },
                { title: `${tTableSizes('length')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [69, 71, 74, 76, 79] },
                { title: `${tTableSizes('sleeve-from')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [85.09, 87.63, 90.17, 92.71, 95.25] },
            ],
        },
        'raglan-tee': {
            head: ['S', 'M', 'L', 'XL', '2XL'],
            body: [
                { title: `${tTableSizes('width')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [44.8, 49.8, 54.9, 60, 65.1] },
                { title: `${tTableSizes('length')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [68.9, 71.4, 74, 76.5, 79.1] },
                { title: `${tTableSizes('sleeve')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [60.2, 62.1, 64, 65.9, 67.8] },
            ],
        },
        'sweatshirt': {
            head: ['S', 'M', 'L', 'XL', '2XL'],
            body: [
                { title: `${tTableSizes('width')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [50.8, 55.9, 60.96, 66.04, 71.12] },
                { title: `${tTableSizes('length')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [68.58, 71.12, 73.66, 76.2, 78.74] },
                { title: `${tTableSizes('sleeve-from')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [85.09, 87.63, 90.17, 92.71, 95.25] },
            ],
        },
        'mug': {
            head: ['11oz'],
            body: [
                { title: `${tTableSizes('height')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [9.7] },
                { title: `${tTableSizes('diameter')}, ${tTableSizes(UNITS[unit].symbol)}`, metric: [8.1] },
            ],
        }
    }

    return (
        <div className={styles.container}>
            {windowWidth <= 700 &&
                <ButtonGroup>
                    <MyButton size='small' style={{ width: 80 }} onClick={() => setUnit('imperial')} variant={unit === 'imperial' ? 'contained' : 'outlined'}>
                        {tTableSizes('imperial')}
                    </MyButton>
                    <MyButton size='small' style={{ width: 80 }} onClick={() => setUnit('metric')} variant={unit === 'metric' ? 'contained' : 'outlined'}>
                        {tTableSizes('metric')}
                    </MyButton>
                </ButtonGroup>
            }
            <Table
                aria-label="size table"
                style={{ width: '100%' }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell className={styles.tableCell} align="left">
                            {windowWidth > 700 &&
                                <ButtonGroup>
                                    <MyButton style={{ width: 90 }} onClick={() => setUnit('imperial')} variant={unit === 'imperial' ? 'contained' : 'outlined'}>
                                        {tTableSizes('imperial')}
                                    </MyButton>
                                    <MyButton style={{ width: 90 }} onClick={() => setUnit('metric')} variant={unit === 'metric' ? 'contained' : 'outlined'}>
                                        {tTableSizes('metric')}
                                    </MyButton>
                                </ButtonGroup>
                            }
                        </TableCell>
                        {SIZES[type].head.map((hd, i) =>
                            <TableCell
                                style={{ fontWeight: 600 }}
                                key={i}
                                className={styles.tableCell}
                                align="right"
                            >
                                {hd}
                            </TableCell>
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
                                style={{ fontWeight: 600 }}
                            >
                                {bd.title}
                            </TableCell>
                            {bd.metric.map((value, j) =>
                                <TableCell
                                    key={j}
                                    className={styles.tableCell}
                                    align="right"
                                >
                                    {(value * UNITS[unit].value).toFixed(2)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}