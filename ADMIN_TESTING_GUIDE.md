# 🧪 Admin Dashboard Testing Guide

Complete testing guide for all admin features. Follow this checklist to verify everything works correctly.

## 🚀 Getting Started

1. **Start Dev Server**:
   ```bash
   bun run dev
   ```

2. **Access Admin**:
   - Login: http://localhost:4321/admin/login
   - Dashboard: http://localhost:4321/admin

---

## 1️⃣ Login Page (`/admin/login`)

### Test Cases

**✅ UI Check**:
- [ ] Page loads without errors
- [ ] Logo and title displayed correctly
- [ ] Form is centered and styled properly
- [ ] Dark mode toggle works

**✅ Form Validation**:
- [ ] Email field is required
- [ ] Password field is required
- [ ] Show/hide password toggle works
- [ ] Remember me checkbox clickable

**✅ Login Functionality**:
- [ ] Enter: `admin@technologiya.com` / `admin123`
- [ ] Click "Shiga" button
- [ ] Loading spinner appears
- [ ] Redirects to `/admin` on success

**✅ Error Handling**:
- [ ] Enter wrong email/password
- [ ] Error message displayed: "Imel ko kalmar sirri ba daidai ba ne"
- [ ] Form stays on page

**✅ Navigation**:
- [ ] "Koma zuwa shafin" link goes to homepage

---

## 2️⃣ Dashboard (`/admin`)

### Test Cases

**✅ Statistics Cards**:
- [ ] 4 cards displayed (Articles, Readers, Views, Trending)
- [ ] Numbers formatted correctly (12,543 with commas)
- [ ] Icons displayed properly
- [ ] Cards responsive on mobile

**✅ Quick Actions**:
- [ ] "Rubuta Sabon Labari" → `/admin/articles/new`
- [ ] "Sarrafa Kalmomi" → `/admin/categories`
- [ ] "Sarrafa Marubuta" → `/admin/authors`
- [ ] All buttons clickable and navigate correctly

**✅ Recent Articles**:
- [ ] 4 recent articles displayed
- [ ] Status badges show (Published/Draft)
- [ ] Views count displayed
- [ ] "Gyara" button works
- [ ] Table scrolls on mobile

**✅ Sidebar**:
- [ ] Logo displayed
- [ ] All 6 navigation items visible
- [ ] Badge shows "12" on "Labarai"
- [ ] Active state highlights current page
- [ ] User section at bottom shows avatar and email
- [ ] Mobile menu toggle works (hamburger icon)

---

## 3️⃣ Articles List (`/admin/articles`)

### Test Cases

**✅ Search Functionality**:
- [ ] Search box displayed
- [ ] Type "AI" → filters to AI articles
- [ ] Type "Kano" → shows Kano article
- [ ] Clear search → shows all articles

**✅ Status Filter**:
- [ ] "Duka" shows all articles
- [ ] "An buga" shows only published
- [ ] "Daftari" shows only drafts
- [ ] Filter counts update correctly

**✅ Articles Table**:
- [ ] All columns displayed: Title, Category, Author, Status, Views, Date, Actions
- [ ] Status badges colored correctly (green=published, yellow=draft)
- [ ] Views formatted with commas
- [ ] Dates show in Hausa format

**✅ Actions**:
- [ ] "Gyara" button → `/admin/articles/edit/[id]`
- [ ] "Share" button shows confirmation
- [ ] Table scrolls horizontally on mobile

---

## 4️⃣ New Article (`/admin/articles/new`)

### Test Cases

**✅ Header**:
- [ ] Title: "Rubuta Sabon Labari"
- [ ] Description displayed
- [ ] "Duba Samfurin" button present
- [ ] "Adana Daftari" and "Buga Labarin" buttons visible

