import { useMemo, useState, useEffect, useCallback } from 'react'
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { api, getImageUrl } from './services/api'

const studioProHome = 'https://app.gostudiopro.com/online/index.php?account_id=30387'

// Fallback data in case API fails
const fallbackHighlights = [
  { title: 'All ages & levels', text: 'From tiny dancers to teens and adults with clear, caring progressions.' },
  { title: 'Safe, upbeat studio', text: 'Bright spaces, encouraging teachers, and choreography that builds confidence.' },
  { title: 'Performance ready', text: 'Recitals, community shows, and plenty of chances to shine together.' },
  { title: 'Performance ready', text: 'Recitals, community shows, and plenty of chances to shine together.' },
]

// Used only when the staff API is unreachable or has no entries
const fallbackStaff = [
  {
    name: 'Rebecca Eagle',
    title: 'Owner / Artistic Director',
    img: '/images/Becky2012_000.jpg',
    styles: ['Ballet', 'Contemporary'],
    bio: [
      'Director of TDA and Mountain Dream Dance Company since 2008; 28+ years performing and teaching.',
      'Ballet roots with Pamela Icaboni and Beverly Gries; expanded into partner/ballroom with Cindy DeChamp.',
      'Choreographer for George Gardner Show Choir Festival, NPC “Amahl,” and multiple high school productions.',
    ],
  },
  {
    name: 'Breanna Adams',
    title: 'Assistant Artistic Director',
    img: '/images/Bre2014.jpg',
    styles: ['Ballet', 'Jazz', 'Tap', 'Lyrical', 'Musical Theatre'],
    bio: [
      'Started at age 4; trained with Ballet Etudes and Kathy Hirai.',
      'Performed Court Fairy (Nutcracker), Stepsister/Princess (Cinderella), Blue Fairy (Alice in Wonderland).',
      'Teacher/choreographer for George Gardner Festival and Show Low HS; mom of three dancers.',
    ],
  },
  {
    name: 'Deborah Baughman',
    title: 'Instructor',
    img: '/images/Deborah2016.png',
    styles: ['Ballet', 'Jazz', 'Tap'],
    bio: [
      '14 years of ballet, jazz, and tap at France Academy of Dance; added modern/ballroom/swing at U of A.',
      'Toured globally with Impact Productions’ “The Master Piece, A Toy Maker’s Dream.”',
      'Certified personal trainer; teaches Primary 2 Ballet with a focus on foundations.',
    ],
  },
  {
    name: 'Danielle Johnson',
    title: 'Instructor',
    img: '/images/Danielle2016.png',
    styles: ['Modern', 'Jazz', 'Ballet'],
    bio: [
      'Ailey and Nanette Bearden scholarship alum; trained in modern, ballet, jazz, and Dunham.',
      'Performed 11 years with Desert Dance Theatre; finalist in the National Aerobics Championships.',
      'Certified fitness/Pilates instructor now teaching in the White Mountains and raising three kids.',
    ],
  },
  {
    name: 'Derrick Patten',
    title: 'Instructor',
    img: '/images/Derrick2016.png',
    styles: ['Ballet', 'Jazz', 'Hip Hop', 'Contemporary', 'Tumbling'],
    bio: [
      'Multi-genre TDA dancer since 2011 across ballet, jazz, hip hop, contemporary, and tumbling.',
      'Competition winner at Dupree, Hollywood Dance Experience, and Starbound.',
      'Performed Snow King, Nutcracker Prince, Rat King; teaches while pursuing nursing.',
    ],
  },
  {
    name: 'Taylor Garcia',
    title: 'Instructor',
    img: '/images/Taylor2016.png',
    styles: ['Jazz', 'Tap', 'Lyrical', 'Modern'],
    bio: [
      'From gymnastics to dance at age 8; 17 years across jazz, tap, lyrical, and modern.',
      'Convention and competition experience; loves teaching clean technique.',
      'Pursuing PTA studies while coaching dancers.',
    ],
  },
  {
    name: 'Shayna da Cruz',
    title: 'Instructor',
    img: '/images/Shayna2011.jpg',
    styles: ['Ballet', 'Lyrical', 'Jazz', 'Tap', 'Hip Hop'],
    bio: [
      '12 years dancing, 10 teaching across ballet, lyrical, jazz, tap, and hip hop.',
      'Maine’s Got Talent finalist (2010) and longtime figure skater with top placements.',
      'Teaches third grade in Show Low while coaching dancers.',
    ],
  },
]

