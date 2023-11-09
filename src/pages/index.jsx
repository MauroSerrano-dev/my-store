import styles from '@/styles/pages/index.module.css'
import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import Head from 'next/head'
import CarouselProducts from '@/components/carousels/CarouselProducts'
import Carousel from '@/components/carousels/Carousel'
import Link from 'next/link'
import Image from 'next/image'
import { DEFAULT_PRODUCTS_TAGS, USER_CUSTOMIZE_HOME_PAGE } from '../../consts'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const categories = [
  { id: 'games', title: 'Games', url: '/search?h=games', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fgames.webp?alt=media&token=c28521d0-8fd8-45b7-9c80-60feffab7f60&_gl=1*fshtki*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzM2NTMyMy4yMzYuMS4xNjk3MzY1Mzk3LjUxLjAuMA..' },
  { id: 't-shirts', title: 'T-Shirts', url: '/search?v=t-shirts', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Ft-shirts.webp?alt=media&token=3818e9b9-4efa-4148-9041-eadb93f2f05d&_gl=1*1b2d21h*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzQyLjE0LjAuMA..' },
  { id: 'music', title: 'Music', url: '/search?h=music', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fmusic.webp?alt=media&token=e6a0a6cd-3f03-4db5-88c8-6924ba4c1f5f&_gl=1*4fn6cj*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzM1MjU4Mi4yMzQuMS4xNjk3MzUzNzI0LjUzLjAuMA..' },
  { id: 'home', title: 'Home', url: '/search?t=home', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fhome.webp?alt=media&token=ff926dca-6af3-4e67-8e5e-9df841b9f244&_gl=1*giu0b1*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzIwLjM2LjAuMA..' },
  { id: 'mugs', title: 'Mugs', url: '/search?v=mugs', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fmugs.webp?alt=media&token=10310c77-061a-497c-9f56-f885942e2d96&_gl=1*erik64*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzMxLjI1LjAuMA..' },
  { id: 'christmas', title: 'Christmas', url: '/search?t=christmas', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fchristmas.webp?alt=media&token=ec33c800-a6c6-497b-92bc-10c8cc8cf54d&_gl=1*yys0pf*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNjk4LjU4LjAuMA..' },
  { id: 'valentines', title: 'Valentines', url: '/search?t=valentines', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fvalentines.webp?alt=media&token=1a8ba264-3494-42ae-9099-39fe5417231e&_gl=1*zb3jw7*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzI3MDYxMy4yMjUuMS4xNjk3MjcwNzYxLjYwLjAuMA..' },
]

export default function Home(props) {
  const {
    userCurrency,
    supportsHoverAndPointer,
    windowWidth,
    session,
  } = props

  const tCommon = useTranslation('common').t
  const tIndex = useTranslation('index').t
  const tErrors = useTranslation('errors').t

  const [productsOne, setProductsOne] = useState()
  const [productsTwo, setProductsTwo] = useState()
  const [productsThree, setProductsThree] = useState()
  const [productsFour, setProductsFour] = useState()
  const [productsFive, setProductsFive] = useState()
  const [productsSix, setProductsSix] = useState()
  const [productsSeven, setProductsSeven] = useState()
  const [productsEight, setProductsEight] = useState()
  const setStates = [
    { value: productsOne, set: setProductsOne },
    { value: productsTwo, set: setProductsTwo },
    { value: productsThree, set: setProductsThree },
    { value: productsFour, set: setProductsFour },
    { value: productsFive, set: setProductsFive },
    { value: productsSix, set: setProductsSix },
    { value: productsSeven, set: setProductsSeven },
    { value: productsEight, set: setProductsEight },
  ]

  async function getProductsByTagOrType(tag) {
    const { query, id } = tag
    const options = {
      method: 'GET',
      headers: {
        authorization: process.env.NEXT_PUBLIC_APP_TOKEN,
        [query]: id
      }
    }

    const products = await fetch("/api/products-by-queries", options)
      .then(response => response.json())
      .then(response => response.products)
      .catch(err => console.error(err))

    return products
  }

  useEffect(() => {
    if (session !== undefined)
      getProductsFromCategories()
  }, [session])

  async function getProductsFromCategories() {
    //tem que ser na mesma ordem que está no HTML
    (session?.home_page_tags || DEFAULT_PRODUCTS_TAGS).forEach(async (tag, i) => {
      setStates[i].set(await getProductsByTagOrType(USER_CUSTOMIZE_HOME_PAGE.find(ele => ele.id === tag)))
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <meta property="og:title" content='Main' key='og:title' />
        <meta property="og:image:alt" content='Main' key='og:image:alt' />
        <meta property="og:description" content="Main description" key='og:description' />
        <meta property="og:type" content="website" key='og:type' />
        <meta property="og:url" content='https://mrfstyles.com' key='og:url' />
      </Head>
      <main className={styles.main}>
        <Link
          className={`${styles.banner} noUnderline`}
          draggable={false}
          href='/search?c=sound-vibes'
        >
          <Image
            priority
            quality={100}
            src='https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/banners%2Fsound-vibes_bg.webp?alt=media&token=27f3d428-7542-4c9e-9960-6c300a4bc68a&_gl=1*1lhdp2p*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzQ1MTEzNC4yNDMuMS4xNjk3NDUxMTYyLjMyLjAuMA..'
            sizes='100%'
            fill
            alt='banner'
            draggable={false}
            style={{
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
          <Image
            priority
            quality={100}
            src='https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/banners%2Fsound-vibes_black.webp?alt=media&token=756a7de4-0b31-441d-b021-753b6dd83e10&_gl=1*z943a0*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzQ1MTEzNC4yNDMuMS4xNjk3NDU0NTgwLjQzLjAuMA..'
            sizes='100%'
            fill
            alt='people'
            draggable={false}
            style={{
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
          <Image
            priority
            quality={100}
            src='https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/banners%2Fsound-vibes_color.webp?alt=media&token=de2c1a9f-fef1-4214-8539-593e69ac5bdc&_gl=1*1fizmog*_ga*NjQyNzA2OTM1LjE2OTE2NjI4OTU.*_ga_CW55HF8NVT*MTY5NzY0Njk3NC4yNTkuMS4xNjk3NjQ3NjU2LjUyLjAuMA..'
            sizes='100%'
            fill
            draggable={false}
            alt='t-shirts_colors'
            className={styles.bannerColors}
          />
        </Link>
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
          </div> */
          }
        </div>
        <div
          className={styles.body}
        >
          <div className={styles.carouselAndTitle}>
            <h2 className={styles.categoriesTitle}>
              {tIndex('categories_title', { count: windowWidth > 500 ? 1 : 2 })}
            </h2>
            <div
              className={styles.carousel}
              style={{
                marginBottom: windowWidth > 750
                  ? '2rem'
                  : '0.5rem',
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
                        width: windowWidth > 750
                          ? 200
                          : windowWidth > 420
                            ? 150
                            : 130,
                        height: windowWidth > 750
                          ? 130
                          : windowWidth > 420
                            ? 97.5
                            : 84.5,
                        transition: 'all ease-in-out 200ms',
                      }}
                    >
                      <div
                        className={styles.categoryShadow}
                      >
                      </div>
                      <span
                        className={styles.itemTitle}
                        style={{
                          fontSize: windowWidth > 420
                            ? 20
                            : 17,
                          transition: 'font-size ease-in-out 200ms'
                        }}
                      >
                        {tCommon(cat.title)}
                      </span>
                      <div
                        className={styles.categoryItemImg}
                      >
                        <Image
                          priority
                          quality={100}
                          src={cat.img}
                          sizes={`${(windowWidth > 420 ? 200 : 130) * 0.8}px`}
                          fill
                          alt={cat.title}
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </Link>
                  )
                }
                itemStyle={{
                  height: windowWidth > 750
                    ? 130
                    : windowWidth > 420
                      ? 97.5
                      : 84.5,
                  transition: 'all ease-in-out 200ms',
                }}
                skeletonStyle={{
                  width: windowWidth > 750
                    ? 200
                    : windowWidth > 420
                      ? 150
                      : 130,
                  height: windowWidth > 750
                    ? 130
                    : windowWidth > 420
                      ? 97.5
                      : 84.5,
                  transition: 'all ease-in-out 200ms',
                }}
              />
            </div>
          </div>
          {setStates.map((state, i) =>
            (session?.home_page_tags || DEFAULT_PRODUCTS_TAGS)[i] &&
            <div
              className={styles.carouselAndTitle}
              key={i}
            >
              <h2 className={styles.carouselTitle}>
                {session === undefined
                  ? ''
                  : tCommon(USER_CUSTOMIZE_HOME_PAGE.find(ele => ele.id === (session?.home_page_tags || DEFAULT_PRODUCTS_TAGS)[i])?.title)
                }
              </h2>
              <CarouselProducts
                products={state.value}
                userCurrency={userCurrency}
                supportsHoverAndPointer={supportsHoverAndPointer}
                windowWidth={windowWidth}
                noProductFoundLabel={tErrors('no_products_found')}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'navbar', 'menu', 'footer', 'index', 'products', 'errors']))
    }
  }
}