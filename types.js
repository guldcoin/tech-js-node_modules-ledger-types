/* global Decimal:false */
/**
 * @module ledger-types
 * @license MIT
 * @author zimmi
 */

function createDecimal (dec) {
  var val = new Decimal(0)
  val.d = dec.d
  val.e = dec.e
  val.s = dec.s
  return val
}

class Amount {
  constructor (amount, commodity) {
    if (amount instanceof Decimal) this.value = amount
    else this.value = new Decimal(`${amount}`)
    this.commodity = commodity || ''
  }

  static create (amt) {
    if (amt instanceof Amount) return amt
    else return new Amount(createDecimal(amt.value), amt.commodity)
  }

  hasSameCommodity (amount) {
    if (!amount.hasOwnProperty('commodity') || this.commodity !== amount
      .commodity) {
      return false
    } else return true
  }

  add (amount) {
    if (this.hasSameCommodity(amount)) {
      return new Amount(this.value.add(
        amount.value), this.commodity)
    }
  }

  sub (amount) {
    if (this.hasSameCommodity(amount)) {
      return new Amount(this.value.sub(
        amount.value), this.commodity)
    }
  }

  mul (amount) {
    if (this.hasSameCommodity(amount)) {
      return new Amount(this.value.mul(
        amount.value), this.commodity)
    }
  }

  div (amount) {
    if (this.hasSameCommodity(amount)) {
      return new Amount(this.value.div(
        amount.value), this.commodity)
    }
  }

  equals (amount) {
    if (this.hasSameCommodity(amount)) {
      return this.value.equals(amount.value)
    } else {
      throw new TypeError(
        'Cannot compare amounts of different commodities')
    }
  }

  greaterThan (amount) {
    if (this.hasSameCommodity(amount)) {
      this.hasSameCommodity(amount)
      return this.value.greaterThan(amount.value)
    } else {
      throw new TypeError(
        'Cannot compare amounts of different commodities')
    }
  }

  greaterThanOrEqualTo (amount) {
    if (this.hasSameCommodity(amount)) {
      this.hasSameCommodity(amount)
      return this.value.greaterThanOrEqualTo(amount.value)
    } else {
      throw new TypeError(
        'Cannot compare amounts of different commodities')
    }
  }

  lessThan (amount) {
    if (this.hasSameCommodity(amount)) {
      this.hasSameCommodity(amount)
      return this.value.lessThan(amount.value)
    } else {
      throw new TypeError(
        'Cannot compare amounts of different commodities')
    }
  }

  lessThanOrEqualTo (amount) {
    if (this.hasSameCommodity(amount)) {
      this.hasSameCommodity(amount)
      return this.value.lessThanOrEqualTo(amount.value)
    } else {
      throw new TypeError(
        'Cannot compare amounts of different commodities')
    }
  }
}

class Balance {
  constructor (amounts) {
    if (amounts instanceof Amount) this[amounts.commodity] = amounts
    else Object.assign(this, amounts)
  }

  static create (bal) {
    if (bal instanceof Balance) return bal
    else {
      var balance = new Balance({})
      Object.keys(bal).forEach(b => {
        if (b.indexOf('_') === -1) {
          balance = balance.add(Amount.create(bal[b]))
        }
      })
      return balance
    }
  }

  addAmount (amount) {
    var newBal = new Balance(this)
    if (this.hasOwnProperty(amount.commodity)) {
      newBal[amount.commodity] =
            newBal[amount.commodity].add(amount)
    } else newBal[amount.commodity] = amount
    return newBal
  }

  add (bal) {
    if (bal instanceof Amount) return this.addAmount(bal)
    else {
      var newBal = new Balance(this)
      Object.keys(bal).forEach(commodity => {
        newBal = newBal.addAmount(bal[commodity])
      })
      return newBal
    }
  }

  subAmount (amount) {
    var newBal = new Balance(this)
    if (this.hasOwnProperty(amount.commodity)) {
      newBal[amount.commodity] =
            newBal[amount.commodity].sub(amount)
    } else newBal[amount.commodity] = amount.mul(new Amount(-1, amount.commodity))
    return newBal
  }

  sub (bal) {
    if (bal instanceof Amount) return this.subAmount(bal)
    else {
      var newBal = new Balance(this)
      Object.keys(bal).forEach(commodity => {
        newBal = newBal.subAmount(bal[commodity])
      })
      return newBal
    }
  }

  mulAmount (amount) {
    var newBal = new Balance(this)
    if (this.hasOwnProperty(amount.commodity)) {
      newBal[amount.commodity] =
            newBal[amount.commodity].mul(amount)
    }
    return newBal
  }

  mul (bal) {
    if (bal instanceof Amount) return this.mulAmount(bal)
    else {
      throw new TypeError(
        'Balances can only be multiplied by Amounts')
    }
  }

  divAmount (amount) {
    var newBal = new Balance(this)
    if (this.hasOwnProperty(amount.commodity)) {
      newBal[amount.commodity] =
            newBal[amount.commodity].div(amount)
    }
    return newBal
  }

  div (bal) {
    if (bal instanceof Amount) return this.divAmount(bal)
    else throw new TypeError('Balances can only be divided by Amounts')
  }

  equals (bal) {
    var mykeys = Object.keys(this)
    if (mykeys.length !== Object.keys(bal).length) return false
    else {
      var allEqual = true
      mykeys.forEach(key => {
        if (!bal.hasOwnProperty(key) || !this[key].equals(
          bal[key])) allEqual = false
      })
      return allEqual
    }
  }