const HeroSlideshow = ({ slides = [] }) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const current = count ? index % count : 0

  useEffect(() => {
    if (count < 2 || paused) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000)
    return () => clearInterval(timer)
  }, [count, paused, current])

  if (count === 0) return <div className="hero-dancer" aria-label="Dancer" />

  return (
    <div
      className="hero-slideshow"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide._id || slide.image}
          className={`hero-slide ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${getImageUrl(slide.image)})` }}
          role="img"
          aria-label={slide.caption || `Dance Academy photo ${i + 1}`}
          aria-hidden={i !== current}
        />
      ))}
      {count > 1 && (
        <>
          <button type="button" className="hero-nav prev" aria-label="Previous photo" onClick={() => setIndex((current - 1 + count) % count)}>&#8249;</button>
          <button type="button" className="hero-nav next" aria-label="Next photo" onClick={() => setIndex((current + 1) % count)}>&#8250;</button>
          <div className="hero-dots">
            {slides.map((slide, i) => (
              <button
                type="button"
                key={slide._id || slide.image}
                className={i === current ? 'active' : ''}
                aria-label={`Show photo ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const HomePage = ({ highlights = [], heroSlides = [] }) => (
  <>
    <header className="hero">
      <div className="hero-content">
        <div>
          <p className="eyebrow">Lakeside - AZ</p>
          <h1>Serious Dance. Serious Fun.</h1>
          <p className="lede">
            Come join our dance family. Ballet, jazz, hip hop, tap, lyrical, contemporary, and tumbling classes are taught by caring instructors who help every dancer grow with confidence.
          </p>
          <div className="cta-row">
            <NavLink className="btn primary" to="/classes">View Classes</NavLink>
            <NavLink className="btn ghost" to="/contact">Contact Us</NavLink>
          </div>
          <div className="hero-stats">
            <div>
              <strong>since 1989</strong>
              <span>of dance in the White Mountains</span>
            </div>
            <div>
              <strong>8 styles</strong>
              <span>across all levels</span>
            </div>
            <div>
              <strong>All ages</strong>
              <span>preschool to adult</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <HeroSlideshow slides={heroSlides} />
        </div>
      </div>
    </header>

    <section className="section highlights">
      {highlights.map((item, index) => (
        <div key={`${item.title}-${index}`} className="highlight-card">
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </div>
      ))}
    </section>

  </>
)

const programBuckets = ['Ages 3-4', 'Ages 5-13', 'Ages 14-18', 'Adults']

const styleMatchers = [
  ['Ballet', /ballet/i],
  ['Pointe', /pointe/i],
  ['Jazz', /jazz/i],
  ['Hip Hop', /hip[\s-]?hop/i],
  ['Tap', /\btap\b/i],
  ['Lyrical', /lyrical/i],
  ['Contemporary', /contemporary/i],
  ['Tumbling', /tumbling/i],
  ['Musical Theatre', /musical theat(re|er)/i],
]

const programStyles = (program) => {
  const text = `${program.name || ''} ${program.style || ''}`
  return styleMatchers.filter(([, pattern]) => pattern.test(text)).map(([label]) => label)
}

const ClassesPage = ({ programs = [] }) => {
  const [ageFilter, setAgeFilter] = useState('All')
  const [styleFilter, setStyleFilter] = useState('All')

  const extraBuckets = [...new Set(programs.map((p) => p.bucket).filter((b) => b && !programBuckets.includes(b)))]
  const allBuckets = [...programBuckets, ...extraBuckets].filter((bucket) => programs.some((p) => p.bucket === bucket))
  const styleOptions = styleMatchers.map(([label]) => label).filter((label) => programs.some((p) => programStyles(p).includes(label)))

  const visiblePrograms = programs.filter(
    (p) => (ageFilter === 'All' || p.bucket === ageFilter) && (styleFilter === 'All' || programStyles(p).includes(styleFilter)),
  )
  const buckets = allBuckets.filter((bucket) => visiblePrograms.some((p) => p.bucket === bucket))

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Programs</p>
        <h2>Classes built for every age and level.</h2>
        <p className="lede small">Clear progressions, supportive instructors, and choreography that keeps dancers excited to learn.</p>
      </div>
      <div className="month-controls">
        <label>
          Age group
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            <option value="All">All</option>
            {allBuckets.map((bucket) => (
              <option key={bucket} value={bucket}>{bucket}</option>
            ))}
          </select>
        </label>
        <label>
          Style
          <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)}>
            <option value="All">All</option>
            {styleOptions.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grouped-programs">
        {buckets.length === 0 && programs.length > 0 && (
          <p className="muted">No classes match those filters. Try a different age group or style.</p>
        )}
        {buckets.map((bucket) => {
          const items = visiblePrograms.filter((p) => p.bucket === bucket)
          return (
            <div key={bucket} className="program-group">
              <div className="program-group-header">
                <h3>{bucket}</h3>
                <span className="tag">{items.length} classes</span>
              </div>
              <div className="card-grid">
                {items.map((program) => (
                  <div key={program._id || program.name} className="card compact">
                    <div className="card-header">
                      <h4>{program.name}</h4>
                      <span className="tag">{program.age}</span>
                    </div>
                    <p className="muted">{program.style}</p>
                    <p className="schedule">{program.schedule}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const SchedulePage = ({ schedule = [] }) => {
  const [ageFilter, setAgeFilter] = useState('All')

  const today = useMemo(() => {
    const now = new Date()
    return {
      date: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
      weekday: daysOfWeek[(now.getDay() + 6) % 7],
    }
  }, [])

  const monthData = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const startDay = (new Date(year, month, 1).getDay() + 6) % 7 // Monday start
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < startDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d)
      const weekday = daysOfWeek[(dateObj.getDay() + 6) % 7]
      cells.push({ dayNumber: d, weekday })
    }
    const label = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
    return { cells, label, month, year }
  }, [])

  const eventsByDayName = useMemo(() => {
    const map = {}
    schedule.forEach((block) => {
      map[block.day] = block.items
    })
    return map
  }, [schedule])

  const filterEvents = (events = []) => {
    if (ageFilter === 'All') return events
    return events.filter((e) => e.age === ageFilter)
  }

  return (
    <section className="section schedule">
      <div className="section-heading">
        <p className="eyebrow">Schedule</p>
        <h2>{monthData.label}</h2>
        <p className="lede small">Hover to see classes; filter by age to narrow down.</p>
      </div>
      <div className="month-controls">
        <label>
          Age group
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Ages 3-4">Ages 3-4</option>
            <option value="Ages 5-13">Ages 5-13</option>
            <option value="Ages 14-18">Ages 14-18</option>
            <option value="Adults">Adults</option>
          </select>
        </label>
        <div className="legend">
          <span className="legend-dot" /> Today
        </div>
      </div>
      <div className="calendar-month">
        <div className="calendar-month-header">
          {daysOfWeek.map((d) => (
            <div key={d} className="calendar-month-dayhead">
              {d}
            </div>
          ))}
        </div>
        <div className="calendar-month-grid">
          {monthData.cells.map((cell, idx) => {
            if (!cell) return <div key={`empty-${idx}`} className="calendar-cell empty" />
            const isToday =
              cell.dayNumber === today.date && monthData.month === today.month && monthData.year === today.year
            const events = filterEvents(eventsByDayName[cell.weekday])
            return (
              <div key={`${cell.weekday}-${cell.dayNumber}-${idx}`} className={`calendar-cell ${isToday ? 'is-today' : ''}`}>
                <div className="calendar-cell-date">{cell.dayNumber}</div>
                <div className="calendar-cell-body">
                  {events.map((e) => (
                    <div key={`${e.title}-${e.time}`} className="calendar-event">
                      <div className="calendar-event-title">{e.title}</div>
                      <div className="calendar-event-meta">
                        {e.time} - Studio {e.studio} - {e.age}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const GalleryPage = ({ gallery = [] }) => (
  <section className="section gallery">
    <div className="section-heading">
      <p className="eyebrow">Gallery</p>
      <h2>Moments that matter.</h2>
    </div>
    <div className="gallery-categories">
      {gallery.map((category) => (
        <div key={category._id} style={{ marginBottom: '60px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '24px' }}>{category.title}</h3>
          <div className="gallery-grid">
            <div className="gallery-card">
              <div
                className="gallery-thumb"
                aria-label={category.title}
                style={{ backgroundImage: `linear-gradient(135deg, rgba(12,12,20,0.35), rgba(0,0,0,0.55)), url(${getImageUrl(category.thumbnail)})` }}
              >
                <span className="gallery-title">{category.title}</span>
              </div>
            </div>
            {category.images.map((img, idx) => (
              <div key={idx} className="gallery-card">
                <div
                  className="gallery-thumb"
                  aria-label={`${category.title} ${idx + 1}`}
                  style={{ backgroundImage: `linear-gradient(135deg, rgba(12,12,20,0.35), rgba(0,0,0,0.55)), url(${getImageUrl(img)})` }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
)

const NewsPage = ({ news = [] }) => (
  <section className="section news">
    <div className="section-heading">
      <p className="eyebrow">Newsfeed</p>
      <h2>Updates for families.</h2>
    </div>
    <div className="news-grid">
      {news.map((item) => (
        <article key={item._id || item.title} className="news-card">
          {item.imageUrl && <img className="news-image" src={getImageUrl(item.imageUrl)} alt={item.title} loading="lazy" />}
          <div className="news-meta">
            <span className="news-date">
              {new Date(item.date || item.updatedAt || item.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3>{item.title}</h3>
          <p className="muted">{item.body ?? item.description}</p>
        </article>
      ))}
    </div>
  </section>
)



const HandbookPage = () => (
  <section className="section handbook">
    <div className="section-heading">
      <p className="eyebrow">Handbook</p>
      <h2>Policies & Dress Code</h2>
      <p className="lede small">The essentials for students and families. No schedules here - just the rules, policies, and attire guidelines.</p>
    </div>
    <div className="handbook-stack">
      <details className="accordion">
        <summary>
          <span>The Dance Academy Rules & Policies</span>
          <span className="chevron">▼</span>
        </summary>
        <div className="accordion-body">
          <p>At The Dance Academy we LOVE TO DANCE! We want to share our passion for dance and teaching with our students. Our goal is to create a positive environment for students to have a great learning experience. We want our students to challenge themselves to be the best they can be and work to achieve goals. We encourage students to explore all different styles of dance and find what they love!</p>
          <p><strong>Newsletters & Updates</strong> - It is your responsibility to stay informed. Please make sure we have a current email address. We send information via email, post to Facebook/Instagram, and hand out hard copies in class.</p>
          <p><strong>Dress Code</strong> - Hair pulled back for every class, no jeans, only family-friendly wording/graphics. No jewelry except wedding rings and small studs. Ballet: girls pink ballet slippers, leotard, pink tights, hair in a bun. Boys: black slippers, black pants, white tee. Jazz & Tap: black jazz/tap shoes, leggings or dance shorts, athletic top, hair pulled back. Lyrical & Contemporary: half-sole turners/footundies, leggings/shorts, athletic top, hair pulled back. Hip Hop: clean studio-only sneakers, athletic clothing, joggers/baggy sweats, hair pulled back. Tumbling: leotard/shorts or other fitted clothing, barefoot, hair pulled back.</p>
          <p><strong>Etiquette</strong> - The Dance Academy is a school. Respect teachers, staff, students, parents, property, and equipment. No bad language, bullying, disruptive behavior, or abuse - grounds for immediate dismissal with no refunds. Children not dancing must be supervised. The studio is not responsible for lost, damaged, or stolen property.</p>
          <p><strong>Classroom Etiquette</strong> - Be on time, prepared, and in dress code. Dancers only in classrooms during class time. No food, soda, or gum; water is encouraged. Phones stay in dance bags during class. Teachers may dismiss students violating rules or dress code.</p>
          <p><strong>Student Drop Off and Pick Up</strong> - Young dancers must be accompanied in and out by an adult. Notify teachers/front desk if another adult is picking up your child.</p>
          <p><strong>Registration Fee & Tuition</strong> - Annual registration: $25 per student or $40 per family (non-refundable). 30 min classes $35/mo, 45 min $50/mo, 1 hour $65/mo. Unlimited: single student $190/mo, second family student unlimited $140/mo, family unlimited $390/mo. Tuition is due on the 1st (except December). Payments after the 5th incur a 10% late fee. Auto-pay is available for tuition and dance company fees only. Returned checks: $20 plus late fees. No refunds for paid lessons/fees; no proration for missed classes.</p>
          <p><strong>Absences</strong> - Please notify the studio. Two consecutive weeks with no notice may be treated as a drop. No refunds or proration for missed classes. Make-up classes are allowed within 4 weeks of the absence.</p>
          <p><strong>Snow Days</strong> - Call the studio or check Facebook for closures. Emails go out when classes are canceled.</p>
          <p><strong>Recital & Costumes</strong> - Annual review in early June (date announced in fall). Attendance is vital the two months prior. Costumes range $60-$100; fees are due early December. No refunds once ordered; payment plans may be arranged.</p>
        </div>
      </details>

      <details className="accordion">
        <summary>
          <span>The Dance Academy Dress Code</span>
          <span className="chevron">▼</span>
        </summary>
        <div className="accordion-body">
          <ul className="policy-list">
            <li><strong>General</strong> - Hair pulled back every class; no jeans; family-friendly graphics only; jewelry is not allowed (wedding rings and small studs are okay).</li>
            <li><strong>Ballet</strong> - Girls: pink ballet slippers, leotard, pink tights, hair in a bun. Boys: black ballet slippers, black dance pants, white t-shirt.</li>
            <li><strong>Jazz & Tap</strong> - Black jazz or tap shoes, leggings or dance shorts with athletic tops, hair pulled back.</li>
            <li><strong>Lyrical & Contemporary</strong> - Half-sole turners or footundies, leggings or dance shorts with athletic tops, hair pulled back.</li>
            <li><strong>Hip Hop</strong> - Clean sneakers used only for class (no outdoor wear), athletic clothing, joggers or baggy sweats, hair pulled back.</li>
            <li><strong>Tumbling</strong> - Leotard and shorts or other fitted clothing; dancers are barefoot; hair pulled back.</li>
          </ul>
        </div>
      </details>
    </div>
  </section>
)

const StaffPage = ({ staff = [] }) => (
  <section className="section staff">
    <div className="section-heading">
      <p className="eyebrow">Team</p>
      <h2>Meet The Dance Academy staff.</h2>
      <p className="lede small">Seasoned instructors, choreographers, and mentors who keep our dancers inspired and supported.</p>
    </div>
    <div className="staff-grid">
      {staff.map((person, idx) => (
        <article key={person._id || person.name} className={`staff-card ${idx % 2 ? 'flip' : ''}`}>
          <div className="staff-content">
            <div className="staff-header">
              <div className="staff-avatar" aria-label={person.name} style={{ backgroundImage: person.img ? `url(${person._id ? getImageUrl(person.img) : person.img})` : 'none' }} />
              <div className="staff-title-block">
                <h4>{person.name}</h4>
                <p className="muted">{person.title}</p>
              </div>
            </div>
            <div className="staff-styles-block">
              <p className="styles-heading">Styles</p>
              <ul className="styles-list">
                {(person.styles || []).map((style) => (
                  <li key={style}>{style}</li>
                ))}
              </ul>
            </div>
            <ul className="staff-bullets">
              {(person.bio || []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  </section>
)
const TestimonialsPage = ({ testimonials = [] }) => (
  <section className="section testimonials">
    <div className="section-heading">
      <p className="eyebrow">Families say</p>
      <h2>"We feel right at home here."</h2>
    </div>
    <div className="testimonial-grid">
      {testimonials.map((item) => (
        <div key={item.name} className="testimonial-card">
          <p>"{item.quote}"</p>
          <span className="muted">{item.name}</span>
        </div>
      ))}
    </div>
  </section>
)

const FounderPage = () => (
  <section className="section founder">
    <div className="section-heading">
      <p className="eyebrow">In Memoriam</p>
      <h2>Honoring Beverly Gries</h2>
      <p className="lede small">Founder of The Dance Academy and Mountain Dream Dance Company, who brought dance to the White Mountains in 1989 and inspired generations.</p>
    </div>

    <div className="founder-hero">
      <div>
        <h3>Beverly Gries</h3>
        <p className="muted">Founder • Visionary • Artist</p>
        <p>Beverly Gries founded The Dance Academy and Mountain Dream Dance Company. In 1989 she came to the White Mountains with a dream of bringing dance to the community, leaving a large and lasting impact on countless lives.</p>
      </div>
      <div className="founder-photo" style={{ backgroundImage: "url('/images/bev1.gif')" }} aria-label="Beverly Gries" />
    </div>

    <div className="founder-card single">
      <h4>Her Legacy & Remembrance</h4>
      <p>Bev’s last performance was in <em>The Nutcracker</em> with MDDC in December 2008, always as the Queen Mother—at home on stage with the passion and presence of a true artist.</p>
      <p>Little did we know that performance would be the final time we saw her dance. She passed away in January 2009, leaving behind a community forever shaped by her artistry and heart.</p>
    </div>
  </section>
)

const StudioProPage = () => (
  <section className="section callout">
    <div>
      <p className="eyebrow">Studio Pro</p>
      <h2>Registration, tickets, and account management.</h2>
      <p className="lede small">Tap through to banking, tickets for shows, and family accounts.</p>
    </div>
    <div className="callout-actions">
      <a className="btn primary" href={studioProHome} target="_blank" rel="noreferrer">Open Studio Pro</a>
      <NavLink className="btn ghost" to="/contact">Schedule a Trial</NavLink>
    </div>
  </section>
)

const ContactPage = () => (
  <section className="section contact">
    <div className="section-heading">
      <p className="eyebrow">Location & Contact Info</p>
      <h2>Visit, call, or email us.</h2>
      <p className="lede small">Office hours Mon-Thu 3:30-7pm, Fri 11am-3pm. Summer hours follow summer classes.</p>
    </div>
    <div className="contact-grid">
      <div className="contact-card">
        <h3>Location & Contact</h3>
        <p className="muted">5801 America Lane</p>
        <p className="muted">Lakeside, AZ 85929</p>
        <p className="muted">danceaca@danceacademywhitemountains.com</p>
        <p className="muted">(928) 537-1406</p>
        <a className="map-image-link" href="/images/Map.png" target="_blank" rel="noreferrer" aria-label="Open map full screen">
          <img className="map-image" src="/images/Map.png" alt="Map to The Dance Academy" />
        </a>
        <a className="muted map-link" href="https://www.google.com/maps/place/Dance+Academy/@34.1930403,-110.0566905,14z/data=!4m10!1m2!2m1!1sthedanceacadamyofthewhitemountains!3m6!1s0x8728cba088d32d89:0x16c975e00cea5b9c!8m2!3d34.1930403!4d-110.0185817!15sCih0aGUgZGFuY2UgYWNhZGVteSBvZiB0aGUgd2hpdGUgbW91bnRhaW5zWioiKHRoZSBkYW5jZSBhY2FkZW15IG9mIHRoZSB3aGl0ZSBtb3VudGFpbnOSAQxkYW5jZV9zY2hvb2yaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVTXlkblZpYW1kQlJSQULgAQD6AQQIEhA9!16s%2Fg%2F1tdwkzht?entry=ttu" target="_blank" rel="noreferrer">View on Google Maps</a>
      </div>
      <div className="contact-card storefront">
        <h3>Storefront & Office Hours</h3>
        <p className="muted">Stop by for registration and questions.</p>
        <p className="muted">Mon-Thu 3:30-7:00pm</p>
        <p className="muted">Fri 11:00am-3:00pm</p>
        <p className="muted">Summer hours follow summer classes.</p>
        <div className="storefront-photo" aria-label="Studio storefront" />
      </div>
    </div>
  </section>
)

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [highlights, setHighlights] = useState(fallbackHighlights)
  const [programs, setPrograms] = useState([])
  const [schedule, setSchedule] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [gallery, setGallery] = useState([])
  const [news, setNews] = useState([])
  const [staff, setStaff] = useState(fallbackStaff)
  const [heroSlides, setHeroSlides] = useState([])

  const loadData = useCallback(() => {
    api.getHighlights().then(setHighlights).catch(() => setHighlights(fallbackHighlights));
    api.getHeroSlides().then(setHeroSlides).catch(console.error);
    api.getPrograms().then(setPrograms).catch(console.error);
    api.getSchedule().then(setSchedule).catch(console.error);
    api.getTestimonials().then(setTestimonials).catch(console.error);
    api.getGallery().then(setGallery).catch(console.error);
    api.getNews().then(setNews).catch(console.error);
    api.getStaff()
      .then((list) => { if (Array.isArray(list) && list.length > 0) setStaff(list) })
      .catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <AppLayout
        loadData={loadData}
        heroSlides={heroSlides}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        highlights={highlights}
        programs={programs}
        schedule={schedule}
        testimonials={testimonials}
        gallery={gallery}
        news={news}
        staff={staff}
      />
    </BrowserRouter>
  )
}

function AppLayout({
  loadData,
  heroSlides,
  mobileNavOpen,
  setMobileNavOpen,
  highlights,
  programs,
  schedule,
  testimonials,
  gallery,
  news,
  staff,
}) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Refresh content on each public page visit so admin edits show immediately
  useEffect(() => {
    if (!isAdminRoute) loadData()
  }, [location.pathname, isAdminRoute, loadData])
  return (
      <div className="page">
        <div className={`layout ${isAdminRoute ? 'admin-layout-only' : ''}`}>
          {!isAdminRoute && (
            <aside className="side-nav">
              <div>
                <img className="brand-logo" src="/images/Logowcolor.png" alt="The Dance Academy of the White Mountains" />
                <span className="brand-sub">Of the White Mountains</span>
              </div>
              <button className="mobile-menu-toggle" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation">
                ☰ Menu
              </button>
              <nav className={mobileNavOpen ? 'open' : ''}>
                <NavLink to="/" end onClick={() => setMobileNavOpen(false)}>Home</NavLink>
                <NavLink to="/classes" onClick={() => setMobileNavOpen(false)}>Classes</NavLink>
                <NavLink to="/news" onClick={() => setMobileNavOpen(false)}>News</NavLink>
                <NavLink to="/staff" onClick={() => setMobileNavOpen(false)}>Staff</NavLink>
                <NavLink to="/handbook" onClick={() => setMobileNavOpen(false)}>Handbook</NavLink>
                <NavLink to="/studio-pro" onClick={() => setMobileNavOpen(false)}>Studio Pro</NavLink>
                <NavLink to="/contact" onClick={() => setMobileNavOpen(false)}>Contact</NavLink>
                <NavLink to="/login" onClick={() => setMobileNavOpen(false)}>Staff Login</NavLink>
              </nav>
            </aside>
          )}

          <main className={`main ${isAdminRoute ? 'main-admin-only' : ''}`}>
            <Routes>
              <Route path="/" element={<HomePage highlights={highlights} heroSlides={heroSlides} />} />
            <Route path="/classes" element={<ClassesPage programs={programs} />} />
            <Route path="/schedule" element={<SchedulePage schedule={schedule} />} />
            <Route path="/gallery" element={<GalleryPage gallery={gallery} />} />
            <Route path="/news" element={<NewsPage news={news} />} />
            <Route path="/founder" element={<FounderPage />} />
            <Route path="/staff" element={<StaffPage staff={staff} />} />
            <Route path="/handbook" element={<HandbookPage />} />
            <Route path="/testimonials" element={<TestimonialsPage testimonials={testimonials} />} />
            <Route path="/studio-pro" element={<StudioProPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>

            {!isAdminRoute && (
              <footer className="footer">
                <div>
                  <img className="brand-logo" src="/images/Logowcolor.png" alt="The Dance Academy of the White Mountains" />
                  <span className="brand-sub">Of the White Mountains</span>
                  <p className="muted">5801 America Lane - Lakeside, AZ 85929 - (928) 537-1406</p>
                </div>
              </footer>
            )}
          </main>
        </div>
      </div>
    
  )
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithAuth
