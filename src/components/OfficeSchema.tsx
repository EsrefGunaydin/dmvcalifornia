type Office = {
  name: string;
  slug: string;
  phone: string;
  hours?: string;
  hours_detailed?: { [key: string]: string };
  address: string;
  status?: string;
};

const SITE_URL = 'https://dmvcalifornia.us';

const DAY_MAP: Record<string, string> = {
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  Sunday: 'Sunday',
};

/**
 * Parse a free-text hours range like "8am-5pm", "8:00 AM - 5:00 PM",
 * "08:00-17:00" into { opens: "08:00", closes: "17:00" } (24h).
 * Returns null for "Closed" or anything we can't confidently parse.
 */
function parseHours(raw: string): { opens: string; closes: string } | null {
  if (!raw || raw.trim().toLowerCase() === 'closed') return null;
  const parts = raw.split(/[-–—]/);
  if (parts.length !== 2) return null;
  const open = to24h(parts[0]);
  const close = to24h(parts[1]);
  if (!open || !close) return null;
  return { opens: open, closes: close };
}

function to24h(token: string): string | null {
  const t = token.trim().toLowerCase();
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = m[2] ? m[2] : '00';
  const meridiem = m[3];
  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  if (hour > 23) return null;
  return `${String(hour).padStart(2, '0')}:${minute}`;
}

/**
 * Injects GovernmentOffice JSON-LD for a DMV field office so Google can show
 * "DMV near me" rich results (hours, phone, address knowledge cards).
 * Server Component — ships in the initial HTML.
 */
export default function OfficeSchema({ office }: { office: Office }) {
  const url = `${SITE_URL}/${office.slug}`;

  const openingHours = office.hours_detailed
    ? Object.entries(office.hours_detailed)
        .map(([day, time]) => {
          const dayOfWeek = DAY_MAP[day];
          const parsed = parseHours(time);
          if (!dayOfWeek || !parsed) return null;
          return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${dayOfWeek}`,
            opens: parsed.opens,
            closes: parsed.closes,
          };
        })
        .filter(Boolean)
    : [];

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOffice',
    name: `${office.name} DMV Office`,
    description: `Hours, location, phone number, and services for the ${office.name} California DMV field office.`,
    url,
    telephone: office.phone,
    parentOrganization: {
      '@type': 'GovernmentOrganization',
      name: 'California Department of Motor Vehicles',
    },
    areaServed: 'California',
  };

  if (office.address && office.address.trim()) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: office.address,
      addressRegion: 'CA',
      addressCountry: 'US',
    };
  }

  if (openingHours.length > 0) {
    schema.openingHoursSpecification = openingHours;
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'DMV Offices', item: `${SITE_URL}/dmv-offices` },
      { '@type': 'ListItem', position: 3, name: `${office.name} DMV Office`, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
