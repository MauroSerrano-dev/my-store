import '@/styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MontserratRegular from '../../public/fonts/montserrat.ttf';
import DataHandler from '@/components/DataHandler'

const primaryColor = '#00acb7'

const mainTheme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: '#e5e5e5'
    },
    neutral: {
      main: '#ffffff',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: [MontserratRegular, 'Arial', 'sans-serif',
    ].join(','),
  },
})


export default function App(props) {
  const { Component, pageProps } = props

  return (
    <div>
      <ThemeProvider theme={mainTheme}>
        <DataHandler pageProps={pageProps} Component={Component} primaryColor={primaryColor} />
      </ThemeProvider>
    </div>
  )
}