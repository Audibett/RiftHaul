import { Helmet } from 'react-helmet-async'

const DEFAULT = {
  title:       'FleetNova Logistics — Cargo Transport in Eldoret, Kenya',
  description: 'FleetNova Logistics connects businesses with verified truck operators in Eldoret and across Kenya. Book reliable cargo transport in minutes.',
  url:         'https://fleetnova.co.ke',
  image:       'https://fleetnova.co.ke/og-image.jpg',
  keywords:    'cargo transport Eldoret, truck hire Kenya, logistics company Eldoret, cargo booking Kenya, freight transport Rift Valley',
}

export default function SEO({
  title,
  description,
  url,
  image,
  keywords,
  type = 'website',
}) {
  const seoTitle       = title       ? `${title} | FleetNova Logistics` : DEFAULT.title
  const seoDescription = description || DEFAULT.description
  const seoUrl         = url         || DEFAULT.url
  const seoImage       = image       || DEFAULT.image
  const seoKeywords    = keywords    || DEFAULT.keywords

  return (
    <Helmet>
      {/* Basic */}
      <title>{seoTitle}</title>
      <meta name="description"        content={seoDescription} />
      <meta name="keywords"           content={seoKeywords} />
      <meta name="author"             content="FleetNova Logistics" />
      <meta name="robots"             content="index, follow" />
      <meta name="google-site-verification" content="google-site-verification=k3of0GqRlh6DpW1m3cDNd1M2S6-9mNma53SrB0sVvJY" />
      <link rel="canonical"           href={seoUrl} />

      {/* Open Graph — controls WhatsApp/Facebook/LinkedIn preview */}
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url"         content={seoUrl} />
      <meta property="og:image"       content={seoImage} />
      <meta property="og:site_name"   content="FleetNova Logistics" />
      <meta property="og:locale"      content="en_KE" />

      {/* Twitter card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image"       content={seoImage} />

      {/* Mobile */}
      <meta name="viewport"  content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#F97316" />
    </Helmet>
  )
}

