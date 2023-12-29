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

    const symbol = unit === 'imperial' ? 'in' : 'cm'

    const SIZES = {
        't-shirt': {
            head: ['S', 'M', 'L', 'XL', '2XL'],
            body: [
                { title: `${tTableSizes('width')}, ${tTableSizes(symbol)}`, imperial: ['18.00', '20.00', '22.00', '24.00', '26.00'], metric: ['45.72', '50.80', '55.88', '60.96', '66.04'] },
                { title: `${tTableSizes('length')}, ${tTableSizes(symbol)}`, imperial: ['28.00', '29.00', '30.00', '31.00', '32.00'], metric: ['71.12', '73.66', '76.20', '78.74', '81.28'] },
                { title: `${tTableSizes('sleeve')}, ${tTableSizes(symbol)}`, imperial: ['8.23', '8.50', '8.74', '9.02', '9.25'], metric: ['20.90', '21.60', '22.20', '22.90', '23.50'] },
            ],
        },
        'hoodie': {
            head: ['S', 'M', 'L', 'XL', '2XL'],
            body: [
                { title: `${tTableSizes('width')}, ${tTableSizes(symbol)}`, imperial: ['20.08', '22.05', '24.02', '25.98', '27.99'], metric: ['51.00', '56.00', '61.00', '66.00', '71.10'] },
                { title: `${tTableSizes('length')}, ${tTableSizes(symbol)}`, imperial: ['27.17', '27.95', '29.13', '29.92', '31.10'], metric: ['69.00', '71.00', '74.00', '76.00', '79.00'] },
                { title: `${tTableSizes('sleeve-from')}, ${tTableSizes(symbol)}`, imperial: ['33.50', '34.50', '35.50', '36.50', '37.50'], metric: ['85.09', '87.63', '90.17', '92.71', '95.25'] },
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
                            {bd[unit].map((value, j) =>
                                <TableCell
                                    key={j}
                                    className={styles.tableCell}
                                    align="right"
                                >
                                    {value}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}