**✅ Form Fields**:
- [ ] **Title**: Type "Test Article" → slug auto-generates
- [ ] **Slug**: Shows in monospace font, editable
- [ ] **Excerpt**: Textarea with 3 rows
- [ ] **Content**: Rich text editor loads
- [ ] **Category**: Dropdown with 6 categories
- [ ] **Tags**: Add tag input and "Ƙara" button work
- [ ] **Cover Image**: URL input and upload button

**✅ Rich Text Editor**:
- [ ] Toolbar displays all buttons
- [ ] **Bold** (Ctrl+B) works
- [ ] **Italic** (Ctrl+I) works
- [ ] **Underline** works
- [ ] **Code** (monospace) works
- [ ] **H2** heading works
- [ ] **H3** heading works
- [ ] **Bullet list** works
- [ ] **Numbered list** works
- [ ] **Align left** works
- [ ] **Align center** works
- [ ] **Align right** works
- [ ] **Align justify** works
- [ ] **Link** button prompts for URL
- [ ] **Image** button prompts for URL
- [ ] Editor has min 400px height
- [ ] Placeholder text shows when empty
- [ ] Dark mode styling works

**✅ Tags Management**:
- [ ] Type tag and press Enter → adds tag
- [ ] Click "Ƙara" button → adds tag
- [ ] Click X on tag → removes tag
- [ ] Duplicate tags prevented

**✅ Preview Mode**:
- [ ] Click "Duba Samfurin" → switches to preview
- [ ] Preview shows article with full styling
- [ ] Category badge displayed
- [ ] Author info shown
- [ ] Date and reading time calculated
- [ ] Tags displayed as badges
- [ ] Cover image shown
- [ ] Content rendered with prose styling
- [ ] Click "Gyara" → back to edit mode

**✅ Save Functionality**:
- [ ] Click "Adana Daftari" → saves as draft
- [ ] Click "Buga Labarin" → publishes
- [ ] Loading state: "Ana adanawa..."
- [ ] Alert shows success message
- [ ] Validation: Empty title shows error
- [ ] Validation: Empty content shows error
- [ ] Validation: Empty category shows error

---

## 5️⃣ Edit Article (`/admin/articles/edit/1`)

### Test Cases

**✅ Page Load**:
- [ ] Navigate to `/admin/articles/edit/1`
- [ ] Page loads without errors
- [ ] Header shows "Gyara Labarin" (not "Rubuta Sabon")

**✅ Data Loading**:
- [ ] Title field pre-filled
- [ ] Slug field pre-filled
- [ ] Excerpt field pre-filled
- [ ] Content editor shows existing content
- [ ] Category pre-selected
- [ ] Tags displayed
- [ ] Cover image URL pre-filled

**✅ Editing**:
- [ ] Change title → slug updates
- [ ] Modify content in editor
- [ ] Add new tags
- [ ] Remove existing tags
- [ ] Change category
- [ ] Update cover image

**✅ Save Functionality**:
- [ ] Button shows "Sabunta" (not "Buga Labarin")
- [ ] Click "Sabunta" → updates article
- [ ] Alert shows success message
- [ ] Can toggle preview mode
- [ ] All editor features work same as new article

---

## 6️⃣ Categories Manager (`/admin/categories`)

### Test Cases

**✅ List View**:
- [ ] Grid shows 4 categories
- [ ] Each card has colored icon
- [ ] Category name displayed
- [ ] Description shown
- [ ] Slug displayed in monospace
- [ ] Article count: "12 labarai"
- [ ] "Gyara" and "Share" buttons visible
- [ ] Grid responsive (3 cols → 2 cols → 1 col)

**✅ Add Category**:
- [ ] Click "Ƙara Sabuwar Kalma" → modal opens
- [ ] Modal title: "Ƙara Sabuwar Kalma"
- [ ] **Name** field required
- [ ] Type name → slug auto-generates
- [ ] **Slug** field editable
- [ ] **Description** textarea
- [ ] **Color picker** shows color input
- [ ] Color preview circle displays chosen color
- [ ] Can type hex color: `#FF5733`
- [ ] Click "Ajiye" → adds category
- [ ] Click "Soke" → closes modal
- [ ] Click outside modal → closes modal

