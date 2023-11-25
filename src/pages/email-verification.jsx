import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { getAuth, applyActionCode } from 'firebase/auth';
import { useEffect } from 'react';

export default function EmailVerification() {

    useEffect(() => {
        // Capturando o URL atual
        const currentURL = window.location.href;
        // Extrair o código de verificação do URL (exemplo de implementação)
        const verificationCode = extractVerificationCodeFromURL(currentURL);

        // Verificar se há um código de verificação no URL
        if (verificationCode) {
            // Obtendo a instância de autenticação do Firebase
            const auth = getAuth();

            // Use o código de verificação para verificar o e-mail
            applyActionCode(auth, verificationCode)
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

    // Função para extrair o código de verificação do URL (exemplo)
    function extractVerificationCodeFromURL(url) {
        // Implemente a lógica para extrair o código de verificação do URL
        // Retorne o código de verificação, se encontrado, ou null
        // Exemplo: www.seusite.com/verificar-email?code=SEUCODIGOAQUI
        const params = new URLSearchParams(new URL(url).search);
        return params.get('code');
    }

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