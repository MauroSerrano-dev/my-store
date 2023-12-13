import styles from '@/styles/pages/order-status/index.module.css'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { COMMON_TRANSLATES } from '@/consts'
import Image from 'next/image'
import Footer from '@/components/Footer'
import TextInput from '@/components/material-ui/TextInput'
import { Button } from '@mui/material'
import { useState } from 'react'

export default function OrderStatus() {

    const [orderId, setOrderId] = useState('')

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <h3>Insira o ID do pedido para começar a sua busca</h3>
                <div className='flex center row' style={{ gap: '1rem' }}>
                    <TextInput
                        label='Order ID'
                        value={orderId}
                        onChange={event => setOrderId(event.target.value)}
                    />
                    <Button
                        variant='contained'
                    >
                        Search
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['footer'])))
        }
    }
}