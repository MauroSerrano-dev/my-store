import styles from '@/styles/admin/products/index.module.css'
import NoFound404 from '../../components/NoFound404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { COMMON_TRANSLATES, PROVIDERS_POOL } from '@/consts';
import { useAppContext } from '@/components/contexts/AppContext';
import { getShippingOptions } from '../../../frontend/app-settings';
import { useEffect, useState } from 'react';

export default function Providers() {
    const {
        session,
        isAdmin,
    } = useAppContext()

    const [shippingOptions, setShippingOptions] = useState()

    useEffect(() => {
        callGetShippingOptions()
    }, [])
    useEffect(() => {
        console.log(shippingOptions)
    }, [shippingOptions])

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
                                Object.keys(shippingOptions.data).map(prodType =>
                                    <div key={prodType}>
                                        <div>
                                            {prodType}
                                        </div>
                                        <div>
                                            {Object.keys(shippingOptions.data[prodType]).map(location =>
                                                <div key={location}>
                                                    <div>
                                                        {location}
                                                    </div>
                                                    <div>
                                                        <p>
                                                            Provider:{PROVIDERS_POOL[shippingOptions.data[prodType][location].provider_id].title}
                                                        </p>
                                                        <p>
                                                            First Item:{shippingOptions.data[prodType][location].first_item}
                                                        </p>
                                                        <p>
                                                            First Item Tax:{shippingOptions.data[prodType][location].tax}
                                                        </p>
                                                        <p>
                                                            Add Item:{shippingOptions.data[prodType][location].add_item}
                                                        </p>
                                                        <p>
                                                            Add Item Tax:{shippingOptions.data[prodType][location].add_tax}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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