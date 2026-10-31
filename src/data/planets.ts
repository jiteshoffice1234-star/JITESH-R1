export interface Planet {
  name: string;
  color: string;
  radius: number; // visual radius in px
  orbitRadius: number; // visual orbit radius in px
  realDiameter: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  orbitalSpeed: number; // relative speed (for animation)
  description: string;
  emoji: string;
}

export const planets: Planet[] = [
  {
    name: "Mercury",
    color: "#b5b5b5",
    radius: 4,
    orbitRadius: 60,
    realDiameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    orbitalSpeed: 4.15,
    description: "The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.",
    emoji: "☿",
  },
  {
    name: "Venus",
    color: "#e8cda0",
    radius: 7,
    orbitRadius: 95,
    realDiameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    orbitalSpeed: 1.62,
    description: "The hottest planet due to its thick atmosphere. It rotates in the opposite direction to most planets.",
    emoji: "♀",
  },
  {
    name: "Earth",
    color: "#4da6ff",
    radius: 8,
    orbitRadius: 130,
    realDiameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    orbitalSpeed: 1.0,
    description: "Our home planet. The only known planet to harbor life, with liquid water covering 71% of its surface.",
    emoji: "🌍",
  },
  {
    name: "Mars",
    color: "#e85d3a",
    radius: 5,
    orbitRadius: 170,
    realDiameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    orbitalSpeed: 0.53,
    description: "The Red Planet, named after the Roman god of war. It has the tallest volcano in the solar system.",
    emoji: "♂",
  },
  {
    name: "Jupiter",
    color: "#d4a574",
    radius: 18,
    orbitRadius: 230,
    realDiameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    orbitalSpeed: 0.084,
    description: "The largest planet, a gas giant with a Great Red Spot storm that has raged for hundreds of years.",
    emoji: "♃",
  },
  {
    name: "Saturn",
    color: "#f0d68a",
    radius: 15,
    orbitRadius: 300,
    realDiameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    orbitalSpeed: 0.034,
    description: "Famous for its spectacular ring system made of ice and rock. It's the least dense planet.",
    emoji: "♄",
  },
  {
    name: "Uranus",
    color: "#7de8e8",
    radius: 11,
    orbitRadius: 365,
    realDiameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    orbitalSpeed: 0.012,
    description: "An ice giant that rotates on its side. It has a blue-green color due to methane in its atmosphere.",
    emoji: "♅",
  },
  {
    name: "Neptune",
    color: "#4166f5",
    radius: 10,
    orbitRadius: 420,
    realDiameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    orbitalSpeed: 0.006,
    description: "The windiest planet with speeds up to 2,100 km/h. It's the farthest planet from the Sun.",
    emoji: "♆",
  },
];
