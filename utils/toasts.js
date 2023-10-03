import { toast } from 'react-toastify'

export function showInfoToast(props) {
    const {
        msg = '',
        time = 3000,
        theme = 'light',
        pauseOnHover = true,
        closeOnClick = true,
        hideProgressBar = false,
        draggable = true,
        progress,
        position = 'top-center'
    } = props

    toast.info(msg, {
        position: position,
        autoClose: time,
        hideProgressBar: hideProgressBar,
        closeOnClick: closeOnClick,
        pauseOnHover: pauseOnHover,
        draggable: draggable,
        progress: progress,
        theme: theme,
    })
}

export function showErrorToast(props) {
    const {
        msg = '',
        time = 3000,
        theme = 'light',
        pauseOnHover = true,
        closeOnClick = true,
        hideProgressBar = false,
        draggable = true,
        progress,
        position = 'top-center'
    } = props

    toast.error(msg, {
        position: position,
        autoClose: time,
        hideProgressBar: hideProgressBar,
        closeOnClick: closeOnClick,
        pauseOnHover: pauseOnHover,
        draggable: draggable,
        progress: progress,
        theme: theme,
    })
}

export function showSuccessToast(props) {
    const {
        msg = '',
        time = 3000,
        theme = 'light',
        pauseOnHover = true,
        closeOnClick = true,
        hideProgressBar = false,
        draggable = true,
        progress,
        position = 'top-center'
    } = props

    toast.success(msg, {
        position: position,
        autoClose: time,
        hideProgressBar: hideProgressBar,
        closeOnClick: closeOnClick,
        pauseOnHover: pauseOnHover,
        draggable: draggable,
        progress: progress,
        theme: theme,
    })
}