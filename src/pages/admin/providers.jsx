import styles from '@/styles/admin/providers.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { COMMON_TRANSLATES, LIMITS, PRODUCTS_TYPES, PROVIDERS_POOL } from '@/consts';
import { useAppContext } from '@/components/contexts/AppContext';
import { getShippingOptions } from '../../../frontend/app-settings';
import { useEffect, useState } from 'react';
import MyTable from '@/components/material-ui/MyTable';
import { useTranslation } from 'next-i18next';
import { showToast } from '@/utils/toasts';
import MyButton from '@/components/material-ui/MyButton';

const LOCATIONS_ORDER = ['US', 'CA', 'PL', 'DE', 'IE', 'GB', 'AU', 'EU', 'EUN', 'default']

const RECORDS_ROWS = [
    { id: 'provider_id', title: 'Provider', type: 'provider' },
    { id: 'first_item', title: 'First Item', type: 'currency' },
    { id: 'add_item', title: 'Add Item', type: 'currency' },
    { id: 'tax', title: 'Tax First Item', type: 'currency' },
    { id: 'add_tax', title: 'Tax Add Item', type: 'currency' },
]

export default function Providers() {
    const {
        session,
        isAdmin,
    } = useAppContext()

    const tCommon = useTranslation('common').t
    const tToasts = useTranslation('toasts').t

    const [shippingOptions, setShippingOptions] = useState()
    const [toastActive, setToastActive] = useState(false)

    useEffect(() => {
        callGetShippingOptions()
    }, [])

    async function callGetShippingOptions() {
        try {
            const response = await getShippingOptions()
            setShippingOptions(response)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    function handleTableChange(prod_type, rowIndex, columnIndex, value) {
        if (value.length > LIMITS.shipping_value) {
            if (!toastActive) {
                setToastActive(true)
                showToast({ msg: tToasts('input_limit') })
                setTimeout(() => {
                    setToastActive(false)
                }, 3000)
            }
            return
        }
        if (!Number.isNaN(Number(value))) {
            setShippingOptions(prev => (
                {
                    ...prev,
                    data: {
                        ...prev.data,
                        [prod_type]: {
                            ...prev.data[prod_type],
                            [Object.keys(prev.data[prod_type]).sort((a, b) => LOCATIONS_ORDER.indexOf(a) - LOCATIONS_ORDER.indexOf(b))[columnIndex - 1]]: {
                                ...prev.data[prod_type][Object.keys(prev.data[prod_type]).sort((a, b) => LOCATIONS_ORDER.indexOf(a) - LOCATIONS_ORDER.indexOf(b))[columnIndex - 1]],
                                [RECORDS_ROWS[rowIndex].id]: Number(value)
                            }
                        }
                    }
                }))
        }
    }

    function getTableRecord(type) {
        return RECORDS_ROWS.map(row => (
            {
                'type': row.title,
                ...Object.keys(shippingOptions.data[type.id]).map(key => (
                    {
                        [key]: (
                            row.type === 'provider'
                                ? { id: PROVIDERS_POOL[shippingOptions.data[type.id][key][row.id]].id, title: PROVIDERS_POOL[shippingOptions.data[type.id][key][row.id]].title }
                                : { id: shippingOptions.data[type.id][key][row.id], title: '$'.concat((shippingOptions.data[type.id][key][row.id] / 100).toFixed(2)) }
                        )
                    }
                )).reduce((acc, ele) => ({ ...acc, ...ele }), {})
            }
        ))
    }

    return (
        session === undefined
            ? <div></div>
            : session === null || !isAdmin
                ? <NoFound404 />
                : <div
                    className={styles.container}
                    style={{
                        paddingLeft: 'calc(var(--admin-menu-width-close) + 2rem)',
                    }}
                >
                    <header>
                    </header>
                    <main className={styles.main}>
                        <h2>Products Providers</h2>
                        <div className={styles.providers}>
                            {shippingOptions &&
                                PRODUCTS_TYPES.map(type =>
                                    <div key={type.id} >
                                        <h2>{tCommon(type.id)}</h2>
                                        <h3>Shipping Values</h3>
                                        {true &&
                                            <MyButton
                                            className={styles.saveButton}
                                                color='success'
                                            >
                                                {tCommon('save')}
                                            </MyButton>
                                        }
                                        <MyTable
                                            showSaveButton
                                            headers={[{ id: 'type', title: 'Type' }].concat(Object.keys(shippingOptions.data[type.id]).sort((a, b) => LOCATIONS_ORDER.indexOf(a) - LOCATIONS_ORDER.indexOf(b)).map(location => ({ id: location, title: location })))}
                                            records={getTableRecord(type)}
                                            onChange={(rowIndex, columnIndex, value) => handleTableChange(type.id, rowIndex, columnIndex, value)}
                                        />
                                    </div>
                                )}
                        </div>
                    </main>
                </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES))
        }
    }
}