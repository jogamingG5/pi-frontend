# Frontend Testing Links - StreetLeague

This document contains all the available routes and links in the StreetLeague Angular application for testing purposes.

## Server Information

**Development Server**: `http://localhost:4200`

To start the development server:
```bash
cd front/streetleague
npm start
```

---

## Available Routes

### 1. **Home / Root**
- **URL**: `http://localhost:4200/`
- **Description**: Redirects to the matches list page
- **Component**: Redirect to `/matches`

### 2. **Matches Pages**

#### 2.1 Matches List
- **URL**: `http://localhost:4200/matches`
- **Description**: Display all matches in a list format
- **Component**: `MatchListComponent`
- **Features**: View all matches, create new match (via modal), search/filter

#### 2.2 Match Details
- **URL**: `http://localhost:4200/matches/:id`
- **Description**: Display details of a specific match
- **Component**: `MatchDetailComponent`
- **Parameters**:
  - `:id` - Replace with actual match ID (e.g., `1`, `2`, `3`)

**Example Links**:
- `http://localhost:4200/matches/1`
- `http://localhost:4200/matches/2`
- `http://localhost:4200/matches/3`

---

### 3. **Events Pages**

#### 3.1 Events List
- **URL**: `http://localhost:4200/events`
- **Description**: Display all events in a list format
- **Component**: `EventListComponent`
- **Features**: View all events, create new event (via modal), search/filter

#### 3.2 Event Details
- **URL**: `http://localhost:4200/events/:id`
- **Description**: Display details of a specific event
- **Component**: `EventDetailComponent`
- **Parameters**:
  - `:id` - Replace with actual event ID (e.g., `1`, `2`, `3`)

**Example Links**:
- `http://localhost:4200/events/1`
- `http://localhost:4200/events/2`
- `http://localhost:4200/events/3`

---

## Testing Checklist

### General Navigation
- [ ] Home page redirects to `/matches`
- [ ] All main pages load without errors
- [ ] Navigation between pages works smoothly

### Matches Page Tests
- [ ] `/matches` loads the list of all matches
- [ ] Match cards display correctly
- [ ] Can open match detail view
- [ ] `/matches/:id` displays the correct match details
- [ ] Invalid match IDs handle gracefully

### Events Page Tests
- [ ] `/events` loads the list of all events
- [ ] Event cards display correctly
- [ ] Can open event detail view
- [ ] `/events/:id` displays the correct event details
- [ ] Invalid event IDs handle gracefully

### Error Handling
- [ ] Invalid routes redirect to `/matches` (wildcard route)
- [ ] Page not found scenarios are handled
- [ ] Network errors are displayed gracefully

### UI Components
- [ ] Badge components render correctly
- [ ] Confirm dialog appears when needed
- [ ] Loading spinner displays during data fetch
- [ ] Toast notifications appear for user feedback

---

## Quick Test URLs

Copy and paste any of these URLs into your browser:

```
http://localhost:4200/
http://localhost:4200/matches
http://localhost:4200/matches/1
http://localhost:4200/matches/2
http://localhost:4200/events
http://localhost:4200/events/1
http://localhost:4200/events/2
http://localhost:4200/invalid-route
```

---

## Notes

- The application is an Angular 21 Single Page Application (SPA)
- All routes are dynamically matched with `:id` parameters (match/event IDs)
- Invalid routes automatically redirect to `/matches`
- The default port for `ng serve` is `4200`, but it may differ if the port is already in use

---

## Additional Commands

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Watch mode
npm run watch
```

---

*Last Updated: April 11, 2026*
