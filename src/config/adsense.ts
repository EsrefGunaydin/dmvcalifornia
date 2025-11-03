// Google AdSense Configuration
// Replace these with your actual AdSense IDs

export const ADSENSE_CONFIG = {
  // Your AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX',

  // Ad Slots - Create these in your AdSense account
  adSlots: {
    // Homepage ads
    homepageTop: '1234567890',
    homepageSidebar: '1234567891',

    // Blog post ads
    blogPostTop: '1234567892',
    blogPostMiddle: '1234567893',
    blogPostBottom: '1234567894',
    blogSidebar: '1234567895',

    // Practice test ads
    practiceTestTop: '1234567896',
    practiceTestSidebar: '1234567897',

    // Blog listing ads
    blogListingTop: '1234567898',
    blogListingBetweenPosts: '1234567899',
  },

  // Ad formats
  formats: {
    auto: 'auto',
    rectangle: 'rectangle',
    vertical: 'vertical',
    horizontal: 'horizontal',
  }
};

export default ADSENSE_CONFIG;
