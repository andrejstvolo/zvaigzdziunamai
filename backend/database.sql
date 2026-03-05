-- Žvaigždžių Namai - Database Schema
-- Run this in MySQL to create all tables

CREATE DATABASE IF NOT EXISTS zvaigzdziu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zvaigzdziu_db;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Accommodations table
CREATE TABLE accommodations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_ru VARCHAR(255),
  description TEXT,
  description_en TEXT,
  description_ru TEXT,
  capacity INT DEFAULT 4,
  price_low_season DECIMAL(10,2) NOT NULL,
  price_high_season DECIMAL(10,2) NOT NULL,
  price_weekend DECIMAL(10,2) NOT NULL,
  image VARCHAR(500),
  features JSON,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Activities table
CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_ru VARCHAR(255),
  description TEXT,
  description_en TEXT,
  description_ru TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(100),
  duration_en VARCHAR(100),
  duration_ru VARCHAR(100),
  icon VARCHAR(50),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('accommodation', 'sports') NOT NULL,
  accommodation_id INT,
  court_type VARCHAR(50),
  check_in DATE,
  check_out DATE,
  booking_date DATE,
  start_time TIME,
  duration INT,
  guests INT DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'refunded', 'failed') DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (accommodation_id) REFERENCES accommodations(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Booking extras (meals, activities, etc.)
CREATE TABLE booking_extras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255),
  quantity INT DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- News/Special offers
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  title_ru VARCHAR(255),
  content TEXT,
  content_en TEXT,
  content_ru TEXT,
  image VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default accommodations
INSERT INTO accommodations (name, name_en, name_ru, description, description_en, description_ru, capacity, price_low_season, price_high_season, price_weekend, image, features) VALUES
('Kupolas Nr. 1', 'Dome No. 1', 'Купол № 1', 
 'Stiklinis kupolas su vaizdu į dangų ir ežerą', 
 'Glass dome with view of the sky and lake',
 'Стеклянный купол с видом на небо и озеро',
 4, 100, 150, 180, '/dome_aerial_close.jpg', '["karališka lova", "dušas", "virtuvėlė", "Wi-Fi", "židinys"]'),

('Kupolas Nr. 2', 'Dome No. 2', 'Купол № 2',
 'Stiklinis kupolas miško apsuptyje',
 'Glass dome surrounded by forest',
 'Стеклянный купол в окружении леса',
 4, 100, 150, 180, '/dome_sunset_river.jpg', '["karališka lova", "dušas", "virtuvėlė", "Wi-Fi", "židinys"]'),

('Kupolas Nr. 3', 'Dome No. 3', 'Купол № 3',
 'Romantiškas kupolas poroms su jacuzzi',
 'Romantic dome for couples with jacuzzi',
 'Романтический купол для пар с джакузи',
 4, 110, 160, 190, '/dome_interior_real.jpg', '["karališka lova", "jacuzzi", "dušas", "virtuvėlė", "Wi-Fi"]'),

('Kupolas Nr. 4', 'Dome No. 4', 'Купол № 4',
 'Šeimyninis kupolas su vaizdu į ežerą',
 'Family dome with lake view',
 'Семейный купол с видом на озеро',
 4, 120, 170, 200, '/dome_river_sunset.jpg', '["2 miegamieji", "dušas", "virtuvė", "Wi-Fi", "terasa"]');

-- Insert default activities
INSERT INTO activities (name, name_en, name_ru, description, description_en, description_ru, price, duration, duration_en, duration_ru, icon) VALUES
('Planetariumo seansas', 'Planetarium show', 'Планетарий шоу',
 'Žvaigždžių stebėjimas su profesionaliu gidu',
 'Stargazing with professional guide',
 'Наблюдение за звездами с профессиональным гидом',
 30, '1 val.', '1 hour', '1 час', 'Star'),

('Pirtis', 'Sauna', 'Баня',
 'Tradicinė lietuviška pirtis ant ežero kranto',
 'Traditional Lithuanian sauna by the lake',
 'Традиционная литовская баня на берегу озера',
 40, '2 val.', '2 hours', '2 часа', 'Flame'),

('BBQ zona', 'BBQ area', 'Зона барбекю',
 'Grilio įranga ir lauko valgomasis',
 'Grill equipment and outdoor dining',
 'Гриль оборудование и обеденная зона',
 10, 'Visai dienai', 'All day', 'Весь день', 'Utensils'),

('Baidarių nuoma', 'Kayak rental', 'Аренда каяков',
 'Plaukiojimas Mikytų ežere',
 'Kayaking on Mikytai lake',
 'Каякинг на озере Микитай',
 20, '1 val.', '1 hour', '1 час', 'Droplets'),

('Žvejyba', 'Fishing', 'Рыбалка',
 'Žvejyba ežere su įranga',
 'Lake fishing with equipment',
 'Рыбалка на озере с оборудованием',
 25, 'Visai dienai', 'All day', 'Весь день', 'Droplets'),

('Paplūdimio rankinis', 'Beach handball', 'Пляжный гандбол',
 'Smėlio aikštelė su vartais',
 'Sand court with goals',
 'Песчаная площадка с воротами',
 15, '1 val.', '1 hour', '1 час', 'Droplets');

-- Insert admin user (password: admin123)
-- In production, use bcrypt to hash the password
INSERT INTO users (email, password, name, phone, role) VALUES
('admin@zvaigzdziunamai.lt', '$2a$10$YourHashedPasswordHere', 'Administratorius', '+37060000000', 'admin');

-- Insert sample news
INSERT INTO news (title, title_en, title_ru, content, content_en, content_ru, image, featured) VALUES
('Atidaromas 2-asis kupolas!', '2nd dome opening soon!', 'Скоро открытие 2-го купола!',
 'Džiaugiamės galėdami pranešti, kad ruošiame antrąjį kupolą. Numatomas atidarymas - balandžio mėnesį.',
 'We are happy to announce that we are preparing the second dome. Expected opening - April.',
 'Мы рады сообщить, что готовим второй купол. Ожидаемое открытие - апрель.',
 '/dome_aerial_close.jpg', TRUE);
