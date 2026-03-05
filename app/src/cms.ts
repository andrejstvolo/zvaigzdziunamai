// Žvaigždžių Namai - CMS Configuration
// Edit this file to update website content, images, and special offers

export const CMS = {
  // SEO Configuration
  seo: {
    title: {
      lt: "Žvaigždžių Namai | Glamping prie Mikytų ežero",
      en: "Star Houses | Glamping by Lake Mikytai",
      ru: "Звездные Дома | Глэмпинг у озера Микитай"
    },
    description: {
      lt: "Unikalūs glamping kupolai prie Mikytų ežero. Planetariumo seansai, pirtis, sporto aikštelės, BBQ zonos. Poilsis po atviru dangumu Lietuvoje.",
      en: "Unique glamping domes by Lake Mikytai. Planetarium shows, sauna, sports courts, BBQ areas. Rest under the open sky in Lithuania.",
      ru: "Уникальные глэмпинг-купола у озера Микитай. Планетарий, баня, спортивные площадки, зоны барбекю. Отдых под открытым небом в Литве."
    },
    keywords: {
      lt: "glamping, kupolai, Mikytų ežeras, poilsis Lietuvoje, planetariumas, pirtis, nameliai gamtoje",
      en: "glamping, domes, Lake Mikytai, Lithuania vacation, planetarium, sauna, nature retreat",
      ru: "глэмпинг, купола, озеро Микитай, отдых в Литве, планетарий, баня, отдых на природе"
    },
    ogImage: "/og-image.jpg",
    canonicalUrl: "https://zvaigzdziunamai.lt"
  },

  // Special Offers / News
  specialOffers: {
    enabled: true,
    banner: {
      enabled: true,
      type: "countdown",
      title: {
        lt: "🌟 VASAROS AKCIJA: -20% visoms nakvynėms!",
        en: "🌟 SUMMER SALE: -20% off all stays!",
        ru: "🌟 ЛЕТНЯЯ АКЦИЯ: -20% на все проживания!"
      },
      subtitle: {
        lt: "Naudokite kodą VASARA2026. Galioja iki birželio 30 d.",
        en: "Use code SUMMER2026. Valid until June 30.",
        ru: "Используйте код ЛЕТО2026. Действует до 30 июня."
      },
      code: "VASARA2026",
      discount: 20,
      validUntil: "2026-06-30",
      bgColor: "#D4A24A",
      textColor: "#0B0F17"
    },
    news: [
      {
        id: "1",
        date: "2026-03-01",
        title: {
          lt: "Atidaromas 2-asis kupolas!",
          en: "2nd dome opening soon!",
          ru: "Скоро открытие 2-го купола!"
        },
        content: {
          lt: "Džiaugiamės galėdami pranešti, kad ruošiame antrąjį kupolą. Numatomas atidarymas - balandžio mėnesį.",
          en: "We are happy to announce that we are preparing the second dome. Expected opening - April.",
          ru: "Мы рады сообщить, что готовим второй купол. Ожидаемое открытие - апрель."
        },
        image: "/dome_aerial_close.jpg",
        featured: true
      },
      {
        id: "2",
        date: "2026-02-15",
        title: {
          lt: "Nauja paslauga: pusryčių pristatymas į kupolą",
          en: "New service: breakfast delivery to your dome",
          ru: "Новая услуга: доставка завтрака в купол"
        },
        content: {
          lt: "Nuo šiol galite užsisakyti šviežių pusryčių pristatymą tiesiai į savo kupolą. Meniu pasirinkimas kasdien!",
          en: "Now you can order fresh breakfast delivery directly to your dome. Menu changes daily!",
          ru: "Теперь вы можете заказать доставку свежего завтрака прямо в ваш купол. Меню меняется ежедневно!"
        },
        image: "/bbq_area.jpg",
        featured: false
      }
    ]
  },

  // About Us Section
  about: {
    title: {
      lt: "Apie mus",
      en: "About Us",
      ru: "О нас"
    },
    subtitle: {
      lt: "Mūsų istorija ir misija",
      en: "Our story and mission",
      ru: "Наша история и миссия"
    },
    story: {
      lt: "Žvaigždžių Namai gimė iš meilės gamtai ir noro sukurti unikalią poilsio vietą Lietuvoje. 2024 metais atradę šį nuostabų kampelį prie Mikytų ežero, supratome, kad čia privalo būti vieta, kur žmonės galėtų atsijungti nuo kasdienio šurmulio ir tiesiog būti su gamta.",
      en: "Star Houses was born from a love of nature and a desire to create a unique retreat in Lithuania. In 2024, when we discovered this amazing spot by Lake Mikytai, we realized that this must be a place where people can disconnect from daily hustle and just be with nature.",
      ru: "Звездные Дома родились из любви к природе и желания создать уникальное место отдыха в Литве. В 2024 году, обнаружив это удивительное место у озера Микитай, мы поняли, что здесь должно быть место, где люди могут отключиться от повседневной суеты и просто быть с природой."
    },
    mission: {
      lt: "Mūsų misija – sukurti erdvę, kurioje modernus komfortas susitinka su gamtos ramybe. Kiekvienas mūsų kupolas yra suprojektuotas taip, kad svečiai galėtų mėgautis žvaigždėtu dangumi tiesiog iš savo lovos.",
      en: "Our mission is to create a space where modern comfort meets nature's tranquility. Each of our domes is designed so that guests can enjoy the starry sky right from their bed.",
      ru: "Наша миссия – создать пространство, где современный комфорт встречается с тишиной природы. Каждый наш купол спроектирован так, чтобы гости могли наслаждаться звездным небом прямо из своей кровати."
    },
    stats: [
      { value: "4", label: { lt: "Kupolai", en: "Domes", ru: "Купола" } },
      { value: "500+", label: { lt: "Laimingų svečių", en: "Happy guests", ru: "Довольных гостей" } },
      { value: "4.9", label: { lt: "Įvertinimas", en: "Rating", ru: "Рейтинг" } },
      { value: "2024", label: { lt: "Nuo", en: "Since", ru: "С" } }
    ],
    image: "/aerial_4_domes.jpg"
  },

  // FAQ Section
  faq: {
    title: {
      lt: "Dažnai užduodami klausimai",
      en: "Frequently Asked Questions",
      ru: "Часто задаваемые вопросы"
    },
    subtitle: {
      lt: "Atsakymai į populiariausius klausimus",
      en: "Answers to the most popular questions",
      ru: "Ответы на самые популярные вопросы"
    },
    items: [
      {
        question: {
          lt: "Kiek kainuoja nakvynė Žvaigždžių Namuose?",
          en: "How much does a stay at Star Houses cost?",
          ru: "Сколько стоит проживание в Звездных Домах?"
        },
        answer: {
          lt: "Nakvynės kaina prasideda nuo 100€ už naktį žemajame sezone. Kaina priklauso nuo sezono, savaitės dienos ir pasirinkto kupolo. Savaitgaliais taikomi specialūs įkainiai.",
          en: "Stay prices start from 100€ per night in low season. Price depends on season, day of the week, and chosen dome. Special rates apply on weekends.",
          ru: "Стоимость проживания начинается от 100€ за ночь в низкий сезон. Цена зависит от сезона, дня недели и выбранного купола. На выходных действуют специальные тарифы."
        }
      },
      {
        question: {
          lt: "Ar galima užsakyti sporto aikštelę be nakvynės?",
          en: "Can I book a sports court without accommodation?",
          ru: "Можно ли забронировать спортплощадку без проживания?"
        },
        answer: {
          lt: "Taip, paplūdimio tinklinio ir rankinio aikštelę galima užsakyti atskirai. Kaina - 15€/valanda. Sporto mokykloms taikoma 30% nuolaida.",
          en: "Yes, beach volleyball and handball courts can be booked separately. Price - 15€/hour. 30% discount for sports schools.",
          ru: "Да, площадки для пляжного волейбола и гандбола можно забронировать отдельно. Цена - 15€/час. Для спортивных школ скидка 30%."
        }
      },
      {
        question: {
          lt: "Kiek žmonių telpa į vieną kupolą?",
          en: "How many people fit in one dome?",
          ru: "Сколько человек помещается в один купол?"
        },
        answer: {
          lt: "Kiekvienas kupolas skirtas iki 4 asmenų šeimoms ar draugų kompanijoms. Kupoluose yra karališka lova ir papildoma miegama vieta.",
          en: "Each dome is designed for families or groups of up to 4 people. Domes have a king bed and additional sleeping space.",
          ru: "Каждый купол рассчитан на семьи или группы до 4 человек. В куполах есть кровать king-size и дополнительное спальное место."
        }
      },
      {
        question: {
          lt: "Ar galima atvykti su augintiniu?",
          en: "Can I come with a pet?",
          ru: "Можно ли приехать с питомцем?"
        },
        answer: {
          lt: "Taip, priimame svečius su augintiniais! Taikomas papildomas 20€ mokestis už visą viešnagę. Prašome informuoti iš anksto.",
          en: "Yes, we welcome guests with pets! An additional 20€ fee applies for the entire stay. Please inform us in advance.",
          ru: "Да, мы принимаем гостей с питомцами! Дополнительная плата 20€ за все проживание. Пожалуйста, сообщите заранее."
        }
      },
      {
        question: {
          lt: "Koks yra atvykimo ir išvykimo laikas?",
          en: "What are the check-in and check-out times?",
          ru: "Какое время заезда и выезда?"
        },
        answer: {
          lt: "Registracija (check-in): nuo 15:00 iki 20:00. Išvykimas (check-out): iki 12:00. Jei reikia kito laiko, susisiekite su mumis.",
          en: "Check-in: from 15:00 to 20:00. Check-out: until 12:00. If you need a different time, please contact us.",
          ru: "Заезд: с 15:00 до 20:00. Выезд: до 12:00. Если вам нужно другое время, пожалуйста, свяжитесь с нами."
        }
      },
      {
        question: {
          lt: "Ar kupoluose yra Wi-Fi ir dušas?",
          en: "Do domes have Wi-Fi and shower?",
          ru: "Есть ли в куполах Wi-Fi и душ?"
        },
        answer: {
          lt: "Taip, visuose kupoluose yra nemokamas Wi-Fi, privatus dušas, virtuvėlė su šaldytuvu, židinys ir kondicionierius.",
          en: "Yes, all domes have free Wi-Fi, private shower, kitchenette with refrigerator, fireplace, and air conditioning.",
          ru: "Да, во всех куполах есть бесплатный Wi-Fi, частный душ, кухонька с холодильником, камин и кондиционер."
        }
      }
    ]
  },

  // Gallery
  gallery: {
    title: {
      lt: "Galerija",
      en: "Gallery",
      ru: "Галерея"
    },
    subtitle: {
      lt: "Pažvelkite į mūsų kampelį gamtoje",
      en: "Take a look at our corner of nature",
      ru: "Взгляните на наш уголок природы"
    },
    images: [
      { src: "/dome_aerial_close.jpg", alt: { lt: "Kupolas iš arti", en: "Dome close-up", ru: "Купол крупным планом" }, category: "domes" },
      { src: "/dome_sunset_river.jpg", alt: { lt: "Kupolas saulėlydžio metu", en: "Dome at sunset", ru: "Купол на закате" }, category: "domes" },
      { src: "/beach_court.jpg", alt: { lt: "Sporto aikštelė", en: "Sports court", ru: "Спортплощадка" }, category: "sports" },
      { src: "/aerial_river.jpg", alt: { lt: "Vaizdas iš viršaus", en: "Aerial view", ru: "Вид сверху" }, category: "nature" },
      { src: "/bbq_area.jpg", alt: { lt: "BBQ zona", en: "BBQ area", ru: "Зона барбекю" }, category: "amenities" },
      { src: "/dome_interior_real.jpg", alt: { lt: "Kupolo interjeras", en: "Dome interior", ru: "Интерьер купола" }, category: "domes" },
      { src: "/dome_night_stars.jpg", alt: { lt: "Kupolas naktį", en: "Dome at night", ru: "Купол ночью" }, category: "domes" },
      { src: "/aerial_court.jpg", alt: { lt: "Aikštelė iš viršaus", en: "Court aerial view", ru: "Площадка сверху" }, category: "sports" }
    ]
  },

  // Editable Content Sections
  content: {
    hero: {
      backgroundImage: "/dome_night_stars.jpg",
      badge: {
        lt: "GLAMPING • MIKYTŲ EŽERAS",
        en: "GLAMPING • LAKE MIKYTAI",
        ru: "ГЛЭМПИНГ • ОЗЕРО МИКИТАЙ"
      },
      title: {
        lt: "Poilsis po atviru dangumi",
        en: "Rest under the open sky",
        ru: "Отдых под открытым небом"
      },
      subtitle: {
        lt: "Unikalūs glamping kupolai prie Mikytų ežero. Planetariumo seansai, pirtis, sporto aikštelės ir nepamirštama gamtos patirtis.",
        en: "Unique glamping domes by Lake Mikytai. Planetarium shows, sauna, sports courts and unforgettable nature experience.",
        ru: "Уникальные глэмпинг-купола у озера Микитай. Планетарий, баня, спортивные площадки и незабываемый опыт природы."
      }
    }
  },

  // Testimonials
  testimonials: [
    {
      name: "Greta & Tomas",
      location: "Kaunas",
      text: {
        lt: "Nerealu žiūrėti į žvaigždes gulint šiltoje lovoje. Pats romantiškiausias savaitgalis!",
        en: "Amazing to watch the stars while lying in a warm bed. The most romantic weekend!",
        ru: "Невероятно смотреть на звезды, лежа в теплой кровати. Самый романтичный уикенд!"
      },
      rating: 5,
      image: null
    },
    {
      name: "Eglė",
      location: "Vilnius",
      text: {
        lt: "Planetariumo seansas vidurnaktį – tai buvo magija. Tikrai sugrįšime!",
        en: "The planetarium show at midnight was magical. We'll definitely come back!",
        ru: "Планетарий в полночь – это была магия. Обязательно вернемся!"
      },
      rating: 5,
      image: null
    },
    {
      name: "Mantas",
      location: "Klaipėda",
      text: {
        lt: "Ramybė, kurią sunkiai randi kitur. Pirtis po atviru dangumi – nepamirštama.",
        en: "Peace you can hardly find elsewhere. Sauna under the open sky is unforgettable.",
        ru: "Тишина, которую трудно найти где-либо еще. Баня под открытым небом – незабываемо."
      },
      rating: 5,
      image: null
    }
  ],

  // Social Media Links
  social: {
    facebook: "https://facebook.com/zvaigzdziunamai",
    instagram: "https://instagram.com/zvaigzdziunamai",
    youtube: "https://youtube.com/@zvaigzdziunamai",
    tiktok: "https://tiktok.com/@zvaigzdziunamai"
  },

  // Contact Info
  contact: {
    phone: "+370 600 00000",
    email: "labas@zvaigzdziunamai.lt",
    address: "Mikytų k., Šakių r., Lietuva",
    coordinates: { lat: 55.0212551, lng: 23.5737184 },
    workingHours: {
      lt: "Registracija: 15:00 - 20:00 | Išvykimas: iki 12:00",
      en: "Check-in: 15:00 - 20:00 | Check-out: until 12:00",
      ru: "Заезд: 15:00 - 20:00 | Выезд: до 12:00"
    }
  }
};

// Helper function to get localized content
export const getLocalized = (obj: Record<string, string>, lang: string): string => {
  return obj[lang] || obj['lt'] || obj['en'] || '';
};
