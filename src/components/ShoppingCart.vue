<!--
 * @Author: doing
 * @Date: 2023-07-28 19:11:30
 * @LastEditors: git config user.name && git config user.email
 * @LastEditTime: 2023-07-29 10:55:00
 * @FilePath: \Vuex\src\components\ShoppingCart.vue
 * @Description: 
 * 购物车组件
 * Copyright (c) 2023 by 1540265624@qq.com, All Rights Reserved. 
-->
<template>
    <div class="cart">
        <h2>Your Cart</h2>
        <p v-show="!products.length">
            <i>Please add some products to cart.</i>
        </p>
        <ul>
            <li v-for="product in products" :key="product.id">
                {{ product.title }} - {{ currency(product.price) }} x {{ product.quantity }}
            </li>
        </ul>
        <p>Total: {{ currency(total) }}</p>
        <p><button :disabled="!products.length" @click="checkout(products)">Checkout</button></p>
        <p v-show="checkoutStatus">Checkout {{ checkoutStatus }}</p>
    </div>
</template>
<script setup>
import { currency } from '../utils/currency'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
// console.log(store.state.products)

//以下内容可以写只读属性
const checkoutStatus = computed(() => store.state.cart.checkoutStatus)
const products = computed(() => store.getters['cart/cartProducts'])
// console.log(store.getters)
// console.log(store.getters['cart/cartProducts'])
// console.log(store.getters['cart/cartTotalPrice'])
const total = computed(() => store.getters['cart/cartTotalPrice'])


async function checkout() {
  console.log(11);
  // 组件挂载之前要做的事情
  try {
    await store.dispatch('cart/checkout', products)
  } catch (err) {
    console.error(err);
  }
}

</script>
