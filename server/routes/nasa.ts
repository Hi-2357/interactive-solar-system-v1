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
    image:
      "https://images.nasa.gov/details-PIA00708.html",
    description: "The star at the center of our solar system",
  },
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    size: 0.38,
    distance: 3.8,
    speed: 0.04,
    color: "#8C7853",
    image:
      "https://images.nasa.gov/details-PIA16077.html",
    description: "The smallest planet in our solar system",
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    size: 0.95,
    distance: 7.2,
    speed: 0.015,
    color: "#FFC649",
    image:
      "https://images.nasa.gov/details-PIA00144.html",
    description: "The hottest planet in our solar system",
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    size: 1,
    distance: 10,
    speed: 0.01,
    color: "#4B9BFF",
    image:
      "https://images.nasa.gov/details-ISS000-039E-000001.html",
    description: "Our home planet",
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    size: 0.53,
    distance: 15.2,
    speed: 0.008,
    color: "#E27B58",
    image:
      "https://images.nasa.gov/details-PIA26085.html",
    description: "The red planet",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    size: 11.21,
    distance: 52,
    speed: 0.002,
    color: "#DAA520",
    image:
      "https://images.nasa.gov/details-PIA32408.html",
    description: "The largest planet in our solar system",
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    size: 9.45,
    distance: 95,
    speed: 0.0009,
    color: "#FAD5A5",
    image:
      "https://images.nasa.gov/details-PIA26249.html",
    description: "The ringed planet",
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    size: 4.01,
    distance: 192,
    speed: 0.0004,
    color: "#4FD0E7",
    image:
      "https://images.nasa.gov/details-PIA02231.html",
    description: "An ice giant tilted on its side",
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    size: 3.88,
    distance: 300,
    speed: 0.0001,
    color: "#4166F5",
    image:
      "https://images.nasa.gov/details-PIA02231.html",
    description: "The windiest planet in our solar system",
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
  },
];

export const handleNASACelestials: RequestHandler = async (_req, res) => {
  try {
    // Combine all celestial objects
    const allObjects = [...PLANET_DATA, ...ASTEROID_DATA];

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
