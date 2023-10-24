import { Skeleton } from '@mui/material'

export default function ProductSkeleton(props) {
    const {
        productWidth,
        supportsHoverAndPointer,
    } = props

    return (
        <div
            style={{
                width: productWidth,
                height: (productWidth * 1.575) + (supportsHoverAndPointer ? productWidth * 0.2 : 0) - 0.01,
            }}
        >
            <Skeleton
                variant="rectangular"
                width={productWidth}
                height={productWidth * 10 / 9}
                sx={{
                    backgroundColor: 'rgb(50, 50, 50)',
                    borderTopRightRadius: '0.5rem',
                    borderTopLeftRadius: '0.5rem',
                }}
            />
            <Skeleton
                variant="rectangular"
                width={productWidth}
                height={productWidth / 9}
                sx={{
                    marginTop: productWidth * 0.005,
                    backgroundColor: 'rgb(50, 50, 50)',
                    borderRadius: '0.5rem',
                }}
            />
            <Skeleton
                variant="rectangular"
                width={productWidth * 0.7}
                height={productWidth * 0.09}
                sx={{
                    marginTop: productWidth * 0.005,
                    backgroundColor: 'rgb(50, 50, 50)',
                    borderRadius: '0.5rem',
                }}
            />
            <Skeleton
                variant="rectangular"
                width={productWidth * 0.35}
                height={productWidth * 0.1}
                sx={{
                    marginTop: productWidth * 0.005,
                    backgroundColor: 'rgb(50, 50, 50)',
                    borderRadius: '0.5rem',
                }}
            />
        </div>
    )
}