# ExerciseDB API - GitHub Copilot Instructions

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Overview

ExerciseDB API is a comprehensive fitness exercise database API built with Bun, TypeScript, and Hono framework. It provides access to 1500+ structured exercises with detailed metadata including target muscles, equipment, instructions, and GIF images.

## Working Effectively

### Bootstrap and Setup
- **Install Bun runtime first** (required for this project):
  ```bash
  curl -fsSL https://bun.sh/install | bash
  source ~/.bashrc
  ```
- **Install dependencies**:
  ```bash
  bun install
  ```
  - Takes ~16 seconds
  - NEVER CANCEL: Set timeout to 60+ seconds minimum

### Build Process
- **Build the project**:
  ```bash
  bun run build
  ```
  - Takes ~1-2 seconds (very fast)
  - Compiles TypeScript and resolves path aliases
  - Outputs to `dist/` directory

### Development Workflow
- **Start development server**:
  ```bash
  bun run dev:node
  ```
  - **CRITICAL**: The default `bun run dev` requires root privileges (port 80)
  - Uses Node.js with Hono adapter for development
  - Customizable port with `PORT=3000 bun run dev:node`
  - Access at http://localhost:3000
  - API endpoints at http://localhost:3000/api/v1/*
  - Swagger docs at http://localhost:3000/docs
  - **NOTE**: Requires build first, no hot reload (use `bun run build` after changes)

- **Alternative Bun development** (requires root/sudo):
  ```bash
  sudo bun run dev
  ```
  - Only use if you have root access
  - Provides hot reload functionality

- **Start production server**:
  ```bash
  PORT=3000 bun start
  ```
  - Runs the compiled version from `dist/`
  - Must build first with `bun run build`

### Code Quality
- **Run linter**:
  ```bash
  bun run lint
  ```
  - Takes ~1-2 seconds
  - Uses ESLint with TypeScript
  - Currently passes with warnings (expected)

- **Format code**:
  ```bash
  bun run format
  ```
  - Takes ~1-2 seconds
  - Uses Prettier for consistent formatting
  - Formats all .js, .ts, .json files

- **Fix linting issues**:
  ```bash
  bun run lint:fix
  ```

### Testing
- **Run tests**:
  ```bash
  bun run test
  ```
  - Uses Vitest
  - **NOTE**: Currently no test files exist (this is expected)
  - Test configuration exists in `vitest.config.ts`

## Validation Scenarios

**ALWAYS manually validate any changes by testing these core scenarios:**

### 1. API Functionality Test
```bash
# Start development server first
bun run dev:node &
SERVER_PID=$!

# Test main exercises endpoint
curl "http://localhost:3000/api/v1/exercises?limit=2"

# Test exercise by ID
curl "http://localhost:3000/api/v1/exercises/VPPtusI"

# Test body parts endpoint  
curl "http://localhost:3000/api/v1/bodyparts"

# Test muscles endpoint
curl "http://localhost:3000/api/v1/muscles"

# Test equipment endpoint
curl "http://localhost:3000/api/v1/equipments"

# Stop server
kill $SERVER_PID
```

### 2. Documentation Test
- Navigate to http://localhost:3000/docs
- Verify Swagger UI loads correctly
- Test at least one API endpoint through the UI

### 3. Build Validation
- Always run `bun run build` after making changes
- Verify no TypeScript compilation errors
- Test both development and production servers work

## Timing Expectations and Timeouts

| Command | Expected Time | Minimum Timeout | Notes |
|---------|---------------|-----------------|-------|
| `bun install` | ~16 seconds | 60+ seconds | NEVER CANCEL |
| `bun run build` | ~1-2 seconds | 30 seconds | Very fast build |
| `bun run lint` | ~1-2 seconds | 30 seconds | Passes with warnings |
| `bun run format` | ~1-2 seconds | 30 seconds | Formats all files |
| `bun run test` | <1 second | 30 seconds | No tests currently exist |
| Server startup | ~1-2 seconds | 30 seconds | Development or production |

## Repository Structure

### Key Directories
```
src/
├── modules/           # Main API modules
│   ├── exercises/     # Exercise endpoints and logic
│   ├── muscles/       # Muscle endpoints  
│   ├── bodyparts/     # Body parts endpoints
│   └── equipments/    # Equipment endpoints
├── data/              # JSON data files (large datasets)
├── common/            # Shared types and utilities
├── middleware/        # HTTP middleware
└── pages/             # HTML pages (home, docs)

dist/                  # Compiled output (after build)
.github/workflows/     # CI/CD pipelines
api/                   # Vercel deployment entry point
```

### Important Files
- `src/server.ts` - Main server entry point (Bun native, port 80)
- `src/vercel.ts` - Vercel deployment entry point  
- `src/app.ts` - Application setup and middleware
- `dev-server.js` - Development server script (Node.js, configurable port)
- `src/data/exercises.json` - Main exercise dataset (25k+ lines)
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vercel.json` - Deployment configuration

## Development Guidelines

### Making Changes
- **Always build and test locally before committing**:
  ```bash
  bun run build
  bun run lint
  bun run format
  PORT=3000 bun run dev
  # Test API endpoints manually
  ```

### Code Architecture
- Uses **Hono framework** for HTTP routing
- **Clean Architecture** with modules, controllers, services, use-cases
- **OpenAPI/Swagger** for API documentation
- **Path aliases** configured (#modules/*, #common/*, #infra/*)

### Data Layer
- **Static JSON files** in `src/data/` (no database)
- **Fuse.js** for fuzzy search functionality
- Large exercise dataset (~1500 exercises)

### Common Tasks
- **Adding new exercises**: Edit `src/data/exercises.json`
- **API endpoints**: Located in `src/modules/*/controllers/`
- **Business logic**: Located in `src/modules/*/use-cases/`
- **Data models**: Located in `src/modules/*/types/`

## Deployment

The repository has automated deployment to both staging and production environments:

### Staging Deployment (Automatic)
- **Triggers**: Every push to `main` branch and pull requests
- **Workflow**: `.github/workflows/ci.yaml`
- **Platform**: Vercel staging environment
- **Process**: `bun install` → Vercel deployment (no build step required)

### Production Deployment (Automatic)
- **Triggers**: When git tags are pushed (e.g., `git tag v1.0.1 && git push origin v1.0.1`)
- **Workflow**: `.github/workflows/release.yaml`
- **Platform**: Vercel production environment
- **Process**: `bun install` → Vercel deployment

### Technical Configuration
- **Entry point**: `api/index.ts` (Vercel-compatible Hono Node.js adapter)
- **Configuration**: `vercel.json` handles routing, headers, and deployment settings
- **Authentication**: Uses Vercel secrets configured in GitHub repository settings
- **Runtime**: Bun in CI pipeline, Node.js adapter for Vercel compatibility

### Local Deployment Testing
```bash
bun run build
PORT=3000 bun start
```

## Troubleshooting

### Common Issues
1. **Port permission denied**: Always use `PORT=3000` (or other non-privileged port)
2. **Bun not found**: Install Bun runtime first
3. **Build fails**: Check TypeScript errors with `bun run build`
4. **Server won't start**: Verify port is available and not in use

### Environment Requirements
- **Bun runtime** (primary requirement)
- **Node.js 20+** (for compatibility)
- **Linux/macOS** (primary platforms)

Remember: This API serves static exercise data and requires no database setup. Focus on TypeScript compilation, API endpoint functionality, and proper HTTP responses when making changes.