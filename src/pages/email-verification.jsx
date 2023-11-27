import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { applyActionCode } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { showToast } from '@/utils/toasts';

export default function EmailVerification(props) {
    const {
        router,
        session,
        setUserEmailVerify,
        auth
    } = props

    const [showSpinner, setShowSpinner] = useState(false)

    useEffect(() => {
        setShowSpinner(true)
        if (router.query?.oobCode) {
            applyActionCode(auth, router.query.oobCode)
                .then(() => {
                    showToast({ type: 'success', msg: 'E-mail verificado com sucesso!' })
                    if (session) {
                        setUserEmailVerify(true)
                        router.push('/')
                    }
                    else
                        router.push('/login')
                })
                .catch(() => {
                    showToast({ type: 'error', msg: 'Erro ao verificar o e-mail' })
                    router.push('/')
                })
        }
    }, [])

    return (
        <div className='flex center column fillWidth' style={{ justifyContent: 'flex-start', paddingTop: '7rem' }}>
            {showSpinner &&
                <div
                    className='flex center column fillWidth'
                >
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            position: 'absolute',
                            color: '#525252',
                        }}
                        size={60}
                        thickness={4}
                        value={100}
                    />
                    <CircularProgress
                        disableShrink
                        size={60}
                        thickness={4}
                        sx={{
                            position: 'absolute',
                            animationDuration: '750ms',
                        }}
                    />
                </div>
            }
        </div>
    )
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'menu', 'navbar', 'footer', 'toasts']))
        }
    }
}