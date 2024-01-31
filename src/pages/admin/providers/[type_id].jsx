import styles from '@/styles/admin/providers.module.css'
import NoFound404 from '../../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { COMMON_TRANSLATES, LIMITS, PRODUCTS_TYPES, PROVIDERS_POOL } from '@/consts';
import { useAppContext } from '@/components/contexts/AppContext';
import { getShippingOptions, updateShippingOption } from '../../../../frontend/app-settings';
import { useEffect, useState } from 'react';
import MyTable from '@/components/material-ui/MyTable';
import { useTranslation } from 'next-i18next';
import { showToast } from '@/utils/toasts';
import MyButton from '@/components/material-ui/MyButton';
import { isShippingOptionValid } from '@/utils/validations';

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
        router,
    } = useAppContext()

    const tCommon = useTranslation('common').t
    const tToasts = useTranslation('toasts').t

    const [shippingOption, setShippingOption] = useState()
    const [toastActive, setToastActive] = useState(false)
    const [saving, setSaving] = useState(false)
    const [clearUpdates, setClearUpdates] = useState(false)

    const type_id = shippingOption ? Object.keys(shippingOption.data)[0] : null

    useEffect(() => {
        callGetShippingOptions()
    }, [router])

    async function callGetShippingOptions() {
        if (router?.query.type_id) {
            try {
                const response = await getShippingOptions()
                setShippingOption({ ...response, data: { [router.query.type_id]: response.data[router.query.type_id] } })
            }
            catch (error) {
                console.error(error)
                if (error.msg)
                    showToast({ type: error.type, msg: tToasts(error.msg) })
            }
        }
    }

    function handleTableChange(rowIndex, columnIndex, value) {
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
            setShippingOption(prev => (
                {
                    ...prev,
                    data: {
                        [type_id]: {
                            ...prev.data[type_id],
                            [Object.keys(prev.data[type_id]).sort((a, b) => LOCATIONS_ORDER.indexOf(a) - LOCATIONS_ORDER.indexOf(b))[columnIndex - 1]]: {
                                ...prev.data[type_id][Object.keys(prev.data[type_id]).sort((a, b) => LOCATIONS_ORDER.indexOf(a) - LOCATIONS_ORDER.indexOf(b))[columnIndex - 1]],
                                [RECORDS_ROWS[rowIndex].id]: Number(value)
                            }
                        }
                    }
                }))
        }
    }

    function getTableRecord() {
        return RECORDS_ROWS.map(row => (
            {
                type: row.title,
                ...Object.keys(shippingOption.data[type_id]).map(key => (
                    {
                        [key]: (
                            row.type === 'provider'
                                ? { id: PROVIDERS_POOL[shippingOption.data[type_id][key][row.id]]?.id || shippingOption.data[type_id][key][row.id], title: PROVIDERS_POOL[shippingOption.data[type_id][key][row.id]]?.title || 'Invalid Provider ID' }
                                : { id: shippingOption.data[type_id][key][row.id], title: '$'.concat((shippingOption.data[type_id][key][row.id] / 100).toFixed(2)) }
                        )
                    }
                )).reduce((acc, ele) => ({ ...acc, ...ele }), {})
            }
        ))
    }

    async function handleUpdateShippingValues() {
        try {
            setSaving(true)
            isShippingOptionValid(shippingOption.data[type_id])
            const response = await updateShippingOption({ [type_id]: shippingOption.data[type_id] })
            showToast({ type: 'success', msg: tToasts(response.message) })
            setClearUpdates(prev => !prev)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
        finally {
            setSaving(false)
        }
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
                            {type_id &&
                                <div>
                                    <h2>{tCommon(type_id)}</h2>
                                    <h3>Shipping Values</h3>
                                    <div className='flex justify-end'>
                                        <MyButton
                                            className={styles.saveButton}
                                            color='success'
                                            disabled={saving}
                                            style={{
                                                width: 150
                                            }}
                                            onClick={() => handleUpdateShippingValues(type_id)}
                                            light
                                        >
                                            {saving ? tCommon('saving...') : tCommon('save')}
                                        </MyButton>
                                    </div>
                                    <MyTable
                                        showSaveButton
                                        headers={[{ id: 'type', title: 'Type', isHeader: true }].concat(Object.keys(shippingOption.data[type_id]).sort((a, b) => LOCATIONS_ORDER.indexOf(a) - LOCATIONS_ORDER.indexOf(b)).map(location => ({ id: location, title: location, editable: true })))}
                                        records={getTableRecord()}
                                        onChange={(rowIndex, columnIndex, value) => handleTableChange(rowIndex, columnIndex, value)}
                                        clearUpdates={clearUpdates}
                                    />
                                </div>
                            }
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