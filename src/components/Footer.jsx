import styles from '../styles/components/Footer.module.css'

export default function Footer() {

    return (
        <footer
            className={styles.container}
        >
            <div className={styles.top}>
                <div className={styles.column}>
                    <h3>
                        Support
                    </h3>
                    <div>
                        <a>
                            Check order status
                        </a>
                    </div>
                    <div>
                        <a>
                            Shipping & Returns
                        </a>
                    </div>
                    <div>
                        <a>
                            Help/FAQ
                        </a>
                    </div>
                    <div>
                        <a>Terms of use</a>
                    </div>
                    <div>
                        <a>Contact us</a>
                    </div>
                    <div>
                        <a>Copyrights</a>
                    </div>
                    <div>
                        <a>Privacy policy</a>
                    </div>
                </div>
                <div className={styles.column}>
                    <h3 className="text-start">About</h3>
                    <div>
                        <a>
                            About us
                        </a>
                    </div>
                </div>
                <div className={styles.column}>
                    <h3 className="text-start">About</h3>
                    <div>
                        <a>
                            About us
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>
                    © {process.env.NEXT_PUBLIC_STORE_NAME}. All Rights Reserved
                </p>
            </div>
        </footer>
    )
}
