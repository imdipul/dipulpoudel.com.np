#!/usr/bin/env node
/**
 * Image Sitemap Generator for Dipul Poudel Portfolio
 * Generates image-sitemap.xml for Google Image indexing
 * Run: node generate-image-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  siteUrl: 'https://dipulpoudel.com.np',
  imageDirectories: ['assets', 'assets/gallery', 'Certificates'],
  imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.JPG', '.JPEG', '.PNG'],
  ownerName: 'Dipul Poudel',
  ownerAlias: 'imdipul',
  location: 'Chitwan, Nepal'
};

// Generate descriptive title from filename
function generateImageTitle(filename, directory) {
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  const lowerName = nameWithoutExt.toLowerCase();
  
  // Custom mappings for specific images
  const customTitles = {
    'dipul-poudel': 'Dipul Poudel - Official Profile Photo - imdipul',
    'profile-pic': 'Dipul Poudel Profile Picture - imdipul Nepal',
    'about': 'Dipul Poudel - About Me Photo - imdipul',
    'imdipul-dipul poudel': 'imdipul - Dipul Poudel Official Photo',
    'morphine': 'Morphine Music Project by Dipul Poudel imdipul',
    'artistpage': 'imdipul Artist Page - Dipul Poudel Music Profile',
    'recordlabel': 'Record Label Project by Dipul Poudel imdipul',
    'linkedin': 'Dipul Poudel LinkedIn - imdipul Social',
    'instagram': 'Dipul Poudel Instagram - imdipul Social',
    'github': 'Dipul Poudel GitHub - imdipul Developer',
    'email': 'Contact Dipul Poudel - imdipul Email',
    'experience': 'Dipul Poudel Experience - imdipul Portfolio',
    'education': 'Dipul Poudel Education - imdipul Background',
    'rotaract-logo': 'Rotaract Club - Dipul Poudel Organization',
    'interact-logo': 'Interact Club - Dipul Poudel Youth Leadership',
    'un-logo': 'United Nations MUN - Dipul Poudel imdipul',
    'checkmark': 'Dipul Poudel Portfolio Checkmark Icon',
    'arrow': 'Navigation Arrow - Dipul Poudel Portfolio'
  };
  
  // Check custom mappings
  for (const [key, value] of Object.entries(customTitles)) {
    if (lowerName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Handle gallery photos
  if (lowerName.startsWith('photo')) {
    const num = lowerName.replace('photo', '');
    return `Dipul Poudel imdipul - Personal Photo ${num} - Nepal`;
  }
  
  if (lowerName.startsWith('collection')) {
    const num = lowerName.replace('collection', '');
    return `Dipul Poudel Collection ${num} - imdipul Gallery`;
  }
  
  if (lowerName.startsWith('journey')) {
    const num = lowerName.replace('journey', '');
    return `Dipul Poudel Journey ${num} - imdipul Life Moments Nepal`;
  }
  
  // Handle certificates
  if (directory.includes('Certificates') || directory.includes('certificate')) {
    return `Dipul Poudel Certificate - imdipul Professional Certification`;
  }
  
  // Default: Convert filename to readable title
  const readable = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return `${readable} - Dipul Poudel imdipul`;
}

// Generate caption/description
function generateCaption(filename, directory) {
  const title = generateImageTitle(filename, directory);
  const category = directory.includes('gallery') ? 'Photo Gallery' : 
                   directory.includes('Certificates') ? 'Professional Certification' : 'Portfolio';
  
  return `${title} | ${category} | Nepali Artist Music Producer Developer`;
}

// Recursively get all image files
function getImageFiles(dir, baseDir = '') {
  const images = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return images;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      images.push(...getImageFiles(filePath, path.join(baseDir, file)));
    } else {
      const ext = path.extname(file);
      if (config.imageExtensions.includes(ext.toLowerCase()) || config.imageExtensions.includes(ext)) {
        images.push({
          path: (baseDir ? path.join(baseDir, file) : path.join(dir, file)).replace(/\\/g, '/'),
          fullPath: filePath,
          filename: file,
          directory: baseDir || dir
        });
      }
    }
  });
  
  return images;
}

// Escape special XML characters
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// URL encode path but keep slashes
function encodeImagePath(imagePath) {
  return imagePath
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

// Generate the image sitemap XML
function generateImageSitemap() {
  let allImages = [];
  
  config.imageDirectories.forEach(dir => {
    const images = getImageFiles(dir, dir);
    allImages = allImages.concat(images);
  });
  
  console.log(`📸 Found ${allImages.length} images total`);
  
  // Group images by page section
  const pageImages = {
    '/': [],
    '/#about': [],
    '/#gallery': [],
    '/#certifications': [],
    '/#projects': [],
    '/#experience': []
  };
  
  allImages.forEach(img => {
    const lowerPath = img.path.toLowerCase();
    const lowerFilename = img.filename.toLowerCase();
    
    if (img.directory.includes('gallery') || lowerFilename.startsWith('photo') || 
        lowerFilename.startsWith('journey') || lowerFilename.startsWith('collection')) {
      pageImages['/#gallery'].push(img);
    } else if (img.directory.includes('Certificates')) {
      pageImages['/#certifications'].push(img);
    } else if (lowerFilename.includes('morphine') || lowerFilename.includes('artist') || 
               lowerFilename.includes('record')) {
      pageImages['/#projects'].push(img);
    } else if (lowerFilename.includes('about')) {
      pageImages['/#about'].push(img);
    } else if (lowerFilename.includes('experience') || lowerFilename.includes('education') ||
               lowerFilename.includes('rotaract') || lowerFilename.includes('interact') ||
               lowerFilename.includes('un-logo')) {
      pageImages['/#experience'].push(img);
    } else {
      pageImages['/'].push(img);
    }
  });
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- ============================================== -->
  <!-- Dipul Poudel / imdipul Official Image Sitemap -->
  <!-- Portfolio: https://dipulpoudel.com.np          -->
  <!-- Generated: ${new Date().toISOString()}         -->
  <!-- Total Images: ${allImages.length}              -->
  <!-- ============================================== -->
`;

  Object.entries(pageImages).forEach(([page, images]) => {
    if (images.length === 0) return;
    
    console.log(`  📂 ${page}: ${images.length} images`);
    
    xml += `
  <url>
    <loc>${config.siteUrl}${page}</loc>`;
    
    images.forEach(img => {
      const imageUrl = `${config.siteUrl}/${encodeImagePath(img.path)}`;
      const title = generateImageTitle(img.filename, img.directory);
      const caption = generateCaption(img.filename, img.directory);
      
      xml += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
      <image:geo_location>${config.location}</image:geo_location>
    </image:image>`;
    });
    
    xml += `
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

// Generate main sitemap
function generateMainSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${config.siteUrl}/#about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${config.siteUrl}/#gallery</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${config.siteUrl}/#certifications</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${config.siteUrl}/#projects</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${config.siteUrl}/#experience</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${config.siteUrl}/#contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
}

// Generate sitemap index
function generateSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${config.siteUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${config.siteUrl}/image-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// Main execution
console.log('🚀 Starting Image SEO Sitemap Generator for Dipul Poudel...\n');

try {
  // Generate image sitemap
  const imageSitemap = generateImageSitemap();
  fs.writeFileSync('image-sitemap.xml', imageSitemap);
  console.log('\n✅ image-sitemap.xml generated successfully!');
  
  // Generate main sitemap
  const mainSitemap = generateMainSitemap();
  fs.writeFileSync('sitemap.xml', mainSitemap);
  console.log('✅ sitemap.xml generated successfully!');
  
  // Generate sitemap index
  const sitemapIndex = generateSitemapIndex();
  fs.writeFileSync('sitemap-index.xml', sitemapIndex);
  console.log('✅ sitemap-index.xml generated successfully!');
  
  console.log('\n🎉 All sitemaps generated! Next steps:');
  console.log('   1. Deploy these files to your website root');
  console.log('   2. Submit sitemaps to Google Search Console');
  console.log('   3. Request indexing for your pages');
  console.log('\n📋 Files created:');
  console.log('   - image-sitemap.xml (for Google Images)');
  console.log('   - sitemap.xml (main sitemap)');
  console.log('   - sitemap-index.xml (sitemap index)');
  
} catch (error) {
  console.error('❌ Error generating sitemaps:', error.message);
  process.exit(1);
}
