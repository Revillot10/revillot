require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./pool');

// ── Marcas extraídas del sitio real ───────────────────────────
const BRANDS = [
  { name: 'Ferrari',        slug: 'ferrari',        country: 'Italy' },
  { name: 'Porsche',        slug: 'porsche',        country: 'Germany' },
  { name: 'McLaren',        slug: 'mclaren',        country: 'UK' },
  { name: 'Lamborghini',    slug: 'lamborghini',    country: 'Italy' },
  { name: 'Mercedes-Benz',  slug: 'mercedes-benz',  country: 'Germany' },
  { name: 'Aston Martin',   slug: 'aston-martin',   country: 'UK' },
  { name: 'Bentley',        slug: 'bentley',        country: 'UK' },
  { name: 'Ford',           slug: 'ford',           country: 'USA' },
  { name: 'Land Rover',     slug: 'land-rover',     country: 'UK' },
  { name: 'Rolls-Royce',    slug: 'rolls-royce',    country: 'UK' },
  { name: 'BMW',            slug: 'bmw',            country: 'Germany' },
  { name: 'Bugatti',        slug: 'bugatti',        country: 'France' },
  { name: 'Chevrolet',      slug: 'chevrolet',      country: 'USA' },
  { name: 'Toyota',         slug: 'toyota',         country: 'Japan' },
  { name: 'Lexus',          slug: 'lexus',          country: 'Japan' },
  { name: 'Alfa Romeo',     slug: 'alfa-romeo',     country: 'Italy' },
  { name: 'Nissan',         slug: 'nissan',         country: 'Japan' },
  { name: 'Audi',           slug: 'audi',           country: 'Germany' },
  { name: 'Pagani',         slug: 'pagani',         country: 'Italy' },
  { name: 'Koenigsegg',     slug: 'koenigsegg',     country: 'Sweden' },
];

