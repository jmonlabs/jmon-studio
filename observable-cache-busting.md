# Observable Cache-Busting Guide

## Method 1: Version-based Import (Recommended)
```javascript
// In Observable, change the import URL to include a version/timestamp
import jm from "https://cdn.jsdelivr.net/gh/yourusername/jmon-studio@main/dist/jmon.esm.js?v=2024123001"

// Or use a commit hash
import jm from "https://cdn.jsdelivr.net/gh/yourusername/jmon-studio@abc123def/dist/jmon.esm.js"
```

## Method 2: Force Refresh with Cache Headers
```javascript
// Add cache-busting parameter
import jm from "https://cdn.jsdelivr.net/gh/yourusername/jmon-studio@main/dist/jmon.esm.js?" + Date.now()
```

## Method 3: Use Different CDN
```javascript
// Switch between CDNs to force refresh
// JSDelivr:
import jm from "https://cdn.jsdelivr.net/gh/yourusername/jmon-studio@main/dist/jmon.esm.js"

// Raw GitHub (slower but no cache):
import jm from "https://raw.githubusercontent.com/yourusername/jmon-studio/main/dist/jmon.esm.js"

// Unpkg:
import jm from "https://unpkg.com/jmon-studio@latest/dist/jmon.esm.js"
```

## Method 4: Observable Hard Refresh
1. In Observable: **Runtime > Clear cached modules**
2. Or restart the notebook entirely
3. Or use Private browsing mode

## Method 5: Test String to Verify Changes
Add this test in Observable to verify you have the new version:

```javascript
// Test if you have the new ABC improvements
testABC = {
  const testComp = {
    metadata: { title: "Test" },
    tracks: [{ notes: [
      { pitch: 68, duration: 0.25, time: 0 },
      { pitch: 64, duration: 0.5, time: 0.25 }
    ]}]
  };
  
  const result = jm.converters.abc(testComp);
  const hasNewFeatures = result.includes('L:1/8') && !result.includes('/4');
  
  return {
    abc: result,
    hasImprovements: hasNewFeatures,
    message: hasNewFeatures ? "✅ New version loaded!" : "❌ Old version - clear cache"
  };
}
```

## Method 6: Local Development Server
```bash
# In your local jmon-studio directory:
npm run dev

# Then in Observable use:
import jm from "http://localhost:5173/src/index.js"
```