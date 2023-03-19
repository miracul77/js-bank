"use strict"

const account1 = {
  owner: "Vladimir Pishchugin",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
}

const account2 = {
  owner: "Dana Buturlakina",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
}

const account3 = {
  owner: "Ivan Popov",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
}

const account4 = {
  owner: "Igor Titov",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
}

const accounts = [account1, account2, account3, account4]

// Elements
const labelWelcome = document.querySelector(".welcome")
const labelDate = document.querySelector(".date")
const labelBalance = document.querySelector(".balance__value")
const labelSumIn = document.querySelector(".summary__value--in")
const labelSumOut = document.querySelector(".summary__value--out")
const labelSumInterest = document.querySelector(".summary__value--interest")
const labelTimer = document.querySelector(".timer")

const containerApp = document.querySelector(".app")
const containerMovements = document.querySelector(".movements")

const btnLogin = document.querySelector(".login__btn")
const btnTransfer = document.querySelector(".form__btn--transfer")
const btnLoan = document.querySelector(".form__btn--loan")
const btnClose = document.querySelector(".form__btn--close")
const btnSort = document.querySelector(".btn--sort")

const inputLoginUsername = document.querySelector(".login__input--user")
const inputLoginPin = document.querySelector(".login__input--pin")
const inputTransferTo = document.querySelector(".form__input--to")
const inputTransferAmount = document.querySelector(".form__input--amount")
const inputLoanAmount = document.querySelector(".form__input--loan-amount")
const inputCloseUsername = document.querySelector(".form__input--user")
const inputClosePin = document.querySelector(".form__input--pin")

function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = ""

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements
  movs.forEach((value, index) => {
    const type = value > 0 ? "deposit" : "withdrawal"
    const trans = value > 0 ? "зачисление" : "списание"
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${trans}
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">${value}₽</div>
        </div>
    `
    containerMovements.insertAdjacentHTML("afterbegin", html)
  })
}

function createLogIn(accs) {
  accs.forEach((acc) => {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map((val) => {
        return val[0]
      })
      .join("")
  })
}

createLogIn(accounts)

// Сумма и вывод на страницу общего баланса
function printBalance(acc) {
  const balance = acc.movements.reduce((acc, val) => {
    return acc + val
  })
  acc.balance = balance
  labelBalance.textContent = `${acc.balance} ₽`
}

// Сумма и вывод на страницу прихода и ухода
function countStonks(movements) {
  const stonks = movements
    .filter((val) => {
      return val > 0
    })
    .reduce((acc, val) => {
      return acc + val
    }, 0)

  const unStonks = movements
    .filter((val) => {
      return val < 0
    })
    .reduce((acc, val) => {
      return acc + val
    }, 0)
  labelSumIn.textContent = `${stonks} ₽`
  labelSumOut.textContent = `${Math.abs(unStonks)} ₽`
  labelSumInterest.textContent = `${stonks + unStonks} ₽`
}

function updateUi(acc) {
  displayMovements(acc.movements)
  printBalance(acc)
  countStonks(acc.movements)
}

let currentAccount
btnLogin.addEventListener("click", (e) => {
  e.preventDefault()
  currentAccount = accounts.find((acc) => {
    return acc.logIn === inputLoginUsername.value
  })

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100
    inputLoginUsername.value = inputLoginPin.value = ""
    console.log("Pin ok")
    updateUi(currentAccount)
  }
})

//Перевод денег на другой аккаунт
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault()
  const reciveAcc = accounts.find((acc) => {
    return acc.logIn === inputTransferTo.value
  })
  const amount = Number(inputTransferAmount.value)
  if (
    reciveAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciveAcc.logIn !== currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount)
    reciveAcc.movements.push(amount)
    updateUi(currentAccount)
    inputTransferTo.value = inputTransferAmount.value = ""
  }
})

btnClose.addEventListener("click", (e) => {
  e.preventDefault()
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex((acc) => {
      return acc.logIn === currentAccount.logIn
    })
    accounts.splice(index, 1)
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = ""
})

btnLoan.addEventListener("click", (e) => {
  e.preventDefault()
  const amount = Number(inputLoanAmount.value)
  if (amount > 0) {
    currentAccount.movements.push(amount)
    updateUi(currentAccount)
  }
  inputLoanAmount.value = ""
})

const overalBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0)

let sorted = false
btnSort.addEventListener("click", (e) => {
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted
})
