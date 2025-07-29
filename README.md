# NFT Access DApp

A decentralized application (DApp) that allows users to connect their MetaMask wallet, verify ownership of a specific ERC-721 NFT, and gain access to a premium dashboard if they own the required NFT.

## Features

- 🔗 **MetaMask Integration**: Seamless wallet connection using MetaMask
- 🎯 **NFT Verification**: Smart contract-based NFT ownership verification
- 🔐 **JWT Authentication**: Secure session handling with JWT tokens
- 📊 **Premium Dashboard**: Exclusive content for NFT holders
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS
- ⚡ **Next.js 15**: Latest Next.js with App Router and TypeScript

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Blockchain**: Ethers.js v6, Solidity, Hardhat
- **Authentication**: JWT tokens with signature verification
- **Smart Contract**: ERC-721 NFT with access control

## Prerequisites

- Node.js 18+ 
- MetaMask browser extension
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nftdappapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   JWT_SECRET=your-super-secret-jwt-key
   NEXT_PUBLIC_CONTRACT_ADDRESS=your-deployed-contract-address
   ```

4. **Compile and deploy the smart contract**
   ```bash
   # Compile contracts
   npx hardhat compile
   
   # Start local blockchain
   npx hardhat node
   
   # In a new terminal, deploy the contract
   npx hardhat run scripts/deploy.ts --network localhost
   ```

5. **Update the contract address**
   Copy the deployed contract address from the deployment output and update it in your `.env.local` file.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Users

1. **Connect Wallet**: Click "Connect MetaMask" to connect your wallet
2. **Verify NFT**: The app will automatically check if you own the required NFT
3. **Access Dashboard**: If you own the NFT, you can access the premium dashboard
4. **Sign Message**: Sign a message to authenticate and get JWT access

### For Administrators

1. **Deploy Contract**: Use the deployment script to deploy the AccessNFT contract
2. **Mint NFTs**: Use the `mintAccessNFT` function to grant access to users
3. **Manage Access**: Use the `revokeAccess` function to revoke user access

## Smart Contract

The `AccessNFT` contract is an ERC-721 token that provides access control:

- **mintAccessNFT(address)**: Mint an access NFT to a specific address (owner only)
- **checkAccess(address)**: Check if an address has access
- **revokeAccess(address)**: Revoke access by burning the NFT (owner only)

## Project Structure

```
nftdappapp/
├── contracts/           # Smart contracts
│   └── AccessNFT.sol
├── scripts/            # Deployment scripts
│   └── deploy.ts
├── src/
│   ├── app/           # Next.js app router
│   │   ├── api/       # API routes
│   │   │   └── auth/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/    # React components
│   │   ├── LoadingSpinner.tsx
│   │   ├── NFTVerification.tsx
│   │   ├── PremiumDashboard.tsx
│   │   └── WalletConnect.tsx
│   ├── contexts/      # React contexts
│   │   ├── AuthContext.tsx
│   │   └── Web3Context.tsx
│   └── hooks/         # Custom hooks
│       └── useNFTVerification.ts
├── hardhat.config.ts
└── package.json
```

## API Endpoints

### POST /api/auth/login
Authenticate user with wallet signature and return JWT token.

**Body:**
```json
{
  "address": "0x...",
  "signature": "0x..."
}
```

### GET /api/auth/verify
Verify JWT token and return user data.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

## Development

### Running Tests
```bash
npx hardhat test
```

### Compiling Contracts
```bash
npx hardhat compile
```

### Deploying to Testnet
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## Security Considerations

- Always use environment variables for sensitive data
- Verify signatures on the server side
- Use HTTPS in production
- Regularly update dependencies
- Audit smart contracts before deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
