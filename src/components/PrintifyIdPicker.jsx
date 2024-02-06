import { useEffect, useState } from 'react';
import MyButton from './material-ui/MyButton';
import TextInput from './material-ui/TextInput';
import styles from '@/styles/components/PrintifyIdPicker.module.css'
import Modal from './Modal';
import { showToast } from '@/utils/toasts';
import { useTranslation } from "next-i18next"
import { CircularProgress, Pagination, PaginationItem } from '@mui/material';
import { motion } from "framer-motion"
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

export default function PrintifyIdPicker(props) {

    const {
        colorText,
        onChoose,
        style,
        provider,
        blueprint_ids,
        value,
    } = props

    const tToasts = useTranslation('toasts').t

    const [modalOpen, setModalOpen] = useState(false)
    const [printifyProducts, setPrintifyProducts] = useState()
    const [imagesFliped, setImagesFliped] = useState([])
    const [modalPage, setModalPage] = useState(1)
    const [modalLastPage, setModalLastPage] = useState(1)
    const [chooseOne, setChooseOne] = useState()
    const [controller, setController] = useState()

    useEffect(() => {
        getInicialProduct()
        if (controller)
            controller.abort()
    }, [value])

    useEffect(() => {
        getPrintifyProducts()
    }, [modalPage])

    async function getInicialProduct() {
        try {
            if (value) {
                setChooseOne()
                const controller = new AbortController()

                setController(controller)

                const { signal } = controller;

                const options = {
                    method: 'GET',
                    headers: {
                        authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                        prod_printify_id: value,
                    },
                    signal: signal,
                }
                const response = await fetch("/api/printify/product", options)

                const responseJson = await response.json()

                if (response.status >= 300)
                    throw responseJson.error

                setChooseOne(responseJson.data)
            }
            else {
                setChooseOne(null)
            }
        }
        catch (error) {
            console.error(error)
            if (error.msg)
                showToast({ type: error.type, msg: tToasts(error.msg) })
        }
    }

    function getPrintifyProducts() {
        setPrintifyProducts()

        const options = {
            method: 'GET',
            headers: {
                authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
                provider_id: provider.id,
                blueprint_id: blueprint_ids[provider.id],
                page: modalPage
            },
        }
        fetch("/api/printify/products", options)
            .then(response => response.json())
            .then(response => {
                setModalLastPage(response.last_page)
                setPrintifyProducts(response.data)
            })
            .catch(err => {
                console.error(err)
                showToast({ type: 'error', msg: tToasts('default_error') })
            })
    }

    function handleOpen() {
        getPrintifyProducts()
        setModalOpen(true)
    }

    function handleClose() {
        setModalOpen(false)
    }

    function handleImageClick(prodId) {
        setImagesFliped(prev => prev.includes(prodId) ? prev.filter(prodsId => prodsId !== prodId) : prev.concat(prodId))
    }

    function handlePageChange(event, value) {
        setModalPage(value)
    }

    function handleChoose(print_prod) {
        setChooseOne(print_prod)
        onChoose(print_prod.id)
        handleClose()
    }

    function handleClearPrintifyId() {
        setChooseOne(null)
        onChoose('')
    }

    return (
        <div
            className={styles.container}
            style={style}
        >
            {chooseOne &&
                <div className={styles.imageChooseOne}>
                    <img
                        onClick={() => handleImageClick(chooseOne.id)}
                        src={chooseOne.images[0].src}
                        alt={chooseOne.title}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                    <img
                        onClick={() => handleImageClick(chooseOne.id)}
                        src={chooseOne.images[1].src}
                        alt={chooseOne.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            opacity: imagesFliped.includes(chooseOne.id) ? 1 : 0
                        }}
                    />
                </div>
            }
            {chooseOne === undefined &&
                <div
                    className={styles.imageSpinner}
                >
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            color: '#525252',
                            position: 'absolute',
                        }}
                        size={45}
                        thickness={4}
                        value={100}
                    />
                    <CircularProgress
                        disableShrink
                        size={45}
                        thickness={4}
                        sx={{
                            animationDuration: '750ms',
                        }}
                    />
                </div>
            }
            <div
                className='flex'
                style={{
                    position: 'relative',
                    flexGrow: 1,
                }}
            >
                <TextInput
                    colorText={colorText}
                    label={`${provider.title} Printify ID`}
                    value={value}
                    disabled
                    style={{
                        width: '100%'
                    }}
                />
                {value !== '' &&
                    <div
                        className={styles.clearButton}
                        onClick={handleClearPrintifyId}
                    >
                        <ClearOutlinedIcon
                            sx={{ fontSize: '20px' }}
                        />
                    </div>
                }
            </div>
            <MyButton
                style={{
                    height: 45,
                }}
                onClick={handleOpen}
            >
                Search
            </MyButton>
            <Modal
                className={styles.modalContent}
                open={modalOpen}
                closeModal={handleClose}
                closedCallBack={() => {
                    setModalPage(1)
                    setModalLastPage(1)
                    setImagesFliped([])
                    setPrintifyProducts()
                }}
            >
                {printifyProducts &&
                    <div className={styles.printProducts}>
                        {printifyProducts.map((print_prod, i) =>
                            <div
                                className={styles.printProduct}
                                key={i}
                            >
                                <div className={styles.imageContainer}>
                                    <img
                                        onClick={() => handleImageClick(print_prod.id)}
                                        src={print_prod.images[0].src}
                                        alt={print_prod.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                    <img
                                        onClick={() => handleImageClick(print_prod.id)}
                                        src={print_prod.images[1].src}
                                        alt={print_prod.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            opacity: imagesFliped.includes(print_prod.id) ? 1 : 0
                                        }}
                                    />
                                </div>
                                <div className={styles.productBody}>
                                    <span className='ellipsis'>
                                        {print_prod.title}
                                    </span>
                                    <MyButton
                                        style={{
                                            paddingLeft: '2rem',
                                            paddingRight: '2rem',
                                        }}
                                        onClick={() => handleChoose(print_prod)}
                                    >
                                        Select
                                    </MyButton>
                                </div>
                            </div>
                        )}
                        {printifyProducts &&
                            <div className={styles.modalBottom}>
                                <Pagination
                                    onChange={handlePageChange}
                                    size='small'
                                    count={modalLastPage}
                                    color="primary"
                                    page={Number(modalPage)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    renderItem={item => (
                                        <PaginationItem
                                            {...item}
                                        />
                                    )}
                                />
                            </div>
                        }
                    </div>
                }
                {!printifyProducts &&
                    <motion.div
                        className={styles.loadingSpinner}
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
                        transition={{
                            duration: 0.3,
                        }}
                    >
                        <CircularProgress
                            variant="determinate"
                            sx={{
                                color: '#525252',
                                position: 'absolute',
                            }}
                            size={120}
                            thickness={4}
                            value={100}
                        />
                        <CircularProgress
                            disableShrink
                            size={120}
                            thickness={4}
                            sx={{
                                animationDuration: '750ms',
                            }}
                        />
                    </motion.div>
                }
            </Modal>
        </div>
    )
}