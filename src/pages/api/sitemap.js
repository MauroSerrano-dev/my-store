import { getAllProductsIds } from "../../../backend/product"
const { SitemapStream, streamToPromise } = require("sitemap")
const { Readable } = require("stream")

export default async function handler(req, res) {

    const prodIdsRes = await getAllProductsIds()

    const links = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
    ].concat(prodIdsRes.productIds.map(prodId => ({ url: '/product/'.concat(prodId), changefreq: 'monthly', priority: 0.8 })))

    const stream = new SitemapStream({ hostname: `https://${req.headers.host}` })

    res.writeHead(200, {
        "Content-Type": "application/xml"
    })

    const xmlString = await streamToPromise(
        Readable.from(links).pipe(stream)
    ).then(data => data.toString())

    console.log('Sitemap generated successfully!');

    res.end(xmlString)
}