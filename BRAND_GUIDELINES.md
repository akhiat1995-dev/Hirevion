# Hirevion Brand Guidelines

## Brand Overview

**Hirevion** is an AI-powered recruitment platform that connects exceptional talent with forward-thinking companies. Our name combines "Hire" (recruitment) with "Vision" (AI-powered insight).

### Tagline
**"Smart Hiring"** - Intelligent recruitment for modern businesses

---

## Logo Design

### Primary Logo
The Hirevion logo features a **pencil icon** combined with elegant typography:

- **Icon**: Stylized pencil with an orange accent dot
- **Symbolism**: 
  - Pencil = Creation, precision, editing, writing the future
  - Orange dot = Innovation, energy, AI-powered insight
  - Rotation = Dynamic, forward-thinking approach

### Logo Usage

**Primary Colors:**
- Navy Blue (#1A365D) - Trust, professionalism
- Navy Dark (#2C5282) - Depth, authority
- Orange (#F6AD55, #ED8936) - Energy, innovation, creativity

**Logo Variations:**
1. **Full Logo**: Icon + "Hirevion" wordmark
2. **Icon Only**: For favicon, app icons, small spaces
3. **Wordmark Only**: When icon won't fit

### Clear Space
Maintain minimum clear space around the logo equal to the height of the "H" in Hirevion.

---

## Color Palette

### Primary Colors
```css
--navy-900: #1A365D;    /* Primary brand color */
--navy-800: #2C5282;    /* Secondary brand color */
--orange-400: #F6AD55;  /* Accent - energy */
--orange-500: #ED8936;  /* Accent - highlights */
```

### Secondary Colors
```css
--warm-white: #F7F5F0;  /* Background */
--warm-50: #FDFBF7;     /* Light backgrounds */
--warm-100: #F2EFE9;    /* Borders, dividers */
--warm-200: #E6E2D8;    /* Subtle borders */
```

### Usage Guidelines
- **Navy Blue**: Primary actions, headers, trust elements
- **Orange**: CTAs, highlights, innovation indicators
- **Warm White**: Page backgrounds, cards
- **Gray tones**: Body text, secondary information

---

## Typography

### Primary Font: Playfair Display
- **Usage**: Headlines, brand name, important titles
- **Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold)
- **Style**: Elegant serif for premium feel

### Secondary Font: DM Sans
- **Usage**: Body text, UI elements, buttons
- **Weights**: 400 (Regular), 500 (Medium), 700 (Bold)
- **Style**: Clean sans-serif for readability

### Typography Scale
```
H1: 48-60px, Playfair Display Bold
H2: 32-40px, Playfair Display Semi-bold
H3: 24px, Playfair Display Semi-bold
Body: 16px, DM Sans Regular
Small: 14px, DM Sans Regular
Caption: 12px, DM Sans Medium
```

---

## Brand Voice

### Tone
- **Professional** but approachable
- **Innovative** but trustworthy
- **Intelligent** but human
- **Efficient** but thorough

### Key Messages
1. "Smart Hiring" - AI makes recruitment intelligent
2. "Find the Perfect Talent" - Precision matching
3. "AI-Powered Recruitment" - Technology-driven
4. "Connect. Analyze. Hire." - Process simplicity

### Language Guidelines
- Use active voice
- Avoid overly technical jargon
- Emphasize benefits, not just features
- Be inclusive and welcoming

---

## Visual Elements

### Icons
- **Style**: Lucide React icons, clean line style
- **Size**: 16-24px for UI, larger for features
- **Color**: Navy blue for standard, orange for actions

### Imagery
- **Style**: Professional, diverse, modern workplace
- **Tone**: Authentic, not stock-photo obvious
- **Subjects**: Diverse professionals, collaborative teams, modern offices

### Patterns
- **Paper Shadow**: Subtle elevation effect
- **Gradients**: Navy blue gradients for depth
- **Pencil Motif**: Can be used as decorative element

---

## Application Examples

### Website Header
```
[Logo Icon] Hirevion  [Nav Items]  [CTA Button]
```

### Button Styles
- **Primary**: Navy blue background, white text
- **Secondary**: White background, navy border
- **Accent**: Orange background (for special CTAs)

### Card Design
- Background: White or warm-50
- Border: 1px solid warm-200
- Shadow: Paper shadow effect
- Border Radius: 8px (rounded-lg)

---

## Do's and Don'ts

### ✅ Do
- Use the logo with clear space
- Maintain color consistency
- Use Playfair Display for headlines
- Keep the orange accent dot visible
- Apply paper shadows consistently

### ❌ Don't
- Stretch or distort the logo
- Change the logo colors
- Use low contrast color combinations
- Remove the orange accent dot
- Use overly decorative fonts

---

## Brand Assets

### Files Included
1. `logo.svg` - Primary logo (scalable)
2. `favicon.ico` - Browser favicon
3. Brand colors in Tailwind config
4. Typography loaded via Google Fonts

### Usage in Code
```jsx
// Logo in Navbar
<div className="relative w-10 h-10">
  <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg transform rotate-12">
    <Pencil className="text-white transform -rotate-12" />
  </div>
  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
</div>

// Brand name
<span className="font-serif text-2xl font-bold text-navy-900">Hirevion</span>
<span className="text-[10px] text-orange-500 font-medium tracking-[0.2em] uppercase">Smart Hiring</span>
```

---

## Contact & Support

For brand questions or asset requests:
- Brand Manager: brand@hirevion.com
- Design Team: design@hirevion.com

---

**Last Updated**: 2024
**Version**: 1.0
**Brand Owner**: Hirevion Inc.
