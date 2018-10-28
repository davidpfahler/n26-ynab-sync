const N26 = require("n26");
const ynab = require("ynab");

require("dotenv").config();

const {
  YNAB_TOKEN,
  N26_YNAB_ACCOUNT,
  N26_YNAB_BUDGET,
  N26_EMAIL,
  N26_PASSWORD
} = process.env;

module.exports.sync = async (event, context, callback) => {
  console.log(`Starting sync on ${new Date()}.`);
  const tresholdAgo = Date.now() - 360000;
  const n26 = await new N26(N26_EMAIL, N26_PASSWORD);

  const rawTransactions = (await n26.transactions({
    limit: 10
  }))
    // get the transactions from the last 6minutes
    // this lambda will run every 5min
    // so we get everything since it ran last (+ buffer)
    // not a perfect filtering mechanism, but it's stateless ¯\_(ツ)_/¯
    .filter(t => t.confirmed > tresholdAgo);

  if (!rawTransactions.length) {
    callback(null, "No transactions to sync. Done.");
  }

  console.log("rawTransactions: " + JSON.stringify(rawTransactions));

  const transactions = rawTransactions.map(t => ({
    account_id: N26_YNAB_ACCOUNT,
    date: new Date(t.confirmed).toISOString().split("T")[0],
    amount: t.amount * 1000,
    memo: t.merchantName || t.referenceText || t.partnerName,
    cleared: "cleared",
    approved: false,
    import_id: t.id
  }));

  // log transactions so we can inspect them later
  console.log("transactions: " + JSON.stringify(transactions));

  const ynabAPI = new ynab.API(YNAB_TOKEN);
  try {
    await ynabAPI.transactions.bulkCreateTransactions(N26_YNAB_BUDGET, {
      transactions
    });
  } catch (err) {
    callback(err);
  }

  callback(null, `${transactions.length} transactions synced. Done.`);
};
