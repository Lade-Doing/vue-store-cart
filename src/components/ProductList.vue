<!--
 * @Author: doing
 * @Date: 2023-07-28 19:11:23
 * @LastEditors: git config user.name && git config user.email
 * @LastEditTime: 2023-07-29 11:12:53
 * @FilePath: \Vuex\src\components\ProductList.vue
 * @Description: 
 * 商品列表组件
 * Copyright (c) 2023 by 1540265624@qq.com, All Rights Reserved. 
-->
<template>
  <ul>
    <li v-for="product in products" :key="product.id">
      {{ product.title }} - {{ currency(product.price) }}
      <br>
      <button :disabled="!product.inventory" @click="addProductToCart(product)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, onBeforeMount } from 'vue';
import { currency } from '../utils/currency'

const store = useStore();


const products = computed(() => store.state.products.all);

const addProductToCart = (product) => {
  store.dispatch('cart/addProductToCart', product);
};

async function Init() {
  console.log(11);
  // 组件挂载之前要做的事情
  try {
    await store.dispatch('products/getAllProducts');
  } catch (err) {
    console.error(err);
  }
}

onBeforeMount(async () => {
  await Init();
});

// console.log(store.state.products);

</script>
