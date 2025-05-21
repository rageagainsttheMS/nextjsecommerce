import { ShippingAddress } from "@/app/types";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore'
export const APP_DESC = process.env.NEXT_PUBLIC_APP_DESC || 'A modern ecommerce platform built with Next.js';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const GST = 0.10;

export const SHIPPING_DEFAULTS : ShippingAddress = {
    fullName : '',
    streetAddress : '',
    city : '',
    country : '',
    postalCode : ''
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(", ") : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD ? process.env.DEFAULT_PAYMENT_METHOD : 'PayPal'