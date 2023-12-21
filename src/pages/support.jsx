import Footer from '@/components/Footer'
import Selector from '@/components/material-ui/Selector'
import { COMMON_TRANSLATES, DEFAULT_LANGUAGE, LIMITS } from '@/consts'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/pages/support.module.css'
import { motion } from "framer-motion";
import TextInput from '@/components/material-ui/TextInput'
import { LoadingButton } from '@mui/lab'
import { showToast } from '@/utils/toasts'
import { handleReCaptchaError, handleReCaptchaSuccess } from '@/utils/validations'
import ReCAPTCHA from 'react-google-recaptcha'
import lottie from 'lottie-web';

const INICIAL_FIELDS = {
    email: '',
    order_id: '',
    subject: '',
    problem_description: '',
    problem_description: '',
}

export default function Support() {

    const { i18n } = useTranslation()
    const tToasts = useTranslation('tToasts').t

    const [option, setOption] = useState('other')
    const [fields, setFields] = useState(INICIAL_FIELDS)
    const [submiting, setSubmiting] = useState(false)
    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)
    const [showSuccessScreen, setShowSuccessScreen] = useState(false)

    const animationContainer = useRef(null)

    function handleSelector(event) {
        resetStates()
        setOption(event.target.value)
    }

    function resetStates() {
        setFields(INICIAL_FIELDS)
        setSubmiting(false)
        setReCaptchaSolve(false)
    }

    function submit() {
        if (!reCaptchaSolve)
            return showToast({ msg: tToasts('solve_recaptcha') })

        setSubmiting(true)

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN
            },
            body: JSON.stringify({
                option: option,
                fields: fields,
                user_language: i18n.language
            })
        }
        fetch("/api/support", options)
            .then(response => response.json())
            .then(response => {
                if (response.error)
                    showToast({ type: 'error', msg: response.error })
                else {
                    showToast({ type: 'success', msg: response.message })
                    setShowSuccessScreen(true)
                }
                setSubmiting(false)
            })
            .catch(() => {
                showToast({ type: 'error', msg: tToasts('default_error') })
                setSubmiting(false)
            })
    }

    useEffect(() => {
        let animation
        if (animationContainer.current) {
            animation = lottie.loadAnimation({
                container: animationContainer.current,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                animationData: require('@/utils/animations/successIcon.json'),
            })
        }

        return () => {
            if (animation)
                animation.destroy();
        }
    }, [showSuccessScreen])

    return (
        <div className={styles.container}>
            <Head>
            </Head>
            {showSuccessScreen
                ? <main className={styles.mainSuccess}>
                    <div
                        ref={animationContainer}
                        style={{
                            height: 300,
                        }}
                    >
                    </div>
                </main>
                : <main className={styles.main}>
                    <div className={styles.mainHead}>
                        <h1 className={styles.title}>How can we help you?</h1>
                        <Selector
                            styleForm={{
                                maxWidth: '290px'
                            }}
                            onChange={handleSelector}
                            value={option}
                            options={[
                                { value: 'order_status', name: 'Consult order status' },
                                { value: 'order_problem', name: 'Problem with an order' },
                                { value: 'account_problem', name: 'Problem with my account' },
                                { value: 'other', name: 'Other' },
                            ]}
                        />
                    </div>
                    <div className={styles.mainBody}>
                        {option === 'order_status' &&
                            <motion.div
                                className={styles.innerMainBody}
                                initial='hidden'
                                animate='visible'
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                    },
                                    visible: {
                                        opacity: 1,
                                    }
                                }}
                            >
                                <p>You can search the order status in <Link href={`${process.env.NEXT_PUBLIC_URL}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/order-status`}>{`${process.env.NEXT_PUBLIC_URL}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/order-status`}</Link></p>
                            </motion.div>
                        }
                        {option === 'order_problem' &&
                            <motion.div
                                className={styles.innerMainBody}
                                initial='hidden'
                                animate='visible'
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                    },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            delay: 0.2,
                                        }
                                    }
                                }}
                            >
                                <TextInput
                                    label='Email'
                                    value={fields.email}
                                    limti={LIMITS.input_email}
                                    onChange={event => setFields(prev => ({ ...prev, email: event.target.value }))}
                                />
                                <TextInput
                                    label='Order ID'
                                    value={fields.order_id}
                                    onChange={event => setFields(prev => ({ ...prev, order_id: event.target.value }))}
                                />
                                <TextInput
                                    label='Problem Description'
                                    multiline
                                    minRows={7}
                                    value={fields.problem_description}
                                    limit={570}
                                    onChange={event => setFields(prev => ({ ...prev, problem_description: event.target.value }))}
                                />
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY}
                                    onChange={userToken => handleReCaptchaSuccess(userToken, setReCaptchaSolve)}
                                    onExpired={() => handleReCaptchaError(setReCaptchaSolve)}
                                    onErrored={() => handleReCaptchaError(setReCaptchaSolve)}
                                    hl={i18n.language}
                                    theme="dark"
                                    className='reCaptcha'
                                />
                                <LoadingButton
                                    onClick={submit}
                                    loading={submiting}
                                    variant='contained'
                                    sx={{
                                        width: '100%',
                                        maxWidth: '600px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Send
                                </LoadingButton>
                            </motion.div>
                        }
                        {option === 'account_problem' &&
                            <motion.div
                                className={styles.innerMainBody}
                                initial='hidden'
                                animate='visible'
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                    },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            delay: 0.2,
                                        }
                                    }
                                }}
                            >
                                <TextInput
                                    label='Email'
                                    value={fields.email}
                                    limti={LIMITS.input_email}
                                    onChange={event => setFields(prev => ({ ...prev, email: event.target.value }))}
                                />
                                <TextInput
                                    label='Problem Description'
                                    multiline
                                    minRows={7}
                                    value={fields.problem_description}
                                    limit={570}
                                    onChange={event => setFields(prev => ({ ...prev, problem_description: event.target.value }))}
                                />
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY}
                                    onChange={userToken => handleReCaptchaSuccess(userToken, setReCaptchaSolve)}
                                    onExpired={() => handleReCaptchaError(setReCaptchaSolve)}
                                    onErrored={() => handleReCaptchaError(setReCaptchaSolve)}
                                    hl={i18n.language}
                                    theme="dark"
                                    className='reCaptcha'
                                />
                                <LoadingButton
                                    onClick={submit}
                                    loading={submiting}
                                    variant='contained'
                                    sx={{
                                        width: '100%',
                                        maxWidth: '600px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Send
                                </LoadingButton>
                            </motion.div>
                        }
                        {option === 'other' &&
                            <motion.div
                                className={styles.innerMainBody}
                                initial='hidden'
                                animate='visible'
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                    },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            delay: 0.2,
                                        }
                                    }
                                }}
                            >
                                <TextInput
                                    label='Email'
                                    value={fields.email}
                                    limti={LIMITS.input_email}
                                    onChange={event => setFields(prev => ({ ...prev, email: event.target.value }))}
                                />
                                <TextInput
                                    label='Subject'
                                    limit={50}
                                    value={fields.subject}
                                    onChange={event => setFields(prev => ({ ...prev, subject: event.target.value }))}
                                />
                                <TextInput
                                    label='Problem Description'
                                    multiline
                                    minRows={7}
                                    value={fields.problem_description}
                                    limit={570}
                                    onChange={event => setFields(prev => ({ ...prev, problem_description: event.target.value }))}
                                />
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY}
                                    onChange={userToken => handleReCaptchaSuccess(userToken, setReCaptchaSolve)}
                                    onExpired={() => handleReCaptchaError(setReCaptchaSolve)}
                                    onErrored={() => handleReCaptchaError(setReCaptchaSolve)}
                                    hl={i18n.language}
                                    theme="dark"
                                    className='reCaptcha'
                                />
                                <LoadingButton
                                    variant='contained'
                                    onClick={submit}
                                    loading={submiting}
                                    sx={{
                                        width: '100%',
                                        maxWidth: '600px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Send
                                </LoadingButton>
                            </motion.div>
                        }
                    </div>
                </main>}
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