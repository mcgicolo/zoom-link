# MCGI Zoom Meeting Generator

A beautiful, mobile-first web application that generates personalized Zoom meeting links with properly formatted display names.

## Features

- 📱 Mobile-first responsive design
- ✨ Typeform-style one-question-at-a-time interface
- 🎨 Modern, clean UI with smooth animations
- 🔒 Privacy-focused - no data is stored
- 📋 One-click copy and join functionality

## Configuration

To use this with your own Zoom meeting, update the configuration in `index.html`:

```javascript
const ZOOM_CONFIG = {
    meetingId: '3337772323',  // Replace with your meeting ID
    password: 'ZOOM_PASS'      // Replace with your meeting password
};
```

## GitHub Pages Deployment

This project is designed to work perfectly with GitHub Pages. Simply:

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select "main" branch as the source
4. Your site will be available at `https://yourusername.github.io/repo-name/`

## Usage

Users will be guided through:
1. Selecting their title (Sister/Brother)
2. Entering their first name
3. Entering their last name
4. Selecting their locale from a dropdown
5. Reviewing and agreeing to service guidelines
6. Receiving their personalized Zoom link

## License

MIT License - feel free to use and modify as needed.
