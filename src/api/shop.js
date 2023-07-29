/*
 * @Author: doing
 * @Date: 2023-07-28 18:57:15
 * @LastEditors: git config user.name && git config user.email
 * @LastEditTime: 2023-07-28 19:08:52
 * @FilePath: \Vuex\src\api\shop.js
 * @Description: 
 * 这里mock一些数据
 * Copyright (c) 2023 by 1540265624@qq.com, All Rights Reserved. 
 */

const _products = [
    { 'id': 1, 'title': 'ipad 4 Mini', 'price': 500.01, 'inventory': 2 },
    { 'id': 2, 'title': 'H&M T-Shirt White', 'price': 10.99, 'inventory': 10 },
    { 'id': 3, 'title': 'Charli XCX - Sucker CD', 'price': 19.99, 'inventory': 5 },
]

function wait(ms){
    return new Promise(resolve => {
        setTimeout(resolve,ms)
    })
}

export default {
    async getProducts () {
        await wait(1000)
        return _products
    },
    
    async buyProducts(products){
        await wait(1000)
        if(
           // simulate random checkout failure.
           (Math.random() > 0.5 || navigator.webdriver)
        ){
            return
        }else{
            throw new Error('Checkout error')
        }
    }
}