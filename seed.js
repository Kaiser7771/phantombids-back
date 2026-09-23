import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno
dotenv.config();

// Importar Modelos (Asegúrate de que las rutas coincidan con la estructura de tu carpeta models)
import User from './models/User.js';
import HauntHouse from './models/HauntHouse.js';
import Auction from './models/Auction.js';

const seedData = async () => {
  try {
    // 1. Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Conectado a MongoDB Atlas para ejecutar el Seed...');

    // 2. Limpiar colecciones previas
    await User.deleteMany({});
    await HauntHouse.deleteMany({});
    await Auction.deleteMany({});
    console.log('🧹 Base de datos limpiada con éxito.');

    // 3. Crear usuario de prueba (contraseña encriptada)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const user = await User.create({
      username: 'fantasma_admin',
      email: 'admin@phantombids.com',
      password: hashedPassword,
    });
    console.log('👤 Usuario de prueba creado.');

    // 4. Crear una casa embrujada de prueba
    const house = await HauntHouse.create({
      title: 'Mansión Blackwood',
      description: 'Una elegante propiedad victoriana con actividad paranormal severa.',
      location: 'Salem, Massachusetts',
      spookinessLevel: 5,
      pricePerNight: 250,
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
      owner: user._id,
    });
    console.log('🏚️ Casa embrujada de prueba creada.');

    // 5. Crear una subasta de prueba
    await Auction.create({
      house: house._id,
      startingBid: 100,
      currentBid: 100,
      highestBidder: user._id,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Vence en 7 días
      status: 'active',
    });
    console.log('🔨 Subasta de prueba creada.');

    console.log('✅ ¡Seeding completado con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar el seeding:', error);
    process.exit(1);
  }
};

seedData();