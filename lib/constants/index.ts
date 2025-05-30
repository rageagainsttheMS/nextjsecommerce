import { ShippingAddress } from "@/app/types";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore'
export const APP_DESC = process.env.NEXT_PUBLIC_APP_DESC || 'A modern ecommerce platform built with Next.js';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const GST = 0.10;
export const CURRENCY_AUD = 'AUD'

export const SHIPPING_DEFAULTS : ShippingAddress = {
    fullName : '',
    streetAddress : '',
    city : '',
    country : '',
    postalCode : ''
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(", ") : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD ? process.env.DEFAULT_PAYMENT_METHOD : 'PayPal'

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const PRODUCT_DEFAULTS = {
    name : '',
    slug : '',
    category : '',
    images : [],
    brand : '',
    description : '',
    price : '0',
    stock : 0,
    rating : '0',
    numReview : '0',
    isFeatured : false,
    banner : null
}

export const USER_ROLES = ['admin', 'user']

export const REVIEW_DEFAULT = {
    title : '',
    comment : '',
    rating : 0
}

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resent.com"