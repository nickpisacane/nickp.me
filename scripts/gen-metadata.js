#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const metadataConfig = yaml.parse(
  fs.readFileSync(path.resolve(__dirname, '../metadata.yaml'), 'utf8'),
);
const htmlMinifier = require('html-minifier').minify;
const fileName = process.argv[2];
const metadata = metadataConfig[fileName];
if (!metadata) {
  console.error(`No metadata: "${fileName}"`);
  process.exit(1);
}

const METADATA = `
<title>${metadata.title}</title>
<meta name="description" content="${metadata.description}" />
<link rel="canonical" href="${metadata.canonical}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${metadata.title}" />
<meta property="og:description" content="${metadata.description}" />
<meta property="og:image" content="${metadata.image}" />
<meta property="og:image:width" content="${metadata.image_width}" />
<meta property="og:image:height" content="${metadata.image_height}" />
<meta name="twitter:card" content="${metadata.twitter_card}" />
<meta name="twitter:site" content="${metadata.twitter_site}" />
<meta name="twitter:image" content="${metadata.image}" />
<meta name="twitter:image:alt" content="${metadata.image_alt}" />
<meta name="twitter:description" content="${metadata.description}" />
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Person",
  "name": "Nick Pisacane",
  "url": "https://nickp.me/",
  "image": "https://nickp.me/img/me.jpg",
  "sameAs": "https://github.com/nickpisacane/",
  "jobTitle": "Software Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Facebook"
  }  
}
</script>
`;

let buf = '';
process.stdin
  .on('data', (chunk) => {
    buf += chunk.toString();
  })
  .on('end', () => {
    process.stdout.write(
      htmlMinifier(buf.replace('<!-- METADATA -->', METADATA), {
        collapseWhitespace: true,
      }),
    );
    process.exit(0);
  });
