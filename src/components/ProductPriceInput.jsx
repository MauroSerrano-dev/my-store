import MyButton from './material-ui/MyButton';
import TextInput from './material-ui/TextInput';
import styles from '@/styles/components/ProductPriceInput.module.css'
import Chain from './svgs/Chain';
import BrokeChain from './svgs/BrokeChain';
import { Slider } from '@mui/material';
import { getVariantProfitBySizeId, getVariantProfitBySizeIdPromotion } from '@/utils';

export default function ProductPriceInput(props) {

    const {
        onClickChain,
        onChangeSlider,
        chained,
        size,
        price,
        product,
        productType,
        onChangeText
    } = props

    return (
        <div
            className={styles.container}
        >
            <MyButton
                variant={chained ? 'contained' : 'outlined'}
                onClick={onClickChain}
                style={{
                    minWidth: 45,
                    width: 45,
                    height: 45,
                    padding: 0,
                }}
            >
                {chained ? <Chain /> : <BrokeChain />}
            </MyButton>
            <TextInput
                label={size.title}
                onChange={onChangeText}
                value={price}
                style={{
                    width: 90,
                }}
                styleInput={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: 0,
                    height: 45,
                }}
            />
            <Slider
                value={price}
                min={Math.max(...Object.values(product.variants[0].cost))}
                max={product.variants.reduce((acc, vari) => Math.max(...Object.values(vari.cost)) > acc ? Math.max(...Object.values(vari.cost)) : acc, 0) * 5}
                valueLabelDisplay="auto"
                onChange={onChangeSlider}
            />
            <div className={styles.profitContainer}>
                {product.promotion &&
                    <span className={styles.originalPrice}>
                        ${getVariantProfitBySizeId(product, size.id, productType)}
                    </span>
                }
                <span className={styles.profit}>
                    ${getVariantProfitBySizeIdPromotion(product, size.id, productType)}
                </span>
            </div>
        </div>
    )
}