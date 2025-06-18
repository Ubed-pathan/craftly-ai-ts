# CraftlyAI - Your AI Career Coach for Professional Success

> Professional resume building, cover letter generation, industry insights, and interview preparation powered by AI.

## 📱 Live Application

**[https://craftly-ai.vercel.app/](https://craftly-ai.vercel.app/)**

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19+-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)

## ✨ Key Features

- **AI Resume Builder** - ATS-optimized resumes with professional templates
- **Cover Letter Generator** - Personalized cover letters tailored to job descriptions
- **Industry Insights** - Data-driven market trends and salary analysis
- **Interview Preparation** - AI-powered mock interviews with feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (latest LTS version)
- npm or yarn

### Quick Installation

```bash
# Clone the repository
git clone https://github.com/Ubed-pathan/craftlyAI
cd craftlyai

# Install dependencies
npm install
# or
yarn install

# Set up your environment variables
cp .env.example .env.local

# Run the development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`


## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Authentication**: Clerk
- **Database**: Prisma ORM
- **AI**: Google Generative AI
- **UI Components**: Radix UI
- **Forms**: React Hook Form, Zod validation

## 📁 Project Structure

```
craftlyai/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── (auth)/           # Authentication routes
│   ├── (main)/           # All pages
│   ├── lib/              # Helper funtions
|   ├── page.jsx          # Root page
|   ├── not-found.jsx     # Not found
│   └── layout.jsx        # Root layout
├── components/           # React components
│   ├── ui/               # UI components
│   ├── shared/           # Reusable components
│   └── forms/            # Form components
├── lib/                  # Utility functions
│   ├── utils.js          # Helper utilities
│   └── ai/               # AI integration helpers
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── constants/            # Application constants
├── context/              # React context providers
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── styles/               # CSS styles
├── middleware.js         # Next.js middleware (for Clerk auth)
├── inngest/              # Inngest serverless functions
├── .env.example          # Example environment variables
├── .eslintrc.js          # ESLint configuration
├── tailwind.config.js    # Tailwind CSS configuration  
├── tsconfig.json         # TypeScript configuration
├── next.config.js        # Next.js configuration
└── package.json          # Project dependencies
```

## 📈 Future Enhancement

- Integration with major job boards
- Advanced analytics dashboard
- Personalized learning recommendations

## Contact
Name:- PATHAN UBEDULLAKHAN HASANKHAN                                                           
📜 Email:- ubedpathan818@gmail.com                                                                
🌐 Portfolio:- https://ubedsportfolio.vercel.app/ 

📱 Linkedin :- https://www.linkedin.com/in/ubed-pathan-35a715242/

🤖 X :- https://x.com/mr_ubed08

## 📱 Screenshot
![CraftlyAI Dashboard](/public/Demo.png)