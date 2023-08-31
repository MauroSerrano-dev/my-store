import { useSession, signIn, signOut } from "next-auth/react"
import NavBar from './NavBar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState } from "react"

export default function DataHandler(props) {
    const { Component, pageProps, primaryColor } = props
    const { data: session } = useSession()
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    const [showNavBar, setShowNavBar] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Inicialize os valores iniciais ao carregar a página
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <div
            style={{
                width: `${windowWidth}px`,
                height: `${windowHeight}px`,
            }}
        >
            {showNavBar &&
                <NavBar session={session} signIn={signIn} signOut={signOut} />
            }
            <div id={styles.componentContainer}>
                <Component{...pageProps} setShowNavBar={setShowNavBar} session={session} signIn={signIn} />
            </div>
        </div >
    )
}