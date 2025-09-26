# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SIGBI is a Next.js application using the App Router pattern with TypeScript. The project is configured with Tailwind CSS for styling and includes a comprehensive authentication system with role-based access control that communicates with an external API.

## Development Commands

- **Start development server**: `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint` (ESLint with Next.js config)

## Architecture

### App Structure
- **App Router**: Uses Next.js 15.5.2 App Router with `src/app/` directory structure
- **Route Groups**: Implements protected and public routes using `(protected)` and `(public)` groups
- **API Routes**: RESTful API endpoints in `src/app/api/` with auth endpoints (`/auth/me`, `/auth/logout`) and user endpoints (`/users/login`)
- **Components**: Shared components in `src/components/layout/` including Navigation, Sidebar, and AppShell
- **CRUD Components**: Modular form components in `src/components/crud/bienes/` for property management
- **Context**: Authentication context in `src/context/AuthContext.tsx` for state management

### Key Features
- **Authentication System**: 
  - Cookie-based authentication using `access_token`
  - JWT token management with automatic logout
  - Role-based access control with different home pages per role (admin, analista, capturista, vista)
  - Protected routes using Next.js middleware
- **User Roles**: Multiple user types with dedicated dashboard pages
- **Navigation**: Responsive navigation with sidebar and mobile menu support
- **Middleware Protection**: Route protection for authenticated areas using `middleware.ts`
- **CRUD Operations**: Complete property management system with multi-step forms
- **Modular Components**: Reusable form components with shared types and validation

### Routing Structure
- **Public Routes**: `/login` page in `(public)` group
- **Protected Routes**: Multiple role-specific home pages and user profile in `(protected)` group:
  - `/home` - General home page
  - `/home-admin` - Administrator dashboard
  - `/home-analista` - Analyst dashboard  
  - `/home-capturista` - Data entry dashboard
  - `/home-vista` - View-only dashboard
  - `/perfil` - User profile page
  - `/bienes/crear` - Multi-step property registration form

### Styling & UI
- **Tailwind CSS**: Version 4 with PostCSS integration
- **Design System**: Modern UI with rounded corners, shadows, and consistent spacing
- **Color Scheme**: Custom brand colors including `#676D47` (olive green), `#5a6140`, and `#F5F1EE` (background)
- **Interactive Elements**: Hover effects, transitions, and micro-animations
- **Form Components**: Advanced form styling with validation states and visual feedback
- **Responsive Design**: Mobile-first approach with responsive components

### TypeScript Configuration
- **Path Aliases**: `@/*` maps to `./src/*`
- **Strict Mode**: TypeScript strict mode enabled
- **Modern Target**: ES2017+ with latest TypeScript 5.x

### Dependencies
- **Core**: Next.js 15.5.2, React 19.1.0, React DOM 19.1.0
- **HTTP Client**: Axios 1.11.0 for API communication
- **Security**: bcryptjs 3.0.2 for password hashing
- **Development**: ESLint 9.x with Next.js config, TypeScript 5.x

### Authentication Flow
- Login redirects based on user role to appropriate dashboard
- Middleware protects `/home*` routes and redirects unauthenticated users to `/login`
- Authenticated users trying to access `/login` are redirected to `/home`
- Automatic logout and token cleanup functionality

## Component Architecture

### Property Management System
The application includes a comprehensive property (bienes inmuebles) management system with the following structure:

- **Main Form**: `/src/app/(protected)/bienes/crear/page.tsx` - Multi-step wizard with navigation
- **Shared Types**: `/src/components/crud/bienes/types.ts` - TypeScript interfaces and prop types
- **Step Components**: Each step is a separate, reusable component:
  - `DatosBasicos.tsx` - Basic property information with icons and validation
  - `Terreno.tsx` - Land information with summary cards
  - `Localizacion.tsx` - Geographic location with Google Maps integration
  - `Planos.tsx` - Cadastral plans and technical information
  - `Avaluos.tsx` - Property valuations with currency formatting
  - `Registros.tsx` - Legal registrations with document links
  - `Documentos.tsx` - Legal documents with summary displays
  - `Ocupacion.tsx` - Occupancy information with status indicators
  - `Inspecciones.tsx` - Physical inspections with date calculations and alerts

### Form Features
- **Step Navigation**: Clickable step indicators for direct navigation
- **Progress Tracking**: Visual progress bar and step completion states
- **Real-time Validation**: Field-level validation with error highlighting
- **Interactive Elements**: Hover effects, animations, and visual feedback
- **Responsive Layout**: Adaptive design for all screen sizes
- **Data Persistence**: Form state maintained across step navigation

## Important Notes
- **Route Protection**: All `/home*` routes are protected by middleware
- **Role-Based UI**: Different dashboard interfaces based on user roles
- **Cookie Authentication**: Uses secure cookie-based JWT token storage
- **External API Integration**: Proxies requests to external backend service
- **Modular Architecture**: Components are designed for reusability and maintainability
- **No Testing Setup**: No test configuration currently present in the project