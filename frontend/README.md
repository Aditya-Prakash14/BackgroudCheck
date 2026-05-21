# BGV Platform - Frontend

A modern, responsive Next.js frontend for the Background Verification Platform with Tailwind CSS, React Hook Form, and Zustand state management.

## 🎨 Overview

The frontend provides a user-friendly interface for managing background verification processes. Built with Next.js 16, it delivers exceptional performance with server-side rendering, static generation, and automatic code splitting.

## ✨ Features

- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Server Components** - Next.js 13+ App Router for optimal performance
- **Form Validation** - React Hook Form with Zod schema validation
- **State Management** - Zustand for lightweight, flexible state
- **Authentication** - JWT-based auth with secure token storage
- **Charts & Analytics** - Interactive charts with Recharts
- **Error Boundaries** - Graceful error handling
- **Type Safety** - Full TypeScript support

## 📦 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **Charts**: Recharts
- **Icons**: Heroicons
- **HTTP Client**: Axios

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API endpoint
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```env
# API endpoint (backend URL)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Debug mode
NEXT_PUBLIC_DEBUG=false
```

**Note:** Variables starting with `NEXT_PUBLIC_` are exposed to the browser.

## 📁 Project Structure

```
src/
├── app/                          # App Router (Next.js 13+)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── dashboard/               # Dashboard pages
│   ├── candidates/              # Candidates pages
│   │   ├── page.tsx            # List candidates
│   │   ├── new/                # Create candidate
│   │   └── [id]/               # View candidate details
│   └── api/                     # API routes (if any)
│
├── components/                  # Reusable components
│   ├── layout/
│   │   ├── GovHeader.tsx        # Government header
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── Navbar.tsx           # Top navigation
│   ├── dashboard/
│   │   ├── StatCard.tsx         # Statistics card
│   │   ├── Charts.tsx           # Chart components
│   │   └── RecentActivity.tsx   # Recent activity
│   ├── candidates/
│   │   ├── CandidateForm.tsx    # Candidate form
│   │   ├── CandidateList.tsx    # Candidates list
│   │   └── CandidateCard.tsx    # Candidate card
│   ├── ui/
│   │   ├── Badge.tsx            # Badge component
│   │   ├── Button.tsx           # Button component
│   │   ├── Card.tsx             # Card container
│   │   ├── Modal.tsx            # Modal dialog
│   │   └── Loader.tsx           # Loading spinner
│   └── common/
│       ├── Header.tsx           # Header component
│       └── Footer.tsx           # Footer component
│
├── services/                    # API services
│   └── api.ts                   # Axios instance & endpoints
│
├── store/                       # Zustand stores
│   ├── auth.store.ts            # Authentication state
│   ├── candidates.store.ts      # Candidates state
│   └── ui.store.ts              # UI state
│
├── validations/                 # Zod schemas
│   └── schemas.ts               # Form validation schemas
│
└── types/                       # TypeScript types
    ├── index.ts                 # Type definitions
    └── api.ts                   # API response types
```

## 🔌 API Integration

### Axios Client Setup

`services/api.ts`:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Making API Calls

```typescript
import api from '@/services/api';

// In a component
const getCandidates = async () => {
  try {
    const response = await api.get('/candidates');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch candidates:', error);
  }
};
```

## 🎯 Key Pages

### Authentication
- **Login** (`/login`) - User login form
- **Register** (`/register`) - User registration form

### Dashboard
- **Dashboard** (`/dashboard`) - Analytics and overview
  - Statistics cards
  - Charts and graphs
  - Recent activity

### Candidates
- **List** (`/candidates`) - View all candidates
- **Create** (`/candidates/new`) - Add new candidate
- **Details** (`/candidates/[id]`) - View candidate details
  - Personal information
  - Verification status
  - Reports

## 📝 Components

### Commonly Used Components

**Button**
```tsx
import Button from '@/components/ui/Button';

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

**Card**
```tsx
import Card from '@/components/ui/Card';

<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

**Badge**
```tsx
import Badge from '@/components/ui/Badge';

<Badge status="active">Active</Badge>
```

**Modal**
```tsx
import Modal from '@/components/ui/Modal';

<Modal isOpen={true} onClose={closeModal}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

## 🔐 Authentication

### Using Auth Store

```typescript
import { useAuthStore } from '@/store/auth.store';

function MyComponent() {
  const { user, login, logout, isLoggedIn } = useAuthStore();

  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>Welcome, {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Protected Routes

Create a middleware for protected routes:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/candidates/:path*'],
};
```

## 📊 Form Validation

### Using Zod and React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemas } from '@/validations/schemas';

function CandidateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemas.candidateSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🎨 Styling

### Tailwind CSS

All components use Tailwind CSS utility classes:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h3 className="text-lg font-semibold text-gray-900">Title</h3>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    Action
  </button>
</div>
```

### Custom CSS

Global styles in `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition;
  }
}
```

## 🧪 Testing

### Setup Jest & React Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Run Tests

```bash
npm test
npm test -- --coverage
```

## 📈 Performance

### Next.js Optimizations

- **Image Optimization**: Use `next/image`
  ```tsx
  import Image from 'next/image';
  <Image src="/image.png" alt="desc" width={400} height={300} />
  ```

- **Code Splitting**: Automatic per-page code splitting
- **CSS Minification**: Automatic CSS minification
- **Static Export**: Pre-render static pages
  ```typescript
  export const generateStaticParams = () => {
    // Return static paths
  };
  ```

### Bundle Analysis

```bash
npm install --save-dev @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({...});
```

Then run:
```bash
ANALYZE=true npm run build
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Vercel automatically deploys on push

### Manual Build

```bash
npm run build
npm start
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t bgv-frontend .
docker run -p 3000:3000 bgv-frontend
```

## 🔍 Debugging

### Enable Debug Mode

```env
NEXT_PUBLIC_DEBUG=true
```

In components:
```typescript
if (process.env.NEXT_PUBLIC_DEBUG) {
  console.log('Debug info:', data);
}
```

### Browser DevTools

- **React Developer Tools** - Chrome extension
- **Redux DevTools** - For state debugging
- **Network tab** - Monitor API calls

### Logs

Check browser console for:
- API errors
- State changes
- Component warnings

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Zustand](https://zustand-demo.vercel.app)

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Create a pull request

## 📝 License

ISC

---

**Last Updated**: May 2026  
**Next.js Version**: 16  
**Node Version**: 18+
