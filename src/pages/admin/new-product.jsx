import styles from '@/styles/admin/new-product.module.css'
import { Button } from '@mui/material'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import { withRouter } from 'next/router'
import Link from 'next/link'
import { TYPES_POOL } from '../../../consts'

export default withRouter(props => {

    return (
        <div className={styles.container}>
            <header>
            </header>
            <main className={styles.main}>
                <div className={styles.top}>
                    <div className={styles.productOption}>
                        <Link
                            legacyBehavior
                            href='/admin'
                        >
                            <a
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
                                        Voltar
                                    </p>
                                </Button>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className={styles.menuContainer}>
                    <h3>Create New Product</h3>
                    {TYPES_POOL.map((type, i) =>
                        <Link
                            legacyBehavior
                            href={`/admin/new-product/${type.id}`}
                            key={i}
                        >
                            <a
                                className='noUnderline fillWidth'
                            >
                                <Button
                                    variant='outlined'
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%'
                                    }}
                                >
                                    {type.title}
                                </Button>
                            </a>
                        </Link>
                    )}
                </div>
            </main>
        </div>
    )
})