import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper function to generate random usernames
const generateUsername = (index: number): string => {
    const prefixes = ['music', 'melody', 'rhythm', 'beat', 'sonic', 'audio', 'tune', 'sound', 'groove', 'vibe'];
    const suffixes = ['lover', 'fan', 'head', 'enthusiast', 'junkie', 'master', 'guru', 'addict', 'pro', 'expert'];
    return `${prefixes[index % 10]}${suffixes[Math.floor(index / 10)]}${Math.floor(Math.random() * 1000)}`;
};

// Helper function to generate review titles based on rating
const generateReviewTitle = (rating: number): string => {
    // Define the type for the titles object
    const titles: { [key: number]: string[] } = {
        1: [
            "Completely Disappointed",
            "Waste of Time",
            "Major Letdown",
            "Cannot Recommend",
            "Missing the Mark Entirely"
        ],
        2: [
            "Has Potential But Falls Short",
            "Somewhat Underwhelming",
            "Mixed Feelings",
            "Not What I Expected",
            "Room for Improvement"
        ],
        3: [
            "Decent but Not Outstanding",
            "Solid Middle Ground",
            "Has Its Moments",
            "Worth a Listen",
            "Growing on Me"
        ],
        4: [
            "Impressive Work",
            "Exceeded Expectations",
            "Nearly Perfect",
            "Standout Album",
            "Must-Listen Material"
        ],
        5: [
            "Absolute Masterpiece",
            "Genre-Defining",
            "Changed My Perspective",
            "Pure Excellence",
            "Instant Classic"
        ]
    };

    // Validate that the rating exists in titles
    if (!titles[rating]) {
        throw new Error(`Invalid rating: ${rating}`);
    }

    // Return a random title
    return titles[rating][Math.floor(Math.random() * titles[rating].length)];
};

// Helper function to generate review bodies based on rating
const generateReviewBody = (rating: number, albumName: string): string => {
    const [title, artist] = albumName.split('_');
    
    const positiveAspects = [
        "The production is immaculate",
        "The artistic vision is clear",
        "The lyrics are thought-provoking",
        "The sound design is innovative",
        "The musical progression is seamless"
    ];

    const negativeAspects = [
        "The mixing feels muddy",
        "The concept feels forced",
        "The lyrics lack depth",
        "The production is uninspired",
        "The pacing is inconsistent"
    ];

    let review = "";
    switch(rating) {
        case 1:
            review = `${negativeAspects[Math.floor(Math.random() * 5)]}. ${artist}'s work on "${title}" fails to deliver on multiple levels. ${negativeAspects[Math.floor(Math.random() * 5)]}. I had high hopes but was left thoroughly disappointed.`;
            break;
        case 2:
            review = `While ${positiveAspects[Math.floor(Math.random() * 5)].toLowerCase()}, "${title}" ultimately falls short. ${negativeAspects[Math.floor(Math.random() * 5)]}. ${artist} has done better work in the past.`;
            break;
        case 3:
            review = `"${title}" by ${artist} is a mixed bag. ${positiveAspects[Math.floor(Math.random() * 5)]}, but ${negativeAspects[Math.floor(Math.random() * 5)].toLowerCase()}. Still worth checking out for fans of the genre.`;
            break;
        case 4:
            review = `${artist} delivers another strong project with "${title}". ${positiveAspects[Math.floor(Math.random() * 5)]} and ${positiveAspects[Math.floor(Math.random() * 5)].toLowerCase()}. A few minor issues don't detract from the overall experience.`;
            break;
        case 5:
            review = `"${title}" is ${artist} at their absolute best. ${positiveAspects[Math.floor(Math.random() * 5)]} and ${positiveAspects[Math.floor(Math.random() * 5)].toLowerCase()}. This is what perfect execution sounds like.`;
            break;
    }
    return review;
};

// Helper function to generate comments based on the review rating
const generateComment = (reviewRating: number): string => {
    const agreementComments = [
        "Couldn't agree more with your assessment!",
        "You perfectly captured my thoughts on this",
        "This review is spot on",
        "Exactly what I've been trying to say",
        "Really well-articulated review"
    ];

    const disagreementComments = [
        "I see where you're coming from, but I had a different experience",
        "Interesting perspective, though I found it differently",
        "I respectfully disagree with some points",
        "While I understand your view, I think there's more to consider",
        "Not sure I agree, but I appreciate your detailed review"
    ];

    // 70% chance to agree with positive reviews (4-5) or negative reviews (1-2)
    const shouldAgree = Math.random() < 0.7;
    if (reviewRating >= 4) {
        return shouldAgree ? agreementComments[Math.floor(Math.random() * 5)] : disagreementComments[Math.floor(Math.random() * 5)];
    } else if (reviewRating <= 2) {
        return shouldAgree ? agreementComments[Math.floor(Math.random() * 5)] : disagreementComments[Math.floor(Math.random() * 5)];
    } else {
        return Math.random() < 0.5 ? agreementComments[Math.floor(Math.random() * 5)] : disagreementComments[Math.floor(Math.random() * 5)];
    }
};

