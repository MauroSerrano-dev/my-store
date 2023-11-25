import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { getAuth, applyActionCode } from 'firebase/auth';
import { useEffect } from 'react';

export default function EmailVerification(props) {
    const {
        router
    } = props

    useEffect(() => {
        // Verificar se há um código de verificação no URL
        if (router.query?.oobCode) {
            // Obtendo a instância de autenticação do Firebase
            const auth = getAuth()

            // Use o código de verificação para verificar o e-mail
            applyActionCode(auth, router.query.oobCode)
                .then(() => {
                    // Email verificado com sucesso!
                    // Atualize o status no seu aplicativo ou redirecione o usuário, se necessário
                    console.log('E-mail verificado com sucesso!');
                })
                .catch((error) => {
                    // Trate os erros de verificação de e-mail aqui
                    console.error('Erro ao verificar o e-mail:', error);
                });
        }
    }, [])

    return (
        <div className='flex center column'>
            <Head>
            </Head>
            <main>
            </main>
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