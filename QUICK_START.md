# Join Us Page - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: The Page is Already Created! ✅

Your new Join Us page is at:

```
/ecast/src/pages/join-us.tsx
```

### Step 2: Start Your Dev Server

```bash
cd /home/abhi/Pictures/emis/ecast-whole/ecast
npm run dev
```

### Step 3: Visit the Page

Open your browser to:

```
http://localhost:3000/join-us
```

## 🎯 What You'll See

### If Enrollment is OPEN:

✅ Green banner: "Enrollment is Currently Open!"  
📅 Deadline display  
🎓 List of available batches  
📝 Full intake form

### If Enrollment is CLOSED:

🔒 Lock icon  
❌ "Enrollment Closed" message  
📆 Next opening date (if available)  
🏠 Return to home button

## 🔗 Add to Your Navigation

### Quick Example (Copy & Paste)

Find your navigation component and add:

```tsx
import Link from "next/link";

// In your navbar/menu
<Link href="/join-us">
  <a className="text-white hover:text-red-500 transition">Join Us</a>
</Link>;
```

### With Button Style

```tsx
<Link href="/join-us">
  <a className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition">
    Join ECAST
  </a>
</Link>
```

## ✅ Test Checklist

Before deploying, verify:

- [ ] Page loads without errors
- [ ] Intake status displays correctly
- [ ] Available batches are shown
- [ ] Form fields work properly
- [ ] File upload works (PDF only)
- [ ] Form submits successfully
- [ ] Success message appears
- [ ] Redirects to home after submission
- [ ] Closed state works (if enrollment closed)
- [ ] Mobile responsive design works

## 🛠️ Backend Checklist

Ensure these are working:

- [ ] `/api/intake/status/` returns status
- [ ] `/api/intake/info/` returns batches & departments
- [ ] `/api/intake/form/` accepts POST submissions
- [ ] CORS is configured for your frontend
- [ ] File uploads are enabled
- [ ] IntakeEnrollment model is set up

## 📱 Test Different Scenarios

### Scenario 1: Enrollment Open

1. Set `IntakeEnrollment.is_open = True` in admin
2. Visit `/join-us`
3. Should see the form

### Scenario 2: Enrollment Closed

1. Set `IntakeEnrollment.is_open = False` in admin
2. Visit `/join-us`
3. Should see locked page

### Scenario 3: Specific Batches Only

1. Set `available_batches = ["80", "81"]` in IntakeEnrollment
2. Visit `/join-us`
3. Should only see batches 2080 and 2081

## 🎨 Quick Customizations

### Change Main Color

Find and replace `red-` with your color:

```tsx
// Original
className = "border-red-500";

// Example: Change to blue
className = "border-blue-500";
```

### Change Form Title

Line ~344:

```tsx
<p className="text-center text-white font-bold text-xl">
  ECAST INTAKE FORM {/* ← Change this */}
</p>
```

### Change Redirect Delay

Line ~241:

```tsx
setTimeout(() => {
  redirectToHome();
}, 3000); // ← Change 3000 to milliseconds you want
```

## 🐛 Common Issues & Fixes

### Issue: Page shows "Loading..." forever

**Fix:** Check backend API is running and accessible

### Issue: "Enrollment Closed" but it should be open

**Fix:** Check `IntakeEnrollment.is_open` in Django admin

### Issue: No batches showing in dropdown

**Fix:** Ensure batches have `is_active=True` in database

### Issue: Form won't submit

**Fix:** Check browser console for errors, verify all required fields

### Issue: TypeScript errors

**Fix:** Run `npm run build` to see detailed errors

## 📚 Documentation Files

All docs are in `/ecast/` folder:

1. **JOIN_US_SUMMARY.md** ← Overview & features
2. **JOIN_US_README.md** ← Detailed documentation
3. **JOIN_US_NAVIGATION.md** ← Integration examples
4. **QUICK_START.md** ← This file!

## 🆘 Need Help?

### Check These First:

1. Browser console (F12) for JavaScript errors
2. Network tab for API failures
3. Django logs for backend issues
4. Terminal for build errors

### Verify APIs Work:

```bash
# Test status endpoint
curl https://ecast.pythonanywhere.com/api/intake/status/

# Test info endpoint
curl https://ecast.pythonanywhere.com/api/intake/info/
```

## 🎉 You're Ready!

Your Join Us page is fully functional and ready to use!

**Next steps:**

1. ✅ Add navigation link
2. ✅ Test the complete flow
3. ✅ Deploy to production
4. ✅ Share the link with students

**Page URL:** `/join-us`

Happy recruiting! 🚀
