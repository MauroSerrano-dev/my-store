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
import MyError from '@/classes/MyError'

const INICIAL_FIELDS = {
    email: '',
    order_id: '',
    subject: '',
    problem_description: '',
    problem_description: '',
}

export default function Support() {

    const { i18n } = useTranslation()
    const tToasts = useTranslation('toasts').t
    const tCommon = useTranslation('common').t
    const tSupport = useTranslation('support').t

    const [option, setOption] = useState('none')
    const [fields, setFields] = useState(INICIAL_FIELDS)
    const [submiting, setSubmiting] = useState(false)
    const [reCaptchaSolve, setReCaptchaSolve] = useState(false)
    const [showSuccessScreen, setShowSuccessScreen] = useState(false)

    const animationSuccessContainer = useRef(null)
    const animationSupportContainer = useRef(null)

    function handleSelector(event) {
        resetStates()
        setOption(event.target.value)
    }

    function resetStates() {
        setFields(INICIAL_FIELDS)
        setSubmiting(false)
        setReCaptchaSolve(false)
    }

    async function submit() {
        try {
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
            const response = await fetch("/api/support", options)
            const responseJson = await response.json()

            if (response.status >= 300)
                throw new MyError(responseJson.error)

            showToast({ type: 'success', msg: tToasts(responseJson.message) })
            setShowSuccessScreen(true)
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
            else
                showToast({ type: 'error', msg: tToasts('default_error') })
        }
        finally {
            setSubmiting(false)
        }
    }

    useEffect(() => {
        let animation
        if (animationSuccessContainer.current) {
            animation = lottie.loadAnimation({
                container: animationSuccessContainer.current,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                animationData: require('@/utils/animations/successEmailSent.json'),
            })
        }

        return () => {
            if (animation)
                animation.destroy();
        }
    }, [showSuccessScreen])

    useEffect(() => {
        let animation
        if (animationSupportContainer.current) {
            animation = lottie.loadAnimation({
                container: animationSupportContainer.current,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                animationData: require('@/utils/animations/support.json'),
            })
        }

        return () => {
            if (animation)
                animation.destroy();
        }
    }, [option])

    return (
        <div className={styles.container}>
            <Head>
            </Head>
            {showSuccessScreen
                ? <main className={styles.mainSuccess}>
                    <div
                        ref={animationSuccessContainer}
                        style={{
                            height: 300,
                        }}
                    >
                    </div>
                    <h3>{tSupport('check_your_email')}</h3>
                </main>
                : <main className={styles.main}>
                    <div className={styles.mainHead}>
                        <h1 className={styles.title}>
                            {tSupport('title')}
                        </h1>
                        <Selector
                            styleForm={{
                                maxWidth: '320px'
                            }}
                            onChange={handleSelector}
                            value={option}
                            options={[
                                { value: 'none', name: 'Choose an option' },
                                { value: 'order_status', name: tSupport('order_status') },
                                { value: 'order_problem', name: tSupport('order_problem') },
                                { value: 'account_problem', name: tSupport('account_problem') },
                                { value: 'report_bug', name: tSupport('report_bug') },
                                { value: 'other', name: tSupport('other') },
                            ]}
                        />
                    </div>
                    <div className={styles.mainBody}>
                        {option === 'none' &&
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
                                <div
                                    ref={animationSupportContainer}
                                    style={{
                                        height: 600,
                                        marginTop: -100,
                                        marginBottom: -100,
                                        zIndex: -10
                                    }}
                                >
                                </div>
                            </motion.div>}
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
                                <p>{tSupport('order_status_text')}</p>
                                <Link href={`${process.env.NEXT_PUBLIC_URL}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/order-status`}>{`${process.env.NEXT_PUBLIC_URL}${i18n.language === DEFAULT_LANGUAGE ? '' : `/${i18n.language}`}/order-status`}</Link>
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
                                    label={tCommon('e-mail')}
                                    value={fields.email}
                                    limti={LIMITS.input_email}
                                    onChange={event => setFields(prev => ({ ...prev, email: event.target.value }))}
                                />
                                <TextInput
                                    label={tSupport('order_id')}
                                    value={fields.order_id}
                                    onChange={event => setFields(prev => ({ ...prev, order_id: event.target.value }))}
                                />
                                <TextInput
                                    label={tSupport('problem_description')}
                                    multiline
                                    minRows={7}
                                    value={fields.problem_description}
                                    limit={570}
                                    onChange={event => setFields(prev => ({ ...prev, problem_description: event.target.value }))}
                                />
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY_CLIENT}
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
                                    {tSupport('send')}
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
                                    label={tCommon('e-mail')}
                                    value={fields.email}
                                    limti={LIMITS.input_email}
                                    onChange={event => setFields(prev => ({ ...prev, email: event.target.value }))}
                                />
                                <TextInput
                                    label={tSupport('problem_description')}
                                    multiline
                                    minRows={7}
                                    value={fields.problem_description}
                                    limit={570}
                                    onChange={event => setFields(prev => ({ ...prev, problem_description: event.target.value }))}
                                />
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY_CLIENT}
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
                                    {tSupport('send')}
                                </LoadingButton>
                            </motion.div>
                        }
                        {option === 'report_bug' &&
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
                                    label={tCommon('e-mail')}
                                    value={fields.email}
                                    limti={LIMITS.input_email}
                                    onChange={event => setFields(prev => ({ ...prev, email: event.target.value }))}
                                />
                                <TextInput
                                    label={tSupport('problem_description')}
                                    multiline
                                    minRows={7}
                                    value={fields.problem_description}
                                    limit={570}
                                    onChange={event => setFields(prev => ({ ...prev, problem_description: event.target.value }))}
                                />
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY_CLIENT}
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
                                    {tSupport('send')}
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
                                    label={tCommon('e-mail')}
                                    value={fields.email}
                                    limti={LIMITS.input_email}
                                    onChange={event => setFields(prev => ({ ...prev, email: event.target.value }))}
                                />
                                <TextInput
                                    label={tSupport('subject')}
                                    limit={35}
                                    value={fields.subject}
                                    onChange={event => setFields(prev => ({ ...prev, subject: event.target.value }))}
                                />
                                <TextInput
                                    label={tSupport('problem_description')}
                                    multiline
                                    minRows={7}
                                    value={fields.problem_description}
                                    limit={570}
                                    onChange={event => setFields(prev => ({ ...prev, problem_description: event.target.value }))}
                                />
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY_CLIENT}
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
                                    {tSupport('send')}
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
            ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['footer', 'support'])))
        }
    }
}