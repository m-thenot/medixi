# Medixi (2023)

A modern Radiology Information System (RIS) designed for healthcare professionals to efficiently manage patient records, radiological examinations, and diagnostic reports with integrated DICOM viewing capabilities and AWS cloud infrastructure.

## Features

- **Patient Management**: Create, view, edit, and manage patient records with comprehensive demographic and examination data
- **DICOM Viewer**: Integrated medical image viewer based on OHIF (Open Health Imaging Foundation) for viewing and analyzing radiological studies (separate repository: `medixi-ohif-viewer`)
- **Examination Management**:
  - Track radiology examinations including exam types, dates, and clinical details
  - Multi-state workflow tracking (pending, in progress, report drafted, validated, etc.)
  - Real-time examination data refresh using Page Visibility API
- **Advanced Report Editing**:
  - Rich text editor (TinyMCE) with comprehensive formatting tools
  - Embedded image support with drag-and-drop upload
  - Report state management and validation workflow
  - Export reports to PDF with embedded images
- **DICOM File Management**:
  - Upload DICOM files (.dcm) and ZIP archives
  - Automatic ZIP extraction and DICOM parsing
  - Server-side DICOM metadata extraction (Study Instance UID)
  - AWS S3 storage with presigned URLs for secure access
  - AWS HealthImaging integration for scalable DICOM storage
- **Multi-Organization Support**:
  - Switch between multiple healthcare organizations
  - Organization-specific data isolation
  - Seamless context switching with preserved navigation
- **User Administration**: Role-based user management system with email invitation workflows
- **Secure Authentication**: HIPAA-compliant authentication powered by Kinde with organization-based access control
- **Internationalization**: Multi-language support (English/French) for global deployment

## System Architecture

Medixi is built on a modern cloud-native architecture with the following components:

### Application Components
1. **Main RIS Application** (this repository)
   - Next.js 14 with App Router for the frontend
   - Patient and examination management
   - Report generation and editing
   - User administration
   - Multi-organization support

2. **DICOM Viewer** (`medixi-ohif-viewer` repository)
   - Dedicated medical imaging viewer based on OHIF
   - Integrated viewing of DICOM studies
   - Advanced image manipulation tools

3. **AWS Lambda Functions** (`/lambda` directory)
   - **health-imaging-importer**: Automated DICOM import pipeline
     - Triggered by S3 upload events
     - Extracts ZIP archives containing DICOM files
     - Imports to AWS HealthImaging datastore
     - Handles both single DICOM files and ZIP archives

### Data Flow
1. **File Upload**: User uploads DICOM/ZIP → Presigned S3 URL → S3 bucket (`inputs/` folder)
2. **Lambda Processing**: S3 event triggers Lambda → ZIP extraction (if needed) → Import to AWS HealthImaging
3. **Metadata Extraction**: DICOM parser API extracts Study Instance UID from files
4. **Image Viewing**: OHIF viewer retrieves images via StudyInstanceUID
5. **Report Management**: TinyMCE editor → Image assets to S3 → HTML with signed URLs → PDF export

### Security & Permissions
- **Authentication**: Kinde Auth with organization-based access
- **Authorization**: Hasura GraphQL with role-based permissions and organization filtering
- **File Access**: Presigned S3 URLs with 30-minute expiration
- **Content Security**: HTML sanitization for XSS prevention

## Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 14 with TypeScript (App Router)
- **Admin Framework**: [Refine](https://refine.dev/) for rapid admin panel development
- **UI Library**: [Ant Design](https://ant.design/) 5
- **Styling**: TailwindCSS
- **Rich Text Editor**: TinyMCE with image upload support
- **File Upload**: react-dropzone for drag-and-drop functionality
- **Internationalization**: i18next with next-i18n-router

### Backend & API
- **Data Layer**: [Hasura](https://hasura.io/) GraphQL API
- **Authentication**: [Kinde Auth](https://kinde.com/) with organization support
- **API Routes**: Next.js API routes for file handling and report generation

### Cloud Infrastructure (AWS)
- **File Storage**: AWS S3 with presigned URLs
- **Medical Imaging**: AWS HealthImaging for DICOM data management
- **Serverless Processing**: AWS Lambda for automated DICOM import
- **DICOM Processing**: dicom-parser for metadata extraction

### Additional Services
- **DICOM Viewer**: Fork of [OHIF Viewer](https://ohif.org/) (maintained separately in `medixi-ohif-viewer` repository)
- **PDF Generation**: Puppeteer with @sparticuz/chromium-min
- **Email**: Resend with React Email templates
- **Security**: sanitize-html for XSS protection

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Access to a Hasura GraphQL endpoint
- Kinde authentication credentials with organization support
- AWS account with S3 and HealthImaging services configured
- TinyMCE API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Hasura GraphQL
NEXT_PUBLIC_API_URL=your_hasura_graphql_endpoint

# Kinde Authentication
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=your_kinde_issuer_url
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000

# AWS Services
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name

# Email Service
RESEND_API_KEY=your_resend_api_key

# TinyMCE Editor
NEXT_PUBLIC_TINY_MCE_API_KEY=your_tinymce_api_key

# OHIF Viewer URL
NEXT_PUBLIC_VIEWER_URL=your_ohif_viewer_url
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
├── app/                      # Next.js App Router
│   ├── (default)/           # Public landing page
│   └── (platform)/          # Main application
│       ├── [locale]/        # Internationalized routes
│       │   ├── examinations/    # Examination pages
│       │   ├── patients/        # Patient management pages
│       │   └── users/           # User management pages
│       └── api/             # API routes
│           ├── auth/            # Kinde authentication
│           ├── examinations/    # Examination assets API
│           ├── files/           # File upload & DICOM parser
│           └── patients/        # Patient file & report export
├── lambda/                   # AWS Lambda functions
│   └── health-imaging-importer/  # DICOM import to AWS HealthImaging
├── src/
│   ├── actions/         # Server actions
│   ├── components/      # Reusable React components
│   │   ├── FileUploader/    # Drag-and-drop file upload
│   │   ├── RichTextEditor/  # TinyMCE wrapper
│   │   └── header/          # Header with org switcher
│   ├── contexts/        # React context providers
│   ├── emails/          # Email templates (Resend)
│   ├── features/        # Feature-specific components
│   │   ├── examinations/    # Examination list & detail views
│   │   ├── patients/        # Patient CRUD operations
│   │   └── users/           # User management
│   ├── hooks/           # Custom React hooks
│   ├── i18n/            # Internationalization config
│   ├── services/        # Business logic (file, email, logger)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
└── public/
    └── locales/         # i18n translation files (en, fr)
```

## Key Features

### Radiology Workflow
1. **Patient Management**
   - Create and manage patient records with demographic information
   - Track patient examination history
   - Multi-organization patient isolation

2. **Examination Management**
   - Schedule and document radiological examinations
   - Upload DICOM studies and ZIP archives
   - Multi-state workflow (pending → in progress → report drafted → validated)
   - Real-time data synchronization with Page Visibility API

3. **DICOM Processing**
   - Automatic ZIP extraction for batch DICOM uploads
   - Server-side DICOM metadata parsing (Study Instance UID extraction)
   - AWS Lambda-based automated import to AWS HealthImaging
   - Secure file storage in AWS S3 with presigned URLs

4. **Medical Image Viewing**
   - Launch integrated OHIF viewer with study context
   - Direct navigation from examination to image viewer
   - StudyInstanceUID-based image retrieval

5. **Report Generation**
   - Rich text editor with comprehensive formatting tools
   - Embed images and captures directly in reports
   - Image upload to S3 with automatic URL management
   - Save drafts and track report states
   - Export reports to PDF with embedded images
   - HTML sanitization for security

### Multi-Organization Support
- Switch between multiple healthcare organizations
- Organization-scoped data access via Hasura permissions
- Seamless context switching with preserved navigation state
- Organization-specific authentication via Kinde

### File Handling
- Drag-and-drop file upload interface
- Support for DICOM files (.dcm) and ZIP archives
- Presigned S3 URLs for secure uploads (up to 1GB per file)
- Automatic content type validation
- Server-side ZIP extraction and processing
- Image asset management for report embeds

### User Management
- Email invitation system with React Email templates
- Organization-based user access control
- Track invitation status (pending/active)
- Role-based permissions via Hasura

## API Endpoints

### File Management
- `POST /api/patients/files` - Generate presigned S3 upload URL
- `GET /api/patients/files?filename=<key>` - Get presigned download URL
- `POST /api/examinations/[id]/assets` - Upload image assets for reports

### DICOM Processing
- `GET /api/files/dicom-parser?keys=<comma-separated-keys>` - Extract Study Instance UIDs from DICOM files

### Reports
- `POST /api/patients/export-report` - Generate PDF from HTML report

## AWS Infrastructure Setup

### S3 Bucket Structure
```
your-bucket/
├── inputs/           # DICOM and ZIP file uploads
│   └── [uuid]/      # Per-upload folder
│       └── zip/     # Extracted DICOM files from ZIP
├── reports/         # Report assets
│   └── assets/      # Images embedded in reports
│       └── [examId]/
└── outputs/         # AWS HealthImaging import results
```

### Lambda Function Deployment
The `lambda/health-imaging-importer` function should be:
1. Deployed to AWS Lambda with Node.js 18+ runtime
2. Configured with S3 trigger on `inputs/` prefix
3. Given IAM permissions for:
   - S3 read/write access
   - AWS HealthImaging datastore access
   - CloudWatch Logs
4. Environment variables:
   - `DATASTORE_ID`: AWS HealthImaging datastore ID

### Required AWS Services
- **S3**: File storage with event notifications
- **Lambda**: Automated DICOM processing
- **HealthImaging**: DICOM datastore (optional but recommended)
- **IAM**: Role-based access control

## Related Repositories

- **[medixi-ohif-viewer](https://github.com/your-org/medixi-ohif-viewer)**: DICOM viewer component based on OHIF for medical image visualization

## Development Notes

- The app uses Next.js App Router with internationalized routing (`[locale]`)
- All patient/examination data is scoped to organizations via Hasura permissions
- DICOM files are processed asynchronously via Lambda functions
- Reports support embedded images stored separately in S3
- Page Visibility API ensures data freshness when users return to tabs

## License

MIT
