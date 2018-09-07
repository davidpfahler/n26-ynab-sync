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

module.exports.sync = async () => {
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
    return "no transactions to sync";
  }

  const transactions = rawTransactions.map(t => ({
    account_id: N26_YNAB_ACCOUNT,
    date: new Date(t.confirmed).toISOString().split("T")[0],
    amount: t.amount * 1000,
    memo: t.merchantName || t.referenceText || t.partnerName,
    cleared: "cleared",
    approved: false,
    import_id: t.id
  }));

  const ynabAPI = new ynab.API(YNAB_TOKEN);
  await ynabAPI.transactions.bulkCreateTransactions(N26_YNAB_BUDGET, {
    transactions
  });

  return transactions.length;
};
