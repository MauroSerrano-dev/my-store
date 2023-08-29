import axios from 'axios';
import { getAllProductPrintifyIds } from '../../../backend/product'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const base_url = `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`;

        const headers = {
            Authorization: process.env.PRINTIFY_ACCESS_TOKEN
        };

        try {
            const response = await axios.get(base_url, { headers });
            const printifyApiData = response.data;

            const existingProductPrintifyIdsData = await getAllProductPrintifyIds();
            const existingPrintifyIds = existingProductPrintifyIdsData.printifyIds;

            const newProductPrintifyIds = printifyApiData.data
                .filter((product) => !existingPrintifyIds.includes(product.id))

            res.status(200).json({
                msg: 'All new products retrieved successfully!',
                products: newProductPrintifyIds
            });
        } catch (error) {
            res.status(error.response?.status || 500).json({ error: 'Error getting new products from Printify' });
        }
    }
}