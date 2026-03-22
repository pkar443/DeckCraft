# DeckCraft

DeckCraft is a premium AI-powered SaaS for generating **editable HTML-based presentation slides** from a prompt or uploaded content.  
It combines **structured slide generation**, **premium template-driven rendering**, **AI-assisted visuals**, and a **visual editor** so users can generate a deck quickly and then refine it manually before export.

---

## Overview

The goal of DeckCraft is to solve a common problem:

Users want AI to create beautiful slides fast, but they also want control after generation.

Instead of generating one large raw HTML blob, DeckCraft uses a **structured deck JSON schema** as the source of truth.  
Slides are then rendered through a controlled template system into premium HTML layouts.

This gives four major advantages:

- consistent visual quality
- easier editing
- theme switching
- reliable export to PDF

---

## Core Features

### AI-powered deck generation
- prompt to outline
- outline to full deck JSON
- slide-by-slide content generation
- AI-assisted image prompt generation
- AI revision for individual slides

### Premium template system
- fixed slide layouts
- modern design tokens
- controlled spacing and typography
- theme-based styling
- predictable visual hierarchy

### HTML slide editor
- inline text editing
- image replace/regenerate
- slide reorder
- duplicate/delete slides
- switch layouts
- switch themes

### Visual generation
- AI-generated hero images
- structured charts
- SVG/HTML diagrams
- icon-based callout cards

### Export
- export deck to PDF
- export-safe HTML rendering
- fixed 16:9 slide dimensions

---

## Product Principles

DeckCraft follows these principles:

1. **Structured data first**  
   Decks are stored as JSON, not raw HTML.

2. **AI decides content, not layout freedom**  
   AI selects and fills templates rather than inventing arbitrary CSS layouts.

3. **Premium feel comes from discipline**  
   Typography, spacing, visual hierarchy, image treatment, and layout consistency matter more than random fancy graphics.

4. **Editing is a first-class feature**  
   Users should be able to improve AI-generated slides instead of starting over.

5. **Version 1 prioritizes polish over too many features**  
   Better quality and reliability are more important than endless flexibility.

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- dnd-kit
- Lucide Icons

### Backend
- Next.js route handlers / server actions
- TypeScript
- Zod validation

### Database
- PostgreSQL
- Prisma ORM

### Storage
- Cloudflare R2 or S3-compatible storage

### Auth
- Clerk or Auth.js

### Billing
- Stripe

### AI
- OpenAI API for:
  - outline generation
  - slide content generation
  - structured JSON output
  - rewrite actions
  - image prompt generation

### Export
- Playwright for PDF export

### Hosting
- Vercel
- Neon PostgreSQL
- Cloudflare R2

---

## Application Flow

### 1. User creates a deck
The user enters:
- topic/prompt
- audience
- tone
- slide count
- content type
- optional source notes or file upload
- optional AI visual generation

### 2. AI generates outline
The system creates:
- deck title
- optional subtitle
- slide titles
- slide intent
- suggested template type
- visual need per slide

### 3. User reviews outline
The user can:
- accept outline
- regenerate outline
- edit titles manually

### 4. AI generates deck JSON
The system creates:
- all slide content
- template mapping
- chart/diagram structure
- image prompts where needed

### 5. Editor opens
The deck loads in the visual editor:
- left sidebar: thumbnails
- center: slide canvas
- right sidebar: properties / AI actions
- top toolbar: save, theme, export

### 6. User edits and exports
The user can:
- change text
- switch layout
- replace image
- regenerate image
- reorder slides
- export to PDF

---

## Project Structure

```bash
deckcraft/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── decks/
│   ├── settings/
│   └── api/
├── components/
│   ├── editor/
│   ├── slides/
│   ├── ui/
│   ├── charts/
│   ├── diagrams/
│   ├── theme/
│   └── thumbnails/
├── lib/
│   ├── ai/
│   ├── db/
│   ├── schema/
│   ├── export/
│   ├── storage/
│   ├── layout/
│   ├── themes/
│   └── utils/
├── prisma/
├── public/
├── styles/
├── scripts/
├── reference-notes/
├── .env.example
├── package.json
└── README.md
