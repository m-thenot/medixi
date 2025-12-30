# Medixi

A modern Radiology Information System (RIS) designed for healthcare professionals to efficiently manage patient records, radiological examinations, and diagnostic reports with integrated DICOM viewing capabilities.

## Features

- **Patient Management**: Create, view, edit, and manage patient records with comprehensive demographic and examination data
- **DICOM Viewer**: Integrated medical image viewer based on OHIF (Open Health Imaging Foundation) for viewing and analyzing radiological studies (separate repository: `medixi-ohif-viewer`)
- **Examination Management**: Track radiology examinations including exam types, dates, and clinical details
- **Rich Text Reports**: Generate and export detailed diagnostic reports with a built-in rich text editor
- **DICOM File Management**: Upload, store, and manage DICOM files and ZIP archives containing medical imaging studies
- **User Administration**: Role-based user management system with invitation workflows
- **Secure Authentication**: HIPAA-compliant authentication powered by Kinde
- **Internationalization**: Multi-language support (English/French) for global deployment

## System Architecture

Medixi consists of two main components:

1. **Main RIS Application** (this repository): Patient and examination management, reporting, and user administration
2. **DICOM Viewer** (`medixi-ohif-viewer` repository): Dedicated medical imaging viewer based on OHIF for viewing and analyzing DICOM studies

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 13 with TypeScript
- **Admin Framework**: [Refine](https://refine.dev/) for rapid admin panel development
- **UI Library**: [Ant Design](https://ant.design/) 5
- **Data Layer**: [Hasura](https://hasura.io/) GraphQL API
- **Authentication**: [Kinde Auth](https://kinde.com/)
- **DICOM Viewer**: Fork of [OHIF Viewer](https://ohif.org/) (maintained separately in `medixi-ohif-viewer` repository)
- **Styling**: TailwindCSS
- **Rich Text Editor**: TinyMCE
- **File Storage**: Vercel Blob
- **PDF Generation**: Puppeteer

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Access to a Hasura GraphQL endpoint
- Kinde authentication credentials
- Vercel Blob storage for DICOM files

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=your_hasura_graphql_endpoint
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=your_kinde_issuer_url
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
RESEND_API_KEY=your_resend_api_key
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with increased memory allocation
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── pages/              # Next.js pages and API routes
│   ├── api/           # API endpoints
│   │   ├── auth/      # Kinde authentication
│   │   ├── patients/  # Patient API routes (upload, export)
│   │   └── users/     # User management API routes
│   ├── patients/      # Patient management pages
│   └── users/         # User management pages
├── src/
│   ├── components/    # Reusable React components
│   ├── contexts/      # React context providers
│   ├── emails/        # Email templates (Resend)
│   ├── services/      # Business logic and services
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
└── public/
    └── locales/       # i18n translation files (en, fr)
```

## Key Features

### Radiology Workflow
- Create patient records with demographic information
- Schedule and document radiological examinations
- Upload DICOM studies and associated files
- View medical images using the integrated OHIF viewer
- Generate diagnostic reports with rich text formatting
- Export reports to PDF for distribution

### File Handling
- Accepts DICOM files (.dcm) and ZIP archives
- Automatic file upload to Vercel Blob storage
- Secure file retrieval and viewing

### User Management
- Invite new users via email
- Track invitation status (pending/active)
- Role-based access control

## Related Repositories

- **[medixi-ohif-viewer](https://github.com/your-org/medixi-ohif-viewer)**: DICOM viewer component based on OHIF for medical image visualization

## License

MIT