  commodities () {
    return Object.keys(this).filter(key => {
      return !key.startsWith('_')
    })
  }
}

class Account {
  constructor (bal) {
    this.__bal = bal || new Balance({})
  }

  static create (acct) {
    if (acct instanceof Account) return acct
    else {
      var account = new Account(new Balance({}))
      Object.keys(acct).forEach(act => {
        if (act === '__bal') {
          account.__bal = Balance.create(acct[act])
        } else if (act.indexOf('_') === -1) {
          account[act] = Account.create(acct[act])
        }
      })
      return account
    }
  }

  static createFromEquity (equity) {
    var account = new Account(new Balance({}))
    equity = equity.split('\n').slice(1)
    for (var l in equity) {
      var linea = equity[l].trim().split(' ').filter(lp => lp !== '')
      if (linea && linea.length > 0) {
        var amt = new Amount(...linea.slice(-2))
        var acpath = linea[0].split(':')
        account._add(new Balance(amt), acpath)
      }
    }
    return account
  }

  _add (bal, path) {
    var parent = this
    var current
    while (path.length > 0) {
      current = path.shift()
      if (parent.hasOwnProperty(current)) {
        parent[current].__bal = parent[current].__bal.add(bal)
      } else {
        parent[current] = new Account(bal)
      }
      parent = parent[current]
    }
  }

  _bal () {
    if (this.hasOwnProperty('__bal') && !this.__bal.equals(new Balance({}))) {
      return this.__bal
    } else {
      var chkeys = Object.keys(this)
      this.__bal = new Balance({})
      if (chkeys.length > 0) {
        chkeys.forEach(child => {
          if (!child.startsWith('_')) {
            this.__bal = this.__bal
              .add(this[child]._bal())
          }
        })
      }
      return this.__bal
    }
  }
}

function filterPricesByTime (line) {
  if (!line.startsWith('P ')) return false
  else {
    var pdate = line.substring(2, 12)
    var apdate = pdate.split('/')
    pdate = `${apdate[1]}/${apdate[2]}/${apdate[0]} 00:00:00 GMT+00:00`
    var now = Date.now()
    var ptime = new Date(pdate).getTime()
    if (now >= ptime) {
      return true
    } else return false
  }
}

const commodity = {
  /* getCommodityPrice: async function (commodity, quote, oname) {
    fs = fs || await getFS()
    if (typeof commodity === 'undefined') commodity = 'GULD'
    if (typeof quote === 'undefined') quote = 'USD'
    if (!oname) {
      if (global.observer && global.observer.name) oname = global.observer.name
      else oname = 'guld'
    }
    commodity = commodity.toUpperCase()
    // TODO make default exchange configurable
    if (commodity === 'GULD') return fs.readFile(path.join(home, 'market', quote, commodity, 'prices', 'guld-core.dat'), 'utf-8')
    else return fs.readFile(path.join(home, 'market', quote, commodity, 'prices', 'coinmarketcap.dat'), 'utf-8')
  }, */
  parseCommodityPrice: function (pricef, commodity = 'GULD', quote = 'USD') {
    var pricefl
    var pricea
    var amtstr
    var re
    commodity = commodity.toUpperCase()
    quote = quote.toUpperCase()
    pricef = pricef.split('\n').reverse()
    pricefl = pricef.filter(filterPricesByTime)
    var res = `[0-9.]*[ ]{0,1}${quote}$`.replace(commodity, '')
    re = new RegExp(res, 'm')
    pricea = re.exec(pricefl.join('\n'))
    if (pricea && pricea.length > 0 && pricea[0].length > 0) {
      amtstr = pricea[0].replace(commodity, '').trim()
      var amt = amtstr.replace(quote, '').trim()
      return new Amount(amt, quote)
    } else throw new RangeError(`Price not found for commodity ${commodity}`)
  }
}

class Transaction {
  constructor (text) {
    this.raw = text
  }

  static getType (tx) {
    var re = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2} \* [ a-zA-Z0-9]*$/m
    var txheader = re.exec(tx)
    if (txheader && txheader.length > 0 && txheader[0].length > 0) {
      return txheader[0].split('*')[1].trim()
    } else {
      throw new TypeError('expected a ledger transaction, but found unknown type')
    }
  }

  static getTimestamp (tx) {
    var re = /^ {4}; (timestamp|START_TIME): [0-9]+$/m
    var txheader = re.exec(tx)
    if (txheader && txheader.length > 0 && txheader[0].length > 0) {
      return txheader[0].split(':')[1].trim()
    } else {
      throw new TypeError('expected a ledger transaction, but found unknown type')
    }
  }

  static getAmount (tx) {
    var re = /^ +[:a-zA-Z-]+ +[0-9a-zA-Z,. -]+$/m
    var txheader = re.exec(tx)
    if (txheader && txheader.length > 0 && txheader[0].length > 0) {
      var posting = txheader[0].replace(',', '')
      re = /[0-9.-]+/
      txheader = re.exec(posting)
      if (txheader && txheader.length > 0 && txheader[0].length > 0) {
        return txheader[0]
      } else {
        throw new TypeError('expected a ledger transaction, but found unknown type')
      }
    } else {
      throw new TypeError('expected a ledger transaction, but found unknown type')
    }
  }
}

module.exports = {
  Amount: Amount,
  Balance: Balance,
  Account: Account,
  commodity: commodity,
  Transaction: Transaction
}
