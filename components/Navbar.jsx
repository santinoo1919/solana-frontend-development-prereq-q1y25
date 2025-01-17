import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  return (
    <nav className="px-16 py-4 flex justify-between items-center bg-zinc-950">
      <a href="/">
        <div className="relative">
          <img
            src="/turbine-logo-text.svg"
            width="160"
            className="transition-transform duration-200 transform hover:scale-100 hover:cursor-pointer"
            alt="Helius logo"
          />
        </div>
      </a>

      <WalletMultiButton className="!bg-turbine-green hover:!bg-black transition-all duration-200 !rounded-lg" />
    </nav>
  );
};

export default Navbar;
