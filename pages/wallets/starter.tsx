import BoilerPlate from "../../components/BoilerPlate";
// imports methods relevant to the react framework
import * as React from "react";
// library we use to interact with the solana json rpc api
import * as web3 from "@solana/web3.js";
// applies the styling to the components which are rendered on the browser
require("@solana/wallet-adapter-react-ui/styles.css");
// imports methods for deriving data from the wallet's data store
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Starter = () => {
  // allows us to add the wallet account balance to our react function component
  const [balance, setBalance] = React.useState<number | null>(0);

  // connection context object that is injected into the browser by the wallet
  const { connection } = useConnection();
  // user's public key of the wallet they connected to our application
  const { publicKey } = useWallet();

  // when the status of "connection" or "publicKey" changes, we execute the code block below
  React.useEffect(() => {
    const getInfo = async () => {
      if (connection && publicKey) {
        // we get the account info for the user's wallet data store and set the balance in our application's state
        const info = await connection.getAccountInfo(publicKey);
        setBalance(info!.lamports / web3.LAMPORTS_PER_SOL);
      }
    };
    getInfo();
    // the code above will execute whenever these variables change in any way
  }, [connection, publicKey]);

  return (
    <main className="p-16 text-zinc-100 bg-zinc-950 min-h-screen w-full">
      <div className="w-full sm:w-2/3 xl:w-1/3 mx-auto">
        <div className="rounded-md bg-zinc-900 border border-1 border-zinc-800 h-full px-8 py-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Account Info ✨</h2>
          </div>

          <div className="mt-4 bg-white/[.05] rounded-md p-2">
            <ul className="p-2">
              <li className="flex justify-between">
                <p className="tracking-wider font-extralight">
                  Wallet is connected
                </p>
                <p className="text-turbine-green italic font-semibold">
                  {publicKey ? "yes" : "no"}
                </p>
              </li>

              <li className="mt-4 flex justify-between">
                <p className="tracking-wider font-extralight">Balance</p>
                <p className="text-turbine-green italic font-semibold">
                  {balance}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Starter;
