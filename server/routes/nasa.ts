import { RequestHandler } from "express";

interface NASACelestialObject {
  id: string;
  name: string;
  type: "planet" | "moon" | "asteroid" | "comet";
  size: number;
  distance: number;
  speed: number;
  color: string;
  image?: string;
  description?: string;
  diameter?: number;
  diameterKm?: number;
  dayLength?: number;
  yearLength?: number;
  surfaceTemp?: number;
  moonCount?: number;
  orbitalSpeed?: number;
  averageDistanceFromSun?: number;
}

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

// Hardcoded NASA data with real images from NASA's public domain
const PLANET_DATA: NASACelestialObject[] = [
  {
    id: "sun",
    name: "Sun",
    type: "planet",
    size: 1,
    distance: 0,
    speed: 0,
    color: "#FDB813",
    image: "https://images.nasa.gov/details-PIA00708.html",
    description: "The star at the center of our solar system",
    diameterKm: 1391000,
    surfaceTemp: 5778,
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    size: 0.38,
    distance: 3.8,
    speed: 0.04,
    color: "#8C7853",
    image: "https://images.nasa.gov/details-PIA16077.html",
    description: "The smallest planet in our solar system",
    diameterKm: 4879,
    dayLength: 58.65,
    yearLength: 87.97,
    surfaceTemp: 167,
    moonCount: 0,
    orbitalSpeed: 47.87,
    averageDistanceFromSun: 57.9,
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    size: 0.95,
    distance: 7.2,
    speed: 0.015,
    color: "#FFC649",
    image: "https://images.nasa.gov/details-PIA00144.html",
    description: "The hottest planet in our solar system",
    diameterKm: 12104,
    dayLength: 243.02,
    yearLength: 224.7,
    surfaceTemp: 464,
    moonCount: 0,
    orbitalSpeed: 35.02,
    averageDistanceFromSun: 108.2,
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    size: 1,
    distance: 10,
    speed: 0.01,
    color: "#4B9BFF",
    image: "https://images.nasa.gov/details-ISS000-039E-000001.html",
    description: "Our home planet",
    diameterKm: 12742,
    dayLength: 23.93,
    yearLength: 365.25,
    surfaceTemp: 15,
    moonCount: 1,
    orbitalSpeed: 29.78,
    averageDistanceFromSun: 149.6,
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    size: 0.53,
    distance: 15.2,
    speed: 0.008,
    color: "#E27B58",
    image: "https://images.nasa.gov/details-PIA26085.html",
    description: "The red planet",
    diameterKm: 6779,
    dayLength: 24.62,
    yearLength: 686.98,
    surfaceTemp: -65,
    moonCount: 2,
    orbitalSpeed: 24.07,
    averageDistanceFromSun: 227.9,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    size: 11.21,
    distance: 52,
    speed: 0.002,
    color: "#DAA520",
    image: "https://images.nasa.gov/details-PIA32408.html",
    description: "The largest planet in our solar system",
    diameterKm: 139820,
    dayLength: 9.93,
    yearLength: 4332.59,
    surfaceTemp: -108,
    moonCount: 95,
    orbitalSpeed: 13.07,
    averageDistanceFromSun: 778.5,
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    size: 9.45,
    distance: 95,
    speed: 0.0009,
    color: "#FAD5A5",
    image: "https://images.nasa.gov/details-PIA26249.html",
    description: "The ringed planet",
    diameterKm: 116460,
    dayLength: 10.66,
    yearLength: 10759.22,
    surfaceTemp: -140,
    moonCount: 146,
    orbitalSpeed: 9.68,
    averageDistanceFromSun: 1434,
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    size: 4.01,
    distance: 192,
    speed: 0.0004,
    color: "#4FD0E7",
    image: "https://images.nasa.gov/details-PIA02231.html",
    description: "An ice giant tilted on its side",
    diameterKm: 50724,
    dayLength: 17.24,
    yearLength: 30688.5,
    surfaceTemp: -195,
    moonCount: 28,
    orbitalSpeed: 6.81,
    averageDistanceFromSun: 2873,
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    size: 3.88,
    distance: 300,
    speed: 0.0001,
    color: "#4166F5",
    image: "https://images.nasa.gov/details-PIA02231.html",
    description: "The windiest planet in our solar system",
    diameterKm: 49244,
    dayLength: 16.11,
    yearLength: 60182,
    surfaceTemp: -200,
    moonCount: 16,
    orbitalSpeed: 5.43,
    averageDistanceFromSun: 4495,
  },
];

