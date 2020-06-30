const toFixMoney = money => parseFloat((Math.round(money * 100) / 100).toFixed(2))

/**
 * 获取等额本息每月还款金额
 * @param   options.totalLoan    贷款总额
 * @param   options.interestRate 贷款利率 格式例如 4.9
 * @param   options.years        贷款年限
 * @return                       每月还款金额
 */
const getAverageCapitalPlusInterestRepaymentPerMonth = ({ totalLoan, interestRate, years }) => {
  const interestRatePerMonth = interestRate / 100 / 12
  const months = years * 12

  // 每月还款额 = 贷款本金×[月利率×（1＋月利率）^还款期数]÷[（1＋月利率）^还款期数－1]
  const reimbursementAmount = totalLoan *
    (interestRatePerMonth * Math.pow(1 + interestRatePerMonth, months)) /
    (Math.pow(1 + interestRatePerMonth, months) - 1)

  return toFixMoney(reimbursementAmount)
}

getAverageCapitalPlusInterestRepaymentPerMonth({ totalLoan: 200000, interestRate: 6, years: 3 })