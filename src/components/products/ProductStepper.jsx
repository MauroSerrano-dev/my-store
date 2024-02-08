import { STEPS, STEPS_ATTEMPT } from "@/consts"
import styled from "@emotion/styled"
import { Step, StepConnector, StepLabel, Stepper, stepConnectorClasses } from "@mui/material"
import { useTranslation } from 'next-i18next'

export default function ProductStepper(props) {
    const {
        product,
    } = props

    const tOrders = useTranslation('orders').t

    const QontoConnector = styled(StepConnector)(() => ({
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                borderColor: 'var(--primary)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#999999',
            borderTopWidth: 2,
            borderRadius: 1,
        },
    }))

    return (
        product.status !== 'canceled' && product.status !== 'refunded' &&
        <Stepper
            connector={<QontoConnector />}
        >
            {(product.status === 'shipment_delivery_attempt' ? STEPS_ATTEMPT : STEPS).map((step, i) => (
                <Step
                    key={step}
                    completed={i <= (product.status === 'shipment_delivery_attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step === product.status)}
                    sx={{
                        '.MuiSvgIcon-root': {
                            color: i <= (product.status === 'shipment_delivery_attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step === product.status) ? 'var(--primary)' : '#999999',
                        },
                        '.MuiStepIcon-text': {
                            fill: i <= (product.status === 'shipment_delivery_attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step === product.status) ? 'var(--primary)' : 'var(--background-color)',
                            fontWeight: 600,
                        },
                    }}
                >
                    <StepLabel
                        sx={{
                            '.MuiStepLabel-label': {
                                cursor: 'default',
                                color: i <= (product.status === 'shipment_delivery_attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step === product.status) ? 'var(--primary) !important' : '#999999',
                                fontWeight: i <= (product.status === 'shipment_delivery_attempt' ? STEPS_ATTEMPT : STEPS).findIndex(step => step === product.status) ? 600 : 400,
                            }
                        }}
                    >
                        {tOrders(step)}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}