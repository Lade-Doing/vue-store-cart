# store 学习

> 此项目主要用于学习 Vuex,以及复习 vue3.x 的一些新特性、ES6 语法、常见的方法

## Vue3.x 的新特性

**关于 setup:**
1、setup 中没有自己的 this
2、setup 可以使用异步,也就是可以使用await,这个功能暂时处于实验阶段
3、setup 从vue的生命周期角度来看，他比beforeCreate还要靠前调用
~~~
async function Init() {
    console.log(11)
    //组件挂载之前要做的事情
    try {
        await store.dispatch('products/getAllProducts')
    } catch (err) {
        console.err(err)
    }
}
//为什么setup中可以添加一个await
await Init()
~~~
解释:因为setup在Vue3生命周期之前,所以不能使用onBeforeMount函数来初始化数据...

**为什么使用的是conts创建count？而不是使用let，因为我觉得增加数量不是也在改变count的值吗？还是说这里使用ref创建的值其实只是count对象中的value属性？**

在Vue 3的`setup`函数中，我们使用`ref`创建响应式数据时，实际上返回的是一个包装过的对象，其中包含一个名为`value`的属性，该属性才是具有响应性的。这就是为什么我们使用`const`来声明变量，并将`ref`的返回值赋给它。

当我们通过`count.value`访问和修改响应式数据时，Vue 能够捕获这些操作，并触发对应的更新。

所以，在下面的代码示例中：
```javascript
const count = ref(0);
```
我们实际上创建了一个名为`count`的常量，其值是一个包装过的对象，其中的`value`属性初始值为0。我们通过`count.value`来获取和修改实际的值。

而如果我们使用`let`来声明变量，如：
```javascript
let count = ref(0);
```
我们会得到一个普通的对象，而非一个具有响应性的对象。在这种情况下，Vue 将无法追踪到这个对象的变化，因此模板也无法实时渲染更新。

因此，为了能够正确地使用`ref`创建响应式数据并实现实时渲染效果，我们需要将返回的包装对象赋值给一个常量（使用`const`声明），然后通过`.value`来访问和修改实际的值。

**创建ref、reactive和computed都是这样用conts吗？除了这里，我可以在其他（全局变量、局部变量）使用let和var？**

在Vue 3中使用`ref`、`reactive`和`computed`创建响应式数据时，我们通常使用`const`关键字来声明变量，并将相应的返回值赋给它。

对于`ref`和`reactive`，我们会使用`const`来创建一个常量，因为它们返回一个包装过的对象，我们通过修改对象的`value`属性来改变响应式数据。例如：

```javascript
const count = ref(0);
const data = reactive({ name: 'John', age: 25 });
```

对于`computed`，我们也可以将其结果赋给一个常量来进行引用。例如：

```javascript
const fullName = computed(() => {
  return `${data.name} Smith`;
});
```

这样做的好处是，我们遵循了函数式编程的原则，使用常量来引用这些响应式数据，确保在同一作用域内它们不会被重新赋值。

然而，在其他情况下，比如全局变量或局部变量的声明，你可以根据需要选择使用`let`或`var`关键字。它们在语法上的区别在于作用域和变量声明的提升行为。`let`和`const`都是块级作用域，而`var`是函数级作用域。

总结起来，在Vue 3中创建响应式数据时，通常使用`const`关键字以保持数据的不可变性。而在其他情况下，你可以根据需求选择使用`let`或`var`关键字来声明变量。

~~~
在Vue 3中使用const关键字来声明变量的主要原因是为了保持数据的不可变性。以下是一些使用const的好处总结：

明确意图：使用const可以清晰地表明我们的意图，即该变量是一个常量，在其生命周期内不会被重新赋值。这有助于提高代码的可读性和维护性。

避免错误：使用const可以防止意外的重新赋值操作。如果我们不打算修改某个变量的值，那么将其声明为常量可以有效地防止程序中的潜在错误。

函数式编程原则：在函数式编程中，不可变性是一个重要的概念。使用const可以遵循函数式编程的原则，将数据视为不可变的，而不是通过改变它们的值来进行操作。

