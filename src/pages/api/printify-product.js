// pages/api/getPrintifyProducts.js
import axios from 'axios'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const id = req.headers.id

        const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`

        const headers = {
            Authorization: process.env.PRINTIFY_ACCESS_TOKEN
        }

        try {
            const response = await axios.get(base_url, { headers })

            // Set the cookie with the appropriate SameSite attribute
            res.setHeader('Set-Cookie', 'SameSite=Strict; SameSite=None; Secure')

            const product = response.data.data.filter(product => product.id === id)[0]
            res.status(200).json(product)
        } catch (error) {
            res.status(error.response?.status || 500).json({ error: 'Error getting product from Printify' })
        }
    }
}