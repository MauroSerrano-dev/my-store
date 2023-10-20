import styles from '@/styles/admin/new-product/index.module.css'
import { Button } from '@mui/material'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { withRouter } from 'next/router'
import Link from 'next/link'
import { PRODUCT_TYPES } from '../../../../consts'
import NoFound404 from '@/pages/404';

export default withRouter(props => {

    const {
        session
    } = props

    return (
        session === undefined
            ? <div></div>
            : session === null || session.email !== 'mauro.serrano.dev@gmail.com'
                ? <NoFound404 />
                : <div className={styles.container}>
                    <header>
                    </header>
                    <main className={styles.main}>
                        <div className={styles.top}>
                            <Link
                                href='/admin'
                                className='noUnderline'
                            >
                                <Button
                                    variant='outlined'
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <KeyboardArrowLeftRoundedIcon
                                        style={{
                                            marginLeft: '-0.5rem'
                                        }}
                                    />
                                    <p
                                        style={{
                                            color: 'var(--primary)'
                                        }}
                                    >
                                        Back
                                    </p>
                                </Button>
                            </Link>
                        </div>
                        <div className={styles.menuContainer}>
                            <h3>Create New Product</h3>
                            {PRODUCT_TYPES.map((type, i) =>
                                <Link
                                    href={`/admin/new-product/${type.id}`}
                                    key={i}
                                    className='noUnderline fillWidth'
                                >
                                    <Button
                                        variant='outlined'
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        {type.title}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </main>
                </div>
    )
})