// Satellite/Moon data
const SATELLITE_DATA: NASACelestialObject[] = [
  // Earth
  {
    id: "moon",
    name: "Moon",
    type: "moon",
    size: 0.27,
    distance: 0.26,
    speed: 0.1,
    color: "#C0C0C0",
    image: "https://images.nasa.gov/details-PIA00405.html",
    description: "Earth's only natural satellite",
    diameterKm: 3474,
    dayLength: 29.53,
    orbitalSpeed: 1.022,
  },
  // Mars
  {
    id: "phobos",
    name: "Phobos",
    type: "moon",
    size: 0.13,
    distance: 0.9,
    speed: 0.3,
    color: "#A9A9A9",
    image: "https://images.nasa.gov/details-PIA10368.html",
    description: "Larger moon of Mars",
    diameterKm: 22,
    dayLength: 0.32,
    orbitalSpeed: 2.138,
  },
  {
    id: "deimos",
    name: "Deimos",
    type: "moon",
    size: 0.08,
    distance: 1.5,
    speed: 0.15,
    color: "#8B8B83",
    image: "https://images.nasa.gov/details-PIA07662.html",
    description: "Smaller moon of Mars",
    diameterKm: 12,
    dayLength: 1.26,
    orbitalSpeed: 1.351,
  },
  // Jupiter
  {
    id: "io",
    name: "Io",
    type: "moon",
    size: 0.45,
    distance: 6,
    speed: 0.18,
    color: "#FFD700",
    image: "https://images.nasa.gov/details-PIA02532.html",
    description: "Most volcanically active body in the solar system",
    diameterKm: 3643,
    dayLength: 1.77,
    orbitalSpeed: 17.33,
    surfaceTemp: -110,
  },
  {
    id: "europa",
    name: "Europa",
    type: "moon",
    size: 0.38,
    distance: 9.5,
    speed: 0.1,
    color: "#E8E8E8",
    image: "https://images.nasa.gov/details-PIA00502.html",
    description: "Icy moon with subsurface ocean",
    diameterKm: 3122,
    dayLength: 3.55,
    orbitalSpeed: 13.74,
    surfaceTemp: -110,
  },
  {
    id: "ganymede",
    name: "Ganymede",
    type: "moon",
    size: 0.5,
    distance: 15,
    speed: 0.08,
    color: "#D2B48C",
    image: "https://images.nasa.gov/details-PIA00383.html",
    description: "Largest moon in the solar system",
    diameterKm: 5268,
    dayLength: 7.15,
    orbitalSpeed: 10.88,
    surfaceTemp: -110,
  },
  {
    id: "callisto",
    name: "Callisto",
    type: "moon",
    size: 0.48,
    distance: 26,
    speed: 0.03,
    color: "#5F4F4F",
    image: "https://images.nasa.gov/details-PIA01637.html",
    description: "Heavily cratered moon of Jupiter",
    diameterKm: 4821,
    dayLength: 16.69,
    orbitalSpeed: 8.2,
    surfaceTemp: -110,
  },
  // Saturn
  {
    id: "titan",
    name: "Titan",
    type: "moon",
    size: 0.4,
    distance: 12,
    speed: 0.1,
    color: "#FFA500",
    image: "https://images.nasa.gov/details-PIA17471.html",
    description: "Only moon with substantial atmosphere",
    diameterKm: 5149,
    dayLength: 15.95,
    orbitalSpeed: 5.57,
    surfaceTemp: -179,
  },
  {
    id: "rhea",
    name: "Rhea",
    type: "moon",
    size: 0.2,
    distance: 20,
    speed: 0.05,
    color: "#D3D3D3",
    image: "https://images.nasa.gov/details-PIA07640.html",
    description: "Second-largest moon of Saturn",
    diameterKm: 1527,
    dayLength: 4.52,
    orbitalSpeed: 8.48,
    surfaceTemp: -174,
  },
  {
    id: "iapetus",
    name: "Iapetus",
    type: "moon",
    size: 0.18,
    distance: 32,
    speed: 0.02,
    color: "#696969",
    image: "https://images.nasa.gov/details-PIA07677.html",
    description: "Moon with distinctive two-tone coloration",
    diameterKm: 1469,
    dayLength: 79.33,
    orbitalSpeed: 3.28,
    surfaceTemp: -128,
  },
  // Uranus
  {
    id: "titania",
    name: "Titania",
    type: "moon",
    size: 0.2,
    distance: 8,
    speed: 0.1,
    color: "#B0C4DE",
    image: "https://images.nasa.gov/details-PIA02313.html",
    description: "Largest moon of Uranus",
    diameterKm: 1578,
    dayLength: 8.7,
    orbitalSpeed: 3.64,
    surfaceTemp: -213,
  },
  {
    id: "oberon",
    name: "Oberon",
    type: "moon",
    size: 0.19,
    distance: 12,
    speed: 0.08,
    color: "#778899",
    image: "https://images.nasa.gov/details-PIA02315.html",
    description: "Second-largest moon of Uranus",
    diameterKm: 1523,
    dayLength: 13.46,
    orbitalSpeed: 3.15,
    surfaceTemp: -213,
  },
  // Neptune
  {
    id: "triton",
    name: "Triton",
    type: "moon",
    size: 0.27,
    distance: 10,
    speed: 0.12,
    color: "#87CEEB",
    image: "https://images.nasa.gov/details-PIA02317.html",
    description: "Largest moon of Neptune with geysers",
    diameterKm: 2707,
    dayLength: 5.88,
    orbitalSpeed: 4.39,
    surfaceTemp: -235,
  },
];

