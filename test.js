/* eslint-env node, mocha */

const assert = require('assert')
const Decimal = require('decimal.js')
global.Decimal = Decimal
var ltypes = require('./types.js')
var Amount = ltypes.Amount
var Balance = ltypes.Balance
var Account = ltypes.Account

describe('ledger-types', function () {
  describe('Amount', function () {
    it('constructor', function () {
      var amt = new Amount(1.111111, 'GULD')
      assert(amt.commodity === 'GULD')
      assert(amt.value.equals(Decimal(1.111111)))
    })

    it('add', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'GULD')
      var amt3 = amt.add(amt2)
      assert(amt3.value.equals(Decimal(3)))
    })

    it('add mismatched commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'USD')
      try {
        var amt3 = amt.add(amt2)
        assert(amt3 === undefined)
      } catch (e) {
        if (!(e instanceof TypeError)) {
          throw e
        }
      }
    })

    it('subtract', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'GULD')
      var amt3 = amt2.sub(amt)
      assert(amt3.value.equals(Decimal(0.777778)))
    })

    it('sub mismatched commodities', function () {
      var amt = new Amount(1.111111)
      var amt2 = new Amount(1.888889, 'USD')
      try {
        var amt3 = amt.sub(amt2)
        assert(amt3 === undefined)
      } catch (e) {
        if (!(e instanceof TypeError)) {
          throw e
        }
      }
    })

    it('mul', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(2, 'GULD')
      var amt3 = amt2.mul(amt)
      assert(amt3.value.equals(Decimal(2.222222)))
      // associative
      assert(amt3.equals(amt.mul(amt2)))
    })

    it('mul mismatched commodities', function () {
      var amt = new Amount(1.111111)
      var amt2 = new Amount(1.888889, 'USD')
      try {
        var amt3 = amt.sub(amt2)
        assert(amt3 === undefined)
      } catch (e) {
        if (!(e instanceof TypeError)) {
          throw e
        }
      }
    })

    it('equals', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt2.equals(amt))
    })

    it('equals mismatched commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'USD')
      try {
        amt2.greaterThan(amt)
        assert(true === false)
      } catch (err) {
        assert(err instanceof TypeError)
      }
    })

    it('greaterThan', function () {
      var amt = new Amount(1, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt2.greaterThan(amt))
    })

    it('greaterThan false', function () {
      var amt = new Amount(1, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt.greaterThan(amt2) === false)
    })

    it('greaterThan mismatched commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'USD')
      try {
        amt2.greaterThan(amt)
        assert(true === false)
      } catch (err) {
        assert(err instanceof TypeError)
      }
    })

    it('greaterThanOrEqualTo', function () {
      var amt = new Amount(1, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt2.greaterThanOrEqualTo(amt))
    })

    it('greaterThanOrEqualTo false', function () {
      var amt = new Amount(1, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt.greaterThanOrEqualTo(amt2) === false)
    })

    it('greaterThanOrEqualTo equal', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt.greaterThanOrEqualTo(amt2))
    })

    it('greaterThanOrEqualTo mismatched commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'USD')
      try {
        amt2.greaterThanOrEqualTo(amt)
        assert(true === false)
      } catch (err) {
        assert(err instanceof TypeError)
      }
    })

    it('lessThan', function () {
      var amt = new Amount(1, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt.lessThan(amt2))
    })

    it('lessThan false', function () {
      var amt = new Amount(1, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt2.lessThan(amt) === false)
    })

    it('lessThan mismatched commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'USD')
      try {
        amt2.lessThan(amt)
        assert(true === false)
      } catch (err) {
        assert(err instanceof TypeError)
      }
    })

    it('lessThanOrEqualTo', function () {
      var amt = new Amount(1, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt.lessThanOrEqualTo(amt2))
    })

    it('lessThanOrEqualTo false', function () {
      var amt = new Amount(1, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt2.lessThanOrEqualTo(amt) === false)
    })

    it('lessThanOrEqualTo equal', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'GULD')
      assert(amt.lessThanOrEqualTo(amt2))
    })

    it('lessThanOrEqualTo mismatched commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'USD')
      try {
        amt2.lessThanOrEqualTo(amt)
        assert(true === false)
      } catch (err) {
        assert(err instanceof TypeError)
      }
    })
  })

  describe('Balance', function () {
    it('constructor', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'USD')
      var bal = new Balance({
        'GULD': amt,
        'USD': amt2
      })
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal.USD.commodity === 'USD')
      assert(bal.USD.value.equals(Decimal(1.888889)))
    })

    it('construct from amount', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
    })

    it('add Amount same commodity', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'GULD')
      var bal2 = bal.add(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value.equals(Decimal(3)))
    })

    it('add Amount new commodity', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = bal.add(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value.equals(Decimal(1.888889)))
    })

    it('add Balance same commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'GULD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.add(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value.equals(Decimal(1.888889)))
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value.equals(Decimal(3)))
    })

    it('add Balance new commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.add(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value.equals(Decimal(1.888889)))
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value.equals(Decimal(1.111111)))
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value.equals(Decimal(1.888889)))
    })

    it('add Balance mixed commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance({
        GULD: new Amount(1.888889,
          'GULD'),
        USD: amt2
      })
      var bal3 = bal.add(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value.equals(Decimal(1.888889)))
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value.equals(Decimal(3)))
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value.equals(Decimal(1.888889)))
    })

    it('sub Amount same commodity', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.888889, 'GULD')
      var bal = new Balance(amt2)
      var bal2 = bal.sub(amt)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.888889)))
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value.equals(Decimal(0.777778)))
    })

    it('sub Amount new commodity', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = bal.sub(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value.equals(Decimal(-1.888889)))
    })

    it('sub Balance same commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'GULD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.sub(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value.equals(Decimal(1.888889)))
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value.equals(Decimal(-0.777778)))
    })

    it('sub Balance new commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance(amt2)
      var bal3 = bal.sub(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value.equals(Decimal(1.888889)))
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value.equals(Decimal(1.111111)))
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value.equals(Decimal(-1.888889)))
    })

    it('sub Balance mixed commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance({
        GULD: new Amount(1.888889,
          'GULD'),
        USD: amt2
      })
      var bal3 = bal.sub(bal2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.USD.commodity === 'USD')
      assert(bal2.USD.value.equals(Decimal(1.888889)))
      assert(bal3.GULD.commodity === 'GULD')
      assert(bal3.GULD.value.equals(Decimal(-0.777778)))
      assert(bal3.USD.commodity === 'USD')
      assert(bal3.USD.value.equals(Decimal(-1.888889)))
    })

    it('mul Amount same commodity', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(2, 'GULD')
      var bal2 = bal.mul(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value.equals(Decimal(2.222222)))
    })

    it('mul Amount new commodity', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(2, 'USD')
      var bal2 = bal.mul(amt2)
      assert(bal.GULD.commodity === 'GULD')
      assert(bal.GULD.value.equals(Decimal(1.111111)))
      assert(bal2.GULD.commodity === 'GULD')
      assert(bal2.GULD.value.equals(Decimal(1.111111)))
      assert(!bal2.hasOwnProperty('USD'))
    })

    it('mul Balance', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(1.888889, 'USD')
      var bal2 = new Balance(amt2)
      try {
        var bal3 = bal.mul(bal2)
        assert(bal3 === undefined)
      } catch (e) {
        if (!(e instanceof TypeError)) {
          throw e
        }
      }
    })

    it('equal Balance', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt)
      assert(bal.equals(bal2))
    })

    it('unequal Balances same commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(2.222222, 'GULD')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt2)
      assert(!bal.equals(bal2))
    })

    it('unequal Balance different commodities', function () {
      var amt = new Amount(1.111111, 'GULD')
      var amt2 = new Amount(1.111111, 'USD')
      var bal = new Balance(amt)
      var bal2 = new Balance(amt2)
      assert(!bal.equals(bal2))
      assert(!bal2.equals(bal))
    })
  })

  describe('Account', function () {
    it('constructor', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      assert(acct._bal().equals(bal))
      assert(acct.isysd._bal().equals(bal))
      assert(acct.isysd.Assets._bal().equals(bal))
    })
    it('_add subaccounts hierarchically', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      assert(acct._bal().equals(bal))
      assert(acct.isysd._bal().equals(bal))
      assert(acct.isysd.Assets._bal().equals(bal))
    })

    it('_add matching subaccount', function () {
      var amt = new Amount(1.111111, 'GULD')
      var bal = new Balance(amt)
      var amt2 = new Amount(-1.111111, 'GULD')
      var bal2 = new Balance(amt2)
      var acct = new Account()
      acct._add(bal, ['isysd', 'Assets'])
      acct._add(bal2, ['isysd', 'Liabilities',
        'subacct'
      ])
      var zero = new Balance(new Amount(0, 'GULD'))
      assert(acct._bal().equals(zero))
      assert(acct.isysd._bal().equals(zero))
      assert(acct.isysd.Assets._bal().equals(bal))
      assert(acct.isysd.Liabilities._bal().equals(
        bal2))
      assert(acct.isysd.Liabilities.subacct._bal()
        .equals(bal2))
    })
  })
})
