# SmarTax SBA Project

SmarTax is a beginner-friendly single-page app that helps users explore tax-learning content and practice simple API interactions.

## Features
- Search and browse tax-themed article content from an external API.
- Move through paginated results with Previous/Next buttons.
- Create a new tax question draft using a POST request.
- Update an existing draft title using a PATCH request.
- Uses asynchronous JavaScript with both async/await and Promise `.then()` syntax.
- Organized into multiple JavaScript modules.

## Tech Used
- HTML
- CSS
- JavaScript (ES modules)
- Fetch API
- JSONPlaceholder API (`https://jsonplaceholder.typicode.com`)

## Project Structure
- `index.html` - app layout.
- `style.css` - styling and responsive design.
- `js/api.js` - API calls.
- `js/state.js` - app state management.
- `js/ui.js` - DOM rendering helpers.
- `js/main.js` - event handlers and app startup.

## Notes
JSONPlaceholder is a mock API. POST/PATCH requests return successful demo responses without permanently saving data on the server.
