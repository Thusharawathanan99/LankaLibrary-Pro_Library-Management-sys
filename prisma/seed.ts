// ============================================================================
// Database Seed — LankaLibrary Pro
// Run: npx prisma db seed
// ============================================================================

import { PrismaClient, Role, IssueStatus, FineStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, subDays } from 'date-fns';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ========================================================================
  // 1. System Settings
  // ========================================================================
  console.log('⚙️  Seeding system settings...');
  const settings = [
    { key: 'fine_per_day', value: '5', description: 'Fine amount charged per overdue day' },
    { key: 'loan_days', value: '14', description: 'Default loan period in days' },
    { key: 'max_books_per_user', value: '5', description: 'Maximum books a user can borrow at once' },
    { key: 'library_name', value: 'LankaLibrary Pro', description: 'Library name' },
    { key: 'library_email', value: 'info@lankalibrary.com', description: 'Library contact email' },
    { key: 'library_phone', value: '+94 11 234 5678', description: 'Library contact phone' },
  ];

  for (const setting of settings) {
    await prisma.systemSettings.upsert({
      where: { key: setting.key },
      create: setting,
      update: { value: setting.value, description: setting.description },
    });
  }
  console.log(`   ✅ ${settings.length} settings created\n`);

  // ========================================================================
  // 2. Users
  // ========================================================================
  console.log('👤 Seeding users...');

  const adminPassword = await hashPassword('Admin@123');
  const staffPassword = await hashPassword('Staff@123');
  const userPassword = await hashPassword('User@123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lankalibrary.com' },
    create: {
      name: 'System Administrator',
      email: 'admin@lankalibrary.com',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '+94 77 100 0001',
    },
    update: {},
  });

  const staff1 = await prisma.user.upsert({
    where: { email: 'kamal@lankalibrary.com' },
    create: {
      name: 'Kamal Perera',
      email: 'kamal@lankalibrary.com',
      password: staffPassword,
      role: Role.STAFF,
      phone: '+94 77 200 0001',
    },
    update: {},
  });

  const staff2 = await prisma.user.upsert({
    where: { email: 'nimal@lankalibrary.com' },
    create: {
      name: 'Nimal Fernando',
      email: 'nimal@lankalibrary.com',
      password: staffPassword,
      role: Role.STAFF,
      phone: '+94 77 200 0002',
    },
    update: {},
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'saman@gmail.com' },
    create: {
      name: 'Saman Silva',
      email: 'saman@gmail.com',
      password: userPassword,
      role: Role.USER,
      phone: '+94 77 300 0001',
    },
    update: {},
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'kumari@gmail.com' },
    create: {
      name: 'Kumari Jayawardena',
      email: 'kumari@gmail.com',
      password: userPassword,
      role: Role.USER,
      phone: '+94 77 300 0002',
    },
    update: {},
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'ruwan@gmail.com' },
    create: {
      name: 'Ruwan Wickramasinghe',
      email: 'ruwan@gmail.com',
      password: userPassword,
      role: Role.USER,
      phone: '+94 77 300 0003',
    },
    update: {},
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'dilani@gmail.com' },
    create: {
      name: 'Dilani Rajapaksha',
      email: 'dilani@gmail.com',
      password: userPassword,
      role: Role.USER,
      phone: '+94 77 300 0004',
    },
    update: {},
  });

  const user5 = await prisma.user.upsert({
    where: { email: 'chathura@gmail.com' },
    create: {
      name: 'Chathura Bandara',
      email: 'chathura@gmail.com',
      password: userPassword,
      role: Role.USER,
      phone: '+94 77 300 0005',
    },
    update: {},
  });

  console.log('   ✅ 1 admin, 2 staff, 5 users created\n');

  // ========================================================================
  // 3. Books
  // ========================================================================
  console.log('📚 Seeding books...');

  const booksData = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', publisher: 'Scribner', quantity: 5 },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', category: 'Fiction', publisher: 'Harper Perennial', quantity: 4 },
    { title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Fiction', publisher: 'Signet Classics', quantity: 6 },
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', category: 'Fiction', publisher: 'Penguin Classics', quantity: 3 },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769488', category: 'Fiction', publisher: 'Little, Brown', quantity: 4 },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: 'Science', publisher: 'Bantam', quantity: 3 },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'History', publisher: 'Harper', quantity: 5 },
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', publisher: 'Prentice Hall', quantity: 4 },
    { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', isbn: '978-0135957059', category: 'Technology', publisher: 'Addison-Wesley', quantity: 3 },
    { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', category: 'Technology', publisher: 'Addison-Wesley', quantity: 2 },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Technology', publisher: 'MIT Press', quantity: 3 },
    { title: 'The Art of War', author: 'Sun Tzu', isbn: '978-1590302255', category: 'History', publisher: 'Shambhala', quantity: 4 },
    { title: 'Cosmos', author: 'Carl Sagan', isbn: '978-0345539434', category: 'Science', publisher: 'Ballantine Books', quantity: 3 },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '978-0374533557', category: 'Psychology', publisher: 'Farrar, Straus', quantity: 4 },
    { title: 'The Lean Startup', author: 'Eric Ries', isbn: '978-0307887894', category: 'Business', publisher: 'Crown Business', quantity: 5 },
    { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Self-Help', publisher: 'Avery', quantity: 6 },
    { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441013593', category: 'Fiction', publisher: 'Ace Books', quantity: 4 },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '978-0199291151', category: 'Science', publisher: 'Oxford University Press', quantity: 2 },
    { title: 'Zero to One', author: 'Peter Thiel', isbn: '978-0804139298', category: 'Business', publisher: 'Crown Business', quantity: 3 },
    { title: 'The History of Sri Lanka', author: 'Patrick Peebles', isbn: '978-0313332050', category: 'History', publisher: 'Greenwood', quantity: 5 },
  ];

  const books = [];
  for (const bookData of booksData) {
    const book = await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      create: {
        ...bookData,
        availableQuantity: bookData.quantity,
      },
      update: {},
    });
    books.push(book);
  }
  console.log(`   ✅ ${books.length} books created\n`);

  // ========================================================================
  // 4. Issues (mix of statuses)
  // ========================================================================
  console.log('📖 Seeding issues...');

  const now = new Date();

  // Active issues (ISSUED)
  const issue1 = await prisma.issue.create({
    data: {
      userId: user1.id,
      bookId: books[0].id,
      issueDate: subDays(now, 5),
      dueDate: addDays(now, 9),
      status: IssueStatus.ISSUED,
    },
  });
  await prisma.book.update({ where: { id: books[0].id }, data: { availableQuantity: { decrement: 1 } } });

  const issue2 = await prisma.issue.create({
    data: {
      userId: user2.id,
      bookId: books[7].id,
      issueDate: subDays(now, 3),
      dueDate: addDays(now, 11),
      status: IssueStatus.ISSUED,
    },
  });
  await prisma.book.update({ where: { id: books[7].id }, data: { availableQuantity: { decrement: 1 } } });

  const issue3 = await prisma.issue.create({
    data: {
      userId: user3.id,
      bookId: books[15].id,
      issueDate: subDays(now, 1),
      dueDate: addDays(now, 13),
      status: IssueStatus.ISSUED,
    },
  });
  await prisma.book.update({ where: { id: books[15].id }, data: { availableQuantity: { decrement: 1 } } });

  // Overdue issues
  const issue4 = await prisma.issue.create({
    data: {
      userId: user4.id,
      bookId: books[2].id,
      issueDate: subDays(now, 20),
      dueDate: subDays(now, 6),
      status: IssueStatus.ISSUED,
    },
  });
  await prisma.book.update({ where: { id: books[2].id }, data: { availableQuantity: { decrement: 1 } } });

  const issue5 = await prisma.issue.create({
    data: {
      userId: user5.id,
      bookId: books[5].id,
      issueDate: subDays(now, 25),
      dueDate: subDays(now, 11),
      status: IssueStatus.ISSUED,
    },
  });
  await prisma.book.update({ where: { id: books[5].id }, data: { availableQuantity: { decrement: 1 } } });

  // Returned issues (with fines)
  const issue6 = await prisma.issue.create({
    data: {
      userId: user1.id,
      bookId: books[6].id,
      issueDate: subDays(now, 30),
      dueDate: subDays(now, 16),
      returnDate: subDays(now, 10),
      status: IssueStatus.RETURNED,
    },
  });

  const issue7 = await prisma.issue.create({
    data: {
      userId: user2.id,
      bookId: books[3].id,
      issueDate: subDays(now, 28),
      dueDate: subDays(now, 14),
      returnDate: subDays(now, 12),
      status: IssueStatus.RETURNED,
    },
  });

  // Returned on time (no fine)
  const issue8 = await prisma.issue.create({
    data: {
      userId: user3.id,
      bookId: books[8].id,
      issueDate: subDays(now, 20),
      dueDate: subDays(now, 6),
      returnDate: subDays(now, 8),
      status: IssueStatus.RETURNED,
    },
  });

  const issue9 = await prisma.issue.create({
    data: {
      userId: user4.id,
      bookId: books[13].id,
      issueDate: subDays(now, 15),
      dueDate: subDays(now, 1),
      returnDate: subDays(now, 3),
      status: IssueStatus.RETURNED,
    },
  });

  const issue10 = await prisma.issue.create({
    data: {
      userId: user5.id,
      bookId: books[14].id,
      issueDate: subDays(now, 12),
      dueDate: addDays(now, 2),
      returnDate: subDays(now, 2),
      status: IssueStatus.RETURNED,
    },
  });

  console.log('   ✅ 10 issues created (3 active, 2 overdue, 5 returned)\n');

  // ========================================================================
  // 5. Fines
  // ========================================================================
  console.log('💰 Seeding fines...');

  // Fine for issue6 (6 days overdue, returned) — PAID
  await prisma.fine.create({
    data: {
      issueId: issue6.id,
      userId: user1.id,
      amount: 30, // 6 days × 5
      status: FineStatus.PAID,
    },
  });

  // Fine for issue7 (2 days overdue, returned) — UNPAID
  await prisma.fine.create({
    data: {
      issueId: issue7.id,
      userId: user2.id,
      amount: 10, // 2 days × 5
      status: FineStatus.UNPAID,
    },
  });

  console.log('   ✅ 2 fines created (1 paid, 1 unpaid)\n');

  // ========================================================================
  // 6. Notifications
  // ========================================================================
  console.log('🔔 Seeding notifications...');

  const notificationsData = [
    { userId: user1.id, title: 'Welcome to LankaLibrary Pro', message: 'Your account has been created. Browse our catalog and start borrowing books!', type: NotificationType.SYSTEM },
    { userId: user2.id, title: 'Welcome to LankaLibrary Pro', message: 'Your account has been created. Browse our catalog and start borrowing books!', type: NotificationType.SYSTEM },
    { userId: user4.id, title: 'Overdue Book Alert', message: 'Your book "1984" is overdue by 6 days. Please return it as soon as possible to avoid additional fines.', type: NotificationType.SYSTEM },
    { userId: user5.id, title: 'Overdue Book Alert', message: 'Your book "A Brief History of Time" is overdue by 11 days. Please return it immediately.', type: NotificationType.SYSTEM },
    { userId: user1.id, title: 'Fine Payment Confirmed', message: 'Your fine of 30 for "Sapiens" has been paid. Thank you!', type: NotificationType.SYSTEM, isRead: true },
    { userId: user2.id, title: 'Fine Generated', message: 'A fine of 10 has been generated for "Pride and Prejudice" (2 days overdue).', type: NotificationType.SYSTEM },
  ];

  for (const notif of notificationsData) {
    await prisma.notification.create({
      data: {
        userId: notif.userId,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        isRead: notif.isRead || false,
      },
    });
  }
  console.log(`   ✅ ${notificationsData.length} notifications created\n`);

  // ========================================================================
  // 7. Activity Logs
  // ========================================================================
  console.log('📝 Seeding activity logs...');

  const logsData = [
    { userId: admin.id, action: 'SYSTEM_INIT', description: 'System initialized with seed data' },
    { userId: admin.id, action: 'USER_CREATED', description: 'Created staff: kamal@lankalibrary.com' },
    { userId: admin.id, action: 'USER_CREATED', description: 'Created staff: nimal@lankalibrary.com' },
    { userId: staff1.id, action: 'BOOK_CREATED', description: 'Added 20 books to the catalog' },
    { userId: staff1.id, action: 'BOOK_ISSUED', description: 'Issued "The Great Gatsby" to Saman Silva' },
    { userId: staff2.id, action: 'BOOK_ISSUED', description: 'Issued "Clean Code" to Kumari Jayawardena' },
    { userId: staff1.id, action: 'BOOK_RETURNED', description: 'Returned "Sapiens" by Saman Silva. Fine: 30' },
    { userId: admin.id, action: 'FINE_PAID', description: 'Fine paid: 30 by saman@gmail.com' },
  ];

  for (const log of logsData) {
    await prisma.activityLog.create({
      data: {
        userId: log.userId,
        action: log.action,
        description: log.description,
      },
    });
  }
  console.log(`   ✅ ${logsData.length} activity logs created\n`);

  // ========================================================================
  // Summary
  // ========================================================================
  console.log('═══════════════════════════════════════════');
  console.log('🎉 Seed completed successfully!');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('📋 Login Credentials:');
  console.log('───────────────────────────────────────────');
  console.log('Admin:  admin@lankalibrary.com / Admin@123');
  console.log('Staff:  kamal@lankalibrary.com / Staff@123');
  console.log('Staff:  nimal@lankalibrary.com / Staff@123');
  console.log('User:   saman@gmail.com        / User@123');
  console.log('User:   kumari@gmail.com       / User@123');
  console.log('User:   ruwan@gmail.com        / User@123');
  console.log('User:   dilani@gmail.com       / User@123');
  console.log('User:   chathura@gmail.com     / User@123');
  console.log('───────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
