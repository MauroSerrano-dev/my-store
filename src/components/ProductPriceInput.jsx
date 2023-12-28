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
        productType
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
                onChange={event => handleChangePrice(isNaN(Number(event.target.value)) ? 0 : Math.abs(Number(event.target.value.slice(0, Math.min(event.target.value.length, 7)))), size.id)}
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
                min={product.variants[0].cost}
                max={product.variants.reduce((acc, vari) => vari.cost > acc.cost ? vari : acc, { cost: 0 }).cost * 5}
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