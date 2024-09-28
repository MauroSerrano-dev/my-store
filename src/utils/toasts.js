import { toast } from 'react-toastify'

/**
 * Function to display toasts.
 *
 * @param {Object} props - Function props.
 * @param {'info' | 'success' | 'error'} props.type - Toast type. `Default: 'info'`
 * @param {string} props.msg - Toast message. `Default: 'This is a Toast!'`
 * @param {number} props.time - Toast duration. `Default: 3000`
 * @param {string} props.theme - Toast theme. `Default: 'light'`
 * @param {boolean} props.pauseOnHover - Pause the timer when the mouse hovers over the toast. `Default: true`
 * @param {boolean} props.closeOnClick - Remove the toast when clicked. `Default: true`
 * @param {boolean} props.hideProgressBar - Hide progress bar. `Default: false`
 * @param {boolean} props.draggable - Allow toast to be draggable. `Default: true`
 * @param {number} props.progress - Set the percentage for the controlled progress bar. `Default: undefined`
 * @param {'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'} props.position - Set the position of the toast. `Default: 'top-center'`
 */

export function showToast(props = {}) {
    const {
        type = 'warning',
        msg = 'This is a toast!',
        time = 3000,
        theme = 'light',
        pauseOnHover = true,
        closeOnClick = true,
        hideProgressBar = false,
        draggable = true,
        progress,
        position = 'top-center'
    } = props

    if (type === 'warning') {
        toast.warning(msg, {
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
    else if (type === 'info') {
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
    else if (type === 'success') {
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
    else if (type === 'error') {
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
    else {
        console.error('Invalid toast type')
    }
}