import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Carousel from '@/components/Carousel'
import { useState } from 'react'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const inter = Inter({ subsets: ['latin'] })

async function createSession() {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'userId',
      cartItems: [
        {
          name: 'name',
          image: 'https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/12/Featured.jpg?auto=format&q=60&w=1200&h=675&fit=crop&crop=faces',
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
      window.location.href = response.url
    })
    .catch(err => console.error(err))
}

const categories = [
  { id: 'gamer', name: 'Gamer', img: 'https://media.istockphoto.com/id/1320799591/pt/vetorial/game-on-neon-game-controller-or-joystick-for-game-console-on-blue-background.jpg?s=612x612&w=0&k=20&c=B6TK6N2MRoM434nt5SXX-bVLfYVw9odAeVLBAtI3Muc=' },
  { id: 'clothes', name: 'T-Shirts', img: 'https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/12/Featured.jpg?auto=format&q=60&w=1200&h=675&fit=crop&crop=faces' },
  { id: 'home', name: 'Home', img: 'https://cdnm.westwing.com.br/glossary/uploads/br/2015/08/17191529/edredom-geek-para-quarto-pinterest-c-a7035.jpg' },
  { id: 'mugs', name: 'Mugs', img: 'https://www.tasteofhome.com/wp-content/uploads/2023/04/11-Funny-Coffee-Mugs-for-a-Laugh-Each-Morning1_social_via-amazon.com_.jpg' },
  { id: 'christmas', name: 'Christmas', img: 'https://cf.ltkcdn.net/christmas/images/orig/274931-2131x1407-christmas-ornament.jpg' },
  { id: 'valentines', name: 'Valentines', img: 'https://www.kirsonfuller.com/wp-content/uploads/2022/02/thequint_2022-02_6edd07c4-aeb0-4241-95dc-b53bd2524634_Happy_Valentines_Day_Wishes_Quotes_Messages_love_HD_Wallpaper_915x515.jpg' },
]

export default function Home() {


  return (
    <div className={styles.container}>
      <header>
      </header>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.categoriesContainer}>
          <p>T-SHIRTS</p>
          <p>HOODIES</p>
          <p>MUGS</p>
          <p>BAGS</p>
          <p>ACCESSORIES</p>
          <p>KITCHEN</p>
          <p>PILLOWS</p>
          <p>SHOES</p>
          <p>SOCKS</p>
        </div>
        <div className={styles.banner}>
          <img
            src='/banner-mock.webp'
          />
        </div>
        <div className={styles.infos}>
          <div className={styles.infosItem}>
            <LocalShippingOutlinedIcon
              sx={{
                scale: '1.3'
              }}
            />
            <p>Fast Shipping</p>
          </div>
          <div className={styles.infosItem}>
            <Inventory2OutlinedIcon
              sx={{
                scale: '1.3'
              }}
            />
            <p>Free Shipping</p>
          </div>
        </div>
        <div className={styles.carousel}>
          <Carousel
            items={categories}
            height='150px'
            width='90%'
            animationDuration={200}
            itemWidth={205}
            type='imgs'
          />
        </div>
        <div className={styles.carousel}>
          <Carousel
            items={categories}
            height='400px'
            width='90%'
            animationDuration={200}
            itemWidth={225}
            type='products'
          />
        </div>
      </main>
      <footer>
      </footer>
    </div >
  )
}
