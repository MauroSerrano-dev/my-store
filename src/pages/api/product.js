import { createProduct, updateProduct } from "../../../backend/product";
import admin from '../../../firebaseAdminInit'

export default async function handler(req, res) {
    const { authorization } = req.headers
    const { product, product_id, new_fields, inicial_product } = req.body

    if (!authorization)
        res.status(401).json({ error: "Access denied: No token provided" })

    const decodedToken = await admin.auth().verifyIdToken(authorization)
    if (!decodedToken.admin)
        res.status(403).send('Access denied: User is not an administrator')

    if (req.method === "POST") {
        try {
            await createProduct(product)

            console.log('Product created successfully')
            res.status(200).json({ message: 'Product created successfully' })
        }
        catch (error) {
            console.error('Error in product POST:', error)
            res.status(500).json({ error: error });
        }
    }
    else if (req.method === "PUT") {
        try {
            await updateProduct(product_id, new_fields, inicial_product)
            console.log(`Product ${product_id} updated successfully!`)
            res.status(200).json({ message: `Product ${product_id} updated successfully!` })
        }
        catch (error) {
            console.error('Error in product PUT:', error)
            res.status(500).json({ error: error })
        }
    }
}