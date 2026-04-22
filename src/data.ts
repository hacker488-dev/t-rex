import type { CelestialBodyData, SpacecraftData } from './types';

export const solarSystemData: CelestialBodyData[] = [
  {
    name: 'Sun',
    description: 'The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
    funFacts: [
      'The Sun accounts for 99.86% of the mass in the Solar System.',
      'The temperature inside the Sun can reach 15 million degrees Celsius.',
      'It takes about 8 minutes and 20 seconds for light from the Sun to reach Earth.',
    ],
    size: 5, // A relative size for rendering
    diameterKm: 1391000,
    color: '#ffcc00',
    orbitalRadius: 0,
    orbitalSpeed: 0,
  },
  {
    name: 'Mercury',
    description: 'Mercury is the smallest planet in the Solar System and nearest to the Sun. Its orbit takes 87.97 Earth days, the shortest of all the Sun\'s planets.',
    funFacts: [
        'A year on Mercury is just 88 days long.',
        'Mercury is the second densest planet.',
        'Mercury has a molten core.',
    ],
    size: 0.5,
    diameterKm: 4879,
    color: '#E5E5E5',
    orbitalRadius: 10,
    orbitalSpeed: 0.02,
  },
  {
    name: 'Venus',
    description: 'Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the brightest planet in Earth\'s night sky and the second brightest natural object after the Moon, Venus can cast shadows and can be, on rare occasion, visible to the naked eye in broad daylight.',
    funFacts: [
        'Venus is the hottest planet in the solar system.',
        'A day on Venus is longer than a year.',
        'Venus is the second brightest object in the night sky.',
    ],
    size: 0.9,
    diameterKm: 12104,
    color: '#F0E68C',
    orbitalRadius: 15,
    orbitalSpeed: 0.015,
  },
  {
    name: 'Earth',
    description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29.2% of Earth\'s surface is land consisting of continents and islands.',
    funFacts: [
      'Earth\'s rotation is gradually slowing.',
      'A year on Earth isn\'t 365 days, it\'s 365.2564 days.',
      'Earth has a powerful magnetic field.',
    ],
    size: 1,
    diameterKm: 12742,
    color: '#0077be',
    orbitalRadius: 20,
    orbitalSpeed: 0.01,
  },
  {
    name: 'Mars',
    description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being only larger than Mercury. In English, Mars carries the name of the Roman god of war and is often referred to as the "Red Planet".',
    funFacts: [
        'Mars has the tallest volcano in the solar system.',
        'Mars has two moons, Phobos and Deimos.',
        'A year on Mars is 687 Earth days.',
    ],
    size: 0.7,
    diameterKm: 6779,
    color: '#ff4500',
    orbitalRadius: 25,
    orbitalSpeed: 0.008,
  },
  {
    name: 'Jupiter',
    description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined, but slightly less than one-thousandth the mass of the Sun.',
    funFacts: [
        'Jupiter has the shortest day of all the planets.',
        'The Great Red Spot is a huge storm on Jupiter that has been raging for centuries.',
        'Jupiter has a faint ring system.',
    ],
    size: 3.5,
    diameterKm: 139820,
    color: '#D2B48C',
    orbitalRadius: 35,
    orbitalSpeed: 0.005,
  },
    {
    name: 'Saturn',
    description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine times that of Earth.',
    funFacts: [
        'Saturn has the most extensive rings in the solar system.',
        'A day on Saturn is only 10.7 hours.',
        'Saturn is the least dense planet in the solar system.',
    ],
    size: 3,
    diameterKm: 116460,
    color: '#F5DEB3',
    orbitalRadius: 45,
    orbitalSpeed: 0.004,
  },
  {
    name: 'Uranus',
    description: 'Uranus is the seventh planet from the Sun. Its name is a reference to the Greek god of the sky, Uranus, who, according to Greek mythology, was the grandfather of Zeus (Jupiter) and father of Cronus (Saturn). It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.',
    funFacts: [
        'Uranus is the coldest planet in the solar system.',
        'Uranus rotates on its side.',
        'A season on Uranus lasts for 21 Earth years.',
    ],
    size: 2,
    diameterKm: 50724,
    color: '#ADD8E6',
    orbitalRadius: 55,
    orbitalSpeed: 0.003,
  },
  {
    name: 'Neptune',
    description: 'Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth, slightly more massive than its near-twin Uranus.',
    funFacts: [
        'Neptune is the windiest planet in the solar system.',
        'A year on Neptune lasts for 165 Earth years.',
        'Neptune is the smallest of the gas giants.',
    ],
    size: 3.8, // Adjusted to be more proportionally accurate to Earth's size
    diameterKm: 49244,
    color: '#4169E1',
    orbitalRadius: 65,
    orbitalSpeed: 0.002,
  },
        {
          name: 'Pluto',
          description: 'Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune. It was the first and the largest Kuiper belt object to be discovered. After Pluto was discovered in 1930, it was declared to be the ninth planet from the Sun.',
          funFacts: [
            'Pluto was reclassified from a planet to a dwarf planet in 2006.',
            'Pluto has a heart-shaped glacier that’s the size of Texas and Oklahoma combined.',
            'It takes sunlight 5.5 hours to reach Pluto.',
          ],
          size: 0.3,
          diameterKm: 2376,
          color: '#d2d2d2',
          orbitalRadius: 75,
          orbitalSpeed: 0.001,
        },];

export const spacecraftData: SpacecraftData[] = [
  {
    name: 'Voyager 1',
    description: 'Voyager 1 is a space probe launched by NASA on September 5, 1977, as part of the Voyager program to study the outer Solar System and interstellar space beyond the Sun\'s heliosphere.',
    funFacts: [
      'Voyager 1 is the most distant human-made object from Earth.',
      'It carries a Golden Record containing sounds and images selected to portray the diversity of life and culture on Earth.',
      'Voyager 1 is in interstellar space.',
    ],
    size: 0.2,
    diameterKm: 0.00000002, // Placeholder, actual size is very small
    color: 'gray',
    // Position can be updated to be far out
    position: [80, 5, 0],
  },
  {
    name: 'New Horizons',
    description: 'New Horizons is an interplanetary space probe that was launched as a part of NASA\'s New Frontiers program. Engineered by the Johns Hopkins University Applied Physics Laboratory (APL) and the Southwest Research Institute (SwRI), with a team led by S. Alan Stern, the spacecraft was launched in 2006 with the primary mission to perform a flyby study of the Pluto system in 2015.',
    funFacts: [
      'New Horizons was the first spacecraft to explore Pluto up close.',
      'It is about the size of a grand piano.',
      'After its Pluto flyby, New Horizons went on to explore a Kuiper Belt object named Arrokoth.',
    ],
    size: 0.2,
    diameterKm: 0.000000008, // Placeholder, actual size is very small
    color: 'gray',
    // Position can be updated to be near Pluto
    position: [75, 2, 0],
  }
];

export const asteroidBeltData = {
  name: 'Asteroid Belt',
  innerRadius: 28,
  outerRadius: 32,
  height: 1,
  numberOfAsteroids: 100,
  minSize: 0.01,
  maxSize: 0.1,
  color: '#8B4513', // SaddleBrown
};

export const kuiperBeltData = {
  name: 'Kuiper Belt',
  innerRadius: 80,
  outerRadius: 150,
  height: 5,
  numberOfObjects: 200,
  minSize: 0.05,
  maxSize: 0.5,
  color: '#A9A9A9', // DarkGray
};