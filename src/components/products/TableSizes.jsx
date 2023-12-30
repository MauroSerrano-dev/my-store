import { ButtonGroup, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import styles from '@/styles/components/products/TableSizes.module.css'
import { useAppContext } from '../contexts/AppContext'
import { useEffect, useState } from 'react'
import MyButton from '../material-ui/MyButton'
import { useTranslation } from 'next-i18next'
import { PRODUCTS_TYPES, SIZES_POOL } from '@/consts'

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

    const PRODUCT_TYPE = PRODUCTS_TYPES.find(tp => tp.id === type)

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
                        {PRODUCT_TYPE.sizes.map((size, i) =>
                            <TableCell
                                style={{ fontWeight: 600 }}
                                key={i}
                                className={styles.tableCell}
                                align="right"
                            >
                                {SIZES_POOL.find(s => s.id === size).title}
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(PRODUCT_TYPE.metrics).map((key, i) =>
                        <TableRow
                            key={i}
                        >
                            <TableCell
                                className={styles.tableCell}
                                component="th"
                                scope="row"
                                style={{
                                    fontWeight: 600,
                                    width: `${100 - (15 * PRODUCT_TYPE.metrics[key].length)}%`,
                                }}
                            >
                                {`${tTableSizes(key)}, ${UNITS[unit].symbol}`}
                            </TableCell>
                            {PRODUCT_TYPE.metrics[key].map((value, j) =>
                                <TableCell
                                    key={j}
                                    className={styles.tableCell}
                                    align="right"
                                    style={{
                                        width: '15%'
                                    }}
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