import { clearDeletedUsers, updateAllCurrencies } from '../../../../backend/app-settings'
import { deleteExpiredCartSessions } from '../../../../backend/cart-session'

const axios = require('axios')

const CURRENCIES = {
    brl: { code: 'brl', symbol: 'R$' },
    gbp: { code: 'gbp', symbol: '£' },
    eur: { code: 'eur', symbol: '€' },
    usd: { code: 'usd', symbol: '$' },
}

export default async function handler(req, res) {
    const { authorization } = req.headers

    if (!authorization) {
        console.error("Invalid authentication.")
        return res.status(401).json({ error: "Invalid authentication." })
    }

    if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error("Invalid authentication.")
        return res.status(401).json({ error: "Invalid authentication." })
    }

    try {
        const API_ENDPOINT = `https://api.currencybeacon.com/v1/latest?api_key=${process.env.CURRENCY_BEACON_API_KEY}`

        const response = await axios.get(
            API_ENDPOINT,
            {
                params: {
                    base: 'USD',
                },
            })

        const updatedCurrencies = {}
        Object.keys(CURRENCIES).forEach(code => {
            updatedCurrencies[code] = { ...CURRENCIES[code], rate: response.data.rates[code.toUpperCase()] + (code.toUpperCase() === 'USD' ? 0 : 0.01) }
        })

        await updateAllCurrencies(updatedCurrencies)

        await deleteExpiredCartSessions()

        await clearDeletedUsers()

        res.status(200).json({ message: 'Daily cron run successfully!' })
    }
    catch {
        res.status(500).json({ error: 'default_error' })
    }
}