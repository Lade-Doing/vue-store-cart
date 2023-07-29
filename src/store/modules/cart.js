/*
 * @Author: doing
 * @Date: 2023-07-28 18:53:35
 * @LastEditors: git config user.name && git config user.email
 * @LastEditTime: 2023-07-29 11:10:09
 * @FilePath: \Vuex\src\store\modules\cart.js
 * @Description: 
 * 购物车的store
 * Copyright (c) 2023 by 1540265624@qq.com, All Rights Reserved. 
 */
import shop from '../../api/shop'
import nested from './nested'

//initial state
//shape: [{ id,quantiry }]
const state = () => ({
    items: [],
    //是否结账
    checkoutStatus: null
})

//getters
const getters = {
    cartProducts: (state, getters, rootState) => {
        console.log(state.items)
        return state.items.map(({ id, quantity }) => {
          const product = rootState.products.all.find(product => product.id === id);
          
          if (!product) {
            return null; // 或者可以根据需求返回一个默认值
          }
          
          return {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity
          };
        }).filter(product => product !== null); // 过滤掉为null的项
      },
      
    
    cartTotalPrice: (state, getters) => {
        return getters.cartProducts.reduce((total, product) => {
            return total + product.price * product.quantity
        }, 0)
    }
}

//actions
const actions = {
    //结算
    async checkout({ commit,state },products){
        const savedCartItems = [...state.items]
        //设置结算状态为null
        commit('setCheckoutStatus',null)
        //empty cart
        commit('setCartItems',{ items: [] })
        try{
            await shop.buyProducts(products)
            //设置结算状态成功
            commit('setCheckoutStatus','successful')
        } catch (e){
            console.log(e)
            commit('setCheckoutStatus','failed')
            //rolback to the cart saved before sending the request
            //这里有一个坑就是要先判断是否为数组,如果不是为数组的话,则直接返回空数组.
            commit('setCartItems', { items: Array.isArray(savedCartItems) ? savedCartItems : [] })
        }
    },
    //添加商品
    addProductToCart({ state, commit }, product){
        commit('setCheckoutStatus',null)
        if (product.inventory > 0){
            const cartItem = state.items.find(item => item.id === product.id)
            if(!cartItem){
                commit('pushProductToCart', { id:product.id })
            } else {
                commit('incrementItemQuantity', cartItem)
            }
            commit('products/decrementProductInventory', { id:product.id },{ root:true })
        }
    }

}


//mutations
const mutations = {
    pushProductToCart (state, { id }){
        state.items.push({
            id,
            quantity: 1
        })
    },
    incrementItemQuantity (state, { id }){
        const cartItem = state.items.find(item => item.id === id)
        cartItem.quantity ++ ;
    },
    setCartItems (state, { items }){
        state.items = [...items]
    },
    setCheckoutStatus (state,status){
        state.checkoutStatus = status
    }
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
    //嵌套模块
    modules:{
        nested
    }
}