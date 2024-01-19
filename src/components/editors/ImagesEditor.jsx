import styles from '@/styles/components/editors/ImagesEditor.module.css'
import { ButtonGroup, Checkbox, CircularProgress } from "@mui/material"
import MyButton from "../material-ui/MyButton"
import TextInput from "../material-ui/TextInput"
import Modal from '../Modal'
import { useState } from 'react'
import { motion } from "framer-motion"
import { storage } from '../../../firebaseInit'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import Image from 'next/image'
import ButtonIcon from '../material-ui/ButtonIcon'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'

export default function ImagesEditor(props) {
    const {
        product_id,
        images,
        setImages,
        product,
        colorIndex,
        viewStatus,
        setViewStatus,
        updateProductField,
        havePositionsVariants,
    } = props

    const [options, setOptions] = useState()
    const [modalOpen, setModalOpen] = useState()
    const [path, setPath] = useState()

    const imagesList = havePositionsVariants ? images[product.colors_ids[colorIndex]][viewStatus] : images[product.colors_ids[colorIndex]]

    function handleDeleteImageField(index) {
        const colorId = product.colors_ids[colorIndex]
        setImages(prev => ({
            ...prev,
            [colorId]: havePositionsVariants
                ? { ...prev[colorId], [viewStatus]: prev[colorId][viewStatus].filter((img, i) => index !== i) }
                : prev[colorId].filter((img, i) => index !== i)
        }))
    }

    function handleAddNewImage(src) {
        const colorId = product.colors_ids[colorIndex]
        setImages(prev => ({
            ...prev,
            [colorId]: havePositionsVariants
                ? { ...prev[colorId], [viewStatus]: prev[colorId][viewStatus].concat({ src: src, color_id: colorId, }) }
                : prev[colorId].concat({ src: src, color_id: colorId, })
        }))
    }

    async function handleOpenModal() {
        handleChangePath(`/${product.type_id}/${product_id.slice(0, -product.type_id.length - 1)}`)
        setModalOpen(true)
    }

    async function handleChangePath(newPath) {
        const myRef = ref(storage, newPath)
        const response = await listAll(myRef)
        const urlsPromises = response.items.map(item => getDownloadURL(item))
        const urls = await Promise.all(urlsPromises);

        setOptions([
            ...response.prefixes.map(dir => ({ type: 'directory', title: dir.name, path: dir.fullPath })),
            ...urls.map((url, i) => ({ type: 'file', title: response.items[i].name, src: url }))
        ])
        setPath(newPath)
    }

    return (
        <div
            className={styles.container}
        >
            <MyButton
                onClick={handleOpenModal}
                style={{
                    width: '100%'
                }}
            >
                Search Images
            </MyButton>
            <h3>Images</h3>
            {havePositionsVariants &&
                <ButtonGroup
                    sx={{
                        width: '100%'
                    }}
                >
                    <MyButton
                        variant={viewStatus === 'front' ? 'contained' : 'outlined'}
                        onClick={() => setViewStatus('front')}
                        style={{
                            width: '50%'
                        }}
                    >
                        Front
                    </MyButton>
                    <MyButton
                        variant={viewStatus === 'back' ? 'contained' : 'outlined'}
                        onClick={() => setViewStatus('back')}
                        style={{
                            width: '50%'
                        }}
                    >
                        Back
                    </MyButton>
                </ButtonGroup>
            }
            {imagesList.length > 0 &&
                <div className={styles.showcaseHover}>
                    <span>showcase</span>
                    <span>hover</span>
                </div>
            }
            <div className='flex column' style={{ gap: '0.8rem' }} >
                {imagesList.map((img, i) =>
                    <div
                        className='flex row align-center fillWidth space-between'
                        key={i}
                    >
                        <TextInput
                            disabled
                            label={`Image ${i + 1}`}
                            style={{
                                width: '70%'
                            }}
                            value={img.src}
                        />
                        <Checkbox
                            checked={i === product.image_showcase_index}
                            onChange={event => updateProductField('image_showcase_index', event.target.checked ? i : -1)}
                            sx={{
                                color: '#ffffff'
                            }}
                        />
                        <Checkbox
                            checked={i === product.image_hover_index}
                            onChange={event => updateProductField('image_hover_index', event.target.checked ? i : -1)}
                            sx={{
                                color: '#ffffff'
                            }}
                        />
                        <ButtonIcon
                            icon={<ClearRoundedIcon />}
                            onClick={() => handleDeleteImageField(i)}
                        />
                    </div>
                )}
            </div>
            <Modal
                className={styles.modalContent}
                open={modalOpen}
                closeModal={() => setModalOpen(false)}
                closedCallBack={() => {
                    setOptions()
                    setPath(`/${product.type_id}`)
                }}
            >
                {path !== `/${product.type_id}` &&
                    <div
                        className='flex start'
                        style={{
                            paddingBottom: '1rem',
                            paddingLeft: '2rem',
                        }}
                    >
                        <MyButton
                            variant='outlined'
                            onClick={() => {
                                handleChangePath(`/${product.type_id}`)
                            }}
                        >
                            {`/${product.type_id}`}
                        </MyButton>
                    </div>
                }
                {options &&
                    <div className={styles.printProducts}>
                        {options.map((option, i) =>
                            <div
                                className={styles.printProduct}
                                key={i}
                                onClick={() => {
                                    option.type === 'directory'
                                        ? handleChangePath(option.path)
                                        : imagesList.findIndex(img => img.src === option.src) >= 0
                                            ? handleDeleteImageField(imagesList.findIndex(img => img.src === option.src))
                                            : handleAddNewImage(option.src)
                                }}
                            >
                                <div className={styles.imageContainer}>
                                    <Image
                                        priority
                                        quality={100}
                                        onClick={() => handleImageClick(option.id)}
                                        src={option.type === 'directory' ? '/svgs/folder.svg' : option.src}
                                        alt={option.title}
                                        fill
                                        sizes='220px'
                                        style={{
                                            pointerEvents: 'none',
                                            objectFit: 'cover',
                                            borderRadius: '0.3rem',
                                        }}
                                    />
                                    {option.type === 'directory' &&
                                        <span
                                            className={styles.directoryTitle}
                                        >
                                            {option.title}
                                        </span>
                                    }
                                    {imagesList.findIndex(img => img.src === option.src) >= 0 &&
                                        <div
                                            className={styles.imageIndex}
                                        >
                                            {1 + imagesList.findIndex(img => img.src === option.src)}
                                        </div>
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                }
                {!options &&
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