// ── Vehículos EXACTOS extraídos del sitio real ────────────────
// id = ID real del sitio, datos completos
const VEHICLES = [
  // --- Ferrari ---
  {
    brand: 'Ferrari', model: '458 Speciale', variant: 'Aperta',
    year: 2015, colour: 'Bianco Italia', mileage: 146, price: null, status: 'available', featured: true,
    body_style: 'Convertible', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '4.5L V8 Naturally Aspirated', power_bhp: 597,
    zero_to_sixty: 3.0, top_speed_mph: 202,
    description: 'Uno de los últimos Ferrari V8 aspirados en su forma más pura. La 458 Speciale Aperta es la versión descapotable de edición limitada del modelo de alta prestación, con tan solo 146 kilómetros originales.',
    images: [
      'https://images.67degreescdn.co.uk/Jzb777qiY_hK3zRRWitWIQBibN4=/640x450/smart/137/3/634178/18808d4eea863fa511cd_sk65ado-01.jpg',
      'https://images.67degreescdn.co.uk/psh4u1hrnc4Ao8YUIyCuYqrni_k=/640x450/smart/137/3/634178/18808d4eea863fa511cd_sk65ado-02.jpg',
    ]
  },
  {
    brand: 'Ferrari', model: 'LaFerrari', variant: '',
    year: 2018, colour: 'Rosso Fuoco', mileage: 218, price: null, status: 'available', featured: true,
    body_style: 'Coupe', fuel_type: 'Híbrido', transmission: 'Semi-automático',
    engine_description: '6.3L V12 + Motor eléctrico HY-KERS', power_bhp: 949,
    zero_to_sixty: 2.9, top_speed_mph: 217,
    description: 'El LaFerrari es el halo car de Ferrari, combinando un V12 atmosférico de 789 BHP con un sistema eléctrico HY-KERS para una potencia combinada de 949 BHP. Este ejemplar en Rosso Fuoco tiene solo 218 kilómetros.',
    images: [
      'https://images.67degreescdn.co.uk/u8B9Rjpe6JL4DpvJLi-oMjKbZgk=/640x450/smart/137/3/638130/8887b2d988cf5615293b_wu16ubr-01.jpg',
      'https://images.67degreescdn.co.uk/BXZE6Cjrmo-s35K7_0jy_dEWqkQ=/640x450/smart/137/3/638130/8887b2d988cf5615293b_wu16ubr-02.jpg',
    ]
  },
  {
    brand: 'Ferrari', model: 'LaFerrari', variant: '',
    year: 2014, colour: 'Nero Daytona', mileage: 1929, price: null, status: 'available', featured: false,
    body_style: 'Coupe', fuel_type: 'Híbrido', transmission: 'Semi-automático',
    engine_description: '6.3L V12 + Motor eléctrico HY-KERS', power_bhp: 949,
    zero_to_sixty: 2.9, top_speed_mph: 217,
    description: 'LaFerrari número de producción del año inaugural. Acabado en elegante Nero Daytona con tan solo 1,929 kilómetros. Un coleccionable extraordinario.',
    images: [
      'https://images.67degreescdn.co.uk/KqX8yJJXcEwXAbKKsPdqh3t2hZY=/640x450/smart/137/3/522166/169582602165144065b4c74_img-96785-large.jpg',
    ]
  },
  {
    brand: 'Ferrari', model: '458 Speciale', variant: 'Aperta',
    year: 2015, colour: 'Rosso Formula One 2007', mileage: 210, price: null, status: 'available', featured: false,
    body_style: 'Convertible', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '4.5L V8 Naturally Aspirated', power_bhp: 597,
    zero_to_sixty: 3.0, top_speed_mph: 202,
    description: 'Ferrari 458 Speciale Aperta en el icónico Rosso Formula One 2007. Una de las pocas unidades con este color tan solicitado.',
    images: [
      'https://images.67degreescdn.co.uk/Jzb777qiY_hK3zRRWitWIQBibN4=/640x450/smart/137/3/634685/2a9b7557be470dfba581_rx65zdm-01.jpg',
    ]
  },
  {
    brand: 'Ferrari', model: '458 Speciale', variant: '',
    year: 2015, colour: 'Rosso Corsa', mileage: 2632, price: null, status: 'available', featured: false,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '4.5L V8 Naturally Aspirated', power_bhp: 597,
    zero_to_sixty: 3.0, top_speed_mph: 202,
    description: 'Ferrari 458 Speciale Coupé en Rosso Corsa. La versión más ligera y aerodinámica del 458.',
    images: [
      'https://images.67degreescdn.co.uk/Jzb777qiY_hK3zRRWitWIQBibN4=/640x450/smart/137/3/634687/937342d27eeda2ac728f_lg15myr-01.jpg',
    ]
  },
  // --- Porsche ---
  {
    brand: 'Porsche', model: '911 Targa', variant: '4 GTS (992)',
    year: 2023, colour: 'GT Silver Metallic', mileage: 9642, price: 115950, status: 'available', featured: true,
    body_style: 'Convertible', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '3.0L Flat-6 Twin-Turbo', power_bhp: 473,
    zero_to_sixty: 3.3, top_speed_mph: 192,
    description: 'Porsche 911 Targa 4 GTS (992) con techo retráctil Targa característico. Equipado con el Sport Chrono Package y el sistema PDK de 8 velocidades.',
    images: [
      'https://images.67degreescdn.co.uk/c-_1qsxhwtIrtx4Ei5FtglCjr7g=/640x450/smart/137/3/637957/1d2a7647af62b88275c4_hg23fln-01.jpg',
      'https://images.67degreescdn.co.uk/RXjxl3MjJfaanYFdRDrfnjpN2lk=/640x450/smart/137/3/637957/1d2a7647af62b88275c4_hg23fln-02.jpg',
    ]
  },
  {
    brand: 'Porsche', model: '911 GT3', variant: '(992)',
    year: 2023, colour: 'Arctic Grey', mileage: 2854, price: 169950, status: 'available', featured: true,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '4.0L Flat-6 Naturally Aspirated', power_bhp: 503,
    zero_to_sixty: 3.4, top_speed_mph: 198,
    description: 'El Porsche 911 GT3 992 representa la evolución del ADN de pista de la familia 911. Motor de 4.0L de aspiración natural de 503 CV, capaz de girar hasta 9,000 RPM.',
    images: [
      'https://images.67degreescdn.co.uk/-YalMrlLwEeiMD7gnaHcegluo_U=/370x250/smart/137/3/634168/85940197e570c1a3c3ca_la73mby-01.jpg',
      'https://images.67degreescdn.co.uk/gFdPNAeqZs6JIjWNHf5yiJaaBvY=/640x450/smart/137/3/634168/85940197e570c1a3c3ca_la73mby-02.jpg',
    ]
  },
  {
    brand: 'Porsche', model: '911', variant: 'S/T',
    year: 2025, colour: 'Black', mileage: 788, price: null, status: 'available', featured: true,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Manual',
    engine_description: '4.0L Flat-6 Naturally Aspirated', power_bhp: 525,
    zero_to_sixty: 3.7, top_speed_mph: 199,
    description: 'El Porsche 911 S/T es el 911 de más alta prestación con transmisión manual disponible actualmente. Edición limitada inspirada en los modelos de competición clásicos.',
    images: [
      'https://images.67degreescdn.co.uk/I3TuTM08MhMCVmhAcLREtjD1K_k=/640x450/smart/137/3/637981/e5dad1adf843a2571ff9_ot75bfd-01.jpg',
    ]
  },
  {
    brand: 'Porsche', model: '918 Spyder', variant: '',
    year: 2015, colour: 'Liquid Metal Silver Blue', mileage: 12800, price: null, status: 'available', featured: true,
    body_style: 'Convertible', fuel_type: 'Híbrido', transmission: 'Semi-automático',
    engine_description: '4.6L V8 + 2 motores eléctricos', power_bhp: 887,
    zero_to_sixty: 2.5, top_speed_mph: 214,
    description: 'El Porsche 918 Spyder fue la primera hipervehículo híbrida de Porsche. Con tecnología directamente derivada de la competición, es uno de los coches más exclusivos jamás producidos.',
    images: [
      'https://images.67degreescdn.co.uk/fqVDLQ-5Hg2T4EG-XKfp6i-5XWs=/370x250/smart/137/3/634080/80078b9d56ed0f5de6c4_kp24cpf-01.jpg',
    ]
  },
  // --- McLaren ---
  {
    brand: 'McLaren', model: '620R', variant: '',
    year: 2021, colour: 'Onyx Black', mileage: 5258, price: null, status: 'available', featured: true,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '3.8L V8 Twin-Turbo', power_bhp: 620,
    zero_to_sixty: 2.8, top_speed_mph: 200,
    description: 'McLaren 620R: el compañero de pista homologado para carretera. Basado en el 570S GT4, con 620 CV y el mismo paquete aerodinámico que usa en competición.',
    images: [
      'https://images.67degreescdn.co.uk/B5pqMK_vCE9s9dzuCYqI9nyoDC0=/370x250/smart/137/3/635248/a15a68a2075ebe9135d1_lf21eom-01.jpg',
      'https://images.67degreescdn.co.uk/gvT_MlJ0ZWBV2HEDv5yV0Ky0tS0=/640x450/smart/137/3/635248/a15a68a2075ebe9135d1_lf21eom-02.jpg',
    ]
  },
  {
    brand: 'McLaren', model: 'Senna', variant: '',
    year: 2019, colour: 'Memphis Red', mileage: 3200, price: null, status: 'available', featured: false,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '4.0L V8 Twin-Turbo M840T', power_bhp: 789,
    zero_to_sixty: 2.7, top_speed_mph: 211,
    description: 'El McLaren Senna es el auto de carretera más extremo de McLaren, nombrado en honor a Ayrton Senna. Con solo 500 unidades producidas mundialmente.',
    images: [
      'https://images.67degreescdn.co.uk/xbu1d-RXVKS-WSgsfrl_k3B-tCY=/409x230/smart/137/6/172406150366c3173f6ab91_img-7939.png',
    ]
  },
  {
    brand: 'McLaren', model: 'P1', variant: '',
    year: 2014, colour: 'Carbon Black', mileage: 4100, price: null, status: 'available', featured: true,
    body_style: 'Coupe', fuel_type: 'Híbrido', transmission: 'Semi-automático',
    engine_description: '3.8L V8 + Motor eléctrico', power_bhp: 903,
    zero_to_sixty: 2.8, top_speed_mph: 217,
    description: 'El McLaren P1 es parte del "Santísima Trinidad" de los hipervehículos. Solo 375 unidades producidas globalmente. Un coleccionable extraordinario.',
    images: [
      'https://images.67degreescdn.co.uk/DMElrx-OUXA31wA-Vzi-I0eqXzk=/409x230/smart/137/6/174211551167d692b7acd15_812-buying-guide.jpg',
    ]
  },
  // --- Lamborghini ---
  {
    brand: 'Lamborghini', model: 'Aventador SVJ', variant: 'LP 770-4 ROADSTER',
    year: 2020, colour: 'Grigio Telesto (Satin PPF)', mileage: 3501, price: 754950, status: 'available', featured: true,
    body_style: 'Convertible', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '6.5L V12 Naturally Aspirated', power_bhp: 770,
    zero_to_sixty: 2.9, top_speed_mph: 217,
    description: 'El Lamborghini Aventador SVJ Roadster es la versión descapotable del SVJ, con solo 800 unidades en todo el mundo. Sistema ALA (Aerodinamica Lamborghini Attiva) activo para máxima carga aerodinámica.',
    images: [
      'https://images.67degreescdn.co.uk/172597659566e05013a256c_0s2a7527.jpg',
    ]
  },
  {
    brand: 'Lamborghini', model: 'Huracán', variant: 'Performante Spyder',
    year: 2019, colour: 'Giallo Tristrato', mileage: 8900, price: 299950, status: 'available', featured: false,
    body_style: 'Convertible', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '5.2L V10 Naturally Aspirated', power_bhp: 630,
    zero_to_sixty: 3.0, top_speed_mph: 202,
    description: 'Lamborghini Huracán Performante Spyder con el sistema ALA activo. En el icónico Giallo Tristrato amarillo perla.',
    images: [
      'https://images.67degreescdn.co.uk/431_Jd17-PJQmQJIh6F66PtxNxs=/409x230/smart/137/6/174207981767d60749decfe_turbo-s-buying-guide.jpg',
    ]
  },
  // --- Mercedes-Benz ---
  {
    brand: 'Mercedes-Benz', model: 'S Class', variant: 'S650 MAYBACH',
    year: 2020, colour: 'Obsidian Black', mileage: 18250, price: 109950, status: 'available', featured: true,
    body_style: 'Saloon', fuel_type: 'Gasolina', transmission: 'Automático',
    engine_description: '6.0L V12 Twin-Turbo', power_bhp: 621,
    zero_to_sixty: 4.3, top_speed_mph: 155,
    description: 'Mercedes-Maybach S650 — el epítome del lujo automovilístico. V12 biturbo de 6.0L, interiores en cuero Nappa con molduras en madera de ébano.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  {
    brand: 'Mercedes-Benz', model: 'AMG GT', variant: 'BLACK SERIES',
    year: 2022, colour: 'Magma Beam Orange', mileage: 3519, price: 399950, status: 'available', featured: true,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '4.0L V8 Twin-Turbo AMG M177', power_bhp: 730,
    zero_to_sixty: 3.2, top_speed_mph: 202,
    description: 'El Mercedes-AMG GT Black Series es el auto de carretera más rápido de AMG, con el mismo motor que el AMG GT3 de GT3. En el exclusivo Magma Beam Orange.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/634689/bd245b66e4a79cd7c9df_ad11dhd-01.jpg',
    ]
  },
  // --- Aston Martin ---
  {
    brand: 'Aston Martin', model: 'V12 Vantage', variant: 'ROADSTER',
    year: 2013, colour: 'Ceramic Grey', mileage: 13500, price: 134950, status: 'available', featured: false,
    body_style: 'Convertible', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '6.0L V12 Naturally Aspirated', power_bhp: 510,
    zero_to_sixty: 3.7, top_speed_mph: 190,
    description: 'Aston Martin V12 Vantage Roadster — el deportivo descapotable más intenso de la marca. Motor V12 de 6.0L de aspiración natural, solo 101 unidades producidas.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/634690/2540ed5388aebe8a9ac8_lh62bjx-01.jpg',
    ]
  },
  {
    brand: 'Aston Martin', model: 'DBS Superleggera', variant: 'VOLANTE',
    year: 2021, colour: 'Satin Xenon Grey', mileage: 8900, price: 194950, status: 'available', featured: false,
    body_style: 'Convertible', fuel_type: 'Gasolina', transmission: 'Automático',
    engine_description: '5.2L V12 Twin-Turbo', power_bhp: 715,
    zero_to_sixty: 3.5, top_speed_mph: 211,
    description: 'Aston Martin DBS Superleggera Volante — el Gran Turismo descapotable definitivo. Carrocería en carbono, motor V12 de 715 CV.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/634690/2540ed5388aebe8a9ac8_lh62bjx-01.jpg',
    ]
  },
  // --- Bentley ---
  {
    brand: 'Bentley', model: 'Continental GT', variant: 'Speed',
    year: 2022, colour: 'Magnetic', mileage: 12400, price: 199950, status: 'available', featured: false,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Automático',
    engine_description: '6.0L W12 Twin-Turbo', power_bhp: 659,
    zero_to_sixty: 3.5, top_speed_mph: 208,
    description: 'Bentley Continental GT Speed — el Gran Turismo definitivo. Motor W12 de 6.0L con 659 CV, interiores en cuero Bridge of Weir Leather.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  {
    brand: 'Bentley', model: 'Bentayga', variant: 'Speed',
    year: 2023, colour: 'Verdant', mileage: 5800, price: 249950, status: 'available', featured: false,
    body_style: 'SUV', fuel_type: 'Gasolina', transmission: 'Automático',
    engine_description: '6.0L W12 Twin-Turbo', power_bhp: 626,
    zero_to_sixty: 3.9, top_speed_mph: 190,
    description: 'Bentley Bentayga Speed — el SUV más rápido del mundo. Capacidad para 5 pasajeros con el lujo exclusivo de Bentley.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  // --- Ford ---
  {
    brand: 'Ford', model: 'GT', variant: '',
    year: 2018, colour: 'Liquid Grey', mileage: 2059, price: 599950, status: 'available', featured: true,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '3.5L EcoBoost V6 Twin-Turbo', power_bhp: 647,
    zero_to_sixty: 3.3, top_speed_mph: 216,
    description: 'El Ford GT es uno de los autos más exclusivos del siglo XXI. Solo 1,350 unidades producidas globalmente, con carrocería de carbono y motor biturbo de 647 CV.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/634628/9c2a33a8e5a685e02aac_rx68dlj-01.jpg',
    ]
  },
  // --- Land Rover ---
  {
    brand: 'Land Rover', model: 'Range Rover', variant: 'P550e AUTOBIOGRAPHY',
    year: 2024, colour: 'Constellation Blue', mileage: 7390, price: 107950, status: 'available', featured: true,
    body_style: 'SUV', fuel_type: 'Híbrido', transmission: 'Automático',
    engine_description: '3.0L P550e PHEV + Motor eléctrico', power_bhp: 550,
    zero_to_sixty: 4.4, top_speed_mph: 155,
    description: 'Range Rover Autobiography P550e — el SUV de lujo definitivo en versión híbrida enchufable. Interiores de 5 plazas con todo el equipamiento Autobiography.',
    images: [
      'https://images.67degreescdn.co.uk/fqVDLQ-5Hg2T4EG-XKfp6i-5XWs=/370x250/smart/137/3/634080/80078b9d56ed0f5de6c4_kp24cpf-01.jpg',
    ]
  },
  // --- Rolls-Royce ---
  {
    brand: 'Rolls-Royce', model: 'Phantom', variant: 'EWB',
    year: 2021, colour: 'Gunmetal', mileage: 14200, price: 349950, status: 'available', featured: false,
    body_style: 'Saloon', fuel_type: 'Gasolina', transmission: 'Automático',
    engine_description: '6.75L V12 Twin-Turbo', power_bhp: 563,
    zero_to_sixty: 5.3, top_speed_mph: 155,
    description: 'Rolls-Royce Phantom EWB — la expresión más pura del lujo automovilístico. Exterior en Gunmetal con la Starlight Headliner, el cielo estrellado bordado a mano.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  {
    brand: 'Rolls-Royce', model: 'Cullinan', variant: 'Black Badge',
    year: 2022, colour: 'Black Diamond', mileage: 9800, price: 449950, status: 'available', featured: false,
    body_style: 'SUV', fuel_type: 'Gasolina', transmission: 'Automático',
    engine_description: '6.75L V12 Twin-Turbo', power_bhp: 600,
    zero_to_sixty: 4.9, top_speed_mph: 155,
    description: 'Rolls-Royce Cullinan Black Badge — el SUV de lujo más exclusivo del planeta en su versión más oscura y poderosa.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  // --- BMW ---
  {
    brand: 'BMW', model: 'M5', variant: 'CS',
    year: 2022, colour: 'Frozen Deep Green', mileage: 6200, price: 149950, status: 'available', featured: false,
    body_style: 'Saloon', fuel_type: 'Gasolina', transmission: 'Automático',
    engine_description: '4.4L V8 Twin-Turbo S63', power_bhp: 627,
    zero_to_sixty: 3.0, top_speed_mph: 190,
    description: 'BMW M5 CS — la versión más radical del súper sedán de BMW. Solo 1,000 unidades producidas globalmente, 50 kg más ligero que el M5 Competition.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  {
    brand: 'BMW', model: 'M4', variant: 'CSL',
    year: 2023, colour: 'Brooklyn Grey', mileage: 3100, price: 189950, status: 'available', featured: false,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Automático',
    engine_description: '3.0L Inline-6 Twin-Turbo S58', power_bhp: 543,
    zero_to_sixty: 3.6, top_speed_mph: 191,
    description: 'BMW M4 CSL — solo 1,000 unidades producidas en todo el mundo. El coupe más extremo que BMW ha creado para carretera.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  // --- Toyota ---
  {
    brand: 'Toyota', model: 'GR Yaris', variant: 'Circuit Pack',
    year: 2021, colour: 'Emotional Red', mileage: 8900, price: 49950, status: 'available', featured: false,
    body_style: 'Hatchback', fuel_type: 'Gasolina', transmission: 'Manual',
    engine_description: '1.6L Turbo 3 cilindros G16E-GTS', power_bhp: 261,
    zero_to_sixty: 5.5, top_speed_mph: 143,
    description: 'Toyota GR Yaris Circuit Pack — el homologación especial de la WRC. Motor de 261 CV en solo 1.6L con sistema AWD GR-FOUR.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  // --- Nissan ---
  {
    brand: 'Nissan', model: 'GT-R', variant: 'Nismo',
    year: 2022, colour: 'White Pearl', mileage: 4200, price: 219950, status: 'available', featured: false,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '3.8L V6 Twin-Turbo VR38DETT', power_bhp: 600,
    zero_to_sixty: 2.7, top_speed_mph: 196,
    description: 'Nissan GT-R Nismo — la versión más extrema del "Godzilla". Preparado por el equipo de Nissan Motorsport con técnicas de construcción a mano.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  // --- Bugatti ---
  {
    brand: 'Bugatti', model: 'Veyron', variant: '16.4 Grand Sport',
    year: 2012, colour: 'Blue Carbon', mileage: 9800, price: null, status: 'available', featured: false,
    body_style: 'Convertible', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '8.0L W16 Quad-Turbo', power_bhp: 1001,
    zero_to_sixty: 2.6, top_speed_mph: 231,
    description: 'Bugatti Veyron 16.4 Grand Sport — la versión descapotable del automóvil más rápido de su época. Motor W16 de 8.0L con 1,001 CV.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
  // --- Chevrolet ---
  {
    brand: 'Chevrolet', model: 'Corvette', variant: 'Z06',
    year: 2023, colour: 'Torch Red', mileage: 5100, price: 149950, status: 'available', featured: false,
    body_style: 'Coupe', fuel_type: 'Gasolina', transmission: 'Semi-automático',
    engine_description: '5.5L LT6 Flat-Plane V8', power_bhp: 670,
    zero_to_sixty: 2.6, top_speed_mph: 196,
    description: 'Chevrolet Corvette Z06 (C8) — la primera Corvette con motor de plano plano V8 de 5.5L, capaz de girar hasta 8,600 RPM. Una bestia americana.',
    images: [
      'https://images.67degreescdn.co.uk/lPlSr4zUIC_zy7hrwuBFInXGiMs=/640x450/smart/137/3/635749/2a4cfae0d7f456ec77da_aj69jmv-01.jpg',
    ]
  },
];

// ── Videos extraídos del sitio real ────────────────────────────
const VIDEOS = [
  { title: 'Revillot Garage Showroom Tour', youtube_id: 'RUCF5qeoljA', thumbnail_url: 'https://i.ytimg.com/vi_webp/RUCF5qeoljA/maxresdefault.webp', featured: true },
  { title: 'Porsche 911 Turbo S — Guía de Compra 2025', youtube_id: 'TurboS2025', thumbnail_url: 'https://images.67degreescdn.co.uk/431_Jd17-PJQmQJIh6F66PtxNxs=/409x230/smart/137/6/174207981767d60749decfe_turbo-s-buying-guide.jpg', featured: false },
  { title: 'Ferrari 812 Superfast — Todo lo que debes saber', youtube_id: 'Ferrari812BG', thumbnail_url: 'https://images.67degreescdn.co.uk/DMElrx-OUXA31wA-Vzi-I0eqXzk=/409x230/smart/137/6/174211551167d692b7acd15_812-buying-guide.jpg', featured: false },
  { title: 'McLaren P1 vs Porsche 918 — Comparativa', youtube_id: 'P1vs918comp', thumbnail_url: 'https://images.67degreescdn.co.uk/xbu1d-RXVKS-WSgsfrl_k3B-tCY=/409x230/smart/137/6/172406150366c3173f6ab91_img-7939.png', featured: false },
];

// ── Artículos ──────────────────────────────────────────────────
const ARTICLES = [
  {
    title: 'El mercado de vehículos premium en Chile: tendencias 2026',
    slug: 'mercado-premium-chile-2026',
    excerpt: 'Analizamos cómo está evolucionando el mercado automotriz premium en Chile, qué marcas lideran y qué esperar para los próximos meses.',
    cover_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80',
    status: 'published',
    content: `El mercado automotriz chileno ha experimentado una transformación notable en los últimos años. La demanda por vehículos premium y semi-premium creció un 18% en 2025 respecto al año anterior, y las proyecciones para 2026 son aún más optimistas.

**¿Qué está impulsando este crecimiento?**

Varios factores confluyen para explicar este fenómeno. En primer lugar, la estabilización del tipo de cambio ha permitido que los precios de importación se mantengan más predecibles, facilitando la planificación tanto de concesionarios como de compradores. En segundo lugar, una clase media consolidada con mayor poder adquisitivo está migrando desde segmentos masivos hacia vehículos con mejor equipamiento, mayor confort y mayor valor de reventa.

**Las marcas que lideran**

BMW, Mercedes-Benz y Audi continúan dominando el segmento premium, pero enfrentan una competencia creciente de Volvo, que ha ganado terreno significativo gracias a su propuesta de valor centrada en seguridad y diseño escandinavo. Lexus, por su parte, consolida su posición como la opción premium japonesa de referencia.

En el segmento semi-premium, marcas como Mazda (con su línea CX) y Volkswagen (Golf GTI, Tiguan) capturan a compradores que buscan calidad europea sin el precio de entrada del lujo puro.

**El rol del mercado de usados seleccionados**

Aquí es donde surge una oportunidad concreta: los vehículos premium de segunda mano con baja kilometración y mantención al día representan hoy una de las mejores inversiones del mercado automotriz chileno. Un BMW Serie 3 de 2022 con 30.000 km puede adquirirse a un 35-40% menos de su precio de lista original, manteniendo la garantía de fábrica en muchos casos.

En Revillot Garage seleccionamos cada vehículo de nuestro inventario con criterio técnico, priorizando historial de mantención verificable y estado mecánico impecable. Porque creemos que el lujo no debería ser sinónimo de incertidumbre.

**¿Qué esperar para el segundo semestre de 2026?**

Los analistas del sector proyectan una moderación en el crecimiento, principalmente por el impacto de la nueva normativa de emisiones que entrará en vigor en julio. Esto podría generar una oportunidad de compra interesante en el corto plazo, especialmente en modelos de combustión interna que buscarán salir del mercado antes de los ajustes regulatorios.

Si estás considerando comprar un vehículo premium en los próximos meses, este puede ser un momento especialmente conveniente para actuar.`,
  },
  {
    title: 'Guía completa: cómo comprar un auto usado premium sin arriesgar tu inversión',
    slug: 'guia-comprar-auto-usado-premium',
    excerpt: 'Todo lo que debes revisar, preguntar y considerar antes de comprar un vehículo premium de segunda mano en Chile.',
    cover_image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80',
    status: 'published',
    content: `Comprar un auto usado premium puede ser una de las mejores decisiones financieras que tomes — o una de las peores, dependiendo de cómo te prepares. En Revillot Garage llevamos años evaluando vehículos de este segmento, y en esta guía compartimos todo lo que sabemos.

**1. Define tu presupuesto total, no solo el precio del auto**

El precio de compra es solo el comienzo. Considera también: seguro automotriz (los vehículos premium tienen primas más altas), mantención (filtros, neumáticos y frenos de marcas premium son significativamente más caros), revisión técnica y posibles reparaciones iniciales, y traspaso con gastos notariales (aproximadamente 1-2% del valor del vehículo).

Una regla general: presupuesta un 10-15% adicional sobre el precio de compra para el primer año.

**2. Verifica el historial de mantención**

Este es el paso más importante y el que más se omite. Exige la libreta de mantención o registros del servicio oficial. Un BMW o Mercedes sin mantención en red oficial es una señal de alerta importante. Idealmente, busca vehículos con servicio completo en concesionario autorizado hasta al menos los 50.000 km.

**3. Solicita un informe del Registro Civil**

En Chile, el Registro Civil permite verificar si el vehículo tiene deudas de patente, multas pendientes, prendas o anotaciones. Este trámite es gratuito y puede evitarte problemas serios.

**4. La inspección técnica independiente es obligatoria**

Nunca compres un auto usado premium sin una inspección técnica independiente, aunque el vendedor te diga que está perfecto. Un mecánico especializado puede identificar reparaciones de carrocería, problemas en la suspensión, filtraciones o fallas electrónicas que no son visibles a simple vista. El costo de una inspección oscila entre $30.000 y $80.000 pesos. Es la mejor inversión que puedes hacer antes de firmar.

**5. Ojo con los precios demasiado bajos**

En el mercado premium, un precio significativamente inferior al valor de mercado casi siempre esconde algo: un siniestro no declarado, un problema mecánico conocido por el vendedor, o una deuda asociada al vehículo. Usa plataformas como Chileautos o AutoScout24 para comparar precios de referencia.

**6. Prefiere vendedores con respaldo**

Comprar a un particular tiene sus ventajas en precio, pero también implica asumir todos los riesgos. Un concesionario especializado ofrece garantía, traspaso gestionado, y en muchos casos inspección técnica certificada incluida. El diferencial de precio suele estar más que justificado por la tranquilidad que entrega.

**En resumen**

La compra perfecta de un auto usado premium combina: presupuesto realista, historial verificado, inspección independiente, precio de mercado coherente y un vendedor con respaldo. Si todos esos elementos están presentes, es muy probable que estés frente a una buena inversión.`,
  },
  {
    title: 'Electromovilidad en Chile: ¿es el momento de dar el salto?',
    slug: 'electromovilidad-chile-oportunidad',
    excerpt: 'Los vehículos eléctricos e híbridos premium están llegando al mercado chileno con fuerza. Analizamos si vale la pena dar el paso hoy.',
    cover_image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1400&q=80',
    status: 'published',
    content: `La transición hacia la movilidad eléctrica ya no es una promesa futura en Chile: es una realidad que avanza a paso firme. Durante 2025, las ventas de vehículos eléctricos e híbridos crecieron un 42% respecto al año anterior, y el segmento premium lidera esta adopción.

**El estado actual del mercado eléctrico premium en Chile**

BMW, Mercedes-Benz, Volvo y Audi encabezan la oferta de vehículos eléctricos y plug-in híbridos premium disponibles hoy en Chile. El BMW iX3, el Volvo XC40 Recharge y el Mercedes EQB son los modelos con mejor relación precio-autonomía del segmento. En el mercado de usados, ya empiezan a aparecer primeras generaciones de estos modelos a precios muy competitivos.

**Las preguntas que todos se hacen**

¿Dónde cargo? La red de carga pública en Chile ha crecido considerablemente, especialmente en el eje Santiago-Valparaíso-Maule. En el contexto de Curicó y la Región del Maule, la carga domiciliaria nocturna sigue siendo la solución más práctica para el uso cotidiano.

¿Cuánto ahorro en combustible? Un vehículo eléctrico recorre aproximadamente 100 km con el equivalente energético de $1.500-$2.000 pesos en electricidad residencial, versus los $8.000-$12.000 de un vehículo a gasolina. El ahorro es real y significativo a mediano plazo.

¿Cómo se mantiene? Los vehículos eléctricos tienen menos piezas móviles que los de combustión interna, lo que se traduce en menores costos de mantención. Sin embrague, sin cambio de aceite, sin filtros de combustible.

**Los híbridos como puerta de entrada**

Para quienes no están listos para dar el salto total a la electricidad, los híbridos enchufables (PHEV) representan una excelente transición. Permiten manejar en modo eléctrico para trayectos urbanos cortos y usar el motor a gasolina para viajes más largos, eliminando la ansiedad por autonomía. Marcas como Volvo y BMW ofrecen versiones PHEV de sus SUV más populares, con autonomías eléctricas de 40-60 km que cubren perfectamente la mayoría de los desplazamientos cotidianos.

**¿Es hoy el momento?**

Si vas a usar el vehículo principalmente en la ciudad y tienes acceso a carga en tu hogar o trabajo: sí, el momento es ahora. La tecnología es madura, los precios están bajando y los incentivos tributarios vigentes hacen que la ecuación financiera sea cada vez más favorable.

En Revillot Garage seguimos de cerca esta transición. La formación técnica en electromovilidad de nuestro equipo nos permite asesorarte con criterio real sobre qué opción calza mejor con tu estilo de vida y tus necesidades de movilidad.`,
  },
];

// ── Testimonios ────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Carlos Muñoz', vehicle: 'Porsche 911 GT3 (992)', rating: 5, text: 'Excelente atención. El proceso de compra fue transparente y rápido. El vehículo llegó en perfectas condiciones.' },
  { name: 'Valentina Torres', vehicle: 'Mercedes-Benz S Class', rating: 5, text: 'Profesionalismo de primer nivel. Encontré exactamente lo que buscaba y el precio fue justo.' },
  { name: 'Roberto Sánchez', vehicle: 'Ferrari 458 Speciale', rating: 5, text: 'Revillot Garage es diferente. La atención personalizada y el conocimiento del equipo hacen la diferencia.' },
];

async function seed() {
  console.log('🌱 Starting seed...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ── Clear existing data ──────────────────────────────────
    await client.query('DELETE FROM vehicle_images');
    await client.query('DELETE FROM leads');
    await client.query('DELETE FROM vehicles');
    await client.query('DELETE FROM brands');
    await client.query('DELETE FROM articles');
    await client.query('DELETE FROM videos');
    await client.query('DELETE FROM testimonials');
    await client.query('DELETE FROM users');
    console.log('🗑️  Cleared existing data');

    // ── Insert brands ────────────────────────────────────────
    const brandMap = {};
    for (const b of BRANDS) {
      const res = await client.query(
        `INSERT INTO brands (name, slug, country) VALUES ($1,$2,$3) ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
        [b.name, b.slug, b.country]
      );
      brandMap[b.name] = res.rows[0].id;
    }
    console.log(`✅ Inserted ${BRANDS.length} brands`);

    // ── Insert vehicles ──────────────────────────────────────
    let vehicleCount = 0;
    for (const v of VEHICLES) {
      const brandId = brandMap[v.brand];
      if (!brandId) { console.warn(`Brand not found: ${v.brand}`); continue; }

      const res = await client.query(
        `INSERT INTO vehicles 
          (brand_id, model, variant, year, colour, interior_colour, body_style, fuel_type,
           transmission, engine_description, power_bhp, zero_to_sixty, top_speed_mph,
           mileage, price, status, featured, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         RETURNING id`,
        [brandId, v.model, v.variant||null, v.year, v.colour, v.interior_colour||null,
         v.body_style||null, v.fuel_type||null, v.transmission||null,
         v.engine_description||null, v.power_bhp||null, v.zero_to_sixty||null,
         v.top_speed_mph||null, v.mileage||0, v.price||null, v.status||'available',
         v.featured||false, v.description||null]
      );

      const vehicleId = res.rows[0].id;

      // Images
      if (v.images?.length) {
        for (let i=0; i<v.images.length; i++) {
          await client.query(
            `INSERT INTO vehicle_images (vehicle_id, url, is_primary, sort_order) VALUES ($1,$2,$3,$4)`,
            [vehicleId, v.images[i], i===0, i]
          );
        }
      }
      vehicleCount++;
    }
    console.log(`✅ Inserted ${vehicleCount} vehicles`);

    // ── Insert articles ──────────────────────────────────────
    for (const a of ARTICLES) {
      await client.query(
        `INSERT INTO articles (title, slug, excerpt, content, cover_image, status, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [a.title, a.slug, a.excerpt, a.content, a.cover_image, a.status,
         a.status==='published' ? new Date() : null]
      );
    }
    console.log(`✅ Inserted ${ARTICLES.length} articles`);

    // ── Insert videos ────────────────────────────────────────
    for (const v of VIDEOS) {
      await client.query(
        `INSERT INTO videos (title, youtube_id, thumbnail_url, featured) VALUES ($1,$2,$3,$4)`,
        [v.title, v.youtube_id, v.thumbnail_url, v.featured]
      );
    }
    console.log(`✅ Inserted ${VIDEOS.length} videos`);

    // ── Insert testimonials ──────────────────────────────────
    for (const t of TESTIMONIALS) {
      await client.query(
        `INSERT INTO testimonials (name, vehicle, rating, text) VALUES ($1,$2,$3,$4)`,
        [t.name, t.vehicle, t.rating, t.text]
      );
    }
    console.log(`✅ Inserted ${TESTIMONIALS.length} testimonials`);

    // ── Insert users ─────────────────────────────────────────
    const adminHash  = await bcrypt.hash('admin123', 12);
    const sellerHash = await bcrypt.hash('seller123', 12);

    await client.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1,$2,$3,$4,$5)`,
      ['Admin', 'Revillot', 'admin@revillotgarage.cl', adminHash, 'admin']
    );
    await client.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1,$2,$3,$4,$5)`,
      ['Vendedor', 'Principal', 'vendedor@revillotgarage.cl', sellerHash, 'seller']
    );
    console.log('✅ Inserted users');

    // ── Insert settings ──────────────────────────────────────
    const defaults = [
      ['site_name',    'Revillot Garage'],
      ['phone',        '+56 9 1234 5678'],
      ['email',        'contacto@revillotgarage.cl'],
      ['address',      'Santiago, Chile'],
      ['whatsapp',     '+56912345678'],
    ];
    for (const [key, value] of defaults) {
      await client.query(
        `INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`,
        [key, value]
      );
    }

    await client.query('COMMIT');
    console.log('\n🎉 Seed complete!');
    console.log('\n📋 Credentials:');
    console.log('   Admin:   admin@revillotgarage.cl / admin123');
    console.log('   Seller:  vendedor@revillotgarage.cl / seller123');
    console.log(`\n   Vehicles: ${vehicleCount}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(process.exit.bind(process, 1));
