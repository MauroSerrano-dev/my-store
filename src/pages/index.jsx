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
  { id: 'games', url: '/search?h=games', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fgames.webp?alt=media&token=c28521d0-8fd8-45b7-9c80-60feffab7f60' },
  { id: 't-shirts', url: '/search?v=t-shirts', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Ft-shirts.webp?alt=media&token=3818e9b9-4efa-4148-9041-eadb93f2f05d' },
  { id: 'music', url: '/search?h=music', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fmusic.webp?alt=media&token=e6a0a6cd-3f03-4db5-88c8-6924ba4c1f5f' },
  { id: 'rpg', url: '/search?h=rpg', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Frpg.webp?alt=media&token=0a1bb84f-de87-4995-ad26-d8f2a39b5a0a' },
  { id: 'mugs', url: '/search?v=mugs', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fmugs.webp?alt=media&token=10310c77-061a-497c-9f56-f885942e2d96' },
  { id: 'christmas', url: '/search?t=christmas', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fchristmas.webp?alt=media&token=ec33c800-a6c6-497b-92bc-10c8cc8cf54d' },
  { id: 'valentines', url: '/search?t=valentines', img: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/index%2Fvalentines.webp?alt=media&token=1a8ba264-3494-42ae-9099-39fe5417231e' },
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
      showToast({ type: error?.type || 'error', msg: tToasts(error.message) })
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
              src: 'https://firebasestorage.googleapis.com/v0/b/my-store-4aef7.appspot.com/o/banners%2Fsound-vibes_bg.webp?alt=media&token=56fc01f4-9e4e-4d01-97ee-529bdf99ebd1',
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
                        transition: `width ease-in-out ${session === undefined ? 0 : 200}ms, width ease-in-out ${session === undefined ? 0 : 200}ms, scale 100ms ease-out`,
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