const ASTEROID_DATA: NASACelestialObject[] = [
  {
    id: "ceres",
    name: "Ceres",
    type: "asteroid",
    size: 0.5,
    distance: 27.6,
    speed: 0.006,
    color: "#A9A9A9",
    image: "https://images.nasa.gov/details-PIA20347.html",
    description: "Largest object in the asteroid belt",
    diameterKm: 946,
    dayLength: 9.07,
    yearLength: 1680,
    orbitalSpeed: 17.88,
    averageDistanceFromSun: 413.9,
  },
  {
    id: "vesta",
    name: "Vesta",
    type: "asteroid",
    size: 0.35,
    distance: 26,
    speed: 0.007,
    color: "#8B8B83",
    image: "https://images.nasa.gov/details-PIA15826.html",
    description: "Second-largest asteroid",
    diameterKm: 525,
    dayLength: 5.34,
    yearLength: 1325,
    orbitalSpeed: 19.26,
    averageDistanceFromSun: 383.2,
  },
  {
    id: "pallas",
    name: "Pallas",
    type: "asteroid",
    size: 0.32,
    distance: 27.2,
    speed: 0.0055,
    color: "#808080",
    image: "https://images.nasa.gov/details-PIA13612.html",
    description: "Third-largest asteroid",
    diameterKm: 582,
    dayLength: 7.81,
    yearLength: 1684,
    orbitalSpeed: 17.65,
    averageDistanceFromSun: 414.5,
  },
];

export const handleNASACelestials: RequestHandler = async (_req, res) => {
  try {
    // Combine all celestial objects
    const allObjects = [...PLANET_DATA, ...ASTEROID_DATA, ...SATELLITE_DATA];

    res.json({
      success: true,
      data: allObjects,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch NASA data",
    });
  }
};

export const handleNASANearEarthObjects: RequestHandler = async (
  _req,
  res
) => {
  try {
    // This would be fetched from NASA's Near-Earth Object API
    // For now, returning example NEO data
    const neoData = [
      {
        id: "apophis",
        name: "Apophis",
        type: "asteroid" as const,
        size: 0.27,
        distance: 45,
        speed: 0.004,
        color: "#C0C0C0",
        description: "Near-Earth asteroid",
      },
    ];

    res.json({
      success: true,
      data: neoData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch NEO data",
    });
  }
};

export const handleNASAImageSearch: RequestHandler = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required",
      });
    }

    // This would call NASA Images API
    // https://api.nasa.gov/planetary/apod
    // For now, returning structured response
    res.json({
      success: true,
      query: q,
      images: [
        {
          title: `${q} from NASA`,
          url: "https://api.nasa.gov/planetary/apod",
          source: "NASA Image Library",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to search NASA images",
    });
  }
};
