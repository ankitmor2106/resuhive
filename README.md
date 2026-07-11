# Resumate

Resumate is a modern, full-stack resume builder application designed to help users create professional, ATS-friendly resumes with ease. The platform features an intuitive drag-and-drop interface, real-time live previews, and a variety of beautifully designed templates.

## 🚀 Features

- **Real-time Live Preview**: See your resume update instantly as you type.
- **Drag & Drop Builder**: Easily reorder sections (Experience, Education, Skills, etc.) with a smooth drag-and-drop interface.
- **Professional Templates**: Choose from a wide variety of beautifully crafted templates, ranging from classic corporate styles to modern, creative layouts.
- **PDF Export**: Generate high-quality, ATS-friendly PDFs of your resume instantly.
- **Authentication**: Secure login and registration powered by JWT and Google OAuth.
- **Data Persistence**: Autosave functionality ensures you never lose your progress.
- **Responsive Design**: A sleek, accessible UI built with Tailwind CSS.

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui & Radix UI
- **State Management**: Zustand & React Query
- **Drag & Drop**: @dnd-kit

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Passport.js (JWT, Google OAuth)
- **PDF Generation**: Puppeteer / PDF-Parse

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- pnpm (for frontend)
- npm (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Resumate
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Set up your .env file with DATABASE_URL, JWT_SECRET, etc.
   cp .env.example .env
   
   # Run Prisma Migrations
   npx prisma migrate dev
   
   # Start the backend server
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   pnpm install
   
   # Set up your .env.local with NEXT_PUBLIC_API_URL
   cp .env.example .env.local
   
   # Start the frontend server
   pnpm run dev
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `/frontend` - Next.js application containing the UI, state management, and API hooks.
- `/backend` - NestJS application containing business logic, REST APIs, and database models.

## 📜 License

This project is licensed under the MIT License.
