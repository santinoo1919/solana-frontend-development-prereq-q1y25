import BoilerPlate from "../../components/BoilerPlate";
import React, { useState, useEffect } from "react";
import * as web3 from "@solana/web3.js";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ExternalLinkIcon } from "@heroicons/react/outline";

const Starter = () => {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [txSig, setTxSig] = useState("");

  const outputs = [
    {
      title: "Account Balance",
      dependency: balance,
    },
    {
      title: "Transaction Signature",
      dependency: txSig,
      href: `https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
    },
  ];

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleTransaction = async () => {
    if (!connection || !publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    const txInfo = {
      /** The transaction fee payer */
      feePayer: publicKey,
      /** A recent blockhash */
      blockhash: blockhash,
      /** the last block chain can advance to before tx is exportd expired */
      lastValidBlockHeight: lastValidBlockHeight,
    };
    const transaction = new web3.Transaction(txInfo);
    const instruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      lamports: amount * web3.LAMPORTS_PER_SOL,
      toPubkey: new web3.PublicKey(account),
    });

    transaction.add(instruction);

    try {
      const signature = await sendTransaction(transaction, connection);
      setTxSig(signature);

      const newBalance = balance - amount;
      setBalance(newBalance);
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed!");
    }

    useEffect(() => {
      const getInfo = async () => {
        if (connection && publicKey) {
          const info = await connection.getAccountInfo(publicKey);
          setBalance(info!.lamports / web3.LAMPORTS_PER_SOL);
        }
      };
      getInfo();
    }, [connection, publicKey]);
  };

  return (
    <main className="bg-zinc-950 w-full min-h-screen text-white place-items-center py-16">
      <section className="p-16 w-full md:w-1/2 xl:w-1/3 gap-4 ">
        <form className="bg-zinc-900 rounded-md min-h-content p-4 border border-zinc-800">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl text-zinc-100">Send Sol 💸</h2>
          </div>
          <div className="mt-6">
            <h3 className="text-sm text-zinc-500">Address of receiver</h3>
            <input
              id="account"
              type="text"
              placeholder="Public key of receiver"
              className="text-[#9e80ff] py-1 w-full bg-transparent outline-none resize-none border border-transparent border-b-zinc-800"
              onChange={(event) => setAccount(event.target.value)}
            />
          </div>
          <div className="mt-6">
            <h3 className="text-sm text-zinc-500">Number amount</h3>
            <input
              id="amount"
              type="number"
              min={0}
              placeholder="Amount of SOL"
              className="text-[#9e80ff] py-1 w-full bg-transparent outline-none resize-none border border-transparent border-b-zinc-800"
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleTransaction();
            }}
            disabled={!account || !amount}
            className={`w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#fa6ece] bg-[#fa6ece] 
                rounded-md py-2 font-normal transition-all duration-300 hover:bg-[#fa6ece]/80 
                 `}
          >
            Submit
          </button>
          <div className="text-sm font-semibold mt-8 bg-white/[.05] rounded-lg p-2">
            <ul className="p-2">
              {outputs.map(({ title, dependency, href }, index) => (
                <li
                  key={title}
                  className={`flex justify-between items-center ${
                    index !== 0 && "mt-4"
                  }`}
                >
                  <p className="tracking-wider font-light text-zinc-500">
                    {title}
                  </p>
                  {dependency && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex text-[#80ebff] italic ${
                        href && "hover:text-white"
                      } transition-all duration-200`}
                    >
                      {dependency.toString().slice(0, 25)}
                      {href && <ExternalLinkIcon className="w-5 ml-1" />}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Starter;
