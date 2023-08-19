import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

async function createSession() {
  console.log('oi')
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'userId',
      cartItems: [
        {
          name: 'name',
          image: 'https://images-api.printify.com/mockup/64df65c1a996f39335017a6c/12070/92662/unisex-heavy-cotton-tee.jpg?camera_label=lifestyle',
          desc: 'desc',
          id: 'id',
          price: 4,
          cartQuantity: 2,
        }
      ]
    })
  }

  await fetch('/api/hello', options)
    .then(response => response.json())
    .then(response => {
      console.log(response.url)
      window.location.href = response.url
    })
    .catch(err => console.error(err))
}

export default function Home() {
  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <div
          className={styles.center}
          onClick={createSession}
        >
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>
        <div className={styles.grid}>
        </div>
      </main>
    </>
  )
}