更好的优化和性能：由于const声明的变量不可变，JavaScript引擎可以在编译时进行更好的优化，以提升性能。此外，不可变数据还可以更好地支持Vue 3的响应式系统，使其更容易追踪数据的变化并进行优化。

需要注意的是，使用const只能保证变量本身不被重新赋值，但对于对象或数组等引用类型的常量，仍然可以修改其属性或元素。如果需要确保对象的完全不可变性，可以使用其他工具库（如Object.freeze）来实现。

综上所述，使用const关键字能够提供更好的代码可读性、错误预防、函数式编程原则的支持以及更好的优化和性能，因此在Vue 3中推荐使用const来声明变量。
~~~

**关于computed属性**
在Vue 3中，computed属性的set函数不允许直接修改computed属性本身。如果你尝试直接赋值给computed属性，将会导致一个**错误**。

如果你想要修改计算属性的值，你需要通过修改计算属性依赖的响应式数据来间接实现。在上面的示例代码中，我们使用了响应式数据products来作为计算属性computedProducts的依赖，并通过修改products.value来间接修改计算属性的值。

下面是一个示例代码，展示了如何创建一个可写的计算属性并修改其值：

~~~
import { ref, computed } from 'vue';

const products = ref([]); // 创建一个响应式的数据

const computedProducts = computed({
  get: () => products.value, // 读取计算属性的值
  set: (val) => {
    // 修改计算属性的值
    products.value = [...val]; // 这里是通过修改响应式数据的值来实现的
  }
});

// 访问计算属性的值
console.log(computedProducts.value); 

// 修改计算属性的值
computedProducts.value = ['product 1', 'product 2'];

// 再次访问计算属性的值
console.log(computedProducts.value);

~~~



## ES6 的学习:

关于导出:

```
export default store //第一种导出方式
export {
    store
}; //第二种
export const store = createStore({
    state(){
        return{
            count:0
        }
    },
    mutations:{
        increment(state){
            state.count++;
        }
    }
})//第三种

```

关于箭头函数

```
//这里省略了return,实际上是return item.id
state.data.filter(item=>item.id)
//箭头函数没有自己的this值,它会继承外层作用于的this值
```

关于'...'在数组和对象中的用法
~~~
const obj1 = { a: 1, b: 2 }
const obj2 = { c: 3, d: 5 }
function objectOdd (){
  return {...obj1, ...obj2}
}
objectOdd()

const array1 = [1,2,3,4,5]
const array2 = [6,7,8,9,10]
function arrayOdd (){
  return [...array1,...array2]
}
arrayOdd()
~~~
使用 ... 可以将一个对象中的所有属性解构出来，并将其合并到另一个对象中。这样可以方便地实现对象的浅拷贝和合并。
需要注意的是，... 只会进行浅拷贝，即只复制对象的一层属性。如果对象中包含引用类型的属性，那么复制后的对象仍然会共享这些属性。如果需要进行深拷贝，则需要使用其他方法或工具库。
>比如对象使用JSON.parse(JSON.stringify(obj))

## 常见的方法

**关于 filter 函数**
当使用 `filter` 函数时，可以根据特定条件筛选数组中的元素。以下是一个使用提供的数据进行筛选的示例，并附上一些注意事项：

```javascript
const data = [
  { id: 1, name: "HTML" },
  { id: 2, name: "CSS" },
  { id: 3, name: "JavaScript" },
  { id: 4, name: "Vue3.x" },
  { id: 5, name: "TypeScript" },
  { id: 6, name: "Node.js" },
];

// 使用 filter 函数筛选具有特定条件的元素
const filteredData = data.filter((item) => item.name.includes("JS"));

console.log(filteredData);
```

在上述示例中，我们使用 `filter` 函数筛选出所有 `name` 属性中包含 `'JS'` 的元素。这将返回一个新数组 `filteredData`，其中包含满足筛选条件的元素。

以下是一些在使用 `filter` 函数时需要注意的事项：

1. 筛选函数：`filter` 函数接受一个筛选函数作为参数。筛选函数应返回一个布尔值，如果为 `true`，则表示该元素满足条件，将会被保留在结果数组中；如果为 `false`，则表示该元素不满足条件，将会被排除。

