import styles from '@/styles/pages/index.module.css'
import { useEffect, useState } from 'react'
import Footer from '@/components/Footer'
import Head from 'next/head'
import CarouselProducts from '@/components/carousels/CarouselProducts'
import Carousel from '@/components/carousels/Carousel'
import Link from 'next/link'
import Image from 'next/image'
import { CART_LOCAL_STORAGE, COMMON_TRANSLATES, DEFAULT_PRODUCTS_TAGS, INICIAL_VISITANT_CART, LIMITS, USER_CUSTOMIZE_HOME_PAGE } from '@/consts'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppContext } from '@/components/contexts/AppContext'
import BannerSlider from '@/components/sliders/BannerSlider'
import { getProductsByQueries } from '../../frontend/product'
import { showToast } from '@/utils/toasts'

const categories = [
  { id: 'music', url: '/search?h=music', img: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fcategories%2Fmusic.webp?alt=media&token=f7ea9fa6-a6d8-455d-96d5-16667780e145' },
  { id: 'games', url: '/search?h=games', img: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fcategories%2Fgames.webp?alt=media&token=ad5cef32-4725-4bdd-aae4-a8302a5bf6a6' },
  { id: 'halloween', url: '/search?h=halloween', img: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fcategories%2Fhalloween.webp?alt=media&token=4db30abb-2f19-4549-8748-9ac424d29f83' },
  { id: 'japan', url: '/search?h=japan', img: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fcategories%2Fjapan.webp?alt=media&token=a93962e7-71ce-4cd5-a12c-901d8117d2a9' },
  { id: 'space', url: '/search?h=space', img: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fcategories%2Fspace.webp?alt=media&token=446a9544-fd58-4186-9374-4c1528ff1263' },
  { id: 'animals', url: '/search?h=animals', img: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fcategories%2Fanimals.webp?alt=media&token=68f66a75-9e3c-4290-995f-72d3a41b9854' },
  { id: 'rpg', url: '/search?h=rpg', img: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fcategories%2Frpg.webp?alt=media&token=70a43a1f-d1c9-4d3b-b66d-c96c5e2d25f4' },
  { id: 't-shirts', url: '/search?v=t-shirts', img: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fcategories%2Ft-shirts.webp?alt=media&token=e91d2c95-a996-436c-817d-f078e25d814c' },
]

export default function Home() {
  const {
    session,
    windowWidth,
    router,
    setCart,
  } = useAppContext()

  const tIndex = useTranslation('index').t
  const tErrors = useTranslation('errors').t
  const tCategories = useTranslation('categories').t
  const tToasts = useTranslation('toasts').t
  const { i18n } = useTranslation()

  const [categoriesCarouselLoad, setCategoriesCarouselLoad] = useState(false)

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

  useEffect(() => {
    getProductsFromCategories()
  }, [session])

  useEffect(() => {
    if (router.query['refresh-cart'] === '') {
      setCart(INICIAL_VISITANT_CART)
      localStorage.setItem(CART_LOCAL_STORAGE, JSON.stringify(INICIAL_VISITANT_CART))
      router.push('/')
    }
  }, [router])

  async function getProductsFromCategories() {
    if (session !== undefined && !productsOne) {
      (session && session.custom_home_page.active ? session.custom_home_page.tags : DEFAULT_PRODUCTS_TAGS).forEach(async (tag, i) => {
        setStates[i].set(await getProductsByTagOrType(USER_CUSTOMIZE_HOME_PAGE.find(ele => ele.id === tag)))
      })
    }
  }

  async function getProductsByTagOrType(tag) {
    try {
      const { query, id } = tag
      const response = await getProductsByQueries({
        [query]: id,
        prods_limit: LIMITS.max_products_in_carousel,
        user_language: i18n.language
      })

      return response.products
    }
    catch (error) {
      console.error(error)
      if (error.msg)
        showToast({ type: error.type, msg: tToasts(error.msg) })
    }
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
        <BannerSlider
          images={[
            {
              src: 'https://firebasestorage.googleapis.com/v0/b/mrf-styles.appspot.com/o/app%2Fbanners%2Fsound-vibes_bg.webp?alt=media&token=eda820f0-f5b4-4a30-8d72-a0ed130c3882',
              href: '/search?c=sound-vibes',
              alt: 'Sound Vibes Collection Banner'
            },
          ]}
        />
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
                transition: `margin-bottom ease-in-out ${session === undefined ? 0 : 200}ms`
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
                        transition: `width ease-in-out ${categoriesCarouselLoad ? 200 : 0}ms, width ease-in-out ${categoriesCarouselLoad ? 200 : 0}ms, scale 100ms ease-out`,
                      }}
                      onLoad={() => setCategoriesCarouselLoad(true)}
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
                          transition: `font-size ease-in-out ${session === undefined ? 0 : 200}ms`
                        }}
                      >
                        {tCategories(cat.id)}
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
                          alt={tCategories(cat.id)}
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
                  transition: `height ease-in-out ${session === undefined ? 0 : 200}ms`,
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
                }}
              />
            </div>
          </div>
          {setStates.map((state, i) =>
            (session && session.custom_home_page.active ? session.custom_home_page.tags : DEFAULT_PRODUCTS_TAGS)[i] &&
            <div
              className={styles.carouselAndTitle}
              key={i}
            >
              <h2 className={styles.carouselTitle}>
                {session === undefined
                  ? ''
                  : tCategories(USER_CUSTOMIZE_HOME_PAGE.find(ele => ele.id === (session && session.custom_home_page.active ? session.custom_home_page.tags : DEFAULT_PRODUCTS_TAGS)[i])?.id)
                }
              </h2>
              <CarouselProducts
                products={state.value}
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
      ...(await serverSideTranslations(locale, COMMON_TRANSLATES.concat(['footer', 'index', 'products', 'errors'])))
    }
  }
}