**✅ Edit Category**:
- [ ] Click "Gyara" on existing category
- [ ] Modal shows "Gyara Kalma" title
- [ ] All fields pre-filled with category data
- [ ] Change name, description, color
- [ ] Click "Ajiye" → updates category
- [ ] Changes reflect in grid immediately

**✅ Delete Category**:
- [ ] Click "Share" button
- [ ] If category has articles → error alert
- [ ] Message: "Ba za ka iya share..." (cannot delete)
- [ ] If no articles → deletes successfully

---

## 7️⃣ Authors Manager (`/admin/authors`)

### Test Cases

**✅ List View**:
- [ ] Grid shows 3 authors
- [ ] Avatar images displayed
- [ ] Author name
- [ ] Role displayed
- [ ] Bio text (truncated)
- [ ] Email address
- [ ] Article count: "25 labarai"
- [ ] "Gyara" and "Share" buttons
- [ ] Grid responsive (3 cols → 1 col)

**✅ Add Author**:
- [ ] Click "Ƙara Sabon Marubucin" → modal opens
- [ ] **Name** field required
- [ ] **Email** field required (email validation)
- [ ] **Role** dropdown with 4 options
- [ ] **Bio** textarea
- [ ] **Avatar URL** optional
- [ ] Avatar preview shows
- [ ] If no avatar → auto-generates from name (UI Avatars)
- [ ] Click "Ajiye" → adds author
- [ ] New author appears in grid
- [ ] Avatar auto-generated if URL empty

**✅ Edit Author**:
- [ ] Click "Gyara" on existing author
- [ ] Modal shows "Gyara Bayanan Marubucin"
- [ ] All fields pre-filled
- [ ] Change name, email, role, bio, avatar
- [ ] Avatar preview updates
- [ ] Click "Ajiye" → updates author

**✅ Delete Author**:
- [ ] Click "Share" button
- [ ] If author has articles → error alert
- [ ] Message: "Ba za ka iya share..."
- [ ] If no articles → deletes successfully

---

## 8️⃣ Settings Panel (`/admin/settings`)

### Test Cases

**✅ Sidebar Navigation**:
- [ ] 6 sections listed
- [ ] Icons displayed for each section
- [ ] Active section highlighted
- [ ] Click each section → content changes

**✅ Site Settings (Saitunan Gaba ɗaya)**:
- [ ] **Sunan Shafin**: Editable, shows "Technologiya"
- [ ] **Bayanin Shafin**: Textarea with description
- [ ] **URL ɗin Shafin**: URL input
- [ ] **Imel ɗin Tuntuɓa**: Email input
- [ ] **Harshe**: Dropdown (Hausa/English)
- [ ] **Yankin Lokaci**: Dropdown (3 timezones)
- [ ] All fields editable

**✅ SEO Settings**:
- [ ] **Meta Title**: Input with character counter (60)
- [ ] **Meta Description**: Textarea with counter (160)
- [ ] **Meta Keywords**: Input with hint "Raba da koma"
- [ ] **Open Graph Image**: URL input with size hint
- [ ] **Twitter Handle**: Input with placeholder "@technologiya"
- [ ] Character counts update as you type

**✅ User Settings (Masu Amfani)**:
- [ ] 4 toggle switches displayed
- [ ] **Rijista Sabon Asusu**: Toggle works
- [ ] **Tabbatar da Imel**: Toggle works
- [ ] **Barin Sharhi**: Toggle works
- [ ] **Duba Sharhi**: Toggle works
- [ ] Toggle animations smooth
- [ ] All toggles functional

