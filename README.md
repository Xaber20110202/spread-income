# spread-income

此项目包含

1. 获取等额本金每月还款额的函数 `getAverageCapitalRepaymentByMonth`
2. 获取等额本息某月还款额的函数 `getAverageCapitalPlusInterestRepaymentPerMonth`
3. 以及理财与银行贷款之间利差收益情况的函数 `getSpreadIncome`

具体API 直接见：[index.js](https://github.com/Xaber20110202/spread-income/blob/master/index.js)

## 关于贷款方式

最主要的就是等额本金和等额本息。

1. 等额本金：是在还款期内把贷款数总额等分，每月偿还同等数额的本金和剩余贷款在该月所产生的利息，这样由于每月的还款本金额固定，而利息越来越少，借款人起初还款压力较大，但是随时间的推移每月还款数也越来越少。例如 120000 的 一年期 5%利率的贷款，每月本金固定还款是 10000，第一个月利息是 120000 * (0.05 / 12) = 500，第二个月利息是 110000 * (0.05 / 12) = 458.33333333。每个月还款的本金固定，最终还款利息为 3250 RMB
2. 等额本息：指在还款期内，每月偿还同等数额的贷款(包括本金和利息)。这个算法比较特别，**每月还款额 = 贷款本金×[月利率×（1＋月利率）^还款期数]÷[（1＋月利率）^还款期数－1]** 略过不表。同样的例子：120000 的 一年期 5%利率的贷款，每月还款额为 10272.9，最终还款利息为 10272.9 * 12 - 120000 = 3274.8 RMB

## 两个有意思的现象


### 收益持平
在理财年化收益与贷款利率持平的情况下，无论等额本息还是等额本金，最终得到的都是 0

```
const a1 = getSpreadIncome({
  totalMoney: 2000000,
  totalLoan: 2000000,
  interestRate: 4.9,
  financialRate: 4.9,
  loanType: 'interest',
  years: 30,
})
console.log('房贷利率等额本息', a1) // 3.61

const a2 = getSpreadIncome({
  totalMoney: 2000000,
  totalLoan: 2000000,
  interestRate: 4.9,
  financialRate: 4.9,
  loanType: 'capital',
  years: 30,
})
console.log('房贷利率等额本金', a2) // -0.02
```

这可能就意味着，如果不能维持30年平均年化收益与银行贷款持平，其实是亏钱的。

不过这里又涉及到机会成本，假如不限购时买房9万首付，总价30万，买完后一年上涨到60万，卖掉后收入60万，还掉贷款21万以及扣除这一年利息，大概净赚30万不到一些。

此时年化达到 333%，这基本等于可以忽略银行30年贷款利息了

当然，这里谈的是买房投资，其他投资也是一样的


### 等额本金与等额本息对应不同理财收益情况

1. 上面的收益持平，是在理财年化收益与贷款利率持平的情况下，那无论等额本息、等额本金，其实都是一样的 0
2. 如果理财收益和贷款利率有差异，那差距就会比较大

```
const b1 = getSpreadIncome({
  totalMoney: 2000000,
  totalLoan: 2000000,
  interestRate: 4.9,
  financialRate: 4,
  loanType: 'interest',
  years: 30,
})
console.log('房贷利率等额本息', b1) // -666493.56

const b2 = getSpreadIncome({
  totalMoney: 2000000,
  totalLoan: 2000000,
  interestRate: 4.9,
  financialRate: 4,
  loanType: 'capital',
  years: 30,
})
console.log('房贷利率等额本金', b2) // -538861.58

// 如果目前利率等额本息
const b3 = getSpreadIncome({
  totalMoney: 2000000,
  totalLoan: 2000000,
  interestRate: 4.9,
  financialRate: 6,
  loanType: 'interest',
  years: 30,
})
console.log('房贷利率等额本息', b3) // 1382695.37

const b4 = getSpreadIncome({
  totalMoney: 2000000,
  totalLoan: 2000000,
  interestRate: 4.9,
  financialRate: 6,
  loanType: 'capital',
  years: 30,
})
console.log('房贷利率等额本金', b4) // 1185160.38
```

所以，结论是：

1. 在贷款利率一致的情况下，不需要纠结两边哪个还的利息多，而是应该考虑自己的理财收益、以及愿不愿意为机会成本保留多一些资金
2. 不要把贷款认为只是 “借钱 - 还钱还利息”，它也可以是 “借钱 - 用钱去做生产、投资获得收益 - 还钱还利息 - 留下其他资金作为收益回报”，并且这里不限于房贷，也可以是其他经营性贷款 等等等等
3. 等额本息适合运气更好的、理财能力更强、理财收益更高的
4. 而贷款利率越高，理财收益情况越小于利率，等额本息相比等额本金的贷款方式，亏得更多

其实就是两极分化，看贷款人更适合哪一种