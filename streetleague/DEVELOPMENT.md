# 🚀 Street League Frontend - Development Guide

## Project Status
✅ **Frontend Implementation Complete**
- Angular 21+ with Standalone Components
- Tailwind CSS styling
- Full CRUD pages for Matches and Events
- Real-time form validation
- Error handling and toast notifications

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ (comes with npm)
- Backend API running on `http://localhost:8081/streetleague/api`

### Install Dependencies
```bash
cd front/streetleague
npm install
```

---

## 🏃 Running the Application

### Development Server
```bash
cd front/streetleague
npm start
```
or
```bash
ng serve
```

The app will be available at: **http://localhost:4200**

### Production Build
```bash
npm run build
```
Output: `dist/streetleague/`

---

## 📁 Project Structure

```
src/app/
├── models/                 # TypeScript interfaces
│   ├── match.model.ts
│   └── event.model.ts
├── services/               # HTTP services
│   ├── match.service.ts
│   └── event.service.ts
├── components/             # Reusable components
│   ├── badge.component.ts
│   ├── toast.component.ts
│   ├── confirm-dialog.component.ts
│   └── loading-spinner.component.ts
├── pages/                  # Routed pages
│   ├── match-list/
│   │   ├── match-list.component.ts
│   │   ├── match-list.component.html
│   │   └── match-modal.component.ts
│   ├── match-detail/
│   │   ├── match-detail.component.ts
│   │   └── match-detail.component.html
│   ├── event-list/
│   │   ├── event-list.component.ts
│   │   ├── event-list.component.html
│   │   └── event-modal.component.ts
│   └── event-detail/
│       ├── event-detail.component.ts
│       └── event-detail.component.html
├── utils/
│   └── constants.ts        # API URLs & constants
├── app.routes.ts           # Route definitions
├── app.config.ts           # Angular config (HT TP provider)
├── app.ts                  # Root component
└── app.html                # Root template with nav

```

---

## 🔗 API Integration

### Base URL
```typescript
const API_BASE_URL = 'http://localhost:8081/streetleague/api';
```

### Services
All HTTP calls are made through:
- `MatchService` → `/api/matchs` endpoints
- `EventService` → `/api/events` endpoints

**Note:** Update the base URL in [utils/constants.ts](src/app/utils/constants.ts) if your backend runs on a different port.

---

## 🔀 Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/matches` | MatchListComponent | View all matches with CRUD actions |
| `/matches/:id` | MatchDetailComponent | View match details |
| `/events` | EventListComponent | View all events with CRUD actions |
| `/events/:id` | EventDetailComponent | View event details + related matches |
| `/` | Redirects to `/matches` | Home page |

---

## 🎨 Design System

### Colors (Tailwind)
- **Primary:** Blue (`bg-blue-500`)
- **Success:** Green (`bg-green-500`)
- **Danger:** Red (`bg-red-500`)
- **Status Badges:** 
  - `SCHEDULED` → Blue
  - `ONGOING` → Green
  - `COMPLETED` → Gray
  - `CANCELLED` → Red
- **Type Badges:**
  - `LEAGUE` → Purple
  - `FRIENDLY` → Amber

### Typography
- Titles: 2xl-3xl font-bold
- Labels: text-sm font-semibold
- Body: text-sm/base text-gray-700

---

## 🛠️ Development Workflow

### 1. **Creating a New Feature**
- Create components in `pages/` for pages or `components/` for reusables
- Use standalone components with `standalone: true`
- Always type variables (avoid `any`)
- Use signals for state management

### 2. **Adding an API Endpoint**
- Add method to service in `services/`
- Import service via `inject()`
- Call from component with `.subscribe()`

### 3. **Form Handling**
- Use `FormsModule` for `[(ngModel)]` binding
- Add validation in component before submit
- Handle API response errors (400, 500, etc.)

### 4. **Error Handling**
- Check error status codes (404, 400, 500)
- Display field-level errors for 400s
- Show toast notifications for success/error

---

## 📋 Form Validation

### Match Form
Required fields:
- Team 1 ID
- Team 2 ID
- Terrain ID
- Date
- Time (Heure)
- Sport ID
- Status
- Type

### Event Form
Required fields:
- Event Name (Nom)
- Date Début
- Date Fin (must be ≥ Date Début)
- Type
- Sport ID

Optional:
- Description
- Teams IDs

---

## 🐛 Common Issues & Solutions

### Build Error: "Can't bind to property X"
**Cause:** Missing import in component
**Fix:** Add to `imports` array in `@Component` decorator

### Forms not updating
**Cause:** Missing `FormsModule`
**Fix:** Import `FormsModule` in component

### API calls returning 404
**Cause:** Backend not running or wrong base URL
**Fix:** 
1. Ensure backend is running on `http://localhost:8081`
2. Check `constants.ts` has correct base URL

### Signals not reactive in template
**Cause:** Forgetting to call `signal()` in template
**Fix:** Use `{{ mySignal() }}` not `{{ mySignal }}`

---

## 🧪 Testing (Future Enhancement)

Project is set up with Vitest. To run tests:
```bash
npm run test
```

---

## 📚 Dependencies

### Core
- `@angular/core` - Angular framework
- `@angular/router` - Routing
- `@angular/common` - Common utilities
- `@angular/forms` - Forms support
- `rxjs` - Reactive programming

### Build/Dev
- `@angular/cli` - CLI tools
- `tailwindcss` - Styling
- `typescript` - Type safety
- `vitest` - Testing (setup ready)

---

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Serve Dist Locally
```bash
npx serve dist/streetleague
```
Available at: `http://localhost:3000`

### Deploy to Cloud
- Firebase Hosting
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static host

---

## 📝 Environment Variables (Future)

Create `.env` for different environments:
```
VITE_API_URL=http://localhost:8081/streetleague/api
VITE_ENV=development
```

Then update `constants.ts`:
```typescript
export const API_BASE_URL = process.env['NG_APP_API_URL'] || 'http://localhost:8081/streetleague/api';
```

---

## 🔐 Authentication (Phase 2)

Currently NOT implemented. Will be added with:
- Login page at `/login`
- JWT token handling
- Route guards for protected pages
- Token refresh logic

---

## 💡 Best Practices

✅ **DO:**
- Use standalone components
- Inject services with `inject()`
- Use signals for state
- Add proper error handling
- Type everything
- Keep services focused
- Use async pipes in templates

❌ **DON'T:**
- Use `any` type
- Create class-based components
- Make HTTP calls in components
- Forget to unsubscribe (signals handle this)
- Hardcode URLs/configs

---

## 🔗 Useful Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Signals Guide](https://angular.io/guide/signals)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [RxJS Guide](https://rxjs.dev)
- [Angular Router Guide](https://angular.io/guide/router)

---

## 📧 Support & Questions

For issues or clarifications:
1. Check the [FRONTEND_GENERATION_GUIDE.md](../../FRONTEND_GENERATION_GUIDE.md) for architecture details
2. Review backend API contract in the guide
3. Create an issue in the repository
4. Reach out to the team lead

---

**Last Updated:** April 11, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
