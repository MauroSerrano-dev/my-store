import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Carousel from '@/components/Carousel'
import { useEffect, useState } from 'react'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

const categories = [
  { id: 'games', name: 'Games', url: '/search?t=games', img: 'https://media.istockphoto.com/id/1320799591/pt/vetorial/game-on-neon-game-controller-or-joystick-for-game-console-on-blue-background.jpg?s=612x612&w=0&k=20&c=B6TK6N2MRoM434nt5SXX-bVLfYVw9odAeVLBAtI3Muc=' },
  { id: 'clothes', name: 'T-Shirts', url: '/search?t=clothes', img: 'https://99designs-blog.imgix.net/blog/wp-content/uploads/2016/12/Featured.jpg?auto=format&q=60&w=1200&h=675&fit=crop&crop=faces' },
  { id: 'home', name: 'Home', url: '/search?t=home', img: 'https://cdnm.westwing.com.br/glossary/uploads/br/2015/08/17191529/edredom-geek-para-quarto-pinterest-c-a7035.jpg' },
  { id: 'mugs', name: 'Mugs', url: '/search?t=mugs', img: 'https://www.tasteofhome.com/wp-content/uploads/2023/04/11-Funny-Coffee-Mugs-for-a-Laugh-Each-Morning1_social_via-amazon.com_.jpg' },
  { id: 'christmas', name: 'Christmas', url: '/search?t=christmas', img: 'https://cf.ltkcdn.net/christmas/images/orig/274931-2131x1407-christmas-ornament.jpg' },
  { id: 'valentines', name: 'Valentines', url: '/search?t=valentines', img: 'https://www.kirsonfuller.com/wp-content/uploads/2022/02/thequint_2022-02_6edd07c4-aeb0-4241-95dc-b53bd2524634_Happy_Valentines_Day_Wishes_Quotes_Messages_love_HD_Wallpaper_915x515.jpg' },
]

export default function Home() {

  const [productsHome, setProductsHome] = useState([])
  const [productsTShirts, setProductsTShirts] = useState([])
  const [allProducts, setAllProducts] = useState([])

  async function getProductsByCategory(categoryName) {
    const options = {
      method: 'GET',
      headers: {
        c: categoryName
      }
    }

    const products = await fetch("/api/products-by-queries", options)
      .then(response => response.json())
      .then(response => response.products)
      .catch(err => console.error(err))

    return products
  }

  async function getAllProducts() {
    let products
    const options = {
      method: 'GET'
    }

    await fetch("/api/products", options)
      .then(response => response.json())
      .then(response => {
        products = response.products
      })
      .catch(err => console.error(err))

    return products
  }

  useEffect(() => {
    getProductsFromCategories()
    getAllProducts()
  }, [])

  async function getProductsFromCategories() {
    setProductsHome(await getProductsByCategory('home'))
    setProductsTShirts(await getProductsByCategory('t-shirts'))
    setAllProducts(await getAllProducts())
  }

  return (
    <div className={styles.container}>
      <header>
      </header>
      <main className={styles.main}>
        <div className={styles.banner}>
          <img
            src='/banner-mock.webp'
            alt='banner'
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
        <div className={styles.carouselAndTitle}>
          <h2 className={styles.carouselTitle}>
            Categories
          </h2>
          <div
            className={styles.carousel}
            style={{
              marginBottom: '2rem',
            }}
          >
            <Carousel
              items={categories}
              height='150px'
              width='90%'
              animationDuration={200}
              itemWidth={205}
              type='imgs'
            />
          </div>
        </div>
        <div className={styles.carouselAndTitle}>
          <h2 className={styles.carouselTitle}>
            All Products
          </h2>
          <div className={styles.carousel}>
            <Carousel
              items={allProducts}
              height='400px'
              width='90%'
              animationDuration={200}
              itemWidth={225}
              type='products'
            />
          </div>
        </div>
        <div className={styles.carouselAndTitle}>
          <h2 className={styles.carouselTitle}>
            T-Shirts
          </h2>
          <div className={styles.carousel}>
            <Carousel
              items={productsTShirts}
              height='400px'
              width='90%'
              animationDuration={200}
              itemWidth={225}
              type='products'
            />
          </div>
        </div>
        <div className={styles.carouselAndTitle}>
          <h2 className={styles.carouselTitle}>
            Home
          </h2>
          <div className={styles.carousel}>
            <Carousel
              items={productsHome}
              height='400px'
              width='90%'
              animationDuration={200}
              itemWidth={225}
              type='products'
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
