import { Inter } from 'next/font/google'
import styles from '@/styles/pages/index.module.css'
import { useEffect, useState } from 'react'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import Footer from '@/components/Footer'
import Head from 'next/head'
import CarouselProducts from '@/components/carousels/CarouselProducts'
import Carousel from '@/components/carousels/Carousel'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

const categories = [
  { id: 'games', title: 'Games', url: '/search?t=games', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fgames.webp?alt=media&token=8c8ed98a-46c3-4123-8907-daf7fbfe45ff&_gl=1*cgoeh2*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzEwLjQ2LjAuMA..' },
  { id: 't-shirts', title: 'T-Shirts', url: '/search?t=t-shirts', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Ft-shirts.webp?alt=media&token=3818e9b9-4efa-4148-9041-eadb93f2f05d&_gl=1*1b2d21h*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzQyLjE0LjAuMA..' },
  { id: 'home', title: 'Home', url: '/search?t=home', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fhome.webp?alt=media&token=ff926dca-6af3-4e67-8e5e-9df841b9f244&_gl=1*giu0b1*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzIwLjM2LjAuMA..' },
  { id: 'mugs', title: 'Mugs', url: '/search?t=mugs', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fmugs.webp?alt=media&token=10310c77-061a-497c-9f56-f885942e2d96&_gl=1*erik64*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzMxLjI1LjAuMA..' },
  { id: 'christmas', title: 'Christmas', url: '/search?t=christmas', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fchristmas.webp?alt=media&token=ec33c800-a6c6-497b-92bc-10c8cc8cf54d&_gl=1*yys0pf*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNjk4LjU4LjAuMA..' },
  { id: 'valentines', title: 'Valentines', url: '/search?t=valentines', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fvalentines.webp?alt=media&token=1a8ba264-3494-42ae-9099-39fe5417231e&_gl=1*zb3jw7*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzYxLjYwLjAuMA..' },
]

export default function Home(props) {
  const {
    userCurrency,
    supportsHoverAndPointer,
    windowWidth,
  } = props

  const [allProducts, setAllProducts] = useState([])
  const [productsTShirts, setProductsTShirts] = useState([])
  const [productsHoodies, setProductsHoodies] = useState([])

  async function getProductsByTagOrType(queryName, categoryName) {
    const options = {
      method: 'GET',
      headers: {
        [queryName]: categoryName
      }
    }

    const products = await fetch("/api/products-by-queries", options)
      .then(response => response.json())
      .then(response => response.products)
      .catch(err => console.error(err))

    return products
  }

  async function getAllProducts() {
    const options = {
      method: 'GET'
    }

    const products = await fetch("/api/products", options)
      .then(response => response.json())
      .then(response => response.products)
      .catch(err => console.error(err))

    return products
  }

  useEffect(() => {
    getProductsFromCategories()
  }, [])

  async function getProductsFromCategories() {
    //tem que ser na mesma ordem que está no HTML
    setAllProducts(await getAllProducts())
    setProductsTShirts(await getProductsByTagOrType('c', 't-shirts'))
    setProductsHoodies(await getProductsByTagOrType('c', 'hoodies'))
  }

  return (
    <div className={styles.container}>
      <Head>
        <meta property="og:title" content='Main dasndjas' key='og:title' />
        <meta property="og:image:alt" content='Main dasndjas' key='og:image:alt' />
        <meta property="og:description" content="Main description bolado" key='og:description' />
        <meta property="og:image" itemProp="image" content='https://my-store-sigma-nine.vercel.app/logos/circle-black.png' key='og:image' />
        <meta property="og:type" content="website" key='og:type' />
        <meta property="og:url" content='https://my-store-sigma-nine.vercel.app' key='og:url' />
      </Head>
      <main className={styles.main}>
        <div
          className={`${styles.banner} noSelection pointer-events-none`}
        >
          <Image
            quality={100}
            priority
            src='https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fbanner.webp?alt=media&token=f76675f7-3377-4d55-8eae-10b97b4eaaed&_gl=1*4hdy1r*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MzgxMS4yMjYuMS4xNjk3MjczOTQ5LjI4LjAuMA..'
            sizes='100%'
            fill
            objectFit="cover"
            objectPosition='top'
            alt='banner'
          />
        </div>
        <div className={styles.infos}>
          {/* <div className={styles.infosItem}>
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
          </div> */}
        </div>
        <div
          className={styles.body}
        >
          <div className={styles.carouselAndTitle}>
            <h2 className={styles.carouselTitle}>
              Find categories that fit your world
            </h2>
            <div
              className={styles.carousel}
              style={{
                marginBottom: windowWidth < 420
                  ? '0.5rem'
                  : '2rem',
              }}
            >
              <Carousel
                items={
                  categories.map(cat =>
                    <Link
                      className={styles.categoryItem}
                      href={cat.url}
                      draggable={false}
                      style={{
                        width: windowWidth < 420
                          ? 130
                          : 200,
                        height: windowWidth < 420
                          ? 84.5
                          : 130,
                      }}
                    >
                      <div
                        className={styles.categoryShadow}
                      >
                      </div>
                      <span
                        className={styles.itemTitle}
                        style={{
                          fontSize: windowWidth < 420
                            ? 17
                            : 20,
                        }}
                      >
                        {cat.title}
                      </span>
                      <div
                        className={styles.categoryItemImg}
                      >
                        <Image
                          quality={100}
                          priority
                          src={cat.img}
                          sizes={`${(windowWidth < 420 ? 130 : 200) * 0.8}px`}
                          fill
                          alt={cat.title}
                        />
                      </div>
                    </Link>
                  )
                }
                itemStyle={{
                  height: windowWidth < 420
                    ? 84.5
                    : 130
                }}
                skeletonStyle={{
                  width: windowWidth < 420
                    ? 130
                    : 200,
                  height: windowWidth < 420
                    ? 84.5
                    : 130,
                }}
              />
            </div>
          </div>
          <div className={styles.carouselAndTitle}>
            <h2 className={styles.carouselTitle}>
              All Products
            </h2>
            <CarouselProducts
              products={allProducts}
              userCurrency={userCurrency}
              supportsHoverAndPointer={supportsHoverAndPointer}
              windowWidth={windowWidth}
            />
          </div>
          <div className={styles.carouselAndTitle}>
            <h2 className={styles.carouselTitle}>
              T-Shirts
            </h2>
            <CarouselProducts
              products={productsTShirts}
              userCurrency={userCurrency}
              supportsHoverAndPointer={supportsHoverAndPointer}
              windowWidth={windowWidth}
            />
          </div>
          <div className={styles.carouselAndTitle}>
            <h2 className={styles.carouselTitle}>
              Hoodies
            </h2>
            <CarouselProducts
              products={productsHoodies}
              userCurrency={userCurrency}
              supportsHoverAndPointer={supportsHoverAndPointer}
              windowWidth={windowWidth}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}