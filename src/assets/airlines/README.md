# Airline Logos

## How to Add Your PNG Logos

1. **Add your PNG files to this directory** with the following names:
   - `emirates.png`
   - `etihad.png`
   - `qatar-airways.png`
   - `turkish-airlines.png`
   - `air-sial.png`
   - `flydubai.png`
   - `pia.png`
   - `jazeera-airways.png`

2. **Update `/components/HomePage.tsx`**:
   
   Find the import section at the top of the file and **uncomment** these lines:
   ```javascript
   // Import airline logos
   // TODO: Uncomment these lines after adding your PNG files to /assets/airlines/
   // import emiratesLogo from '../assets/airlines/emirates.png';
   // import etihadLogo from '../assets/airlines/etihad.png';
   // import qatarLogo from '../assets/airlines/qatar-airways.png';
   // import turkishLogo from '../assets/airlines/turkish-airlines.png';
   // import airSialLogo from '../assets/airlines/air-sial.png';
   // import flyDubaiLogo from '../assets/airlines/flydubai.png';
   // import piaLogo from '../assets/airlines/pia.png';
   // import jazeeraLogo from '../assets/airlines/jazeera-airways.png';
   ```

   They should look like this after uncommenting:
   ```javascript
   // Import airline logos
   import emiratesLogo from '../assets/airlines/emirates.png';
   import etihadLogo from '../assets/airlines/etihad.png';
   import qatarLogo from '../assets/airlines/qatar-airways.png';
   import turkishLogo from '../assets/airlines/turkish-airlines.png';
   import airSialLogo from '../assets/airlines/air-sial.png';
   import flyDubaiLogo from '../assets/airlines/flydubai.png';
   import piaLogo from '../assets/airlines/pia.png';
   import jazeeraLogo from '../assets/airlines/jazeera-airways.png';
   ```

3. **Update the airlines array** in the same file:
   
   Find the `airlines` constant and replace the URL strings with the imported variables:
   ```javascript
   const airlines = [
     { name: 'Emirates', logo: emiratesLogo },
     { name: 'Etihad Airways', logo: etihadLogo },
     { name: 'Qatar Airways', logo: qatarLogo },
     { name: 'Turkish Airlines', logo: turkishLogo },
     { name: 'Air Sial', logo: airSialLogo },
     { name: 'Fly Dubai', logo: flyDubaiLogo },
     { name: 'PIA', logo: piaLogo },
     { name: 'Jazeera Airways', logo: jazeeraLogo },
   ];
   ```

## Logo Requirements

- **Format**: PNG with transparent background (recommended)
- **Size**: Recommended width: 200-400px, height: 100-200px
- **Aspect Ratio**: Logos will be contained within 160px × 96px cards
- **File Size**: Keep under 100KB per logo for optimal loading

## Notes

- The carousel currently shows placeholder images from Unsplash
- Once you add your PNG files and update the imports, the placeholders will be replaced with your actual logos
- The logos will automatically have a grayscale filter that transitions to color on hover