// Helper function to generate list titles and descriptions
const generateList = (): { title: string; desc: string } => {
    const listTypes = [
        { title: "Best of Hip-Hop", desc: "Essential hip-hop albums that defined the genre" },
        { title: "Electronic Essentials", desc: "Must-listen electronic music from various eras" },
        { title: "Pop Perfection", desc: "Pop albums that achieved both critical and commercial success" },
        { title: "Alternative Gems", desc: "Underrated alternative albums worth discovering" },
        { title: "Modern Classics", desc: "Contemporary albums that will stand the test of time" },
        { title: "Personal Favorites", desc: "A curated selection of albums that mean the most to me" },
        { title: "Genre-Bending Masterpieces", desc: "Albums that successfully crossed genre boundaries" },
        { title: "Mood Boosters", desc: "Albums guaranteed to lift your spirits" },
        { title: "Late Night Listening", desc: "Perfect albums for those quiet night sessions" },
        { title: "Production Showcases", desc: "Albums with exceptional production value" }
    ];
    return listTypes[Math.floor(Math.random() * listTypes.length)];
};

const main = async () => {
    // Clear existing data
    await prisma.comment.deleteMany();
    await prisma.list.deleteMany();
    await prisma.review.deleteMany();
    await prisma.user.deleteMany();

    // Create admin and moderator users (as in original)
    const admin = await prisma.user.create({
        data: {
            username: "admin",
            email: "admin@yadig.com",
            password: await hash("verySecure", 12),
            role: "admin"
        }
    });

    const adam = await prisma.user.create({
        data: {
            username: "fr3udian",
            email: "adam@yadig.com",
            password: await hash("adamDaMadMod", 12),
            role: "moderator"
        }
    });

    const dezz = await prisma.user.create({
        data: {
            username: "dezz",
            email: "dezz@yadig.com",
            password: await hash("dezzDaLameUser", 12),
            role: "user"
        }
    });

    const albums = [
        "To Pimp a Butterfly_Kendrick Lamar",
        "The Allegory_Royce da 5'9",
        "DAMN._Kendrick Lamar",
        "Currents_Tame Impala",
        "Chromakopia_Tyler, the Creator",
        "Playboi Carti_Playboi Carti",
        "Yeezus_Kanye West",
        "DONDA_Kanye West",
        "FUTURE_Future",
        "After Hours_The Weeknd",
        "KOD_J.Cole",
        "Born Sinner_J.Cole",
        "DiCaprio 2_Jid",
        "AM_Arctic Monkeys",
        "Mr. Morale & the Big Steppers_Kendrick Lamar",
        "UN VERANO SIN TI_Bad Bunny",
        "Vultures 1_¥$",
        "A Great Chaos_Ken Carson",
        "GNX_Kendrick Lamar",
        "Happier Than Ever_Billie Eilish",
        "Planet Her_Doja Cat",
        "Anti (Deluxe)_Rihanna",
        "BRAT_Charli XCX",
        "ZUU_Denzel Curry",
        "Blonde_Frank Ocean",
        "My Beautiful Dark Twisted Fantasy_Kanye West",
        "Igor_Tyler, the Creator",
        "CALL ME IF YOU GET LOST_Tyler, the Creator",
        "Queendom - The 6th Mini Album_Red Velvet",
        "The Life Of Pablo_Kanye West",
        "Whole Lotta Red_Playboi Carti",
        "greedy_Tate McRae",
        "LEVELING_Adam.",
        "21_Adele",
        "dawn FM_The Weeknd",
        "QALF infinity_Damso",
        "Short n' Sweet_Sabrina Carpenter",
        "Caméléon_ElGrandeToto",
        "Quality Control: Control The Streets Volume 1_Quality Control",
        "her loss_Drake",
        "Quavo Huncho_Quavo",
        "The Dark Side Of The Moon_Pink Floyd",
        "Illmatic_Nas",
        "Nanobots_They Might Be Giants",
        "LP!_JPEGMAFIA",
        "VETERAN_JPEGMAFIA",
        "Lupe Fiasco's The Cool_Lupe Fiasco",
        "DROGAS Wave_Lupe Fiasco",
        "The Goat_Polo G",
    ]

    // Create 97 regular users (to total 100 with admin and mods)
    const users = [];
    for (let i = 0; i < 97; i++) {
        const user = await prisma.user.create({
            data: {
                username: generateUsername(i),
                email: `user${i}@yadig.com`,
                password: await hash(`password${i}`, 12),
                role: "user"
            }
        });
        users.push(user);
    }

    // Create reviews and comments
    for (const album of albums) {
        // Create 2-3 reviews per album
        const numReviews = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numReviews; i++) {
            const rating = 1 + Math.floor(Math.random() * 5);
            const reviewer = users[Math.floor(Math.random() * users.length)];
            
            const review = await prisma.review.create({
                data: {
                    title: generateReviewTitle(rating),
                    body: generateReviewBody(rating, album),
                    albumID: album,
                    starRating: rating,
                    author: {
                        connect: { id: reviewer.id }
                    }
                }
            });

            // Create 2-4 comments per review
            const numComments = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < numComments; j++) {
                const commenter = users[Math.floor(Math.random() * users.length)];
                await prisma.comment.create({
                    data: {
                        body: generateComment(rating),
                        author: {
                            connect: { id: commenter.id }
                        },
                        review: {
                            connect: { id: review.id }
                        }
                    }
                });
            }
        }
    }

    // Create lists (1-2 per user)
    for (const user of [...users, admin, adam, dezz]) {
        const numLists = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numLists; i++) {
            const { title, desc } = generateList();
            // Select 5-8 random albums
            const numAlbums = 5 + Math.floor(Math.random() * 4);
            const selectedAlbums = [...albums]
                .sort(() => Math.random() - 0.5)
                .slice(0, numAlbums);

            await prisma.list.create({
                data: {
                    title,
                    description: desc,
                    albumIds: selectedAlbums,
                    author: {
                        connect: { id: user.id }
                    }
                }
            });
        }
    }
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
