# 🌐 Custom Domain Setup Guide

Transform your GitHub Pages URL from `valeriobarletta.github.io/bike-rental-website` to your own professional domain like `www.cyclerent.com`!

## 🎯 **What is a Custom Domain?**

Instead of using the default GitHub Pages URL:
- ❌ `https://valeriobarletta.github.io/bike-rental-website`

You can use your own professional domain:
- ✅ `https://www.cyclerent.com`
- ✅ `https://bikerentals.com`
- ✅ `https://yourbusinessname.com`

## 🚀 **Step-by-Step Setup Process**

### **Step 1: Purchase a Domain**

**Popular Domain Registrars:**
- **Namecheap** (~$10-15/year) - Recommended for beginners
- **GoDaddy** (~$15-20/year) - Most popular
- **Google Domains** (~$12/year) - Now part of Squarespace
- **Cloudflare** (~$8-12/year) - Great for developers

**Domain Ideas for Your Bike Rental:**
- `cyclerent.com`
- `bikerentals.com` 
- `ridebikes.com`
- `pedalrentals.com`
- `bikehire.com`

### **Step 2: Configure DNS Settings**

After purchasing your domain, set up these DNS records in your domain registrar:

**For Apex Domain (e.g., `cyclerent.com`):**
```
Type: A
Host: @
Value: 185.199.108.153
```
```
Type: A  
Host: @
Value: 185.199.109.153
```
```
Type: A
Host: @  
Value: 185.199.110.153
```
```
Type: A
Host: @
Value: 185.199.111.153
```

**For WWW Subdomain (e.g., `www.cyclerent.com`):**
```
Type: CNAME
Host: www
Value: valeriobarletta.github.io
```

### **Step 3: Configure GitHub Pages**

1. **Go to your repository**: https://github.com/valeriobarletta/bike-rental-website

2. **Navigate to Settings → Pages**

3. **In the "Custom domain" section:**
   - Enter your domain: `www.cyclerent.com` (or your chosen domain)
   - Click "Save"

4. **Enable "Enforce HTTPS"** (wait 24 hours after DNS setup)

### **Step 4: Create CNAME File**

GitHub will automatically create a CNAME file, but you can also create it manually:

**File: `CNAME` (no extension)**
```
www.cyclerent.com
```

## ⏰ **Timeline & What to Expect**

- **DNS Propagation**: 24-48 hours (sometimes faster)
- **SSL Certificate**: Available after DNS propagation
- **Full Setup**: 1-3 days maximum

## 🔧 **DNS Configuration Examples**

### **Namecheap Setup:**
1. Login to Namecheap account
2. Go to "Domain List" → Manage your domain
3. Click "Advanced DNS" tab
4. Add the A and CNAME records as shown above

### **GoDaddy Setup:**
1. Login to GoDaddy account  
2. Go to "My Products" → DNS
3. Select your domain
4. Add DNS records as specified

### **Cloudflare Setup:**
1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Add DNS records in Cloudflare dashboard
4. Enable "Proxied" status for better performance

## 🛡️ **Security & Best Practices**

### **Domain Verification (Recommended)**
According to the [GitHub Pages documentation](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site), you should verify your custom domain:

1. **Go to GitHub Settings** (your profile settings, not repository)
2. **Click "Pages" in sidebar**
3. **Add your domain for verification**
4. **Follow verification steps** (add DNS TXT record)

**Benefits of verification:**
- ✅ Prevents domain takeover attacks
- ✅ Increases security
- ✅ Recommended by GitHub

### **HTTPS/SSL Certificate**
- ✅ **Always enable "Enforce HTTPS"** in GitHub Pages settings
- ✅ **Free SSL certificate** provided by GitHub
- ✅ **Automatic renewal** - no maintenance required

## 🎨 **Professional Domain Ideas by Business Type**

### **Local Bike Rental Business:**
- `[cityname]bikerentals.com`
- `[cityname]cycles.com`
- `ride[cityname].com`

### **Tourist/Vacation Rentals:**
- `beachbikerentals.com`
- `mountainbikeadventures.com`
- `touristbikes.com`

### **Premium/Boutique Service:**
- `premiumbikerentals.com`
- `luxurycycles.com`
- `elitebikehire.com`

## 📧 **Professional Email Setup**

Once you have a custom domain, set up professional email:

**Options:**
- **Google Workspace** (~$6/month) - `info@cyclerent.com`
- **Microsoft 365** (~$5/month) - Professional email + Office
- **Zoho Mail** (Free plan available) - Good for small businesses

## 🔄 **Updating Your Website**

After setting up custom domain, update these in your website:

### **Update Contact Information:**
```html
<!-- In index.html, update email links -->
<a href="mailto:info@cyclerent.com">info@cyclerent.com</a>
```

### **Update Social Media Links:**
- Update website URL in social media profiles
- Update business listings (Google My Business, etc.)

### **Update Branding:**
Consider updating the site title and meta tags:
```html
<title>CycleRent - Premium Bike Rentals | www.cyclerent.com</title>
```

## 🚨 **Troubleshooting Common Issues**

### **DNS Not Propagating:**
- Wait 24-48 hours
- Check DNS propagation: https://dnschecker.org
- Clear browser cache

### **SSL Certificate Issues:**
- Ensure DNS is fully propagated first
- Disable/re-enable "Enforce HTTPS"
- Wait additional 24 hours

### **404 Errors:**
- Check CNAME file contains correct domain
- Verify repository settings
- Ensure index.html is in root directory

## 💰 **Cost Breakdown**

**Annual Costs:**
- **Domain Registration**: $10-20/year
- **GitHub Pages Hosting**: FREE ✅
- **SSL Certificate**: FREE ✅ (included)
- **Professional Email**: $0-72/year (optional)

**Total**: ~$10-20/year for professional website!

## 🎯 **Next Steps After Setup**

1. **Test your custom domain** thoroughly
2. **Update all marketing materials** with new URL
3. **Set up Google Analytics** with new domain
4. **Update social media profiles**
5. **Register with Google My Business**
6. **Set up professional email**

## 📚 **Additional Resources**

- [GitHub Pages Custom Domain Documentation](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Checker Tool](https://dnschecker.org)
- [SSL Test Tool](https://www.ssllabs.com/ssltest/)

---

**Remember**: Your bike rental website is already professional and ready for business. A custom domain just makes it even more credible and memorable for your customers! 🚴‍♂️✨
