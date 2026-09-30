import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import HauntHouse from './models/HauntHouse.js';
import CursedObject from './models/CursedObject.js';
import Auction from './models/Auction.js';
import Bet from './models/Bet.js';
import { generateAnonymousAlias } from './services/auctionService.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Falta la variable MONGODB_URI en el archivo .env');
  process.exit(1);
}

const runSeed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('⚡ Conectado a MongoDB Atlas para ejecutar el Seed.');

    // 1. Limpieza de colecciones existentes
    await Promise.all([
      User.deleteMany({}),
      HauntHouse.deleteMany({}),
      CursedObject.deleteMany({}),
      Auction.deleteMany({}),
      Bet.deleteMany({})
    ]);
    console.log('🧹 Colecciones limpiadas correctamente.');

    // 2. Crear 12 Usuarios (Reputaciones: 120, 100, 95, 85, 80, 75, 70, 65, 60, 55, 50, 45)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const userConfigs = [
      { username: 'PhantomKing', email: 'king@phantom.com', reputation: 120 },
      { username: 'ShadowBider', email: 'shadow@phantom.com', reputation: 100 },
      { username: 'SpookyCat', email: 'cat@phantom.com', reputation: 95 },
      { username: 'GraveDigger', email: 'digger@phantom.com', reputation: 85 },
      { username: 'BansheeWhisper', email: 'banshee@phantom.com', reputation: 80 },
      { username: 'SpecterSeeker', email: 'specter@phantom.com', reputation: 75 },
      { username: 'GhoulishGuest', email: 'ghoul@phantom.com', reputation: 70 },
      { username: 'CryptKeeper', email: 'crypt@phantom.com', reputation: 65 },
      { username: 'VampireLord', email: 'vampire@phantom.com', reputation: 60 },
      { username: 'PoltergeistPaul', email: 'paul@phantom.com', reputation: 55 },
      { username: 'HauntedHannah', email: 'hannah@phantom.com', reputation: 50 },
      { username: 'CursedCharlie', email: 'charlie@phantom.com', reputation: 45 }
    ];

    const users = await User.insertMany(
      userConfigs.map(u => ({ ...u, password: hashedPassword }))
    );
    console.log(`👤 ${users.length} Usuarios creados.`);

    // 3. Crear 3 Casas de Subastas (Temas: Darkness, Comedy, Terror)
    const housesData = [
      {
        name: 'The Obsidian Crypt',
        theme: 'Darkness',
        description: 'Una bóveda en la penumbra donde habitan las reliquias más oscuras.',
        isPrivate: false,
        members: [
          { user: users[0]._id, role: 'Head Haunter' },
          { user: users[1]._id, role: 'Senior Spook' },
          { user: users[2]._id, role: 'Spirit' },
          { user: users[3]._id, role: 'Spirit' }
        ]
      },
      {
        name: 'The Laughing Skeleton Club',
        theme: 'Comedy',
        description: 'Lugar para subastas absurdas y maldiciones bromistas.',
        isPrivate: false,
        members: [
          { user: users[4]._id, role: 'Head Haunter' },
          { user: users[5]._id, role: 'Spirit' },
          { user: users[6]._id, role: 'Spirit' },
          { user: users[7]._id, role: 'Spirit' }
        ]
      },
      {
        name: 'Chamber of Screams',
        theme: 'Terror',
        description: 'Exclusiva para aquellos dispuestos a perder su propia cordura.',
        isPrivate: true,
        inviteCode: 'SCREAM2026',
        members: [
          { user: users[8]._id, role: 'Head Haunter' },
          { user: users[9]._id, role: 'Poltergeist' },
          { user: users[10]._id, role: 'Spirit' },
          { user: users[11]._id, role: 'Spirit' }
        ]
      }
    ];

    const houses = await HauntHouse.insertMany(housesData);
    console.log(`🏰 ${houses.length} Casas embrujadas creadas.`);

    // 4. Crear 8 Objetos Malditos (con las 8 maldiciones predefinidas)
    const cursesData = [
      { name: 'Espejo Susurrante', description: 'Refleja sombras inquietantes.', baseCurse: 'LOSE_10_REP', minBid: 5, maxBid: 150, durationDays: 3, imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233' },
      { name: 'Muñeca de Porcelana Ojo Abierto', description: 'Parpadea cuando nadie la mira.', baseCurse: 'BAN_NEXT_2_AUCTIONS', minBid: 10, maxBid: 200, durationDays: 5, imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e' },
      { name: 'Caja de Música Desafinada', description: 'Toca melodías a las 3:00 AM.', baseCurse: 'CURSE_MARK_7_DAYS', minBid: 20, maxBid: 250, durationDays: 2, imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5' },
      { name: 'Anillo del Lamento', description: 'Enfría la mano de quien lo porta.', baseCurse: 'REDUCE_BET_LIMIT', minBid: 15, maxBid: 180, durationDays: 4, imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e' },
      { name: 'Libro de Páginas Blancas', description: 'Se escribe solo durante la noche.', baseCurse: 'POLTERGEIST_24H', minBid: 30, maxBid: 300, durationDays: 6, imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' },
      { name: 'Reloj de Arena Invertido', description: 'El tiempo avanza al revés a su alrededor.', baseCurse: 'PUBLIC_SHAME_ROLE', minBid: 50, maxBid: 400, durationDays: 7, imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5' },
      { name: 'Vela de Cera Negra', description: 'Su llama proyecta sombras opuestas.', baseCurse: 'REPUTATION_DRAIN_PER_DAY', minBid: 8, maxBid: 120, durationDays: 1, imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233' },
      { name: 'Retrato sin Rostro', description: 'Cambia la fisonomía de quien lo observa.', baseCurse: 'SILENCE_IN_HOUSE', minBid: 25, maxBid: 220, durationDays: 3, imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e' }
    ];

    const objects = await CursedObject.insertMany(cursesData);
    console.log(`📦 ${objects.length} Objetos malditos creados.`);

    // 5. Crear 6 Subastas (3 Abiertas, 2 Cerradas con ganador, 1 Cancelada)
    const now = new Date();
    const futureDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const auctionsData = [
      { hauntHouse: houses[0]._id, cursedObject: objects[0]._id, status: 'open', startDate: now, endDate: futureDate },
      { hauntHouse: houses[0]._id, cursedObject: objects[1]._id, status: 'open', startDate: now, endDate: futureDate },
      { hauntHouse: houses[1]._id, cursedObject: objects[2]._id, status: 'open', startDate: now, endDate: futureDate },
      { hauntHouse: houses[1]._id, cursedObject: objects[3]._id, status: 'closed', startDate: pastDate, endDate: now, winner: users[2]._id, winningBid: 12 },
      { hauntHouse: houses[2]._id, cursedObject: objects[4]._id, status: 'closed', startDate: pastDate, endDate: now, winner: users[6]._id, winningBid: 35 },
      { hauntHouse: houses[2]._id, cursedObject: objects[5]._id, status: 'cancelled', startDate: pastDate, endDate: now }
    ];

    const auctions = await Auction.insertMany(auctionsData);
    console.log(`🔮 ${auctions.length} Subastas creadas.`);

    // 6. Asignar 25 Pujas (Con 2 escenarios de pujas duplicadas)
    // Subasta 1 (Abierta): Pujas [10, 10 (Duplicado), 15, 20, 25]
    const auction1Bids = [
      { user: users[0]._id, amount: 10, isDuplicate: true },
      { user: users[1]._id, amount: 10, isDuplicate: true },
      { user: users[2]._id, amount: 15, isDuplicate: false },
      { user: users[3]._id, amount: 20, isDuplicate: false },
      { user: users[4]._id, amount: 25, isDuplicate: false }
    ];

    // Subasta 2 (Abierta): Pujas [12, 18, 18 (Duplicado), 18 (Duplicado), 30]
    const auction2Bids = [
      { user: users[5]._id, amount: 12, isDuplicate: false },
      { user: users[6]._id, amount: 18, isDuplicate: true },
      { user: users[7]._id, amount: 18, isDuplicate: true },
      { user: users[8]._id, amount: 18, isDuplicate: true },
      { user: users[9]._id, amount: 30, isDuplicate: false }
    ];

    // Subasta 3 (Abierta): Pujas [22, 25, 28, 35, 40]
    const auction3Bids = [
      { user: users[0]._id, amount: 22 },
      { user: users[2]._id, amount: 25 },
      { user: users[4]._id, amount: 28 },
      { user: users[6]._id, amount: 35 },
      { user: users[8]._id, amount: 40 }
    ];

    // Subasta 4 (Cerrada): Pujas [12 (Ganador), 15, 20, 25, 30]
    const auction4Bids = [
      { user: users[2]._id, amount: 12 },
      { user: users[3]._id, amount: 15 },
      { user: users[5]._id, amount: 20 },
      { user: users[7]._id, amount: 25 },
      { user: users[9]._id, amount: 30 }
    ];

    // Subasta 5 (Cerrada): Pujas [35 (Ganador), 40, 45, 50, 55]
    const auction5Bids = [
      { user: users[6]._id, amount: 35 },
      { user: users[7]._id, amount: 40 },
      { user: users[8]._id, amount: 45 },
      { user: users[10]._id, amount: 50 },
      { user: users[11]._id, amount: 55 }
    ];

    const processBids = (bidList, auctionId) => {
      return bidList.map(b => ({
        ...b,
        alias: generateAnonymousAlias(b.user, auctionId)
      }));
    };

    auctions[0].bids = processBids(auction1Bids, auctions[0]._id);
    auctions[1].bids = processBids(auction2Bids, auctions[1]._id);
    auctions[2].bids = processBids(auction3Bids, auctions[2]._id);
    auctions[3].bids = processBids(auction4Bids, auctions[3]._id);
    auctions[4].bids = processBids(auction5Bids, auctions[4]._id);

    await Promise.all(auctions.map(a => a.save()));
    console.log('💰 25 Pujas registradas en las subastas.');

    // 7. Crear 10 Registros de Apuestas Paralelas
    const targetAlias1 = generateAnonymousAlias(users[2]._id, auctions[0]._id);
    const targetAlias2 = generateAnonymousAlias(users[5]._id, auctions[1]._id);

    const betsData = [
      { auction: auctions[0]._id, user: users[1]._id, targetAlias: targetAlias1, amount: 10, status: 'pending' },
      { auction: auctions[0]._id, user: users[3]._id, targetAlias: targetAlias1, amount: 25, status: 'pending' },
      { auction: auctions[1]._id, user: users[0]._id, targetAlias: targetAlias2, amount: 5, status: 'pending' },
      { auction: auctions[1]._id, user: users[2]._id, targetAlias: targetAlias2, amount: 50, status: 'pending' },
      { auction: auctions[2]._id, user: users[5]._id, targetAlias: targetAlias1, amount: 10, status: 'pending' },
      { auction: auctions[2]._id, user: users[7]._id, targetAlias: targetAlias2, amount: 25, status: 'pending' },
      { auction: auctions[3]._id, user: users[1]._id, targetAlias: targetAlias1, amount: 10, status: 'won' },
      { auction: auctions[3]._id, user: users[4]._id, targetAlias: targetAlias2, amount: 10, status: 'lost' },
      { auction: auctions[4]._id, user: users[8]._id, targetAlias: targetAlias1, amount: 50, status: 'won' },
      { auction: auctions[4]._id, user: users[9]._id, targetAlias: targetAlias2, amount: 5, status: 'lost' }
    ];

    await Bet.insertMany(betsData);
    console.log('🎲 10 Apuestas registradas.');

    // 8. Aplicar marcas de maldición en usuarios
    await User.updateOne({ _id: users[0]._id }, { $push: { curseMarks: 'LOSE_10_REP' } });
    await User.updateOne({ _id: users[1]._id }, { $push: { curseMarks: 'POLTERGEIST_24H' } });
    await User.updateOne({ _id: users[6]._id }, { $push: { curseMarks: 'CURSE_MARK_7_DAYS' } });
    console.log('🕸️ 3 Maldiciones aplicadas a registros de usuarios.');

    console.log('\n✅ ¡Sembrado de datos ejecutado con éxito total en PhantomBids!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

runSeed();