# TimeArt - Photography Marketplace Disguised as Time Display

![App Preview](https://imgix.cosmicjs.com/b3375a20-6688-11f0-a051-23c10f41277a-photo-1514565131-fce0801e5785-1753139774877.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A unique photography marketplace that disguises itself as a simple time display website. Visitors come to check the time but discover beautiful photography backgrounds that can be purchased, creating an elegant fusion of utility and art commerce.

## ✨ Features

- **Real-Time Clock Display** with customizable 12/24-hour formats
- **Rotating Featured Photography** with automatic scheduling
- **Transparent Photo Information** overlay with hover interactions
- **Artist Portfolio Management** with commission tracking
- **Seamless Purchase Flow** for digital and print sales
- **Artist Application System** with review workflow
- **Responsive Full-Screen Design** optimized for all devices
- **Admin Dashboard** for content management

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=687ec909713abc4f2911face&clone_repository=687ecbbd713abc4f2911faeb)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "I want to create a website that primarily draws people in to check the time but the background of the time is a beautiful photo that can also be purchased if the user wants so the website is really a photographer's photo marketplace but disguised as a site that tells the time. I want there to be a small transparent button for people to hover their curser over to get info on the art like artist, description of art, and price and then a link to a for sale page on that art. and then also a small button on the page for artists to learn about how to submit their own art for sale and for use as a background image for the site. Can this be done?"

### Code Generation Prompt

> create a photo marketplace disguised as a time display website. This system includes everything you need to manage background photos, artist profiles, and the sales functionality.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🚀 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic CMS** - Headless content management
- **Framer Motion** - Smooth animations and transitions

## 📋 Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the TimeArt content model

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd timeart-marketplace
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Cosmic credentials:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. **Run the development server**
```bash
bun run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🎨 Cosmic SDK Examples

### Fetching Featured Photos
```typescript
import { cosmic } from '@/lib/cosmic'

const response = await cosmic.objects
  .find({
    type: 'featured-photos',
    'metadata.is_active': true
  })
  .props(['id', 'title', 'metadata'])
  .depth(1)

const photos = response.objects
```

### Creating Artist Applications
```typescript
await cosmic.objects.insertOne({
  title: `Application from ${formData.name}`,
  type: 'artist-applications',
  metadata: {
    name: formData.name,
    email: formData.email,
    artist_statement: formData.statement,
    portfolio_samples: uploadedFiles,
    status: 'submitted',
    agreed_to_terms: true
  }
})
```

## 🎯 Cosmic CMS Integration

The application integrates with four main content types:

- **Featured Photos** (`featured-photos`) - Photo marketplace inventory with pricing and scheduling
- **Artists** (`artists`) - Photographer profiles with portfolios and commission rates  
- **Site Settings** (`site-settings`) - Global configuration including current featured photo
- **Artist Applications** (`artist-applications`) - New photographer onboarding workflow

All content is managed through your Cosmic dashboard with real-time updates to the live website.

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production
```env
COSMIC_BUCKET_SLUG=your-production-bucket-slug
COSMIC_READ_KEY=your-production-read-key
COSMIC_WRITE_KEY=your-production-write-key
```
<!-- README_END -->