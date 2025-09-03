# WhatsApp URL Extractor

## Overview

This is a full-stack web application that extracts Group and Channel IDs from WhatsApp URLs. The application provides both single URL processing and batch processing capabilities, allowing users to quickly extract identifiers from various WhatsApp URL formats including group invites and channel links.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling
- **API Design**: RESTful endpoints with centralized route registration

### Data Processing
- **URL Extraction**: Client-side JavaScript functions for parsing WhatsApp URLs
- **Supported Formats**: 
  - Group URLs: `chat.whatsapp.com/*` and `whatsapp.com/invite/*`
  - Channel URLs: `whatsapp.com/channel/*` and `www.whatsapp.com/channel/*`
- **Validation**: Zod schemas for input validation and type safety

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured but with in-memory storage fallback)
- **Schema**: Extraction results table for storing URL processing history
- **Migrations**: Drizzle Kit for database schema management

### Development Environment
- **Hot Reload**: Vite dev server with HMR support
- **Error Handling**: Runtime error overlay for development
- **Replit Integration**: Custom plugins for Replit environment compatibility

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)
- **Connection**: Environment variable `DATABASE_URL` for database connection

### UI Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible components
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **ESBuild**: Fast JavaScript bundler for production builds

### Form and Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Utility Libraries
- **date-fns**: Date manipulation library
- **clsx & tailwind-merge**: Utility for conditional CSS classes
- **nanoid**: URL-safe unique string ID generator