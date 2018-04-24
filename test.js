
const assert = require('assert')
var ltypes = require('./types')
var Amount = ltypes.Amount
var Balance = ltypes.Balance
var Account = ltypes.Account

describe('ledger-types', function () {
  describe('Amount', function () {
    it('constructor', function() {
      var amt = new Amount(1.111111, 'GULD')
      assert(amt.commodity === 'GULD')
      assert(amt.value == 1.111111)
    })

    it('add', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'GULD')
      var amt3 = amt.add(amt2)
      assert(amt3.value == 3)
    })

    it('add mismatched commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'USD')
      try {
        var amt3 = amt.add(amt2)
        assert(amt3 === undefined)
      } catch (e) {
        if (e instanceof TypeError) {
          return
        } else {
          throw e
        }
      }
    })

    it('subtract', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'GULD')
      var amt3 = amt2.sub(amt)
      assert(amt3.value == 0.777778)

    })

    it('sub mismatched commodities', function() {
      var amt = new Amount(1.111111)
      var amt2 = new Amount(1.888889, 'USD')
      try {
        var amt3 = amt.sub(amt2)
        assert(amt3 === undefined)
      } catch (e) {
        if (e instanceof TypeError) {
          return
        } else {
          throw e
        }
      }
    })

    it('mul', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(2, 'GULD')
      var amt3 = amt2.mul(amt)
      assert(amt3.value == 2.222222)
      // associative
      assert(amt3.equals(amt.mul(amt2)))
    })

    it('mul mismatched commodities', function() {
      var amt = new Amount(1.111111)
      var amt2 = new Amount(1.888889, 'USD')
      try {
        var amt3 = amt.sub(amt2)
        assert(amt3 === undefined)
      } catch (e) {
        if (e instanceof TypeError) {
          return
        } else {
          throw e
        }
      }
    })

    it('equals', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt2.equals(amt))
    })

    it('equals mismatched commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'USD')
      assert(!amt.equals(amt2))
    })
  })

  describe('Balance', function () {
    it('constructor', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'USD')
      var bal = new Balance({'GULD': amt, 'USD': amt2})
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal.USD.commodity === 'USD')
      assert(bal.USD.value == 1.888889)
    })

    it('construct from amount', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
    })

    it('add Amount same commodity', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'GULD')
      var bal2 = bal.add(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value == 3)
    })

    it('add Amount new commodity', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = bal.add(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
    })

    it('add Balance same commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'GULD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.add(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value == 1.888889)
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value == 3)
    })

    it('add Balance new commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.add(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value == 1.111111)
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value == 1.888889)
    })

    it('add Balance mixed commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance({GULD: new Amount(1.888889, 'GULD'), USD: amt2})
      var bal3 = bal.add(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value == 3)
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value == 1.888889)
    })

    it('sub Amount same commodity', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'GULD')
      var bal = new Balance(amt2)
      var bal2 = bal.sub(amt)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.888889)
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value == 0.777778)
    })

    it('sub Amount new commodity', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = bal.sub(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == -1.888889)
    })

    it('sub Balance same commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'GULD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.sub(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value == 1.888889)
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value == -0.777778)
    })

    it('sub Balance new commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.sub(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value == 1.111111)
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value == -1.888889)
    })

    it('sub Balance mixed commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance({GULD: new Amount(1.888889, 'GULD'), USD: amt2})
      var bal3 = bal.sub(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value == -0.777778)
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value == -1.888889)
    })

    it('mul Amount same commodity', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(2, 'GULD')
      var bal2 = bal.mul(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value == 2.222222)
    })

    it('mul Amount new commodity', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(2, 'USD')
      var bal2 = bal.mul(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value == 1.111111)
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value == 1.111111)
      assert(!bal2.hasOwnProperty('USD'))
    })

    it('mul Balance', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance(amt2)
      try {
        var bal3 = bal.mul(bal2)
        assert(bal3 === undefined)
      } catch (e) {
        if (e instanceof TypeError) {
          return
        } else {
          throw e
        }
      }
    })

    it('equal Balance', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt)
      assert(bal.equals(bal2))
    })

    it('unequal Balances same commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(2.222222, 'GULD')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt2)
      assert(!bal.equals(bal2))
    })

    it('unequal Balance different commodities', function() {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'USD')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt2)
      assert(!bal.equals(bal2))
      assert(!bal2.equals(bal))
    })
  })

  describe('Account', function () {
    it('constructor', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      assert(acct._bal().equals(bal))
      assert(acct.isysd._bal().equals(bal))
      assert(acct.isysd.Assets._bal().equals(bal))
    })
    it('_add subaccounts hierarchically', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      acct._add(bal, ['isysd'])
      assert(acct._bal().equals(bal))
      assert(acct.isysd._bal().equals(bal))
      assert(acct.isysd.Assets._bal().equals(bal))
    })

    it('_add matching subaccount', function() {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(-1.111111, 'GULD')
      var bal2 = new Balance(amt2)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      acct._add(bal2, ['isysd', 'Liabilities', 'subacct'])
      var zero = new Balance(new Amount(0, 'GULD'))
      assert(acct._bal().equals(zero))
      assert(acct.isysd._bal().equals(zero))
      assert(acct.isysd.Assets._bal().equals(bal))
      assert(acct.isysd.Liabilities._bal().equals(bal2))
      assert(acct.isysd.Liabilities.subacct._bal().equals(bal2))
    })
  })
})
