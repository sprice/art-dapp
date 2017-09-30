A distributed art gallery.

Based on http://truffleframework.com/boxes/react


```
// Get started
$ npm install

// Run dev server
$ npm run start

// Compile contracts.
$ npm run compile

// Migrate contracts. First run `testrpc` or `geth`
$ npm run migrate
```

### Dev Workflow

* `$ npm run start` (own shell)
* `$ rm build/contracts/*`
* `$ npm run compile`
* `$ testrpc` (own shell)
* Copy available account details
* Set the `artist` in `2_deploy_contracts.js` as an address that you just copied
* `$ npm run migrate`
* Load up fresh Metamask (see gotchas below)
* Connect using mnemonic (this is the curator account)
* Add the account with the private key of the artist address
* Sign Work
* Set work for sale
* Unlist for sale
* Set for sale again
* Switch to a new metamask account with copied private key
* Buy artwork
* Switch to curator account
* Withdraw

### Dev Gotchas

* Sometimes the actions (sign, list, unlist, buy, withdraw) do not return expected output in promises (see current logging). Page refreshes usually help.
* When restarting `testrpc` connect Metamask to a different network and then back to the local network. If you don't do this weird things can happen.
