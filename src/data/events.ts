// California traffic-safety events and awareness campaigns.
//
// These pages revive the WordPress-era /events/ section. Each event is a
// recurring national or state campaign with a predictable annual search spike.
// The hub renders at /events, each entry at /events/<slug>.

export interface SafetyEvent {
  slug: string;
  name: string;
  /** Short label for cards and breadcrumbs */
  shortName: string;
  /** Display string for the current cycle, e.g. "October 18-24, 2026" */
  dates: string;
  /** The recurrence rule in plain words, e.g. "Third full week of October" */
  recurrence: string;
  /** 0-11, month the event (or its anchor) falls in, for hub ordering */
  monthIndex: number;
  metaTitle: string;
  metaDescription: string;
  heroBlurb: string;
  /** Article body HTML. Uses the same global dmv-* classes as blog content. */
  body: string;
  faq: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  official: { href: string; label: string }[];
}

export const SAFETY_EVENTS: SafetyEvent[] = [
  {
    slug: 'california-teen-driver-safety-week',
    name: 'National Teen Driver Safety Week in California',
    shortName: 'Teen Driver Safety Week',
    dates: 'October 18-24, 2026',
    recurrence: 'Third week of October, every year',
    monthIndex: 9,
    metaTitle: 'Teen Driver Safety Week California 2026: Dates & Rules',
    metaDescription:
      'National Teen Driver Safety Week runs October 18-24, 2026. What California parents and teens should review: provisional license rules, passenger limits, and practice.',
    heroBlurb:
      'One week every October set aside for the conversation most parents put off: the rules, risks, and habits that keep new drivers alive on California roads.',
    body: `
<p>National Teen Driver Safety Week runs <strong>October 18-24 in 2026</strong>, the third week of October every year. Congress created it in 2007 after crash data kept showing the same thing: car crashes are one of the leading causes of death for American teenagers, and the first year of licensed driving is the most dangerous. The week exists to get parents and teens talking about specific rules before a crash makes the conversation impossible.</p>

<div class="dmv-stats">
  <div class="dmv-stat"><span class="dmv-stat-value">Oct 18-24</span><span class="dmv-stat-label">2026 dates, third week of October</span></div>
  <div class="dmv-stat"><span class="dmv-stat-value">12 mo</span><span class="dmv-stat-label">California provisional restrictions after licensing</span></div>
  <div class="dmv-stat"><span class="dmv-stat-value">50 hrs</span><span class="dmv-stat-label">supervised practice required before the driving test</span></div>
  <div class="dmv-stat"><span class="dmv-stat-value">11pm-5am</span><span class="dmv-stat-label">provisional night driving curfew</span></div>
</div>

<h2>What California parents should actually review this week</h2>

<p>The national campaign gives parents a checklist of crash factors: seat belts, speed, alcohol and drugs, phones, and passengers. California backs most of that list with real law, so the conversation doesn't have to rest on "because I said so."</p>

<ul>
  <li>For the first 12 months after getting a license, a driver under 18 cannot drive between 11 p.m. and 5 a.m., and cannot carry passengers under 20 unless a licensed adult 25 or older is in the car. These are the provisional license rules under Vehicle Code &sect;12814.6.</li>
  <li>Drivers under 18 may not use a phone at all while driving, even hands-free (Vehicle Code &sect;23124).</li>
  <li>Everyone in the car needs a seat belt, and the driver gets the ticket when a passenger under 16 is unbuckled.</li>
  <li>California has zero tolerance for underage drinking and driving: any measurable alcohol suspends a minor's license.</li>
</ul>

<p>If your teen is still working toward the license, the week is a good deadline for progress on the 50 required supervised practice hours, 10 of them at night. Our <a href="/california-teen-driver-complete-guide-2026">complete California teen driver guide</a> walks through the whole permit-to-license sequence, and the <a href="/california-permit-test">free permit practice test</a> is the fastest way to check whether the handbook study is actually sticking.</p>

<h2>Why the first year matters so much</h2>

<p>Newly licensed drivers crash at far higher rates than any other group, and the risk drops sharply with each month of experience. That's the logic behind California's graduated licensing system: the provisional restrictions carve the highest-risk situations (night driving, carloads of friends) out of the first year, then hand them back once the skills exist. Teens who treat the restrictions as a floor rather than an obstacle get through the dangerous window with habits that stick.</p>

<div class="dmv-callout dmv-callout-tip">
  <div class="dmv-callout-header"><span class="dmv-callout-icon">💡</span><span class="dmv-callout-title">A concrete way to use the week</span></div>
  <div class="dmv-callout-body"><ul>
    <li>Ride along on one practice drive and log it toward the 50 hours</li>
    <li>Agree on a no-questions-asked pickup policy as the alternative to riding with an impaired driver</li>
    <li>Put the phone in the glovebox for every drive, parent included: teens copy what they see</li>
    <li>Have your teen take a <a href="/california-permit-test">practice knowledge test</a> and go over the missed questions together</li>
  </ul></div>
</div>

<h2>What schools and communities do</h2>

<p>During the week, NHTSA and the California Office of Traffic Safety push materials to high schools, and many districts run their own events: mock crash demonstrations, seat belt challenges, and pledge campaigns. The CHP's Start Smart classes, free teen-and-parent traffic safety sessions offered year-round at local CHP offices, tend to fill up around this week, so booking early helps.</p>
`,
    faq: [
      {
        question: 'When is National Teen Driver Safety Week in 2026?',
        answer:
          'October 18-24, 2026. It falls on the third week of October every year, anchored by the NHTSA highway safety events calendar.',
      },
      {
        question: 'What are the provisional license restrictions for California teens?',
        answer:
          'For the first 12 months after being licensed, drivers under 18 cannot drive between 11 p.m. and 5 a.m. and cannot carry passengers under 20 without a licensed adult 25 or older present. Exceptions exist for documented school, work, and medical needs.',
      },
      {
        question: 'Can a teen driver use a phone hands-free in California?',
        answer:
          'No. Vehicle Code section 23124 bans all phone use for drivers under 18, including hands-free calls and speaker mode. Adult drivers may use hands-free devices; drivers under 18 may not.',
      },
      {
        question: 'How many practice hours does a California teen need before the driving test?',
        answer:
          'A minor must complete 50 hours of supervised practice, including 10 hours at night, signed off by a parent or guardian, plus hold the permit for at least 6 months before taking the behind-the-wheel test.',
      },
    ],
    related: [
      { href: '/california-teen-driver-complete-guide-2026', label: 'California teen driver guide' },
      { href: '/california-permit-test', label: 'Free permit practice test' },
      { href: '/licencia-de-conducir-para-menores-california', label: 'Guia para padres en espanol' },
    ],
    official: [
      { href: 'https://www.nhtsa.gov/teen-driving', label: 'NHTSA teen driving resources' },
      { href: 'https://www.chp.ca.gov/programs-services/programs/start-smart', label: 'CHP Start Smart classes' },
    ],
  },
  {
    slug: 'distracted-driving-awareness-month',
    name: 'Distracted Driving Awareness Month in California',
    shortName: 'Distracted Driving Awareness Month',
    dates: 'April 2026',
    recurrence: 'Every April',
    monthIndex: 3,
    metaTitle: 'Distracted Driving Awareness Month 2026: California Rules',
    metaDescription:
      'April is Distracted Driving Awareness Month. California phone laws, the fines that actually get charged, and the point that lands on a second offense.',
    heroBlurb:
      'Every April, enforcement steps up statewide. A refresher on what California phone law actually forbids, and what a ticket really costs.',
    body: `
<p>April is National Distracted Driving Awareness Month, and California agencies treat it as an enforcement period, not just a hashtag. CHP and local departments run extra patrols during the national "Put the Phone Away or Pay" campaign window, writing tickets for exactly the behavior most drivers think they can get away with at a red light.</p>

<h2>What California law actually says</h2>

<ul>
  <li>Holding a phone while driving is illegal, period. Vehicle Code &sect;23123.5 requires the phone to be mounted and limits you to a single tap or swipe.</li>
  <li>Texting, scrolling, and app use in the hand are covered by the same section: if it's in your hand while the wheels move, it's a violation. Red lights count as driving.</li>
  <li>Drivers under 18 cannot use a phone at all, even hands-free (Vehicle Code &sect;23124).</li>
  <li>Since July 2021, a second hands-free violation within 36 months adds a point to your record, which is where the insurance pain starts. Our <a href="/read-article-using-smartphone-driving">California cell phone law guide</a> covers the details.</li>
</ul>

<p>The base fine looks small on paper, but court assessments multiply it several times over, and the possible point on a repeat offense follows you for 36 months. The <a href="/california-online-traffic-school">traffic school option</a> does not hide distracted driving points from a second offense within the window.</p>

<div class="dmv-callout dmv-callout-warning">
  <div class="dmv-callout-header"><span class="dmv-callout-icon">⚠️</span><span class="dmv-callout-title">The knowledge test asks about this</span></div>
  <div class="dmv-callout-body"><p>Phone-law questions appear regularly on the California written test. If yours is coming up, the <a href="/practice-test">free practice tests</a> include the current hands-free rules.</p></div>
</div>
`,
    faq: [
      {
        question: 'Is it legal to use a phone at a red light in California?',
        answer:
          'No. You are still driving under California law when stopped at a light. Holding a phone at a red light is the same violation as holding it in motion.',
      },
      {
        question: 'Does a distracted driving ticket add a point in California?',
        answer:
          'A first hands-free violation does not add a point. A second violation within 36 months of the first adds one point to your driving record, under the law that took effect July 1, 2021.',
      },
      {
        question: 'Can adults use hands-free phones while driving in California?',
        answer:
          'Yes, drivers 18 and older may use voice-activated, hands-free functions with the phone mounted. Drivers under 18 may not use a phone in any form while driving.',
      },
    ],
    related: [
      { href: '/read-article-using-smartphone-driving', label: 'California cell phone driving laws' },
      { href: '/california-online-traffic-school', label: 'California online traffic school' },
      { href: '/practice-test', label: 'Free DMV practice tests' },
    ],
    official: [
      { href: 'https://www.nhtsa.gov/april-distracted-driving-awareness-month', label: 'NHTSA campaign page' },
      { href: 'https://www.ots.ca.gov/', label: 'California Office of Traffic Safety' },
    ],
  },
  {
    slug: 'motorcycle-safety-awareness-month',
    name: 'Motorcycle Safety Awareness Month in California',
    shortName: 'Motorcycle Safety Awareness Month',
    dates: 'May 2026',
    recurrence: 'Every May',
    monthIndex: 4,
    metaTitle: 'Motorcycle Safety Awareness Month 2026: California Guide',
    metaDescription:
      'May is Motorcycle Safety Awareness Month. California lane splitting rules, the Class M license path, and the training course that waives the DMV skills test.',
    heroBlurb:
      'Riding season opens as the days get longer. May is the annual reminder for drivers to look twice, and for new riders to get licensed properly.',
    body: `
<p>May is Motorcycle Safety Awareness Month nationally, timed for the start of riding season. The message runs in both directions: drivers are asked to check mirrors and blind spots for riders, and riders are asked to get trained, licensed, and visible.</p>

<h2>What makes California different for riders</h2>

<ul>
  <li>California is the only state where lane splitting is explicitly legal. CHP publishes safety guidance for it; splitting recklessly can still be cited as unsafe driving.</li>
  <li>Helmets are mandatory for all riders and passengers, full stop.</li>
  <li>A Class M1 license requires a knowledge test plus either a DMV skills test or completion of the California Motorcyclist Safety Program (CMSP) course. Riders under 21 must complete the CMSP course before getting a permit.</li>
</ul>

<p>New riders can start with our <a href="/california-motorcycle-license-class-m-guide-2026">Class M license guide</a> and the <a href="/motorcycle-test">motorcycle practice test</a>, which mirrors the DMV's motorcycle knowledge exam.</p>

<div class="dmv-callout dmv-callout-tip">
  <div class="dmv-callout-header"><span class="dmv-callout-icon">💡</span><span class="dmv-callout-title">The CMSP course usually beats the DMV skills test</span></div>
  <div class="dmv-callout-body"><p>Completing the CMSP course waives the DMV riding test, and insurers often discount trained riders. Under 21 it isn't optional anyway. Courses fill up in May, so book ahead of the season.</p></div>
</div>
`,
    faq: [
      {
        question: 'Is lane splitting legal in California?',
        answer:
          'Yes. California formally legalized lane splitting in 2016, the only state to do so. CHP publishes safety tips for it, and officers can still cite splitting done at unsafe speed differentials.',
      },
      {
        question: 'How do I get a motorcycle license in California?',
        answer:
          'Pass the motorcycle knowledge test at the DMV, then either pass the DMV skills test or complete the California Motorcyclist Safety Program course. Riders under 21 must take the CMSP course first. The application fee is $46.',
      },
    ],
    related: [
      { href: '/california-motorcycle-license-class-m-guide-2026', label: 'Class M license guide' },
      { href: '/motorcycle-test', label: 'Motorcycle practice test' },
    ],
    official: [
      { href: 'https://www.chp.ca.gov/programs-services/programs/california-motorcyclist-safety', label: 'California Motorcyclist Safety Program' },
    ],
  },
  {
    slug: 'child-passenger-safety-week',
    name: 'Child Passenger Safety Week in California',
    shortName: 'Child Passenger Safety Week',
    dates: 'September 20-26, 2026',
    recurrence: 'Third week of September, ending with Seat Check Saturday',
    monthIndex: 8,
    metaTitle: 'Child Passenger Safety Week 2026: California Car Seat Law',
    metaDescription:
      'Child Passenger Safety Week is September 20-26, 2026. California car seat law by age, the rear-facing rule, and where to get a free seat check.',
    heroBlurb:
      'Most car seats are installed wrong in some way. One week each September is dedicated to fixing that, ending with free Seat Check Saturday events.',
    body: `
<p>Child Passenger Safety Week runs <strong>September 20-26 in 2026</strong>, closing with National Seat Check Saturday on September 26, when certified technicians check installations for free at fire stations, hospitals, and CHP offices across California.</p>

<h2>California car seat law, by age</h2>

<ul>
  <li>Under 2 years: rear-facing seat, unless the child weighs 40 pounds or more or is 40 inches or taller (Vehicle Code &sect;27360).</li>
  <li>Under 8 years: secured in a car seat or booster in the back seat.</li>
  <li>8 or older, or 4 feet 9 inches or taller: a properly fitting seat belt is legal, though a booster is still safer until the belt fits without it.</li>
  <li>The driver is the one cited when a child under 16 is improperly restrained.</li>
</ul>

<p>The week is the easiest time of year to get an installation checked, since agencies publicize local events. CHP offices also check seats year-round by appointment, free of charge.</p>
`,
    faq: [
      {
        question: 'When can my child stop using a booster seat in California?',
        answer:
          'At age 8, or once they reach 4 feet 9 inches tall, a child may legally use a seat belt alone. Safety agencies recommend keeping the booster until the lap belt sits on the hips and the shoulder belt crosses the chest without cutting the neck.',
      },
      {
        question: 'How long must a child ride rear-facing in California?',
        answer:
          'Until age 2, unless the child weighs 40 pounds or more or is 40 or more inches tall. Rear-facing longer than the legal minimum is recommended when the seat allows it.',
      },
      {
        question: 'Where can I get my car seat checked for free?',
        answer:
          'CHP offices check installations year-round by appointment at no cost, and Seat Check Saturday (September 26, 2026) adds free walk-up events at fire stations and hospitals statewide.',
      },
    ],
    related: [
      { href: '/california-teen-driver-complete-guide-2026', label: 'California teen driver guide' },
      { href: '/auto-insurance', label: 'California auto insurance requirements' },
    ],
    official: [
      { href: 'https://www.nhtsa.gov/campaign/child-passenger-safety', label: 'NHTSA child passenger safety' },
      { href: 'https://www.chp.ca.gov/programs-services/programs/child-safety-seats', label: 'CHP child safety seat program' },
    ],
  },
  {
    slug: 'older-driver-safety-awareness-week',
    name: 'Older Driver Safety Awareness Week in California',
    shortName: 'Older Driver Safety Awareness Week',
    dates: 'First full week of December 2026',
    recurrence: 'First full week of December, every year',
    monthIndex: 11,
    metaTitle: 'Older Driver Safety Awareness Week 2026: California Rules',
    metaDescription:
      'Older Driver Safety Awareness Week falls in early December. California renewal rules at 70+, the vision test, and how families can plan the conversation.',
    heroBlurb:
      'A week in December for families to talk about driving and aging before the DMV forces the topic at renewal time.',
    body: `
<p>Older Driver Safety Awareness Week falls in the first full week of December each year. The point isn't taking keys away: it's planning ahead so driving can continue safely as long as possible, and so the alternatives are in place before they're needed.</p>

<h2>What changes at 70 in California</h2>

<ul>
  <li>Drivers 70 and older renew in person at a DMV office, with a vision test at every renewal.</li>
  <li>A knowledge test can be required based on driving record or a physician's report.</li>
  <li>The DMV can add restrictions (daylight only, corrective lenses, no freeway) instead of denying a license outright, which keeps many drivers safely on the road for years longer.</li>
  <li>Anyone, including family members and doctors, can request a DMV driver reevaluation when there's a genuine safety concern.</li>
</ul>

<p>The in-person renewal process, what to bring, and the $46 fee are covered in our <a href="/california-senior-driver-license-guide-2026">senior driver license guide</a>. Seniors preparing for a required knowledge test can use the <a href="/california-dmv-practice-test-for-seniors">senior practice test</a>, which uses the same question pool as the regular exam.</p>
`,
    faq: [
      {
        question: 'Do California drivers over 70 have to renew in person?',
        answer:
          'Yes. Drivers 70 and older must renew at a DMV office in person and pass a vision test at each renewal. Online and mail renewal are not available in this age group.',
      },
      {
        question: 'Does turning 70 mean taking the written test again in California?',
        answer:
          'Not automatically. The DMV requires a knowledge test only when triggered by the driving record, a physician report, or an examiner referral. Many drivers 70+ renew with just the vision test.',
      },
    ],
    related: [
      { href: '/california-senior-driver-license-guide-2026', label: 'Senior driver license guide' },
      { href: '/california-dmv-practice-test-for-seniors', label: 'Practice test for seniors' },
    ],
    official: [
      { href: 'https://www.dmv.ca.gov/portal/driver-education-and-safety/educational-materials/senior-drivers/', label: 'DMV senior driver resources' },
    ],
  },
  {
    slug: 'california-dui-enforcement-periods',
    name: 'California DUI Maximum Enforcement Periods',
    shortName: 'DUI enforcement periods',
    dates: 'Major holidays, year-round',
    recurrence: 'Winter holidays, Memorial Day, July 4, Labor Day, and other holiday weekends',
    monthIndex: 6,
    metaTitle: 'California DUI Enforcement Periods 2026: When CHP Saturates',
    metaDescription:
      'CHP runs Maximum Enforcement Periods every major holiday: all available officers on the road. The 2026 windows, California BAC limits, and what a first DUI costs.',
    heroBlurb:
      'Every major holiday weekend, CHP puts every available officer on the road. Knowing the windows is no substitute for a sober ride, but here they are.',
    body: `
<p>The CHP formally declares a Maximum Enforcement Period (MEP) around every major holiday: winter holidays, New Year's, Memorial Day, Independence Day, Labor Day, and Thanksgiving. During an MEP, all available officers work the roads, with DUI saturation patrols and checkpoints concentrated on the nights the crash data flags.</p>

<h2>The limits that apply in California</h2>

<ul>
  <li>0.08% BAC for drivers 21 and older in a private vehicle</li>
  <li>0.04% for commercial license holders</li>
  <li>0.01% for drivers under 21: effectively zero tolerance</li>
  <li>Cannabis DUI is charged under the same impaired-driving statute; there is no legal "limit" that makes driving high safe or lawful</li>
</ul>

<p>A first DUI conviction in California typically costs well over $10,000 once fines, fees, license reinstatement, DUI school, and years of insurance surcharges are counted, before any jail time or ignition interlock requirement. The specifics are in our <a href="/dui-california-limits">California DUI limits guide</a>.</p>

<div class="dmv-callout dmv-callout-warning">
  <div class="dmv-callout-header"><span class="dmv-callout-icon">⚠️</span><span class="dmv-callout-title">Checkpoints are legal in California</span></div>
  <div class="dmv-callout-body"><p>Sobriety checkpoints are constitutional in California and announced in advance by many agencies. Turning around illegally to avoid one is itself a violation that invites a stop.</p></div>
</div>
`,
    faq: [
      {
        question: 'When does CHP run Maximum Enforcement Periods?',
        answer:
          'Around every major holiday: the winter holidays and New Year’s, Memorial Day weekend, July 4, Labor Day weekend, and Thanksgiving. MEPs typically start the evening before the holiday and run through the last night of the weekend.',
      },
      {
        question: 'What is the legal BAC limit in California?',
        answer:
          '0.08% for drivers 21 and older in private vehicles, 0.04% for commercial drivers, and 0.01% for drivers under 21. Impairment below these numbers can still be charged when driving is affected.',
      },
    ],
    related: [
      { href: '/dui-california-limits', label: 'California DUI limits guide' },
      { href: '/how-to-drive-safely-and-avoid-fines', label: 'California traffic fines guide' },
    ],
    official: [
      { href: 'https://www.chp.ca.gov/', label: 'California Highway Patrol' },
    ],
  },
];

export const EVENT_SLUGS = SAFETY_EVENTS.map((e) => e.slug);

export function getEvent(slug: string): SafetyEvent | undefined {
  return SAFETY_EVENTS.find((e) => e.slug === slug);
}
