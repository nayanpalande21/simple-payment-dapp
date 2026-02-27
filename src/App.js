import { useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import {
  requestAccess,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

//  Horizon Testnet Server
const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

function App() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  //  CONNECT WALLET
  const connectWallet = async () => {
    try {
      await requestAccess();

      const { address } = await getAddress();
      setWallet(address);
      setMessage("");

      const account = await server.loadAccount(address);
      const nativeBalance = account.balances.find(
        (b) => b.asset_type === "native"
      );

      setBalance(nativeBalance ? nativeBalance.balance : "0");
    } catch (err) {
      console.log("FULL ERROR OBJECT:", err);
      console.log("HORIZON RESPONSE:", err.response?.data);

      setMessage(
        JSON.stringify(
          err.response?.data?.extras?.result_codes || err.message,
          null,
          2
        )
      );
    }
  }; 

  //  SEND XLM
  const sendXLM = async () => {
    if (!wallet) {
      setMessage(" Wallet not connected");
      return;
    }

    if (!StellarSdk.StrKey.isValidEd25519PublicKey(to)) {
      setMessage(" Invalid destination address");
      return;
    }

    if (wallet === to) {
      setMessage(" Cannot send to same account");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage(" Enter valid amount");
      return;
    }

    if (parseFloat(amount) + 0.00001 > parseFloat(balance)) {
      setMessage(" Insufficient balance");
      return;
    }

    try {
     
      const sourceAccount = await server.loadAccount(wallet);

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: to,
            asset: StellarSdk.Asset.native(),
            amount: amount.toString(),
          })
        )
        .setTimeout(30)
        .build();
const signed = await signTransaction(transaction.toXDR(), {
  networkPassphrase: StellarSdk.Networks.TESTNET,
});

const signedXDR = signed.signedTxXdr || signed;

const signedTx = StellarSdk.TransactionBuilder.fromXDR(
  signedXDR,
  StellarSdk.Networks.TESTNET
);

const result = await server.submitTransaction(signedTx);


      setMessage(` Transaction Successful! Hash: ${result.hash}`);

      const updatedAccount = await server.loadAccount(wallet);
      const nativeBalance = updatedAccount.balances.find(
        (b) => b.asset_type === "native"
      );
      setBalance(nativeBalance.balance);

    } catch (err) {
      console.error("FULL ERROR:", err.response?.data || err);

      setMessage(
        JSON.stringify(
          err.response?.data?.extras?.result_codes || err.message,
          null,
          2
        )
      );
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Stellar Testnet Payment </h1>

      {!wallet ? (
        <button onClick={connectWallet}>
          Connect Freighter Wallet
        </button>
      ) : (
        <>
          <p><b>Wallet:</b> {wallet}</p>
          <p><b>Balance:</b> {balance} XLM</p>

          <hr />

          <h3>Send XLM</h3>

          <input
            placeholder="Recipient Address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ width: "420px" }}
          />
          <br /><br />

          <input
            type="number"
            placeholder="Amount (XLM)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br /><br />

          <button onClick={sendXLM}>Send XLM</button>
        </>
      )}

      <p>{message}</p>
    </div>
  );
}

export default App;
