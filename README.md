# 💸 Kazana Pay — Web3 Payments for Everyone

**Kazana Pay** lets any WordPress, shopify, wix merchant accept **instant USDC payments on Base**,  
without writing a single line of blockchain code.  
[**CURRENTLY FOCUSING ON WORDPRESS**]

It’s a lightweight plugin that adds a **“Pay with Base”** button to your checkout page.  
Built for speed, trust, and reusability.

---

## Overview

### Merchant Setup Flow
1. Install the **Kazana Pay plugin**.  
2. Connect your wallet via **Base Account Kit** or **WalletConnect**.  
3. Paste your **USDC receiving address** in plugin settings.  

### Customer Checkout Flow
1. “**Pay with Base**” button appears on checkout.  
2. Buyer connects Base wallet.  
3. Pays in USDC (Base Testnet for demo).  
4. **Base Pay SDK** verifies transaction.  
5. Confirmation modal + optional NFT receipt.

---

## 🛠️ Tech Stack

| Layer | Tech / Library | Purpose |
|-------|----------------|----------|
| **Frontend** | JavaScript (ES6) | Handle button logic + Base Pay SDK |
| **WordPress Core** | PHP | Plugin logic, settings page |
| **Blockchain** | [Base Pay SDK](https://docs.base.org) | Payment flow |
| **Login** | [Base Account Kit](https://docs.base.org/account-kit) | Wallet connection (optional) |
| **NFT Minting** | [thirdweb SDK](https://portal.thirdweb.com) | Optional proof-of-purchase |
| **Network** | Base Sepolia (Testnet) | Demo transactions |
| **Token** | USDC Testnet | Payment currency |

---

##  Repository Structure
kazana-pay/
│
├── kazana-pay.php              # Main plugin file (entry point)
├── readme.txt                  # For WordPress directory (optional for now)
├── assets/
│   ├── js/
│   │   ├── kazana-pay.js       # Frontend logic (Base Pay SDK, button UI)
│   │   └── admin.js            # For merchant dashboard interactions
│   ├── css/
│   │   ├── style.css           # Styles for button and modal
│   │   └── admin.css           # Styles for dashboard (if any)
│   └── img/
│       └── logo.png            # Plugin logo
│
├── includes/
│   ├── class-kazana-settings.php  # Handles admin settings (wallet, USDC address)
│   ├── class-kazana-checkout.php  # Injects “Pay with Base” button on checkout
│   └── class-kazana-api.php       # For REST endpoints (when/ if needed)
│
└── templates/
    └── pay-button.php             # HTML template for “Pay with Base” button


---

## ⚙️ Installation & Local Testing

### 1️Prepare a WordPress Dev Environment

You can use **Local by Flywheel**, **XAMPP**, or **Laragon**.

1. Download & install WordPress locally.  
2. Log in to `http://localhost/wp-admin`.  
3. Navigate to **wp-content/plugins/**.  Find plugin and activate.
4. Copy your plugin folder here:  
/wp-content/plugins/kazana-pay/


### 2️ Activate the Plugin

- In the WordPress Admin Panel → **Plugins → Installed Plugins**
- Find **Kazana Pay** and click **Activate**

You should now see:
- “Kazana Pay” settings under **Settings → Kazana Pay**
- A **“Pay with Base”** button on any checkout page where you call the template.

---

## 🧪 Testing Payments on Base Testnet

1. Get **Base Sepolia USDC tokens** from faucet (search *Base USDC Faucet*).  
2. Open your site → checkout → click **Pay with Base**.  
3. Connect wallet → confirm transaction → you’ll see a success alert.  
4. Check transaction on [Base Sepolia Explorer](https://sepolia.basescan.org).

---


