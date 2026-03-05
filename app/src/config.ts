// Žvaigždžių Namai - Configuration File
// Edit this file to update prices, activities, and settings

export const CONFIG = {
  // Business Info
  business: {
    name: 'Žvaigždžių Namai',
    nameEn: 'Star Houses',
    nameRu: 'Звездные Дома',
    address: 'Mikytų k., Šakių r., Lietuva',
    coordinates: {
      lat: 55.0212551,
      lng: 23.5737184
    },
    email: 'labas@zvaigzdziunamai.lt',
    phone: '+370 600 00000',
    phoneDisplay: '+370 600 00000'
  },

  // Accommodation - 4 Dome Tents
  accommodations: [
    {
      id: 'dome-1',
      name: 'Kupolas Nr. 1',
      nameEn: 'Dome No. 1',
      nameRu: 'Купол № 1',
      description: 'Stiklinis kupolas su vaizdu į dangų ir ežerą',
      descriptionEn: 'Glass dome with view of the sky and lake',
      descriptionRu: 'Стеклянный купол с видом на небо и озеро',
      capacity: 4,
      priceLowSeason: 100, // € per night
      priceHighSeason: 150, // € per night
      priceWeekend: 180, // € per night (Friday-Saturday)
      image: '/dome_river_sunset.jpg',
      features: ['karališka lova', 'dušas', 'virtuvėlė', 'Wi-Fi', 'židinys', 'kondicionierius'],
      featuresEn: ['king bed', 'shower', 'kitchenette', 'Wi-Fi', 'fireplace', 'AC'],
      featuresRu: ['кровать king-size', 'душ', 'кухонька', 'Wi-Fi', 'камин', 'кондиционер']
    },
    {
      id: 'dome-2',
      name: 'Kupolas Nr. 2',
      nameEn: 'Dome No. 2',
      nameRu: 'Купол № 2',
      description: 'Stiklinis kupolas miško apsuptyje',
      descriptionEn: 'Glass dome surrounded by forest',
      descriptionRu: 'Стеклянный купол в окружении леса',
      capacity: 4,
      priceLowSeason: 100,
      priceHighSeason: 150,
      priceWeekend: 180,
      image: '/dome_river_sunset.jpg',
      features: ['karališka lova', 'dušas', 'virtuvėlė', 'Wi-Fi', 'židinys', 'kondicionierius'],
      featuresEn: ['king bed', 'shower', 'kitchenette', 'Wi-Fi', 'fireplace', 'AC'],
      featuresRu: ['кровать king-size', 'душ', 'кухонька', 'Wi-Fi', 'камин', 'кондиционер']
    },
    {
      id: 'dome-3',
      name: 'Kupolas Nr. 3',
      nameEn: 'Dome No. 3',
      nameRu: 'Купол № 3',
      description: 'Romantiškas kupolas poroms',
      descriptionEn: 'Romantic dome for couples',
      descriptionRu: 'Романтический купол для пар',
      capacity: 4,
      priceLowSeason: 110,
      priceHighSeason: 160,
      priceWeekend: 190,
      image: '/dome_river_sunset.jpg',
      features: ['karališka lova', 'jacuzzi', 'dušas', 'virtuvėlė', 'Wi-Fi', 'židinys'],
      featuresEn: ['king bed', 'jacuzzi', 'shower', 'kitchenette', 'Wi-Fi', 'fireplace'],
      featuresRu: ['кровать king-size', 'джакузи', 'душ', 'кухонька', 'Wi-Fi', 'камин']
    },
    {
      id: 'dome-4',
      name: 'Kupolas Nr. 4',
      nameEn: 'Dome No. 4',
      nameRu: 'Купол № 4',
      description: 'Šeimyninis kupolas su vaizdu į ežerą',
      descriptionEn: 'Family dome with lake view',
      descriptionRu: 'Семейный купол с видом на озеро',
      capacity: 4,
      priceLowSeason: 120,
      priceHighSeason: 170,
      priceWeekend: 200,
      image: '/dome_river_sunset.jpg',
      features: ['2 miegamieji', 'dušas', 'virtuvė', 'Wi-Fi', 'terasa', 'židinys'],
      featuresEn: ['2 bedrooms', 'shower', 'kitchen', 'Wi-Fi', 'terrace', 'fireplace'],
      featuresRu: ['2 спальни', 'душ', 'кухня', 'Wi-Fi', 'терраса', 'камин']
    }
  ],

  // Activities with Pricing
  activities: [
    {
      id: 'planetarium',
      name: 'Planetariumo seansas',
      nameEn: 'Planetarium show',
      nameRu: 'Планетарий шоу',
      description: 'Žvaigždžių stebėjimas su profesionaliu gidu',
      descriptionEn: 'Stargazing with professional guide',
      descriptionRu: 'Наблюдение за звездами с профессиональным гидом',
      price: 30, // € per session
      duration: '1 val.',
      durationEn: '1 hour',
      durationRu: '1 час',
      included: false,
      icon: 'Star'
    },
    {
      id: 'sauna',
      name: 'Pirtis',
      nameEn: 'Sauna',
      nameRu: 'Баня',
      description: 'Tradicinė lietuviška pirtis ant ežero kranto',
      descriptionEn: 'Traditional Lithuanian sauna by the lake',
      descriptionRu: 'Традиционная литовская баня на берегу озера',
      price: 40, // € per session (2 hours)
      duration: '2 val.',
      durationEn: '2 hours',
      durationRu: '2 часа',
      included: false,
      icon: 'Flame'
    },
    {
      id: 'handball',
      name: 'Rankinio aikštelė',
      nameEn: 'Handball court',
      nameRu: 'Площадка для гандбола',
      description: 'Sporto aikštelė prie ežero',
      descriptionEn: 'Sports court by the lake',
      descriptionRu: 'Спортивная площадка у озера',
      price: 15, // € per hour
      duration: '1 val.',
      durationEn: '1 hour',
      durationRu: '1 час',
      included: false,
      icon: 'Droplets'
    },
    {
      id: 'bbq',
      name: 'BBQ zona',
      nameEn: 'BBQ area',
      nameRu: 'Зона барбекю',
      description: 'Grilio įranga ir lauko valgomasis',
      descriptionEn: 'Grill equipment and outdoor dining',
      descriptionRu: 'Гриль оборудование и обеденная зона',
      price: 10, // € per session
      duration: 'Visai dienai',
      durationEn: 'All day',
      durationRu: 'Весь день',
      included: false,
      icon: 'Utensils'
    },
    {
      id: 'kayak',
      name: 'Baidarių nuoma',
      nameEn: 'Kayak rental',
      nameRu: 'Аренда каяков',
      description: 'Plaukiojimas Mikytų ežere',
      descriptionEn: 'Kayaking on Mikytai lake',
      descriptionRu: 'Каякинг на озере Микитай',
      price: 20, // € per hour
      duration: '1 val.',
      durationEn: '1 hour',
      durationRu: '1 час',
      included: false,
      icon: 'Droplets'
    },
    {
      id: 'fishing',
      name: 'Žvejyba',
      nameEn: 'Fishing',
      nameRu: 'Рыбалка',
      description: 'Žvejyba ežere su įranga',
      descriptionEn: 'Lake fishing with equipment',
      descriptionRu: 'Рыбалка на озере с оборудованием',
      price: 25, // € per day
      duration: 'Visai dienai',
      durationEn: 'All day',
      durationRu: 'Весь день',
      included: false,
      icon: 'Droplets'
    },
    {
      id: 'beachhandball',
      name: 'Paplūdimio rankinis',
      nameEn: 'Beach handball',
      nameRu: 'Пляжный гандбол',
      description: 'Smėlio aikštelė su vartais tinkliniui ir rankiniui',
      descriptionEn: 'Sand court with goals for volleyball and handball',
      descriptionRu: 'Песчаная площадка с воротами для волейбола и гандбола',
      price: 15, // € per hour
      duration: '1 val.',
      durationEn: '1 hour',
      durationRu: '1 час',
      included: false,
      icon: 'Droplets',
      image: '/beach_court.jpg'
    }
  ],

  // Seasons
  seasons: {
    low: {
      name: 'Žemasis sezonas',
      nameEn: 'Low season',
      nameRu: 'Низкий сезон',
      months: ['Spalis', 'Lapkritis', 'Kovas', 'Balandis'],
      monthsEn: ['October', 'November', 'March', 'April'],
      monthsRu: ['Октябрь', 'Ноябрь', 'Март', 'Апрель']
    },
    high: {
      name: 'Aukštasis sezonas',
      nameEn: 'High season',
      nameRu: 'Высокий сезон',
      months: ['Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis'],
      monthsEn: ['May', 'June', 'July', 'August', 'September'],
      monthsRu: ['Май', 'Июнь', 'Июль', 'Август', 'Сентябрь']
    }
  },

  // Payment Methods
  paymentMethods: [
    { id: 'card', name: 'Banko kortelė', nameEn: 'Credit card', nameRu: 'Банковская карта' },
    { id: 'transfer', name: 'Banko pavedimas', nameEn: 'Bank transfer', nameRu: 'Банковский перевод' },
    { id: 'cash', name: 'Grynieji atvykus', nameEn: 'Cash on arrival', nameRu: 'Наличные при заезде' }
  ],

  // Booking.com integration
  bookingCom: {
    enabled: true,
    link: 'https://www.booking.com/hotel/lt/zvaigzdziunamai.html'
  },

  // Admin settings
  admin: {
    password: 'admin123', // Change this in production!
    email: 'admin@zvaigzdziunamai.lt'
  }
};

// Helper function to get current season price
export const getCurrentPrice = (accommodationId: string, date: Date = new Date()): number => {
  const acc = CONFIG.accommodations.find(a => a.id === accommodationId);
  if (!acc) return 0;

  const month = date.getMonth();
  const isWeekend = date.getDay() === 5 || date.getDay() === 6; // Friday or Saturday
  
  // High season: May (4) - September (8)
  const isHighSeason = month >= 4 && month <= 8;
  
  if (isWeekend) return acc.priceWeekend;
  if (isHighSeason) return acc.priceHighSeason;
  return acc.priceLowSeason;
};

// Helper to format price
export const formatPrice = (price: number, currency: string = '€'): string => {
  return `${price} ${currency}`;
};

// Languages for UI
export const languages = [
  { code: 'lt', name: 'LT', flag: '🇱🇹' },
  { code: 'en', name: 'EN', flag: '🇬🇧' },
  { code: 'ru', name: 'RU', flag: '🇷🇺' }
];