**✅ Other Sections**:
- [ ] **Imel**: Shows blue info box
- [ ] **Tsaro**: Shows blue info box
- [ ] **Database**: Shows blue info box
- [ ] Info message: "... bayan an gama haɗawa"

**✅ Save Functionality**:
- [ ] "Ajiye Canje-canje" button at bottom
- [ ] Click button → console log shows saved data
- [ ] Success message: "✓ An ajiye saitunan"
- [ ] Success message disappears after 3 seconds
- [ ] Button works from any section

---

## 🎨 Visual/UX Testing

### Responsive Design
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Sidebar collapses on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Grids adjust column count
- [ ] Modals centered on all screens

### Dark Mode
- [ ] Toggle dark mode on homepage
- [ ] Navigate to admin → dark mode persists
- [ ] All admin pages have dark mode styling
- [ ] Colors readable in dark mode
- [ ] Borders visible in dark mode
- [ ] Forms styled correctly in dark mode

### Animations & Transitions
- [ ] Hover effects on buttons
- [ ] Active states on navigation
- [ ] Modal fade in/out
- [ ] Loading spinner rotates
- [ ] Toggle switches animate
- [ ] Sidebar slide in/out (mobile)

### Typography
- [ ] Headings use Fira Code (monospace)
- [ ] Body text readable
- [ ] Hausa characters display correctly
- [ ] Code/slug fields use monospace
- [ ] Font sizes appropriate

### Icons
- [ ] All icons load from react-icons
- [ ] Icons properly sized
- [ ] Icons colored correctly
- [ ] Icons visible in dark mode

---

## 🐛 Known Issues to Check

### Potential Issues
- [ ] No console errors in browser
- [ ] No React hydration warnings
- [ ] No TypeScript errors
- [ ] Images load correctly (external URLs)
- [ ] Forms submit without page reload
- [ ] State updates reflect immediately

### Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

---

## 📊 Performance Check

- [ ] Page loads under 2 seconds
- [ ] No layout shift on load
- [ ] Images lazy load
- [ ] Rich text editor loads quickly
- [ ] No memory leaks (check DevTools)
- [ ] Smooth 60fps scrolling

---

## ✅ Final Checklist

### Core Functionality
- [ ] All 8 pages load without errors
- [ ] Navigation works between all pages
- [ ] Forms can be filled and submitted
- [ ] CRUD operations update UI correctly
- [ ] Preview mode works in article editor
- [ ] Rich text editor fully functional

### Data Integrity
- [ ] Slug auto-generation works
- [ ] Character counters accurate
- [ ] Form validation prevents empty submissions
- [ ] Delete protection works (categories/authors with articles)
- [ ] Tags can be added and removed
- [ ] Filters update results correctly

### UI/UX
- [ ] Consistent styling across all pages
- [ ] Hausa language throughout
- [ ] Responsive on all screen sizes
- [ ] Dark mode works everywhere
- [ ] Loading states shown appropriately
- [ ] Success/error messages clear

### Technical
- [ ] No console errors
- [ ] No React warnings
- [ ] SSR works (window checks in place)
- [ ] Tiptap configured for SSR
- [ ] TypeScript types correct
- [ ] Mock data structured properly

---

## 🎯 After Testing

1. **Document Issues**: Note any bugs or improvements needed
2. **Create Bug Report**: If issues found, list them with screenshots
3. **Prioritize Fixes**: Decide what needs fixing before Appwrite integration
4. **Plan Next Steps**: Ready for Appwrite or need more features?

---

## 🎊 Success Criteria

✅ All pages load without errors  
✅ All forms functional  
✅ All CRUD operations work (UI level)  
✅ Rich text editor fully functional  
✅ Responsive on all devices  
✅ Dark mode works throughout  
✅ No console errors or warnings  
✅ Ready for Appwrite integration  

---

**Happy Testing! 🚀**

Once all checkboxes are complete, your admin dashboard is production-ready (frontend) and ready for Appwrite backend integration.
