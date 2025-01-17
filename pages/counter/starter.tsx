import BoilerPlate from "../../components/BoilerPlate";
import React, { useState, useEffect } from "react";
import * as web3 from "@solana/web3.js";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import CounterIDL from "../../programs/idls/counter.json";
import { Counter } from "../../programs/types/counter";
import { Keypair, PublicKey } from "@solana/web3.js";

const Starter = () => {
  const [counterKey, setCounterKey] = useState("");
  const [count, setCount] = useState(0);
  const [txSig, setTxSig] = useState("");

  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();

  const provider = new AnchorProvider(
    connection,
    wallet?.adapter as unknown as NodeWallet,
    AnchorProvider.defaultOptions()
  );

  const counterProgram = new Program(
    CounterIDL as unknown as Counter,
    provider
  );

  const getPreparedTransaction = async () => {
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
    return transaction;
  };
  const handleInitializeCounter = async () => {
    if (!connection || !publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }
    const transaction = await getPreparedTransaction();
    const counterKeypair = Keypair.generate();
    const instruction = await counterProgram.methods
      .initialize()
      .accounts({
        payer: publicKey,
        counter: counterKeypair.publicKey,
      })
      .instruction();
    transaction.add(instruction);

    try {
      const signature = await provider.sendAndConfirm(
        transaction,
        [counterKeypair],
        {
          skipPreflight: true,
        }
      );
      setTxSig(signature);
      setCounterKey(counterKeypair.publicKey.toBase58());
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed!");
    }
  };

  const handleIncrementCounter = async () => {
    if (!connection || !publicKey) {
      toast.error("Please connect your wallet.");
      return;
    }

    const transaction = await getPreparedTransaction();
    const instruction = await counterProgram.methods
      .increment()
      .accounts({
        counter: new PublicKey(counterKey),
      })
      .instruction();
    transaction.add(instruction);

    try {
      const signature = await provider.sendAndConfirm(transaction, [], {
        skipPreflight: true,
      });
      setTxSig(signature);
    } catch (error) {
      console.log(error);
      toast.error("Transaction failed!");
    }
  };

  const outputs = [
    {
      title: "Counter Value",
      dependency: count,
    },
    {
      title: "Latest Tx Signature",
      dependency: txSig,
      href: `https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
    },
  ];

  useEffect(() => {
    const getInfo = async () => {
      if (connection && publicKey && counterKey) {
        try {
          const currentCount = await counterProgram.account.counter.fetch(
            new PublicKey(counterKey)
          );
          setCount(currentCount.count);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getInfo();
  }, [connection, publicKey, counterKey, txSig]);

  return (
    <main className="min-h-screen text-zinc-100 bg-zinc-950 w-full place-items-center py-16">
      <section className="w-full sm:w-2/3 xl:w-1/3 px-16">
        <form className="rounded-md min-h-content p-4 bg-zinc-900 border border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl text-zinc-200">
              Create Counter 💸
            </h2>
          </div>
          <div className="flex flex-row w-full gap-2 mt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleInitializeCounter();
              }}
              disabled={!publicKey}
              className={`disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#fa6ece] bg-[#fa6ece] 
                  rounded-md w-1/2 py-1 font-normal transition-all duration-300 hover:bg-[#fa6ece]/80 
                   `}
            >
              Initialize Counter
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleIncrementCounter();
              }}
              disabled={!publicKey || !counterKey}
              className={`disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800 bg-zinc-600 
                  rounded-md w-1/2 py-1 font-normal transition-all duration-300 hover:bg-zinc-700`}
            >
              Increment Counter
            </button>
          </div>
          <div className="text-sm font-normal mt-4 bg-white/[.05] rounded-md p-2">
            <ul className="p-2">
              {outputs.map(({ title, dependency, href }, index) => (
                <li
                  key={title}
                  className={`flex justify-between items-center ${
                    index !== 0 && "mt-4"
                  }`}
                >
                  <p className="tracking-wider font-extralight">{title}</p>
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
          {counterKey && (
            <p className="pt-4 text-sm font-extralight text-white/60">
              Counter Key: {counterKey}
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default Starter;
