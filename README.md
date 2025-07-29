<div align="center">
  <img src="frontend/public/logo.webp" width="100" alt="FinMate Logo" />
  
  # FinMate - Effortless Financial Management
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?logo=mongodb)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?logo=tailwind-css)
  
  **Your comprehensive financial management platform**
  
  [🚀 Live Demo](https://fin-mate-lac.vercel.app/) • [📖 Documentation](#features) • [🐛 Report Bug](https://github.com/jatin-sh01/FinMate-/issues) • [✨ Request Feature](https://github.com/jatin-sh01/FinMate-/issues)
</div>

---

## 📸 Screenshots

<div align="center">
  
  ### Light Theme
  <img src="frontend/src/assets/light dashboard.png" alt="FinMate Dashboard - Light Theme" width="80%" />
  
  ### Dark Theme  
  <img src="frontend/src/assets/dark dashboard.png" alt="FinMate Dashboard - Dark Theme" width="80%" />
  
</div>

---

## 🎯 About FinMate

FinMate is your go-to platform for effortless financial management. Track expenses, manage income, and stay on top of your finances with ease. Easily add transactions, and navigate your dashboard with ease. Take control of your finances with FinMate.

### 🌟 Key Highlights

- **🎨 Theme-Aware Interface**: Seamlessly switches between light and dark themes
- **💰 Multi-Currency Support**: Manage finances in your preferred currency  
- **📧 Real-time Email Notifications**: Stay updated with all financial activities
- **🔐 Advanced Security**: Two-factor authentication and secure data handling

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📱 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)

---

## ✨ Features

<div align="center">
  
| 💼 **Financial Management** | 🔒 **Security & Privacy** | 🎨 **User Experience** |
|:---:|:---:|:---:|
| Expense Tracking | Two-Factor Authentication | Theme-Aware Interface |
| Income Management | Secure Authentication | Responsive Design |
| Multi-Currency Support | Email Notifications | Interactive Charts |
| Personalized Budgeting | Data Encryption | Modern UI Components |

</div>

### 📊 **Core Features**

- **💸 Expense Tracking**: Easily categorize and monitor your expenses with detailed insights
- **💰 Income Management**: Seamlessly add and track your income sources across categories  
- **🌍 Multi-Currency Support**: Manage finances in multiple currencies with real-time conversion
- **🎨 Theme-Aware Interface**: Enjoy both light and dark themes that adapt to your preference
- **🔐 Secure Authentication**: Protect your account with robust authentication and password security
- **🔑 Two-Factor Authentication**: Enhanced security with TOTP-based 2FA using authenticator apps
- **📧 Email Notifications**: Receive automated emails for important account activities and monthly summaries
- **📈 Insightful Reports**: Gain valuable insights into your financial health with interactive charts
- **🎯 Personalized Budgeting**: Set and track customized spending limits and financial goals
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

</div>

**Frontend Technologies:**
- React.js with Vite for fast development
- Redux Toolkit for state management  
- NextUI for modern UI components
- Tailwind CSS for responsive styling
- Chart.js for data visualization

**Backend Technologies:**
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT for secure authentication
- Nodemailer for email services
- Cron jobs for automated tasks

---

## 🚀 Installation

Get FinMate up and running on your local machine in just a few steps!

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ![Node.js](https://img.shields.io/badge/Node.js-v18.0+-339933?logo=node.js) **Node.js** (v18.0 or higher)
- ![npm](https://img.shields.io/badge/npm-v8.0+-CB3837?logo=npm) **npm** (v8.0 or higher)  
- ![MongoDB](https://img.shields.io/badge/MongoDB-v6.0+-47A248?logo=mongodb) **MongoDB** (local or cloud instance)
- ![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white) **Git** for version control

### 📥 Clone the Repository

```bash
git clone https://github.com/jatin-sh01/FinMate-.git
cd FinMate
```

### ⚙️ Configuration

#### 1. Backend Environment Setup

Navigate to the backend directory and create your environment file:

```bash
cd backend
cp .env.example .env
```

#### 2. Configure Environment Variables

Edit the `.env` file with your configuration:

```bash
# .env.example
PORT=3000
MONGO_URI=mongodb://localhost:27017/spend_smart
JWT_SECRET_KEY=your_secret_key_here
NODE_ENV=development
ENCRYPTION_SALT=10
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password_here
FRONTEND_URL=http://localhost:5173
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/finmate

# Authentication
JWT_SECRET_KEY=your_super_secret_jwt_key_here
ENCRYPTION_SALT=10

# Email Configuration (Gmail recommended)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

> **📧 Email Setup:** For Gmail, enable 2-factor authentication and generate an [App Password](https://support.google.com/accounts/answer/185833)

### 🚀 Quick Start

#### Option 1: Automated Setup (Recommended)

```bash
# Install dependencies for both frontend and backend
npm run setup

# Start both development servers concurrently  
npm run dev
```

#### Option 2: Manual Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install

# Start backend server (Terminal 1)
cd ../backend  
npm run dev

# Start frontend server (Terminal 2)
cd ../frontend
npm run dev
```

### 🌐 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017/finmate

---

## 📱 Usage

1. **🔐 Register/Login**: Create your account or sign in
2. **💰 Add Transactions**: Start tracking your income and expenses
3. **📊 View Dashboard**: Monitor your financial overview
4. **🔧 Configure Settings**: Set up 2FA, change currency, update profile
5. **📈 Analyze Reports**: Review your financial insights and trends

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🍴 Fork** the repository
2. **🌿 Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **💾 Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **📤 Push** to the branch (`git push origin feature/AmazingFeature`)
5. **🔄 Open** a Pull Request

### 🐛 Found a Bug?

- Open an [issue](https://github.com/jatin-sh01/FinMate-/issues) with detailed information
- Include steps to reproduce the bug
- Add screenshots if applicable

---

## 🎓 Learning Experience

Building FinMate provided valuable insights into modern web development:

<details>
<summary><strong>🔧 Technical Skills Acquired</strong></summary>

- **💻 Full-Stack Development**: End-to-end application development from UI to database
- **⚛️ React.js Mastery**: Advanced component architecture and state management
- **🚀 Node.js & Express**: RESTful API development and server-side logic
- **🍃 MongoDB & Mongoose**: NoSQL database design and data modeling
- **🔐 Authentication & Security**: JWT implementation and 2FA integration
- **🔄 State Management**: Redux Toolkit for complex application state
- **📧 Email Integration**: Automated notifications with Nodemailer
- **🎨 Modern UI/UX**: Responsive design with Tailwind CSS and NextUI
- **📊 Data Visualization**: Interactive charts and financial insights
- **🚀 Deployment**: Cloud deployment strategies and DevOps practices

</details>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - feel free to use this project for learning and development!
```

---

## 📞 Contact

<div align="center">

**Jatin Sharma** - Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/Jatinsharma-)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:Jatinsharma708090@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jatin-sh01)

**⭐ Star this repository if you found it helpful!**

</div>

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/jatin-sh01">Jatin Sharma</a></sub>
</div>
