const os = require('os')
const path = require('path')
const assert = require('assert')
require('guld-import')
const glob = require(getLocalPath('gap://tech/js/node_modules/glob-promise'))
const math = require(getLocalPath('gap://tech/js/node_modules/mathjs/index.js'))
var ltypes = require('ledger-types')
var Amount = ltypes.Amount
var Balance = ltypes.Balance
var Account = ltypes.Account

describe('ledger-types', function () {
  describe('Amount', function () {
    it('constructor', function() {
      var amt = new Amount(1.111111, 'guld')
      assert(amt.commodity === 'guld')
      assert(amt.value == 1.111111)
    })

    it('add', function() {
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(1.888889, 'guld')
      var amt3 = amt.add(amt2)
      assert(amt3.value == 3)
    })

    it('add mismatched commodities', function() {
      var amt = new Amount(1.111111, 'guld')
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
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(1.888889, 'guld')
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
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(2, 'guld')
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
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(1.111111, 'guld')
      assert(amt2.equals(amt))
    })

    it('equals mismatched commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(1.111111, 'USD')
      assert(!amt.equals(amt2))
    })
  })

  describe('Balance', function () {
    it('constructor', function() {
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(1.888889, 'USD')
      var bal = new Balance({'guld': amt, 'USD': amt2})
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal.USD.commodity === 'USD')
      assert(bal.USD.value == 1.888889)
    })

    it('construct from amount', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
    })

    it('add Amount same commodity', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'guld')
      var bal2 = bal.add(amt2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.guld.commodity === 'guld')
      assert(bal2.guld.value == 3)
    })

    it('add Amount new commodity', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = bal.add(amt2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.guld.commodity === 'guld')
      assert(bal2.guld.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
    })

    it('add Balance same commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'guld')
      var bal2 = new Balance(amt2)
      var bal3 = bal.add(bal2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.guld.commodity === 'guld')
      assert(bal2.guld.value == 1.888889)
      assert(bal3.guld.commodity === 'guld')
      assert(bal3.guld.value == 3)
    })

    it('add Balance new commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.add(bal2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
      assert(bal3.guld.commodity === 'guld')
      assert(bal3.guld.value == 1.111111)
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value == 1.888889)
    })

    it('add Balance mixed commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance({guld: new Amount(1.888889, 'guld'), USD: amt2})
      var bal3 = bal.add(bal2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
      assert(bal3.guld.commodity === 'guld')
      assert(bal3.guld.value == 3)
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value == 1.888889)
    })

    it('sub Amount same commodity', function() {
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(1.888889, 'guld')
      var bal = new Balance(amt2)
      var bal2 = bal.sub(amt)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.888889)
      assert(bal2.guld.commodity === 'guld')
      assert(bal2.guld.value == 0.777778)
    })

    it('sub Amount new commodity', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = bal.sub(amt2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.guld.commodity === 'guld')
      assert(bal2.guld.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == -1.888889)
    })

    it('sub Balance same commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'guld')
      var bal2 = new Balance(amt2)
      var bal3 = bal.sub(bal2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.guld.commodity === 'guld')
      assert(bal2.guld.value == 1.888889)
      assert(bal3.guld.commodity === 'guld')
      assert(bal3.guld.value == -0.777778)
    })

    it('sub Balance new commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.sub(bal2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
      assert(bal3.guld.commodity === 'guld')
      assert(bal3.guld.value == 1.111111)
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value == -1.888889)
    })

    it('sub Balance mixed commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance({guld: new Amount(1.888889, 'guld'), USD: amt2})
      var bal3 = bal.sub(bal2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value == 1.888889)
      assert(bal3.guld.commodity === 'guld')
      assert(bal3.guld.value == -0.777778)
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value == -1.888889)
    })

    it('mul Amount same commodity', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(2, 'guld')
      var bal2 = bal.mul(amt2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.guld.commodity === 'guld')
      assert(bal2.guld.value == 2.222222)
    })

    it('mul Amount new commodity', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(2, 'USD')
      var bal2 = bal.mul(amt2)
      assert(bal.guld.commodity === 'guld')
      assert(bal.guld.value == 1.111111)
      assert(bal2.guld.commodity === 'guld')
      assert(bal2.guld.value == 1.111111)
      assert(!bal2.hasOwnProperty('USD'))
    })

    it('mul Balance', function() {
      var amt = new Amount(1.111111, 'guld')
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
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt)
      assert(bal.equals(bal2))
    })

    it('unequal Balances same commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(2.222222, 'guld')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt2)
      assert(!bal.equals(bal2))
    })

    it('unequal Balance different commodities', function() {
      var amt = new Amount(1.111111, 'guld')
      var amt2 = new Amount(1.111111, 'USD')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt2)
      assert(!bal.equals(bal2))
      assert(!bal2.equals(bal))
    })
  })

  describe('Account', function () {
    it('constructor', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      assert(acct._bal().equals(bal))
      assert(acct.isysd._bal().equals(bal))
      assert(acct.isysd.Assets._bal().equals(bal))
    })
    it('_add subaccounts hierarchically', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      acct._add(bal, ['isysd'])
      assert(acct._bal().equals(bal))
      assert(acct.isysd._bal().equals(bal))
      assert(acct.isysd.Assets._bal().equals(bal))
    })

    it('_add matching subaccount', function() {
      var amt = new Amount(1.111111, 'guld')
      var bal = new Balance(amt)
      var amt2 = new Amount(-1.111111, 'guld')
      var bal2 = new Balance(amt2)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      acct._add(bal2, ['isysd', 'Liabilities', 'subacct'])
      var zero = new Balance(new Amount(0, 'guld'))
      assert(acct._bal().equals(zero))
      assert(acct.isysd._bal().equals(zero))
      assert(acct.isysd.Assets._bal().equals(bal))
      assert(acct.isysd.Liabilities._bal().equals(bal2))
      assert(acct.isysd.Liabilities.subacct._bal().equals(bal2))
    })
  })
})
