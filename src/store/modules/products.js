/*
 * @Author: doing
 * @Date: 2023-07-28 18:53:45
 * @LastEditors: git config user.name && git config user.email
 * @LastEditTime: 2023-07-29 10:25:28
 * @FilePath: \Vuex\src\store\modules\products.js
 * @Description: 
 * 产品的store
 * Copyright (c) 2023 by 1540265624@qq.com, All Rights Reserved. 
 */

import shop from '../../api/shop'

//initial state
const state = () => ({
    all: [],
    test: '421'
})


//getters
const getters = {}


//actions
const actions = {
    async getAllProducts({ commit }) {
        const products = await shop.getProducts()
        commit('setProducts', products)
    }
}


//mutations
const mutations = {
    //设置商品信息
    setProducts(state, products) {
        state.all = [...products]
    },
    //减少商品库存
    decrementProductInventory(state, { id }) {
        const product = state.all.find(product => product.id === id)
        product.inventory--
    },
    //验证mutations是否正确运行
    test(state){
        state.test = 'fdsfsd'
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}