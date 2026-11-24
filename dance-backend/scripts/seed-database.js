const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Define schemas
const HighlightSchema = new mongoose.Schema({
    title: String,
    text: String,
    order: Number,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ProgramSchema = new mongoose.Schema({
    name: String,
    age: String,
    bucket: String,
    style: String,
    schedule: String,
    order: Number,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const ScheduleSchema = new mongoose.Schema({
    day: String,
    items: [{
        title: String,
        time: String,
        studio: String,
        age: String,
    }],
    order: Number,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const TestimonialSchema = new mongoose.Schema({
    quote: String,
    name: String,
    order: Number,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const NewsSchema = new mongoose.Schema({
    title: String,
    body: String,
    date: String,
}, { timestamps: true });

const GallerySchema = new mongoose.Schema({
    title: String,
    thumbnail: String,
    images: [String],
    order: Number,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const StaffMemberSchema = new mongoose.Schema({
    name: String,
    title: String,
    img: String,
    styles: [String],
    bio: [String],
    order: Number,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Highlight = mongoose.model('Highlight', HighlightSchema);
const Program = mongoose.model('Program', ProgramSchema);
const Schedule = mongoose.model('Schedule', ScheduleSchema);
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
const News = mongoose.model('News', NewsSchema);
const Gallery = mongoose.model('Gallery', GallerySchema);
const StaffMember = mongoose.model('StaffMember', StaffMemberSchema);

// Sample data
const highlights = [
    { title: 'All ages & levels', text: 'From tiny dancers to teens and adults with clear, caring progressions.', order: 0 },
    { title: 'Safe, upbeat studio', text: 'Bright spaces, encouraging teachers, and choreography that builds confidence.', order: 1 },
    { title: 'Performance ready', text: 'Recitals, community shows, and plenty of chances to shine together.', order: 2 },
];

const programs = [
    { name: 'Preschool Ballet', age: 'Ages 3-4', bucket: 'Ages 3-4', style: 'First steps in ballet', schedule: 'Mon 4:00-4:30 - Fri 10:30-11:00', order: 0 },
    { name: 'Primary Ballet', age: 'Ages 5-7', bucket: 'Ages 5-13', style: 'Foundations in ballet', schedule: 'Mon 4:45-5:30 - Wed/Fri sessions', order: 1 },
    { name: 'Ballet 1 & 2', age: 'Ages 8-13', bucket: 'Ages 5-13', style: 'Beginning ballet technique', schedule: 'Mon 4:00-4:45 - Fri 1:00-1:45', order: 2 },
    { name: 'Contemporary 1-6', age: 'Levels 1-6', bucket: 'Ages 14-18', style: 'Contemporary progressions', schedule: 'Mon 5:45-8:45 across levels', order: 3 },
    { name: 'Musical Theatre 1 & 2', age: 'Ages 5-13', bucket: 'Ages 5-13', style: 'Vocals + dance (tuition by semester, costume included)', schedule: 'Mon 4:00-5:45 - Studio A', order: 4 },
    { name: 'Hip Hop (1-6, Jr/Sr Crew)', age: 'Ages 8-Teen', bucket: 'Ages 14-18', style: 'Hip Hop levels 1-6, Jr/Sr Crew', schedule: 'Mon 4:45-8:45 - Thu 6:30-7:45', order: 5 },
    { name: 'Jazz & Lyrical', age: 'Various levels', bucket: 'Ages 14-18', style: 'Jazz and lyrical technique', schedule: 'Tue & Wed evenings', order: 6 },
    { name: 'Tap & Pointe', age: 'Levels 1-6', bucket: 'Ages 14-18', style: 'Tap progressions and pointe prep/levels', schedule: 'Tue/Thu evenings', order: 7 },
    { name: 'Tumbling', age: 'Preschool through advanced', bucket: 'Ages 3-4', style: 'Tumbling progressions across ages', schedule: 'Wed daytime - Fri 10:30-2:00', order: 8 },
    { name: 'Adult Classes', age: '18+', bucket: 'Adults', style: 'Ballet, Tap, Jazz & Hip Hop', schedule: 'Tue/Thu evenings', order: 9 },
];

const schedule = [
    {
        day: 'Monday',
        order: 0,
        items: [
            { title: 'Ballet 1 & 2', time: '4:00-4:45', studio: 'B', age: 'Ages 5-13' },
            { title: 'Musical Theatre 1', time: '4:00-4:45', studio: 'A', age: 'Ages 5-13' },
            { title: 'Preschool Ballet', time: '4:00-4:30', studio: 'C', age: 'Ages 3-4' },
            { title: 'Hip Hop 1 & 2', time: '4:45-5:30', studio: 'B', age: 'Ages 5-13' },
            { title: 'Primary Ballet', time: '4:45-5:30', studio: 'C', age: 'Ages 5-13' },
            { title: 'Contemporary 1 & 2', time: '5:45-6:30', studio: 'B', age: 'Ages 5-13' },
            { title: 'Contemporary 5', time: '6:45-7:45', studio: 'A', age: 'Ages 14-18' },
            { title: 'Hip Hop 6 "Sr Crew"', time: '6:45-7:45', studio: 'B', age: 'Ages 14-18' },
        ],
    },
    {
        day: 'Tuesday',
        order: 1,
        items: [
            { title: 'Jazz 3', time: '4:00-5:00', studio: 'A', age: 'Ages 5-13' },
            { title: 'Tap 1 & 2', time: '4:00-4:45', studio: 'B', age: 'Ages 5-13' },
            { title: 'Lyrical 1 & 2', time: '5:00-5:45', studio: 'B', age: 'Ages 5-13' },
            { title: 'Adult Jazz & Hip Hop', time: '6:30-7:30', studio: 'C', age: 'Adults' },
            { title: 'Adult Ballet', time: '7:30-8:30', studio: 'C', age: 'Adults' },
        ],
    },
    {
        day: 'Wednesday',
        order: 2,
        items: [
            { title: 'Preschool & Primary Tumbling', time: '4:00-4:45', studio: 'B', age: 'Ages 3-4' },
            { title: 'Primary Ballet', time: '4:00-4:45', studio: 'C', age: 'Ages 5-13' },
            { title: 'Jazz 6', time: '5:45-6:45', studio: 'A', age: 'Ages 14-18' },
            { title: 'Beginning & Intermediate Tumbling', time: '6:45-7:45', studio: 'B', age: 'Ages 5-13' },
        ],
    },
    {
        day: 'Thursday',
        order: 3,
        items: [
            { title: 'Ballet 5', time: '4:00-5:00', studio: 'B', age: 'Ages 14-18' },
            { title: 'Preschool Jazz & Hip Hop', time: '4:00-4:30', studio: 'C', age: 'Ages 3-4' },
            { title: 'Jazz 1 & 2', time: '5:00-5:45', studio: 'B', age: 'Ages 5-13' },
            { title: 'Hip Hop 3 & 4', time: '6:30-7:15', studio: 'A', age: 'Ages 5-13' },
            { title: 'Adult Tap', time: '7:15-8:15', studio: 'A', age: 'Adults' },
        ],
    },
    {
        day: 'Friday',
        order: 4,
        items: [
            { title: 'Preschool Ballet', time: '10:30-11:00', studio: 'C', age: 'Ages 3-4' },
            { title: 'Primary Tumbling', time: '10:30-11:15', studio: 'B', age: 'Ages 5-13' },
            { title: 'Primary Ballet', time: '11:15-12:00', studio: 'A', age: 'Ages 5-13' },
            { title: 'Beginning Tumbling', time: '12:00-1:00', studio: 'B', age: 'Ages 5-13' },
            { title: 'Intermediate & Advanced Tumbling', time: '1:00-2:00', studio: 'B', age: 'Ages 14-18' },
        ],
    },
];

const testimonials = [
    { quote: 'My daughter gained confidence and cannot wait for class each week.', name: 'Sarah M.', order: 0 },
    { quote: 'Warm, professional teachers who set high standards with lots of joy.', name: 'Josh L.', order: 1 },
    { quote: 'Performances are organized, creative, and so much fun to watch.', name: 'Dana P.', order: 2 },
];

const news = [
    { title: 'Winter showcase tickets now open', date: 'Dec 10', body: 'Reserve seats early in Studio Pro under Tickets. Families and friends welcome.' },
    { title: 'Company auditions Jan 12', date: 'Nov 28', body: 'Sign up in Studio Pro; choreography notes are posted in Band for review.' },
    { title: 'Holiday break schedule', date: 'Nov 20', body: 'Studio closed Dec 24-Jan 1. Classes resume Jan 2 with refreshed routines.' },
];

const gallery = [
    { title: 'Performance showcase', thumbnail: '/images/gallery1.jpg', images: [], order: 0 },
    { title: 'Dance practice', thumbnail: '/images/gallery2.jpg', images: [], order: 1 },
    { title: 'Studio moments', thumbnail: '/images/gallery3.jpg', images: [], order: 2 },
    { title: 'Recital day', thumbnail: '/images/gallery4.jpg', images: [], order: 3 },
    { title: 'Group rehearsal', thumbnail: '/images/gallery5.jpg', images: [], order: 4 },
    { title: 'Company photo', thumbnail: '/images/gallery6.jpg', images: [], order: 5 },
];

const staffMembers = [
    {
        name: 'Rebecca Eagle',
        title: 'Owner / Artistic Director',
        img: '/images/Becky2012_000.jpg',
        styles: ['Ballet', 'Contemporary'],
        bio: [
            'Director of TDA and Mountain Dream Dance Company since 2008; 28+ years performing and teaching.',
            'Ballet roots with Pamela Icaboni and Beverly Gries; expanded into partner/ballroom with Cindy DeChamp.',
            'Choreographer for George Gardner Show Choir Festival, NPC "Amahl," and multiple high school productions.',
        ],
        order: 0,
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
        order: 1,
    },
    {
        name: 'Deborah Baughman',
        title: 'Instructor',
        img: '/images/Deborah2016.png',
        styles: ['Ballet', 'Jazz', 'Tap'],
        bio: [
            '14 years of ballet, jazz, and tap at France Academy of Dance; added modern/ballroom/swing at U of A.',
            'Toured globally with Impact Productions\' "The Master Piece, A Toy Maker\'s Dream."',
            'Certified personal trainer; teaches Primary 2 Ballet with a focus on foundations.',
        ],
        order: 2,
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
        order: 3,
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
        order: 4,
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
        order: 5,
    },
    {
        name: 'Shayna da Cruz',
        title: 'Instructor',
        img: '/images/Shayna2011.jpg',
        styles: ['Ballet', 'Lyrical', 'Jazz', 'Tap', 'Hip Hop'],
        bio: [
            '12 years dancing, 10 teaching across ballet, lyrical, jazz, tap, and hip hop.',
            'Maine\'s Got Talent finalist (2010) and longtime figure skater with top placements.',
            'Teaches third grade in Show Low while coaching dancers.',
        ],
        order: 6,
    },
];

async function seedDatabase() {
    try {
        const uri = process.env.DATABASE_URL || process.env.MONGO_URI;
        
        if (!uri) {
            console.error('❌ DATABASE_URL or MONGO_URI not found in .env file');
            process.exit(1);
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('\n🗑️  Clearing existing data...');
        await Highlight.deleteMany({});
        await Program.deleteMany({});
        await Schedule.deleteMany({});
        await Testimonial.deleteMany({});
        await News.deleteMany({});
        await Gallery.deleteMany({});
        await StaffMember.deleteMany({});

        // Insert new data
        console.log('📝 Seeding highlights...');
        await Highlight.insertMany(highlights);
        console.log(`✅ Added ${highlights.length} highlights`);

        console.log('📝 Seeding programs...');
        await Program.insertMany(programs);
        console.log(`✅ Added ${programs.length} programs`);

        console.log('📝 Seeding schedule...');
        await Schedule.insertMany(schedule);
        console.log(`✅ Added ${schedule.length} schedule days`);

        console.log('📝 Seeding testimonials...');
        await Testimonial.insertMany(testimonials);
        console.log(`✅ Added ${testimonials.length} testimonials`);

        console.log('📝 Seeding news...');
        await News.insertMany(news);
        console.log(`✅ Added ${news.length} news items`);

        console.log('📝 Seeding gallery...');
        await Gallery.insertMany(gallery);
        console.log(`✅ Added ${gallery.length} gallery images`);

        console.log('📝 Seeding staff members...');
        await StaffMember.insertMany(staffMembers);
        console.log(`✅ Added ${staffMembers.length} staff members`);

        console.log('\n✅ Database seeded successfully!');
        console.log('📊 Summary:');
        console.log(`   - ${highlights.length} Highlights`);
        console.log(`   - ${programs.length} Programs`);
        console.log(`   - ${schedule.length} Schedule Days`);
        console.log(`   - ${testimonials.length} Testimonials`);
        console.log(`   - ${news.length} News Items`);
        console.log(`   - ${gallery.length} Gallery Images`);
        console.log(`   - ${staffMembers.length} Staff Members`);
        
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