2. 筛选条件：筛选函数可以根据需要定义不同的筛选条件。在示例中，我们使用了 `includes` 方法来判断 `name` 是否包含 `'JS'`。你可以根据实际需求使用其他方法或操作符进行比较、匹配等操作。

3. 原数组不变：`filter` 函数不会修改原始数组，而是返回一个新的数组作为结果。因此，在使用 `filter` 函数后，建议将结果保存到一个新的变量中。

4. 空数组处理：如果没有满足筛选条件的元素，`filter` 函数将返回一个空数组 `[]`。

5. 注意引用类型：当数组中的元素是引用类型（如对象）时，请注意筛选过程中对元素的引用和修改操作可能会影响原始数组。

**关于复制数组**
很多时候因为直接用'='赋值后的对象往往出现其中一个对象改变,另一个对象也会发生改变的情况.这时候我们就需要单独将数组复制过来.

```
    //使用...创建一个新数组
    const savedCartItems = [...state.cart.added]
    //我们也可以使用...合并为一个新数组
    const savedCartItems = [...state.cart.added,...[{id:3,name:'商品C'}]];
```

**关于复制对象**

可以使用 JSON.parse(JSON.stringify(object));
**这种方法只适用于对象没有函数或循环引用的情况。如果对象具有函数或循环引用，JSON.stringify 会将函数丢失，而循环引用会导致无限递归，造成堆栈溢出。在处理包含函数或循环引用的对象时，需要考虑使用其他方法**

**关于对象引用**
```
    incrementItemQualitity (state, { id }){
        const cartItem = state.items.find(item => item.id === id)
        cartItem.quantity ++ ;
    } 
    这个代码执行之后是否为影响到state.item?
```
JavaScript中的对象是引用传递，所以任何对cartItem对象的修改都会直接反映到原始的state.items数组中。因此，在执行完这段代码后，state.items数组中对应的项的quantity属性会被增加1。

**结构赋值**

比如：

~~~
    incrementItemQualitity (state, { id }){
        const cartItem = state.items.find(item => item.id === id)
        cartItem.quantity ++ ;
    },
	//会自动赋值出对象中对应的id值
    incrementItemQuality(item)
~~~

还有：

~~~
//会将actions中的context对象其中的commit、state结构赋值出来
const actions = {
    async checkout({ commit,state },product){
        const savedCartItems = [...state.items]
    }
}
~~~

**数组的累加函数reduce**

~~~
    cartTotalPrice: (state, getters) => {
        return getters.cartProducts.reduce((total, product) => {
            return total + product.price * product.quantity
        }, 0)
    }
~~~

`reduce`函数是数组的高阶函数之一，用于对数组中的每个元素进行累积计算并返回最终结果。下面是`reduce`函数的使用方式：

```
array.reduce(callback, initialValue)
```

- `array`：要进行累积计算的数组。
- `callback`：回调函数，接受四个参数：
  - `accumulator`：累加器，累积计算的结果。
  - `currentValue`：当前元素的值。
  - `currentIndex`：当前元素的索引（可选）。
  - `array`：原始数组（可选）。
- `initialValue`：初始值，作为累积计算的起点。

在上述代码中，`getters.cartProducts`是一个数组，通过调用`reduce`函数对其进行累积计算。初始值为`0`，并将每个产品的价格(`product.price`)乘以数量(`product.quantity`)累加到`total`中。

通过遍历数组中的每个元素，将每个元素的值与累加器相加，并将结果作为下一次计算的累加器值。最后，`reduce`函数会返回最终的累加结果。

总而言之，上述代码使用`reduce`函数对`getters.cartProducts`数组中的产品价格和数量进行累积计算，并返回最终的总金额。

## Vuex 的基本配置

**store/index.js**

```
import { createStore } from "vuex";
//创建一个新的store实例
const store = createStore({
    state(){
        return{
            count:0
        }
    },
    mutations:{
        increment(state){
            state.count++;
        }
    }
})

export default store;
```

**main.js**

```
import { createApp } from 'vue'
import store from './store'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(store)
app.mount('#app')

```

**HelloWorld.vue**

```
<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
const store = useStore()
const count = computed(()=>store.state.count)
const increment = ()=>{
  store.commit('increment')
}
</script>
<template>
  <div class="card">
    <button type="button" @click="increment">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
</template>
```

**问:为什么不适用 ref 而是使用 computed?**

```
使用 computed 而不是 ref 的原因是因为你的目标是从 Vuex store 中获取状态，并且当状态发生变化时更新组件的响应式数据。

在 Vue 3 中，ref 是用来包装普通的数据或对象，并使其成为响应式数据。但是当你需要从 Vuex store 中获取状态时，使用 ref 并不会自动响应状态的变化，你需要手动监听状态的变化并更新 ref 的值。

而 computed 函数可以帮助你监听 Vuex store 中的状态变化，并在状态发生变化时自动更新计算属性的值。这意味着你可以直接通过 count 计算属性来获取 store.state.count 的值，并且当 store.state.count 发生变化时，count 的值也会自动更新。

所以，在你的代码中选择使用 computed 来创建计算属性是更合适的选择，因为它能够提供自动响应状态变化的功能，减少了手动处理的代码量。

当然，在某些情况下，如果你只需要获取状态的初始值或者不需要自动响应状态变化，使用 ref 也是可以的。但在大多数情况下，使用 computed 更适合从 Vuex store 中获取状态并在组件中使用。
```

### store 常见使用

store 里面的值可以通过 Mutation 进行改变,使用 computed 属性可以监听 store 中的数据变化并更新.
store 在 Vue2.x 中可以使用 mapState 辅助函数和对象展开运算符:
https://vuex.vuejs.org/zh/guide/state.html#mapstate-%E8%BE%85%E5%8A%A9%E5%87%BD%E6%95%B0
https://vuex.vuejs.org/zh/guide/state.html#%E5%AF%B9%E8%B1%A1%E5%B1%95%E5%BC%80%E8%BF%90%E7%AE%97%E7%AC%A6
**注意:Vue3.x 已经废弃了 mapState 辅助函数**

### Getter 常见使用

文档:
https://vuex.vuejs.org/zh/guide/getters.html#getter

Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。

> 从 Vue 3.0 开始，getter 的结果不再像计算属性一样会被缓存起来(会不会有性能损失?)。这是一个已知的问题，将会在 3.1 版本中修复。详情请看 PR #1878。

#### 通过属性访问

Getter 会暴露为 store.getters 对象，你可以以属性的形式访问这些值：

```
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getter 也可以接受其他 getter 作为第二个参数：

```
getters: {
  // ...
  doneTodosCount (state, getters) {
    return getters.doneTodos.length
  }
}
```

我们可以很容易地在任何组件中使用它：

```
import { useStore } from 'vuex'
const store = useStore()
const filterData = computed(()=>{store.getters.doneData})
```

注意，getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。
**注意:Vue3.x 已经废弃了 mapGetters 辅助函数**

### Mutation 常见使用

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type)和一个回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```
//increment是事件类型,(state) => { state.count++ } 是对应的回调函数。
const store = createStore({
    state:{
        count:1
    },
    mutations:{
        increment(state){
            //变更状态
            state.count++
        }
    }
})
```

通常要唤醒一个 mutation 处理函数,你需要以相应的 type 调 store.commit 方法:

```
store.commit('increment')
```

#### 提交载荷（Payload）

你可以向 store.commit 传入额外的参数,即 mutation 的载荷(payload):

```
//...
mutations:{
    increment(state,n){
        state.count += n
    }
}
```

```
store.commit('increment',10)
```

在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：

```
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

```
store.commit('increment',{
    amount:10
})
```

#### 对象风格的提交方式

提交 mutation 的另一种方式是直接使用包含 type 属性的对象:

```
store.commit({
    type: 'increment', //字符串的时间事件类型
    amount: 10
})
```

mutation 函数，因此处理函数保持不变：当使用对象风格的提交方式，整个对象都作为载荷传给

```
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

#### 使用常量替代 Mutation 事件类型

使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：

```
//mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```
//store.js
import { createStore } from 'vuex'
import { SOME_MUTATION } from './mutataion-types'

const store = createStore({
    state:{...},
    mutations:{
        //我们可以使用ES2015风格的计算熟悉感命名功能
        //来使用一个常量作为函数名
        [SOME_MUTATION](state){
            //修改 state
        }
    }
})
```

用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。

#### Mutation 必须是同步函数

一条重要的原则就是要记住 mutation 必须是同步函数。为什么？请参考下面的例子：

```
mutations:{
    someMutation(state){
        api.callAsyncMethod(()=>{
            state.count++
        })
    }
}
```

现在想象，我们正在 debug 一个 app 并且观察 devtool 中的 mutation 日志。每一条 mutation 被记录，devtools 都需要捕捉到前一状态和后一状态的快照。然而，在上面的例子中 mutation 中的异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。

#### 在组件中提交 Mutation

你可以在组件中使用 vuex 中的 useStore 来使用 commit 函数提交 mutation,也可以使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用(需要再根节点注入 store),但是在**Vue3.x 中不支持 mapmutations 辅助函数**

```
import { useStore } from 'vuex'
const store = useStore()
const changeData = ()=>{
    store.commit('changeData',{
        id:8,
        name:'后端开发'
    })
}
```

#### 下一步：Action

在 mutation 中混合异步调用会导致你的程序很难调试。例如，当你调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念。在 Vuex 中，mutation 都是同步事务：

### Getter 和 Mutation 的区别?

在 Vuex（Vue.js 的状态管理库）中，有两个主要的概念：`getters` 和 `mutations`。它们在功能和使用方式上有一些区别。

1. Getters（获取器）：

   - Getters 类似于计算属性，可以基于存储在 Vuex 中的状态派生出新的值。
   - 它们接收 Vuex 的状态作为第一个参数，并可以接收其他 getters 作为第二个参数。
   - Getters 可以被视为对状态进行筛选、转换或组合的函数。
   - 它们通常用于获取经过处理的数据，供组件使用。

2. Mutations（突变）：
   - Mutations 用于修改 Vuex 中的状态。
   - 它们是同步函数，负责更改状态，并且每个 mutation 都有一个字符串类型的事件类型（type）和一个处理状态更改的回调函数。
   - 在组件中，通过调用 `commit` 方法来触发 mutation 来修改状态。
   - Mutations 必须是同步的，并遵循单向数据流的原则。

总结：

- Getters 是从状态派生出新值的函数，类似于计算属性。它们用于获取、转换和组合状态。
- Mutations 用于修改状态。它们是同步的操作，用于进行状态的突变。

需要注意的是，如果需要异步操作或复杂的业务逻辑，应该使用 Actions（动作）来代替 Mutations。Actions 允许执行异步操作，并在完成后提交 Mutations 来修改状态。

### Action

Action 类似于 mutation,不同于

- Action 提交的是 mutation,而不是直接变更状态.
- Action 可以包含任何异步操作
  让我们来注册一个简单的 action:

```
const store = createStore({
    state:{
        count: 0
    },
    mutations:{
        increment(state){
            state.count++
        }
    },
    actions:{
        increment(context){
            context.commit('increment')
        }
    }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。当我们在之后介绍到 Modules 时，你就知道 context 对象为什么不是 store 实例本身了。

实践中，我们会经常用到 ES2015 的参数解构来简化代码（特别是我们需要调用 commit 很多次的时候）：

```
actions: {
    increment({ commit }) {
        commit('increment')
    }
}
```

#### 分发 Action

Action 通过 store.dispatch 方法触发：

```
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('increment')
```

乍一眼看上去感觉多此一举，我们直接分发 mutation 岂不更方便？实际上并非如此，还记得 mutation 必须同步执行这个限制么？Action 就不受约束！我们可以在 action 内部执行异步操作：

```
actions:{
    incrementAsync({ commit }){
        setTimeout(()=>{
            commit('increment')
        },1000)
    }
}
```

Actions 支持同样的载荷方式和对象方式进行分发：

```
import { useStore } from 'vuex'
const store = useStore()
//以负载形式分发
store.dispatch('incrementAsync',{
    amount: 10
})
//以对象形式分发
store.dispatch({
    type: 'incrementAsync',
    amount: 10
})
```

来看一个更加实际的购物车实例,涉及到调用异步 API 和**分发多重**mutation:

```
import { createStore } from 'vuex';
import shop from './shop'; // 导入购物车API和相关类型

// 定义mutation的types常量
const types = {
  CHECKOUT_REQUEST: 'CHECKOUT_REQUEST',
  CHECKOUT_SUCCESS: 'CHECKOUT_SUCCESS',
  CHECKOUT_FAILURE: 'CHECKOUT_FAILURE',
};

const store = createStore({
  state() {
    return {
      cart: {
        added: [
                { id: 1, name: '商品A' },
                { id: 2, name: '商品B' }
        ], // 添加一个数组用于存储购物车中的物品
      }
    };
  },
  actions: {
    checkout({ commit, state }, products) {
      // 把当前购物车的物品备份起来
      const savedCartItems = [...state.cart.added];
      // 发出结账请求
      // 然后乐观地清空购物车
      commit(types.CHECKOUT_REQUEST);
      // 购物车 API 接受一个成功回调和一个失败回调
      shop.buyProducts(
        products,
        // 成功操作
        () => commit(types.CHECKOUT_SUCCESS),
        // 失败操作
        () => commit(types.CHECKOUT_FAILURE, savedCartItems)
      );
    },
  },
  mutations: {
    [types.CHECKOUT_REQUEST](state) {
      // 处理结账请求
      state.cart.added = []; // 清空购物车
    },
    [types.CHECKOUT_SUCCESS](state) {
      // 处理结账成功
      // 这里可以进行其他操作，例如显示成功提示、跳转页面等
    },
    [types.CHECKOUT_FAILURE](state, savedCartItems) {
      // 处理结账失败
      // 还原购物车物品
      state.cart.added = savedCartItems;
      // 这里可以进行其他操作，例如显示失败提示、重新加载购物车等
    },
  },
});

export default store;

```

注意我们正在进行一系列的异步操作，并且通过提交 mutation 来记录 action 产生的副作用（即状态变更）。

#### 在组件中分发 Action

你在组件中使用 this.$store.dispatch('xxx') 分发 action，但是不能使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用(需要先在根节点注入 store,并引入 useStore),**因为在 Vue3.x 已经弃用了 mapActions 函数.**
网址:https://vuex.vuejs.org/zh/guide/actions.html#%E5%9C%A8%E7%BB%84%E4%BB%B6%E4%B8%AD%E5%88%86%E5%8F%91-action

#### 组合 Action

Action 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？

首先，你需要明白 store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise：

```
actions: {
    actionA ({ commit }) {
        return new Promise((resolve,rejecrt)=>{
            setTimeout(()=>{
                commit('someMutation')
                resolve()
            },1000)
        })
    }
}
```

现在你可以:

```
store.dispatch('actionA').then(()=>{
    // ...
})
```

在另外一个 action 中也可以

```
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

最后，如果我们利用 async / await，我们可以如下组合 action：

```
//假设getData() 和 getOtherData() 返回的是 Promise
actions: {
    async actionA({ commit }){
        commit('gotData',await getData())
    },
    asybc actionB({ dispatch, commit }){
        await dispatch('actionA') //等待 actionA 完成
        commit('gotOtherData',await getOtherData())
    }
}
```

> 一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。

### Module(重点)

由于使用单一状态树,应用的所有状态会集中到一个比较大的对象中.当应用变得非常复杂时,store 对象就有可能变得相当臃肿.

为了解决以上问题,Vuex 允许我们将 store 分割成模块(module).每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块-----从上到下进行同样方式的分割:

```
const moduleA = {
    state: () => ({ ... }),
    mutation: { ... },
    actions: { ... },
    getters: { ... }
}

const moduleB = {
    state: () => ({ ... }),
    mutations: { ... },
    actions: { ... }
}

const store = createStore({
    modules: {
        a: moduleA,
        b: moduleB
    }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

#### 模块的局部状态

对于模块内部的 mutation 和 getter,接收到的第一个参数是模块的局部状态对象

```
const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment(state){
      //这里的`state`对象是模块的局部状态
      state.count++
    }
  },
  getters: {
    doubleCount(state){
      return state.count * 2
    }
  }
}
```

同样,对于模块内部的 action,局部状态通过 context.state 暴露出来,根节点状态则为 context.rootState:

```
const moduleA = {
  //...
  actions: {
    incrementIfOddOnRootSum({state,commit,rootState}){
      if((state.count + rootState.count) % 2 === 1){
        commit('increment')
      }
      //比如我们又引用了moduleB的模块,以上if判断代码可以改为:
      if((state.count + rootState.moduleB.count % 2 === 1)){
        commit('increment')
      }
    }
  }
}
```

#### 命名空间

默认情况下,模块内部的 action 和 mutation 仍然是注册在全局命名空间的------这样使得多个模块能够对同一个 action 和 mutation 作出响应.Getter 同样也默认注册在全局命名空间,但是目前这并非出于功能上的目的(仅仅是维持现状来避免非兼容性变更).必须注意,不要在不同的、无命名空间的模块中定义两个相同的 getter 从而导致错误.

如果希望你的模块具有更高的封装



性和复用性,你可以通过添加`namespaced:true`的方法使其称为带命名空间的模块.当模块被注册之后,它所有 getter、action 和 mutation 都会自动根据模块驻车的路径调整命名.例如:

```
import { createStore } from 'store'
const store = createStore({
  module: {
    account:{
      namespaced: true,
      //模块内容(module assets)
      state: () => ({ ... })//模块内的状态已经是嵌套的了,使用`namespaced`属性不会对其产生影响
      getters:{
        isAdmin() { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login() { ... } // -> dispatch('account/login')
      },
      mutations: {
        login() { ... } // -> commit('accout/login')
      },

      //嵌套模块
      modules: {
        //继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },
        //进一步嵌套命名空间
        posts:{
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            pupular() { ... } //-> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit。换言之，你在使用模块内容（module assets）时不需要在同一模块内额外添加空间名前缀。更改 namespaced 属性后不需要修改模块内的代码。

#### 在带命名空间的模块内访问全局内容(Global Assets)

如果你希望使用全局 state 和 getter,`rootState`和`rootGetters`会作为第三和第四参数传入 getter,也会通过 context 对象的属性传入 action

若需要在全局命名空间内分发 action 或提交 mutation,将{ root:true }作为第三参数传给`dispatch` 或 `commit`即可.

```
modules:{
  foo: {
    namespaced: true,

    getters: {
      //在这个模块的getter中,`getter`被局部化了
      //你可以使用getter的第四个参数来调用`rootGetters`
      someGetter(state,getters,rootState,rootGetters){
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
        rootGetters['bar/someOtherGetter'] // -> 'bar/someOtherGetter'
      },
      //其他getter
      someOtherGetter: state => { ... }
    },
    actions: {
      //在这个模块中, dispatch 和 commit 也被局部化了
      //他们可以接受`root`属性以访问根 dispatch 或 commit
      someAction({ dispatch, commit, getters, rootGetters }){
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        rootGetters['bar/someGetter'] // -> 'bar/someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('foo/someOtherAction',null) // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root:true })// -> 'someMutation'

        commit('someMutation')// -> 'foo/someMutation'
        commit('foo/someOtherAction',null) // -> 'foo/someOtherAction
        commit('someMutation', null, { root:true })// -> 'someMutation'
      },
      //其他action
      someOtherAction(ctx,payload){ ... }
    }
  }
}
```

> 这里需要注意的是，在组件中通过useStore实例化的store，可以通过以上同样的方式进行访问模块的状态

~~~
import { useStore } from 'vuex'
const store = useStore()
const ArrayList = computed(()=>store.state.moduleA.arraysList)
const filterList = computed(()=>store.getters['moduleA/filterList'])
//异步获取模块moduleA中的asyncList
const dealFn = computed(()=>store.dispatch('moduleA/asyncList',null))
//异步获取根store的asyncList
const dealFn = computed(()=>store.dispatch('asyncList',null,{ root:true }))
//同步获取模块moduleA中的asyncList
const dealFn = computed(()=>store.commit('moduleA/asyncList',null))
//同步获取根store的asyncList
const dealFn = computed(()=>store.commit('asyncList',null,{ root:true }))

~~~



#### 在带命名空间的模块注册全局 action

若需要在带命名空间的模块注册全局 action,你可以添加`root:true`,并将这个 action 的定义放在函数`handler`中,例如:

```
{
  action:{
    someOtherAction({dispatch}){
      dispatch('someAction')
    }
  },
  modules:{
    foo: {
      namespaced: true,
      actions: {
        someAction :{
          root: true,
          handler (namespaceContext,payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

#### 带命名空间的绑定函数

当使用`mapState`、`mapGetters`、`mapActions`、`mapMutations` 这些函数来绑定带命名空间的模块时,写起来可能比较繁琐:
文档:
https://vuex.vuejs.org/zh/guide/modules.html#%E5%B8%A6%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E7%9A%84%E7%BB%91%E5%AE%9A%E5%87%BD%E6%95%B0
不过这里我们可以不用学,因为 Vue3.x 已经弃用了这些函数!

#### 给插件开发者的注意事项

如果你开发的插件(Plugin)提供了模块并允许用户将其添加到 Vuex store,可能需要考虑模块的空间名称问题.对于这种情况,你可以通过插件的参数对象来允许用户指定空间名称:

```
//通过插件的参数对象得到空间名称
//然后返回Vuex插件函数
export function createPlugin(options = {}){
  return function(store){
    //把空间名字添加到插件模块的类型(type)中去
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

#### 模块动态注册

在 store 创建**之后**,你可以使用 store.registerModule 方法注册模块:

```
import { createStore } from 'vuex'

const store = createStore({ /* 选项 */ })

//注册模块`myModule`
store.registerModule('myModule',{

})

//注册模块模板 `nested/myModule`
store.registerModule(['nested','myModule'],{

})
```

之后就可以通过 `store.state.myModule` 和 `store.state.nested.myModule`访问**其他模块**的状态.

模块动态注册功能使得其他 Vue 插件可以通过在 store 中附加新模块的方式来使用 Vuex 管理状态.例如,`vuex-router-sync` 插件就是通过动态注册模块将 Vue Router 和 Vuex 结合在一起,实现应用的路由状态管理.

你也可以使用 `store.unregisterModule(moduleName)` 来动态卸载模块.注意,你不能使用此方法卸载静态模块(即创建 store 时声明的模块).

注意,你可以通过 store.hasModule(moduleName) 方法检查是否已经被注册到 store,需要记住的是,嵌套模块应该以数组形式传递给`registerModule`和`hasModule`,而不是以路径字符串的形式传递给 module.

#### 保留 state

在注册一个新 module 时,你很可能想保留过去的 state,例如从一个服务端渲染的应用保留 state.你可以通过`preseveState`选项将其归档:`store.registerModule('a',module, { preserveStae: true })`.
当你设置`preserveState: true`时,该模块会被注册,action、mutation 和 getter 会被添加到 store 中,但是 state 不会.这里假设 store 的 state 已经包含了这个 module 的 state 并且你不希望将其覆写.

#### 模块重用

有时我们可能需要创建一个模块的多个实例,例如:

- 创建多个 store,他们公用同一个模块(例如当 `runInNewContext`选项是`false`或`once`时,为了避免<a src="https://ssr.vuejs.org/en/structure.html#avoid-stateful-singletons">在服务端渲染中避免有状态的单例</a>)
- 在一个 store 中多次注册同一个模块

如果我们使用一个纯对象来声明模块的状态,那么这个状态对象会通过引用被共享,导致状态对象被修改时 stoer 或模块间数据互相污染的问题

实际上这和 Vue 组件内的`data`是相同的问题.因此解决方法也是相同的-----使用一个函数来声明模块状态(仅 2.3.0+支持):

```
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  })
  // mutation、action 和 getter等等
}
```

### 项目结构

Vuex 并不限制你的代码结构.但是,它规定了一些需要遵守的规则
1、应用层级的状态应该集中到单个 store 对象中
2、提交 mutation 是更改状态的唯一方法,并且这个过程是同步的
3、异步逻辑都应该封装 action 里面

只要你遵守以上规则,如何组织代码随你便.如果你的 store 文件太大,只需将 action、mutation 和 getter 分割到单独的文件中

对于大型应用,我们会希望把 Vuex 相关代码分割到模块中.下面是项目结构示例:

```
├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块
```

请参考<a src="https://github.com/vuejs/vuex/tree/4.0/examples/classic/shopping-cart">购物车示例</a>
