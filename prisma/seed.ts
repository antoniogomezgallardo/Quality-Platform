import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@quality-platform.com' },
    update: {},
    create: {
      email: 'admin@quality-platform.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('👤 Created admin user:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@quality-platform.com' },
    update: {},
    create: {
      email: 'user@quality-platform.com',
      username: 'testuser',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: Role.USER,
      isActive: true,
    },
  });
  console.log('👤 Created regular user:', user.email);

  // Seed products
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
      price: 199.99,
      stock: 50,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      isActive: true,
    },
    {
      name: 'Gaming Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with Cherry MX switches, perfect for gaming and productivity.',
      price: 149.99,
      stock: 30,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
      isActive: true,
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and 7-day battery life.',
      price: 299.99,
      stock: 25,
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      isActive: true,
    },
    {
      name: 'Professional Coffee Maker',
      description: 'Programmable drip coffee maker with thermal carafe and built-in grinder.',
      price: 249.99,
      stock: 15,
      category: 'Appliances',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
      isActive: true,
    },
    {
      name: 'Ergonomic Office Chair',
      description: 'Adjustable office chair with lumbar support and breathable mesh back for all-day comfort.',
      price: 399.99,
      stock: 20,
      category: 'Furniture',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      isActive: true,
    },
    {
      name: 'Portable External SSD',
      description: '1TB portable SSD with USB-C connectivity and ultra-fast transfer speeds.',
      price: 129.99,
      stock: 40,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
      isActive: true,
    },
    {
      name: 'Wireless Phone Charger',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
      price: 39.99,
      stock: 60,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
      isActive: true,
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Extra thick yoga mat with superior grip and eco-friendly materials.',
      price: 79.99,
      stock: 35,
      category: 'Fitness',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
      isActive: true,
    },
    {
      name: 'Smart Home Speaker',
      description: 'Voice-controlled smart speaker with premium sound quality and home automation.',
      price: 179.99,
      stock: 22,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
      isActive: true,
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
      price: 34.99,
      stock: 80,
      category: 'Lifestyle',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
      isActive: true,
    },
  ];

  console.log('🛍️ Creating products...');
  
  // Check if products already exist
  const existingProductsCount = await prisma.product.count();
  
  if (existingProductsCount === 0) {
    await prisma.product.createMany({
      data: products,
    });
    
    const createdProducts = await prisma.product.findMany();
    createdProducts.forEach(product => {
      console.log(`  ✅ Created product: ${product.name} - $${product.price}`);
    });
  } else {
    console.log(`  ℹ️  Products already exist (${existingProductsCount} found), skipping...`);
  }

  // Create sample orders
  console.log('📦 Creating sample orders...');
  
  const existingOrdersCount = await prisma.order.count();
  
  if (existingOrdersCount === 0) {
    // Create orders for the regular user
    const sampleOrders = [
      {
        userId: user.id,
        items: [
          { productId: 1, quantity: 1 }, // Wireless Bluetooth Headphones - $199.99
          { productId: 7, quantity: 2 }, // Wireless Phone Charger - $39.99 * 2 = $79.98
        ],
        total: 279.97,
        status: 'DELIVERED' as const,
        notes: 'Great products, fast delivery!',
        createdAt: new Date('2024-01-10T14:30:00Z'),
      },
      {
        userId: user.id,
        items: [
          { productId: 8, quantity: 1 }, // Yoga Mat Premium - $79.99
          { productId: 10, quantity: 1 }, // Stainless Steel Water Bottle - $34.99
        ],
        total: 114.98,
        status: 'SHIPPED' as const,
        notes: 'For my new fitness routine',
        createdAt: new Date('2024-01-12T09:15:00Z'),
      },
      {
        userId: user.id,
        items: [
          { productId: 2, quantity: 1 }, // Gaming Mechanical Keyboard - $149.99
          { productId: 6, quantity: 1 }, // Portable External SSD - $129.99
        ],
        total: 279.98,
        status: 'CONFIRMED' as const,
        notes: 'For my home office setup',
        createdAt: new Date('2024-01-14T16:45:00Z'),
      },
      {
        userId: user.id,
        items: [
          { productId: 4, quantity: 1 }, // Professional Coffee Maker - $249.99
        ],
        total: 249.99,
        status: 'PENDING' as const,
        notes: 'Birthday gift for my partner',
        createdAt: new Date('2024-01-15T11:20:00Z'),
      },
    ];

    for (const orderData of sampleOrders) {
      const { items, ...orderInfo } = orderData;
      
      const order = await prisma.order.create({
        data: {
          ...orderInfo,
          orderItems: {
            create: items.map(item => {
              // Get product price from our seeded products
              const product = products.find(p => p.name === getProductNameById(item.productId));
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product?.price || 0,
              };
            }),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
      
      console.log(`  ✅ Created order #${order.id} - $${order.total} (${order.status})`);
    }
  } else {
    console.log(`  ℹ️  Orders already exist (${existingOrdersCount} found), skipping...`);
  }

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log('  • Users created: 2 (1 admin, 1 regular user)');
  console.log('  • Products created:', products.length);
  console.log('  • Sample orders: 4 orders with various statuses');
  console.log('\n🔐 Test credentials:');
  console.log('  Admin: admin@quality-platform.com / admin123');
  console.log('  User: user@quality-platform.com / user123');
  
  function getProductNameById(id: number): string {
    const productNames = {
      1: 'Wireless Bluetooth Headphones',
      2: 'Gaming Mechanical Keyboard',
      3: 'Smart Fitness Watch',
      4: 'Professional Coffee Maker',
      5: 'Ergonomic Office Chair',
      6: 'Portable External SSD',
      7: 'Wireless Phone Charger',
      8: 'Yoga Mat Premium',
      9: 'Smart Home Speaker',
      10: 'Stainless Steel Water Bottle',
    };
    return productNames[id] || '';
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });