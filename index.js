var toFixMoney = money => parseFloat((Math.round(money * 100) / 100).toFixed(2))

/**
 * 获取等额本息每月还款金额
 * @param   options.totalLoan    贷款总额
 * @param   options.interestRate 贷款利率 格式例如 4.9
 * @param   options.years        贷款年限
 * @return                       每月还款金额
 */
var getAverageCapitalPlusInterestRepaymentPerMonth = ({ totalLoan, interestRate, years }) => {
  const interestRatePerMonth = interestRate / 100 / 12
  const months = years * 12

  // 每月还款额 = 贷款本金×[月利率×（1＋月利率）^还款期数]÷[（1＋月利率）^还款期数－1]
  const reimbursementAmount = totalLoan *
    (interestRatePerMonth * Math.pow(1 + interestRatePerMonth, months)) /
    (Math.pow(1 + interestRatePerMonth, months) - 1)

  return toFixMoney(reimbursementAmount)
}

/**
 * 获取等额本金某月还款金额
 * @param   options.totalLoan    贷款总额
 * @param   options.interestRate 贷款利率 格式例如 4.9
 * @param   options.years        贷款年限
 * @param   month                贷款月份 - 需获取第几个月的还款金额
 * @return                       该月份还款金额
 */
var getAverageCapitalRepaymentByMonth = ({ totalLoan, interestRate, years }, month) => {
  const months = years * 12
  const capitalPerMonth = totalLoan / months
  const loanRemaining = totalLoan - month * capitalPerMonth
  const interest = loanRemaining * (interestRate / 100) / 12
  return toFixMoney(capitalPerMonth + interest)
}

/**
 * 获取理财收益 - 每月还贷，最终贷款还清后收益情况
 * @param   options.totalMoney    现有的钱
 * @param   options.totalLoan     贷款总额
 * @param   options.interestRate  贷款利率 格式例如 4.9
 * @param   options.loanType      贷款类型 - capital: 等额本金 / interest: 等额本息
 * @param   options.years         贷款年限
 * @param   options.financialRate 理财利率 格式例如 4.9
 * @return                        最终收益情况
 */
var getSpreadIncome = ({ totalMoney, totalLoan, interestRate, loanType, years, financialRate }) => {
  let remainingMoney = totalMoney
  const isCapital = loanType === 'capital'
  const months = years * 12
  const repaymentForACPI = getAverageCapitalPlusInterestRepaymentPerMonth({
    totalLoan, interestRate, years,
  })

  for (let m = 0; m < months; m += 1) {
    const repayment = isCapital ? getAverageCapitalRepaymentByMonth({
      totalLoan,
      interestRate,
      years,
    }, m) : repaymentForACPI
    const financialIncome = remainingMoney > 0 ? remainingMoney * (financialRate / 100) / 12 : 0
    const netIncome = financialIncome - repayment

    // console.log('month', m)
    // console.log('repayment', repayment)
    // console.log('financialIncome', financialIncome)
    // console.log('netIncome', netIncome)

    remainingMoney = remainingMoney + netIncome
  }

  return toFixMoney(remainingMoney)
}