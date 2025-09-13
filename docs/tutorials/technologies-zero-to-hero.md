# Technologies Zero to Hero Tutorial

## 🌟 What is this Tutorial About?

Imagine you want to build a complete web application - like Amazon, Netflix, or Facebook. You'd need several different technologies working together, just like building a house requires different specialists: architects, electricians, plumbers, and contractors.

This tutorial teaches you all the technologies needed to build modern web applications from scratch. By the end, you'll be able to create professional websites and applications that millions of people can use.

## 🎯 What Will You Build?

Throughout this tutorial, you'll learn by building a **complete e-commerce platform** (like a mini-Amazon) that includes:

- **Users can register and login** (like creating accounts on any website)
- **Browse and search products** (like shopping on Amazon)
- **Add items to shopping cart** (like any online store)
- **Complete purchases** (checkout and payment processing)
- **Admin dashboard** (for managing products and orders)
- **Real-time updates** (see changes immediately without refreshing)

## 🧩 The Technology Stack Explained

Think of web development like building a restaurant:

### 🏠 **Frontend** (What Customers See)
- **React & Next.js**: Like the restaurant's dining room, menu, and decorations - everything customers interact with
- **Tailwind CSS**: Like interior design - makes everything look beautiful and professional
- **TypeScript**: Like having clear recipes - prevents mistakes and makes code more reliable

### 🍳 **Backend** (The Kitchen)
- **Node.js**: Like the kitchen itself - where all the food preparation happens
- **NestJS**: Like having an organized kitchen with proper stations - keeps everything structured and efficient
- **API**: Like the waiter - carries information between the dining room (frontend) and kitchen (backend)

### 📚 **Database** (The Pantry)
- **Prisma + SQLite/PostgreSQL**: Like the restaurant's pantry and inventory system - stores all information (users, products, orders)

### 🧪 **Testing** (Quality Control)
- **Jest, Playwright**: Like taste-testing food before serving - ensures everything works perfectly

### 🚀 **DevOps** (Restaurant Management)
- **Git, CI/CD**: Like management systems - keeps track of changes and ensures smooth operations

## 🎯 Learning Path Overview

```
Week 1-2: Understanding the Basics (What is a website? How does the internet work?)
    ↓
Week 3-6: JavaScript & TypeScript (The language that powers modern web)
    ↓
Week 7-12: Backend Development (Building the server and APIs)
    ↓
Week 13-22: Frontend Development (Building beautiful user interfaces)
    ↓
Week 23-28: Database & Testing (Storing data and ensuring quality)
    ↓
Week 29-40: Advanced Topics (Performance, Security, Deployment)
    ↓
Week 41-52: Capstone Project (Build your complete application)
```

## 💰 Career Opportunities

After mastering these technologies, you can work as:

- **Full-Stack Developer** ($60,000 - $150,000+ per year)
- **Frontend Developer** ($55,000 - $130,000+ per year)
- **Backend Developer** ($65,000 - $140,000+ per year)
- **DevOps Engineer** ($70,000 - $160,000+ per year)
- **Technical Lead** ($90,000 - $200,000+ per year)
- **Freelancer/Consultant** ($50-150+ per hour)

## 🏆 What Makes This Tutorial Special?

1. **Complete Beginner Friendly**: We explain everything, assuming you know nothing
2. **Real-World Project**: You build an actual application you can show employers
3. **Industry Standards**: We use the same tools and practices used by Google, Facebook, Netflix
4. **Hands-On Learning**: Every concept is followed by practical exercises
5. **Career Focused**: Designed to make you job-ready

---

## 📚 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Core Technologies](#core-technologies)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Database & ORM](#database--orm)
6. [Testing Framework](#testing-framework)
7. [DevOps & Tooling](#devops--tooling)
8. [Advanced Topics](#advanced-topics)
9. [Quality Engineering](#quality-engineering)
10. [Project-Based Learning](#project-based-learning)

---

## 🚀 Prerequisites - What You Need to Get Started

### 🤔 Do I Need Any Experience?

**Absolutely not!** This tutorial is designed for complete beginners. You just need:

- **Basic computer skills**: You can browse the internet, install programs, and use a mouse/keyboard
- **Curiosity and patience**: Programming requires thinking logically and solving problems step-by-step
- **Time commitment**: Expect 10-15 hours per week for 52 weeks to become proficient

### 💭 What is Programming?

Programming is like giving very detailed instructions to a computer. Imagine explaining to someone how to make a sandwich, but you have to be extremely specific:

1. "Take two slices of bread" (not just "get bread")
2. "Open the peanut butter jar by twisting counterclockwise"
3. "Take a knife and spread peanut butter on one slice"

That's essentially what programming is - writing very detailed instructions for computers.

### 🛠️ Essential Software to Install

Think of these as your "toolbox" for building websites:

#### **Node.js** - The Runtime Environment
**What it is**: Node.js lets you run JavaScript code on your computer (not just in web browsers)
**Why you need it**: It's like having an engine that powers your applications
**Real-world analogy**: Like having electricity in your house - everything else depends on it

```bash
# Download from: https://nodejs.org/
# Choose the "LTS" (Long Term Support) version

# After installation, verify it works:
node --version    # Should show something like: v20.10.0
npm --version     # Should show something like: 10.2.3
```

#### **pnpm** - Package Manager
**What it is**: A tool that automatically downloads and manages code libraries
**Why you need it**: Instead of writing everything from scratch, you can use code others have written
**Real-world analogy**: Like Amazon for programmers - you can "order" pre-built code components

```bash
# Install pnpm (faster and better than npm)
npm install -g pnpm

# Verify installation
pnpm --version
```

#### **Git** - Version Control System
**What it is**: Keeps track of all changes to your code over time
**Why you need it**: Like "Track Changes" in Microsoft Word, but much more powerful
**Real-world analogy**: Like a time machine for your code - you can see what changed and go back to any previous version

```bash
# Download from: https://git-scm.com/
# Follow the installation wizard (default settings are fine)

# Verify installation
git --version
```

#### **Visual Studio Code (VS Code)** - Code Editor
**What it is**: A specialized text editor designed for programming
**Why you need it**: Like Microsoft Word, but for code - with helpful features like syntax highlighting and error detection
**Real-world analogy**: Like a Swiss Army knife for programmers

```bash
# Download from: https://code.visualstudio.com/
# It's completely free and made by Microsoft
```

### 🌐 Understanding How the Internet Works (5-Minute Overview)

Before we start coding, let's understand what happens when you visit a website:

1. **You type a URL** (like www.amazon.com) in your browser
2. **Your browser asks the internet** "Where is Amazon?"
3. **The internet responds** with an IP address (like a postal address: 192.0.2.1)
4. **Your browser connects** to Amazon's servers
5. **Amazon's server sends back** the website code (HTML, CSS, JavaScript)
6. **Your browser displays** the website

**In our tutorial, you'll learn to build both sides:**
- **Frontend**: The part users see (like Amazon's product pages)
- **Backend**: The server that handles requests (like Amazon's inventory system)

### 💡 What Will Your First Program Do?

Your very first program will display "Hello, World!" on the screen. This might seem simple, but it proves:
- Your development environment is set up correctly
- You can write code that the computer understands
- You're ready to learn more complex concepts

This tradition dates back to 1972 and is the first program every programmer writes!

### 🎯 Setting Realistic Expectations

**What you'll feel:**
- **Weeks 1-4**: Confused and overwhelmed (this is normal!)
- **Weeks 5-12**: Starting to understand basic concepts
- **Weeks 13-24**: Building confidence, things start clicking
- **Weeks 25-40**: Feeling capable of building real applications
- **Weeks 41-52**: Confident enough to get a job or freelance

**Remember**: Every expert programmer started exactly where you are now. The only difference between them and you is time and practice.

---

## 💻 Core Technologies - The Foundation of Modern Web Development

### 🤔 Why Do We Need Programming Languages?

Computers only understand 1s and 0s (binary), but writing `01001000 01100101 01101100 01101100 01101111` to say "Hello" would be impossible for humans. Programming languages are like translators - they convert human-readable instructions into computer-understandable commands.

### 1. JavaScript & TypeScript - The Language of the Web

#### 🌟 **What is JavaScript?**

**JavaScript** is the programming language that makes websites interactive. Every time you:
- Click a button and something happens
- Fill out a form and see validation messages
- See animations or moving elements
- Get real-time updates without refreshing the page

That's JavaScript in action!

**Real-world examples:**
- **Facebook**: When you like a post, JavaScript updates the like count instantly
- **Google Maps**: When you zoom or drag the map, JavaScript handles all the smooth interactions
- **Netflix**: The video player, recommendations, and search are all powered by JavaScript

#### 🔧 **What is TypeScript?**

**TypeScript** is JavaScript with superpowers. It's like having a really good spell-checker and grammar assistant for your code.

**Why it matters:**
- **Prevents bugs**: Catches errors before your code runs (like spell-check catching typos)
- **Better code completion**: Your editor can suggest what to type next
- **Easier teamwork**: Makes code more readable and understandable for other programmers
- **Used by big companies**: Microsoft, Google, Airbnb, and Slack all use TypeScript

#### 🎓 **Beginner Level (Week 1-2) - Your First Steps**

**What you'll learn**: The basic building blocks of programming

**JavaScript Fundamentals - Think Like a Computer:**

Programming is about storing information and doing things with that information. Let's start with the basics:

```javascript
// 🗂️ VARIABLES - Think of these as labeled boxes where you store information

let name = "John";           // String (text) - like writing on a label
const age = 25;              // Number - for math calculations
let isActive = true;         // Boolean (true/false) - like a light switch
let items = [1, 2, 3];       // Array (list) - like a shopping list
let user = { name, age };    // Object - like a filing cabinet with labeled folders

// 🔍 WHY THIS MATTERS:
// - Websites need to remember user information (name, email, preferences)
// - E-commerce sites track products, prices, and inventory numbers
// - Social media stores posts, likes, and user profiles
```

```javascript
// 🏭 FUNCTIONS - Think of these as little factories that do specific jobs

function greetUser(name) {
    return `Hello, ${name}!`;
}

// What this does:
// 1. Takes a name as input (like raw material)
// 2. Processes it (adds "Hello" in front)
// 3. Returns the result (finished product)

// Real-world example: A function that calculates tax
function calculateTax(price, taxRate) {
    return price * (taxRate / 100);
}

let totalTax = calculateTax(100, 8.25); // $8.25 tax on $100 item
```

```javascript
// 🚀 MODERN JAVASCRIPT - Shorter, cleaner ways to write functions

// Old way (still works, but more typing)
function greetUser(name) {
    return `Hello, ${name}!`;
}

// New way (arrow functions - same result, less code)
const greetUser2 = (name) => `Hello, ${name}!`;

// 🌐 ASYNC/AWAIT - How websites talk to servers (like making phone calls)
async function fetchData() {
    try {
        // "Call" the server and wait for response
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        // If something goes wrong, handle the error gracefully
        console.error('Error:', error);
    }
}

// Real-world example: Getting weather data
async function getWeather(city) {
    try {
        const response = await fetch(`/api/weather/${city}`);
        const weatherData = await response.json();
        return `Weather in ${city}: ${weatherData.temperature}°F`;
    } catch (error) {
        return "Sorry, couldn't get weather data";
    }
}
```

**🎯 Your First Real Example - A Simple Calculator:**

```javascript
// Let's build something useful - a tip calculator for restaurants!

function calculateTip(billAmount, tipPercentage) {
    // Calculate tip amount
    const tipAmount = billAmount * (tipPercentage / 100);

    // Calculate total amount
    const totalAmount = billAmount + tipAmount;

    // Return results
    return {
        billAmount: billAmount,
        tipAmount: tipAmount,
        totalAmount: totalAmount
    };
}

// Usage examples:
const dinner = calculateTip(50.00, 18);  // 18% tip on $50 bill
console.log(`Bill: $${dinner.billAmount}`);
console.log(`Tip: $${dinner.tipAmount}`);
console.log(`Total: $${dinner.totalAmount}`);

// This would output:
// Bill: $50
// Tip: $9
// Total: $59
```

**Practice Exercises**:
```javascript
// Exercise 1: Create a user management system
class UserManager {
    constructor() {
        this.users = [];
    }

    addUser(name, email) {
        const user = {
            id: this.users.length + 1,
            name,
            email,
            createdAt: new Date()
        };
        this.users.push(user);
        return user;
    }

    findUser(id) {
        return this.users.find(user => user.id === id);
    }

    updateUser(id, updates) {
        const user = this.findUser(id);
        if (user) {
            Object.assign(user, updates);
            return user;
        }
        return null;
    }
}

// Usage
const userManager = new UserManager();
userManager.addUser("Alice", "alice@example.com");
console.log(userManager.findUser(1));
```

#### 🎯 **Intermediate Level (Week 3-4)**

**TypeScript Introduction**:
```typescript
// Type Definitions
interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
}

// Generics
interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

// Classes with TypeScript
class AuthService {
    private users: User[] = [];

    async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        const newUser: User = {
            id: this.users.length + 1,
            ...userData,
            createdAt: new Date()
        };

        this.users.push(newUser);
        return newUser;
    }

    async login(email: string, password: string): Promise<User | null> {
        // Implementation would include password verification
        return this.users.find(user => user.email === email) || null;
    }
}
```

**Practical Project**: Build a Todo App with TypeScript
```typescript
// types/todo.ts
export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    tags: string[];
}

// services/TodoService.ts
export class TodoService {
    private todos: Todo[] = [];

    create(todoData: Omit<Todo, 'id'>): Todo {
        const todo: Todo = {
            id: crypto.randomUUID(),
            ...todoData
        };
        this.todos.push(todo);
        return todo;
    }

    getAll(): Todo[] {
        return [...this.todos];
    }

    getByPriority(priority: Todo['priority']): Todo[] {
        return this.todos.filter(todo => todo.priority === priority);
    }

    update(id: string, updates: Partial<Todo>): Todo | null {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos[index] = { ...this.todos[index], ...updates };
            return this.todos[index];
        }
        return null;
    }

    delete(id: string): boolean {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
            return true;
        }
        return false;
    }
}
```

#### 🏆 **Advanced Level (Week 5-6)**

**Advanced TypeScript Concepts**:
```typescript
// Utility Types
type CreateUserRequest = Pick<User, 'name' | 'email' | 'role'>;
type UpdateUserRequest = Partial<Pick<User, 'name' | 'email'>>;
type UserResponse = Omit<User, 'password'>;

// Conditional Types
type ApiResult<T, E = Error> = T extends string
    ? { data: T; type: 'string' }
    : { data: T; type: 'object' };

// Mapped Types
type OptionalUser = {
    [K in keyof User]?: User[K];
};

// Template Literal Types
type EventType = 'user' | 'product' | 'order';
type EventAction = 'created' | 'updated' | 'deleted';
type EventName = `${EventType}_${EventAction}`; // 'user_created' | 'user_updated' | etc.

// Advanced Class Example
abstract class BaseRepository<T, K> {
    protected abstract items: T[];

    abstract create(item: Omit<T, keyof K>): T;
    abstract findById(id: K): T | null;
    abstract update(id: K, updates: Partial<T>): T | null;
    abstract delete(id: K): boolean;

    findAll(): T[] {
        return [...this.items];
    }

    count(): number {
        return this.items.length;
    }
}

class UserRepository extends BaseRepository<User, number> {
    protected items: User[] = [];

    create(userData: Omit<User, 'id' | 'createdAt'>): User {
        const user: User = {
            id: this.items.length + 1,
            ...userData,
            createdAt: new Date()
        };
        this.items.push(user);
        return user;
    }

    findById(id: number): User | null {
        return this.items.find(user => user.id === id) || null;
    }

    findByEmail(email: string): User | null {
        return this.items.find(user => user.email === email) || null;
    }

    update(id: number, updates: Partial<User>): User | null {
        const index = this.items.findIndex(user => user.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updates };
            return this.items[index];
        }
        return null;
    }

    delete(id: number): boolean {
        const index = this.items.findIndex(user => user.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}
```

---

## 🔧 Backend Development - Building the Server Side

### 🤔 What is Backend Development?

Imagine a restaurant. Customers (frontend) see the menu and dining room, but there's a whole kitchen (backend) working behind the scenes:

- **Taking orders** (receiving requests from users)
- **Preparing food** (processing data and business logic)
- **Managing inventory** (database operations)
- **Serving dishes** (sending responses back to users)

Backend development is building this "kitchen" that powers websites and apps.

### 🌐 What is a Server?

A **server** is simply a computer that:
1. **Listens** for requests from users (like "show me all products")
2. **Processes** those requests (like looking up products in the database)
3. **Responds** with the requested information (like sending back a list of products)

**Real-world examples:**
- When you search Google, their servers process your search and return results
- When you post on Instagram, their servers save your photo and share it with followers
- When you check your bank balance, the bank's servers verify your identity and show your account info

### 1. Node.js - Running JavaScript Outside the Browser

#### 🌟 **What is Node.js and Why Do We Need It?**

**The Problem**: Originally, JavaScript only worked in web browsers. You couldn't use it to build servers or desktop applications.

**The Solution**: Node.js lets you run JavaScript anywhere - on servers, your computer, even IoT devices!

**Why it's revolutionary:**
- **One language everywhere**: Instead of learning different languages for frontend and backend, you can use JavaScript for everything
- **Fast performance**: Built on Chrome's V8 engine (the same engine that makes Chrome browser fast)
- **Huge community**: Millions of developers and pre-built packages you can use
- **Used by giants**: Netflix, Uber, LinkedIn, PayPal all use Node.js

#### 🔧 **What is Express.js?**

If Node.js is like having a kitchen, **Express.js** is like having all the cooking tools and appliances organized perfectly.

**Express.js provides:**
- **Easy routing**: "If user requests '/products', do this"
- **Middleware**: Add features like security, logging, data parsing
- **Simple API creation**: Build REST APIs that mobile apps and websites can use
- **Template engines**: Generate dynamic HTML pages

### 2. Building Your First Server (Week 7-8)

#### **Step 1: Understanding HTTP Requests**

When you visit a website, your browser sends **HTTP requests**. Think of these as different types of restaurant orders:

- **GET**: "Show me the menu" (retrieve information)
- **POST**: "Place this order" (create something new)
- **PUT**: "Change my order" (update existing information)
- **DELETE**: "Cancel my order" (remove something)

#### **Basic Server Example - Your First Web Server:**
```javascript
// basic-server.js
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (path === '/api/health' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString()
        }));
    } else if (path === '/api/users' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            users: [
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ]
        }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

#### **Express.js Framework**:
```javascript
// express-server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/api/users', (req, res) => {
    res.json({ users });
});

app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    // Simple validation
    if (!name || !email) {
        return res.status(400).json({
            error: 'Name and email are required'
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);
    res.status(201).json({ user: newUser });
});

app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { name, email } = req.body;
    users[userIndex] = { ...users[userIndex], name, email };

    res.json({ user: users[userIndex] });
});

app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2. NestJS Framework (Week 9-12)

#### **NestJS Fundamentals**:
```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [UsersModule, ProductsModule],
})
export class AppModule {}

// users/users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return { users };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return { user };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { user };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    return { user };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
  }
}

// users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findOne(id: number): Promise<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = {
      id: this.nextId++,
      ...createUserDto,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  async remove(id: number): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
  }
}

// users/dto/create-user.dto.ts
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;
}

// users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

#### **Advanced NestJS Features**:
```typescript
// Authentication & Guards
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// Interceptors for logging
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    console.log(`${method} ${url} - Started`);

    return next.handle().pipe(
      tap(() => {
        console.log(`${method} ${url} - Completed in ${Date.now() - now}ms`);
      }),
    );
  }
}

// Exception Filters
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

---

## 🎨 Frontend Development - Building User Interfaces

### 🤔 What is Frontend Development?

Frontend development is like being an **interior designer and architect** for websites. You create everything users see and interact with:

- **Visual design**: Colors, fonts, layouts, images
- **User interactions**: Buttons, forms, animations, navigation
- **Responsive design**: Making sites work on phones, tablets, and desktops
- **User experience**: Making websites intuitive and enjoyable to use

**Real-world examples:**
- **Instagram**: The photo grid, story viewer, like button animations
- **Spotify**: The music player, playlists, search interface
- **Amazon**: Product listings, shopping cart, checkout forms

### 🌟 Why Modern Frontend is Complex

In the early days of the internet (1990s), websites were simple:
- Static HTML pages (like digital brochures)
- Basic styling with CSS
- Minimal interactivity

**Today's websites are like desktop applications:**
- Real-time updates (chat messages, notifications)
- Complex interactions (drag & drop, infinite scroll)
- Rich media (videos, animations, dynamic content)
- Works across all devices (responsive design)

This complexity requires powerful tools and frameworks.

### 1. React - Building Interactive User Interfaces

#### 🚀 **What is React and Why is it Revolutionary?**

**React** is a JavaScript library created by Facebook that completely changed how we build websites.

**The Problem with Traditional Websites:**
Imagine updating your Facebook feed manually:
1. Check for new posts every few seconds
2. Add new posts to the page
3. Update like counts
4. Manage user interactions
5. Keep everything synchronized

This becomes impossibly complex!

**React's Solution - Component-Based Architecture:**
Think of React components like **LEGO blocks**:
- Each component has a specific purpose (like a LEGO piece)
- You can combine components to build complex interfaces (like building with LEGO)
- Components can be reused in different parts of your application
- Components manage their own state (data and behavior)

**Why Major Companies Use React:**
- **Facebook**: Created React, uses it for Facebook.com and Instagram
- **Netflix**: Entire user interface built with React
- **Uber**: Both driver and rider apps use React
- **Airbnb**: Search, booking, and host interfaces
- **WhatsApp Web**: Real-time messaging interface

#### 🧱 **Understanding Components (Week 13-14)**

**What is a Component?**
A component is like a **custom HTML element** that you create. Instead of just using `<div>` and `<p>`, you create your own elements like `<UserCard>` or `<ShoppingCart>`.

**Basic Component Example:**
```jsx
// components/UserCard.jsx
import React, { useState } from 'react';

function UserCard({ user, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: user.name, email: user.email });

    const handleSave = () => {
        onEdit(user.id, editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ name: user.name, email: user.email });
        setIsEditing(false);
    };

    return (
        <div className="user-card">
            {isEditing ? (
                <div className="edit-form">
                    <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Name"
                    />
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        placeholder="Email"
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            ) : (
                <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <div className="actions">
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => onDelete(user.id)}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserCard;
```

#### **Advanced React with Hooks**:
```jsx
// hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (userData) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            const data = await response.json();
            setUsers(prev => [...prev, data.user]);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const updateUser = useCallback(async (id, updates) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            const data = await response.json();
            setUsers(prev => prev.map(user =>
                user.id === id ? data.user : user
            ));
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteUser = useCallback(async (id) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser,
        refetch: fetchUsers
    };
}

// components/UserManagement.jsx
import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserCard from './UserCard';
import UserForm from './UserForm';

function UserManagement() {
    const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
    const [showForm, setShowForm] = useState(false);

    const handleCreateUser = async (userData) => {
        try {
            await createUser(userData);
            setShowForm(false);
        } catch (err) {
            // Error is already handled in the hook
        }
    };

    if (loading) return <div className="loading">Loading users...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="user-management">
            <h1>User Management</h1>

            <div className="controls">
                <button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add User'}
                </button>
            </div>

            {showForm && (
                <UserForm
                    onSubmit={handleCreateUser}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div className="users-grid">
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    users.map(user => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={updateUser}
                            onDelete={deleteUser}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default UserManagement;
```

### 2. Next.js 15 (Week 17-20)

#### **Next.js App Router**:
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'User Management App',
  description: 'A modern user management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app">
          <nav className="nav">
            <h1>User Management</h1>
          </nav>
          <main className="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <h1>Welcome to User Management</h1>
      <div className="users-grid">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In-memory store (in real app, use database)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString() }
];

export async function GET() {
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required' },
      { status: 400 }
    );
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  return NextResponse.json({ user: newUser }, { status: 201 });
}

// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  users[userIndex] = { ...users[userIndex], ...body };

  return NextResponse.json({ user: users[userIndex] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  users.splice(userIndex, 1);

  return NextResponse.json({ message: 'User deleted successfully' });
}
```

### 3. Tailwind CSS (Week 21-22)

#### **Tailwind Fundamentals**:
```html
<!-- Basic Layout -->
<div class="min-h-screen bg-gray-100">
  <!-- Header -->
  <header class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <h1 class="text-2xl font-bold text-gray-900">My App</h1>
        <nav class="space-x-4">
          <a href="#" class="text-gray-600 hover:text-gray-900">Home</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">About</a>
          <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <img src="image.jpg" alt="Image" class="w-full h-48 object-cover">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Card Title</h2>
          <p class="text-gray-600 mb-4">Card description goes here...</p>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  </main>
</div>
```

#### **Advanced Tailwind - Custom Components**:
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Components */
@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply btn bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500;
  }

  .btn-secondary {
    @apply btn bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
  }

  .card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }

  .form-input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
           focus:outline-none focus:ring-blue-500 focus:border-blue-500;
  }

  .form-error {
    @apply text-sm text-red-600 mt-1;
  }
}

/* Custom animations */
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

```typescript
// components/Button.tsx
import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Size variants
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },

        // Color variants
        {
          'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
          'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'danger',
        },

        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

---

## 🗃️ Database & ORM - Storing and Managing Data

### 🤔 What is a Database?

Think of a database as a **super-organized digital filing cabinet** that can:
- Store millions of pieces of information
- Find any information instantly
- Keep everything organized and secure
- Handle thousands of people accessing it simultaneously

**Real-world examples:**
- **Facebook**: Stores billions of user profiles, posts, photos, and messages
- **Amazon**: Keeps track of millions of products, orders, customers, and inventory
- **Netflix**: Manages movie catalogs, user preferences, viewing history, and recommendations
- **Your Bank**: Stores account information, transactions, balances, and payment history

### 🏢 Why Do We Need Databases?

**The Problem Without Databases:**
Imagine Amazon trying to manage their business with Excel spreadsheets:
- **Product Catalog**: 100 million+ products in one giant spreadsheet
- **Customer Data**: 300 million+ customers in another spreadsheet
- **Orders**: Millions of daily orders in yet another spreadsheet
- **Performance**: Opening these files would crash your computer
- **Security**: Anyone with access could see everyone's personal information
- **Reliability**: One corrupted file could destroy the entire business

**The Database Solution:**
- **Speed**: Find any information in milliseconds
- **Security**: Control who can access what information
- **Reliability**: Built-in backups and error recovery
- **Scalability**: Handle millions of users simultaneously
- **Data Integrity**: Prevent corruption and maintain consistency

### 🔧 What is an ORM?

**ORM** stands for **Object-Relational Mapping**. Think of it as a **translator** between your programming language (JavaScript/TypeScript) and the database.

**Without ORM (the hard way):**
```sql
-- Raw SQL - complex and error-prone
SELECT users.name, users.email, COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.created_at > '2023-01-01'
GROUP BY users.id, users.name, users.email;
```

**With ORM (the easy way):**
```javascript
// Simple, readable code
const users = await prisma.user.findMany({
  where: { createdAt: { gt: new Date('2023-01-01') } },
  include: { _count: { select: { orders: true } } }
});
```

### 1. Prisma - Modern Database Toolkit

#### 🌟 **What is Prisma and Why Use It?**

**Prisma** is like having a **personal database assistant** that:
- **Speaks your language**: Write database queries in JavaScript/TypeScript
- **Prevents mistakes**: Catches errors before they happen
- **Auto-completes**: Your editor knows what data exists and suggests what to type
- **Manages changes**: Keeps track of database structure changes over time
- **Type-safe**: Ensures data types match between your code and database

**Why Companies Love Prisma:**
- **Developer productivity**: 3x faster development compared to raw SQL
- **Fewer bugs**: Type safety prevents 80% of common database errors
- **Easy maintenance**: Clear, readable code that's easy to modify
- **Great tools**: Database visualization, migration management, and more

#### 🏗️ **Database Design Fundamentals (Week 23-24)**

**Understanding Database Structure:**
Think of a database like organizing a library:

- **Tables** = Different sections (Fiction, Non-fiction, Reference)
- **Rows** = Individual books
- **Columns** = Book properties (Title, Author, ISBN, Publication Date)
- **Relationships** = Connections (Author writes many Books, Book belongs to one Author)

**E-commerce Database Example:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  profile   Profile?

  @@map("users")
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  avatar String?
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags      Tag[]

  @@map("posts")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]

  @@map("tags")
}

enum Role {
  USER
  ADMIN
}
```

#### **Prisma Client Usage**:
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// services/user.service.ts
import { prisma } from '../lib/prisma';
import { User, Prisma } from '@prisma/client';

export class UserService {
  // Create user
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
      include: {
        profile: true,
        posts: true,
      },
    });
  }

  // Find users with filtering, pagination, and sorting
  async findUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy, include } = params;

    return prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  // Find user by ID with relations
  async findUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Update user
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return prisma.user.update({
      data,
      where,
    });
  }

  // Delete user
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return prisma.user.delete({
      where,
    });
  }

  // Advanced queries with aggregation
  async getUserStats() {
    return prisma.user.aggregate({
      _count: {
        id: true,
      },
      _max: {
        createdAt: true,
      },
      _min: {
        createdAt: true,
      },
    });
  }

  // Complex queries with raw SQL (when needed)
  async getUsersWithPostCount(): Promise<any[]> {
    return prisma.$queryRaw`
      SELECT
        u.id,
        u.name,
        u.email,
        COUNT(p.id) as postCount
      FROM users u
      LEFT JOIN posts p ON u.id = p.authorId
      GROUP BY u.id, u.name, u.email
      ORDER BY postCount DESC
    `;
  }

  // Transaction example
  async createUserWithProfile(userData: {
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
  }): Promise<User> {
    const { name, email, bio, avatar } = userData;

    return prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
        },
      });

      // Create profile
      await tx.profile.create({
        data: {
          userId: user.id,
          bio,
          avatar,
        },
      });

      // Return user with profile
      return tx.user.findUnique({
        where: { id: user.id },
        include: { profile: true },
      });
    });
  }

  // Bulk operations
  async createManyUsers(users: Prisma.UserCreateManyInput[]): Promise<number> {
    const result = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });
    return result.count;
  }

  // Search functionality
  async searchUsers(query: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            posts: {
              some: {
                title: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
      include: {
        posts: {
          where: {
            published: true,
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
      },
    });
  }
}
```

---

## 🧪 Testing Framework - Ensuring Your Code Works Perfectly

### 🤔 What is Software Testing?

Imagine you're building a car. Would you sell it without testing if:
- The brakes work?
- The engine starts?
- The headlights turn on?
- The doors open and close?

**Software testing** is the same concept - making sure your application works correctly before users use it.

### 🚨 Why Testing is Critical

**Real-world disasters caused by untested code:**
- **Knight Capital (2012)**: Untested trading software caused $440 million loss in 45 minutes
- **Healthcare.gov (2013)**: Poor testing led to website crashes affecting millions of Americans
- **Therac-25 (1980s)**: Medical software bugs caused radiation overdoses, resulting in deaths
- **Amazon Prime Day (2018)**: Website crashes during biggest sale day due to insufficient testing

**Benefits of good testing:**
- **Prevents bugs**: Catch problems before users experience them
- **Saves money**: Fixing bugs early costs 100x less than fixing them in production
- **Builds confidence**: You can make changes knowing you won't break existing features
- **Better sleep**: No more 3 AM emergency fixes!

### 🏗️ The Testing Pyramid

Think of testing like quality control in a factory with three levels:

```
     🔺 E2E Tests (10%)     ← Test complete user journeys
    🔺🔺 Integration (20%)   ← Test how parts work together
   🔺🔺🔺 Unit Tests (70%)   ← Test individual components
```

#### **1. Unit Tests (70%) - Testing Individual Functions**
Like testing individual car parts:
- Does the brake pedal respond when pressed?
- Does the horn make sound when pressed?
- Does the speedometer show the correct speed?

#### **2. Integration Tests (20%) - Testing How Parts Work Together**
Like testing car systems:
- When you press the brake pedal, do the brake lights turn on?
- When you turn the steering wheel, do the wheels turn?
- When you shift gears, does the transmission respond?

#### **3. End-to-End (E2E) Tests (10%) - Testing Complete User Journeys**
Like test driving the entire car:
- Can you start the car, drive to the store, park, and return home?
- Does everything work together as a complete system?

### 🔬 Types of Testing in Web Development

#### **Functional Testing** - "Does it work as expected?"
```javascript
// Example: Testing a login function
test('user can login with correct credentials', () => {
  const result = login('user@example.com', 'password123');
  expect(result.success).toBe(true);
  expect(result.user.email).toBe('user@example.com');
});
```

#### **Performance Testing** - "Is it fast enough?"
```javascript
// Example: Testing if a function completes quickly
test('search results return in less than 100ms', async () => {
  const startTime = Date.now();
  await searchProducts('laptop');
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(100);
});
```

#### **Security Testing** - "Is it safe from attacks?"
```javascript
// Example: Testing SQL injection protection
test('login rejects malicious input', () => {
  const maliciousInput = "'; DROP TABLE users; --";
  const result = login(maliciousInput, 'password');
  expect(result.success).toBe(false);
  expect(result.error).toBe('Invalid credentials');
});
```

### 1. Jest - JavaScript Testing Framework

#### 🌟 **What is Jest?**

**Jest** is like having a **quality control inspector** for your code. It:
- **Runs your tests** automatically
- **Reports results** in an easy-to-read format
- **Tracks coverage** - shows which parts of your code are tested
- **Mocks dependencies** - simulates external services during testing
- **Provides debugging tools** - helps you figure out why tests fail

**Why Jest is Popular:**
- **Created by Facebook**: Used to test Facebook, Instagram, and WhatsApp
- **Zero configuration**: Works out of the box with minimal setup
- **Fast execution**: Runs tests in parallel for speed
- **Great developer experience**: Clear error messages and helpful output

#### 🧪 **Your First Unit Test (Week 25-26)**

Let's test a simple shopping cart function:

```javascript
// 📁 src/cart.js - The code we want to test
function calculateTotal(items) {
  if (!items || items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

function addItem(cart, item) {
  return [...cart, item];
}

function removeItem(cart, itemId) {
  return cart.filter(item => item.id !== itemId);
}

module.exports = { calculateTotal, addItem, removeItem };
```

```javascript
// 📁 tests/cart.test.js - Our tests
const { calculateTotal, addItem, removeItem } = require('../src/cart');

describe('Shopping Cart Functions', () => {
  // Test the happy path (normal usage)
  test('calculates total for items correctly', () => {
    // Arrange - Set up test data
    const items = [
      { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
      { id: 2, name: 'Mouse', price: 29.99, quantity: 2 }
    ];

    // Act - Run the function
    const total = calculateTotal(items);

    // Assert - Check the result
    expect(total).toBe(1059.97); // 999.99 + (29.99 * 2)
  });

  // Test edge cases (unusual situations)
  test('returns 0 for empty cart', () => {
    expect(calculateTotal([])).toBe(0);
    expect(calculateTotal(null)).toBe(0);
    expect(calculateTotal(undefined)).toBe(0);
  });

  test('adds item to cart', () => {
    const existingCart = [
      { id: 1, name: 'Laptop', price: 999.99, quantity: 1 }
    ];

    const newItem = { id: 2, name: 'Mouse', price: 29.99, quantity: 1 };
    const updatedCart = addItem(existingCart, newItem);

    expect(updatedCart).toHaveLength(2);
    expect(updatedCart[1]).toEqual(newItem);
    // Original cart should not be modified
    expect(existingCart).toHaveLength(1);
  });

  test('removes item from cart', () => {
    const cart = [
      { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
      { id: 2, name: 'Mouse', price: 29.99, quantity: 1 }
    ];

    const updatedCart = removeItem(cart, 2);

    expect(updatedCart).toHaveLength(1);
    expect(updatedCart[0].id).toBe(1);
  });
});
```

**Running the Tests:**
```bash
# Run all tests
npm test

# Output you'll see:
# ✓ calculates total for items correctly (5ms)
# ✓ returns 0 for empty cart (1ms)
# ✓ adds item to cart (2ms)
# ✓ removes item from cart (1ms)
#
# Tests: 4 passed, 4 total
# Time: 0.5s
```

#### 🎯 **What Good Tests Look Like**

**The AAA Pattern:**
- **Arrange**: Set up test data and conditions
- **Act**: Execute the function you're testing
- **Assert**: Check that the result is what you expected

**Good Test Characteristics:**
1. **Clear naming**: Test names explain what they're testing
2. **One thing per test**: Each test focuses on one specific behavior
3. **Independent**: Tests don't depend on each other
4. **Fast**: Tests run quickly so developers run them often
5. **Reliable**: Tests pass consistently - no random failures
```typescript
// __tests__/user.service.test.ts
import { UserService } from '../services/user.service';
import { prismaMock } from '../lib/prisma.mock';

// Mock Prisma Client
jest.mock('../lib/prisma', () => ({
  prisma: prismaMock,
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const expectedUser = {
        id: 1,
        ...userData,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: null,
        posts: [],
      };

      prismaMock.user.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: userData,
        include: {
          profile: true,
          posts: true,
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'existing@example.com',
      };

      prismaMock.user.create.mockRejectedValue(
        new Error('Unique constraint failed on the fields: (`email`)')
      );

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow();
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 1;
      const expectedUser = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: { id: 1, bio: 'Developer', avatar: null, userId },
        posts: [],
      };

      prismaMock.user.findUnique.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.findUserById(userId);

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          profile: true,
          posts: {
            where: { published: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 999;
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await userService.findUserById(userId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('searchUsers', () => {
    it('should search users by name and email', async () => {
      // Arrange
      const query = 'john';
      const expectedUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          posts: [],
        },
        {
          id: 2,
          name: 'Johnny Smith',
          email: 'johnny@example.com',
          posts: [],
        },
      ];

      prismaMock.user.findMany.mockResolvedValue(expectedUsers);

      // Act
      const result = await userService.searchUsers(query);

      // Assert
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              name: { contains: query, mode: 'insensitive' },
            },
            {
              email: { contains: query, mode: 'insensitive' },
            },
            {
              posts: {
                some: {
                  title: { contains: query, mode: 'insensitive' },
                },
              },
            },
          ],
        },
        include: {
          posts: {
            where: {
              published: true,
              title: { contains: query, mode: 'insensitive' },
            },
          },
        },
      });
      expect(result).toEqual(expectedUsers);
    });
  });
});

// Test utilities
// __tests__/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### 2. Playwright E2E Testing (Week 27-28)

#### **End-to-End Test Examples**:
```typescript
// tests/e2e/user-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to the application
    await page.goto('/');

    // Mock API responses for consistent testing
    await page.route('/api/users', async (route) => {
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString() }
      ];
      await route.fulfill({ json: { users } });
    });
  });

  test('should display list of users', async ({ page }) => {
    // Wait for users to load
    await expect(page.locator('[data-testid="user-card"]')).toHaveCount(2);

    // Verify user names are displayed
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).toBeVisible();
  });

  test('should create a new user', async ({ page }) => {
    // Mock the POST request
    await page.route('/api/users', async (route) => {
      if (route.request().method() === 'POST') {
        const requestData = await route.request().postDataJSON();
        const newUser = {
          id: 3,
          ...requestData,
          createdAt: new Date().toISOString()
        };
        await route.fulfill({
          status: 201,
          json: { user: newUser }
        });
      }
    });

    // Click add user button
    await page.click('text=Add User');

    // Fill form
    await page.fill('[data-testid="name-input"]', 'New User');
    await page.fill('[data-testid="email-input"]', 'newuser@example.com');

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Verify success message or user appears in list
    await expect(page.locator('text=User created successfully')).toBeVisible();
  });

  test('should edit an existing user', async ({ page }) => {
    // Mock the PUT request
    await page.route('/api/users/1', async (route) => {
      if (route.request().method() === 'PUT') {
        const requestData = await route.request().postDataJSON();
        const updatedUser = {
          id: 1,
          name: requestData.name || 'John Doe',
          email: requestData.email || 'john@example.com',
          createdAt: new Date().toISOString()
        };
        await route.fulfill({ json: { user: updatedUser } });
      }
    });

    // Click edit button for first user
    await page.click('[data-testid="user-1"] [data-testid="edit-button"]');

    // Modify name
    await page.fill('[data-testid="name-input"]', 'John Updated');

    // Save changes
    await page.click('[data-testid="save-button"]');

    // Verify changes
    await expect(page.locator('text=John Updated')).toBeVisible();
  });

  test('should delete a user', async ({ page }) => {
    // Mock the DELETE request
    await page.route('/api/users/1', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          json: { message: 'User deleted successfully' }
        });
      }
    });

    // Click delete button
    await page.click('[data-testid="user-1"] [data-testid="delete-button"]');

    // Confirm deletion
    await page.click('text=Confirm Delete');

    // Verify user is removed
    await expect(page.locator('[data-testid="user-1"]')).not.toBeVisible();
  });

  test('should handle form validation', async ({ page }) => {
    // Click add user button
    await page.click('text=Add User');

    // Try to submit empty form
    await page.click('[data-testid="submit-button"]');

    // Check validation messages
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();

    // Fill invalid email
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="submit-button"]');

    // Check email validation
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify layout adapts to mobile
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Test mobile-specific interactions
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('/api/users', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({ json: { users: [] } });
    });

    // Reload page to trigger loading
    await page.reload();

    // Check loading indicator appears
    await expect(page.locator('text=Loading users...')).toBeVisible();

    // Wait for loading to complete
    await expect(page.locator('text=Loading users...')).not.toBeVisible({ timeout: 5000 });
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('/api/users', async (route) => {
      await route.fulfill({
        status: 500,
        json: { error: 'Internal Server Error' }
      });
    });

    await page.reload();

    // Verify error message is displayed
    await expect(page.locator('text=Failed to load users')).toBeVisible();

    // Verify retry button works
    await page.click('text=Retry');
  });
});

// Visual regression testing
test.describe('Visual Tests', () => {
  test('should match homepage screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('should match user form screenshot', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Add User');

    // Fill form for consistent state
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');

    await expect(page).toHaveScreenshot('user-form.png');
  });
});
```

---

## 🛠️ DevOps & Tooling

### 1. Package Managers & Build Tools (Week 29-30)

#### **pnpm & Nx Workspace**:
```json
// package.json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "nx serve web",
    "build": "nx build web",
    "test": "nx test web",
    "lint": "nx lint web",
    "e2e": "nx e2e web-e2e"
  },
  "devDependencies": {
    "@nx/eslint-plugin": "^17.0.0",
    "@nx/jest": "^17.0.0",
    "@nx/js": "^17.0.0",
    "@nx/next": "^17.0.0",
    "@nx/playwright": "^17.0.0",
    "@nx/workspace": "^17.0.0"
  }
}

// nx.json
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json"
    ],
    "sharedGlobals": []
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "test": {
      "inputs": ["default", "^production"],
      "cache": true
    },
    "lint": {
      "inputs": ["default"],
      "cache": true
    }
  }
}
```

#### **ESLint & Prettier Configuration**:
```json
// .eslintrc.json
{
  "root": true,
  "ignorePatterns": ["**/*"],
  "plugins": ["@nx"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "extends": [
        "@nx/eslint-plugin",
        "next/core-web-vitals"
      ],
      "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "prefer-const": "error",
        "no-var": "error"
      }
    },
    {
      "files": ["*.ts", "*.tsx"],
      "extends": ["@nx/typescript"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ]
}

// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 2. Version Control with Git (Week 31-32)

#### **Git Workflow Best Practices**:
```bash
# Basic Git workflow
git status
git add .
git commit -m "feat: add user management functionality"
git push origin feature/user-management

# Feature branch workflow
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature

# Create pull request, then after review:
git checkout main
git pull origin main
git branch -d feature/new-feature

# Conventional Commits
git commit -m "feat: add shopping cart functionality"
git commit -m "fix: resolve login validation issue"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for user service"
git commit -m "refactor: optimize database queries"
```

#### **Git Hooks & Automation**:
```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

```bash
#!/bin/sh
# .husky/pre-commit
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run lint-staged
npx lint-staged

# Run tests
npm run test

# Check TypeScript
npm run type-check

echo "✅ All checks passed!"
```

---

## 🚀 Advanced Topics

### 1. Authentication & Security (Week 33-34)

#### **JWT Authentication Implementation**:
```typescript
// services/auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

const authService = new AuthService();

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = authService.extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const payload = authService.verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = payload;
  next();
}

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: `${role} role required` });
    }

    next();
  };
}

// Usage in routes
app.get('/api/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const user = await userService.findUserById(req.user!.userId);
  res.json({ user });
});

app.delete('/api/admin/users/:id',
  authenticateToken,
  requireRole('ADMIN'),
  async (req, res) => {
    await userService.deleteUser(parseInt(req.params.id));
    res.json({ message: 'User deleted' });
  }
);
```

#### **Input Validation & Sanitization**:
```typescript
// validation/schemas.ts
import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    })
});

// middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import DOMPurify from 'isomorphic-dompurify';

export function validateSchema(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        error: 'Validation failed',
        messages: errorMessages
      });
    }

    next();
  };
}

export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj);
    }

    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }

    return obj;
  }

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
}
```

### 2. Performance Optimization (Week 35-36)

#### **Database Optimization**:
```typescript
// services/optimized-user.service.ts
import { prisma } from '../lib/prisma';

export class OptimizedUserService {
  // Efficient pagination with cursor-based pagination
  async findUsersWithCursor(params: {
    take: number;
    cursor?: number;
    search?: string;
  }) {
    const { take, cursor, search } = params;

    const users = await prisma.user.findMany({
      take: take + 1, // Take one extra to check if there are more
      cursor: cursor ? { id: cursor } : undefined,
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    const hasNextPage = users.length > take;
    if (hasNextPage) users.pop(); // Remove the extra item

    return {
      users,
      hasNextPage,
      nextCursor: hasNextPage ? users[users.length - 1].id : null,
    };
  }

  // Batch operations to reduce database calls
  async getUsersWithPostsAndProfiles(userIds: number[]) {
    const [users, posts, profiles] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: userIds } },
      }),
      prisma.post.findMany({
        where: { authorId: { in: userIds } },
        select: {
          id: true,
          title: true,
          authorId: true,
          createdAt: true,
        },
      }),
      prisma.profile.findMany({
        where: { userId: { in: userIds } },
      }),
    ]);

    // Combine data efficiently
    return users.map(user => ({
      ...user,
      posts: posts.filter(post => post.authorId === user.id),
      profile: profiles.find(profile => profile.userId === user.id) || null,
    }));
  }

  // Database connection pooling and caching
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getCachedUserStats(): Promise<any> {
    const cacheKey = 'user-stats';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const stats = await prisma.user.aggregate({
      _count: { id: true },
      _max: { createdAt: true },
      _min: { createdAt: true },
    });

    this.cache.set(cacheKey, {
      data: stats,
      timestamp: Date.now(),
    });

    return stats;
  }
}
```

#### **Frontend Performance**:
```typescript
// hooks/useVirtualization.ts
import { useMemo, useState, useEffect } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization<T>(
  items: T[],
  options: VirtualizationOptions
) {
  const { itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );

    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex,
      items: items.slice(
        Math.max(0, startIndex - overscan),
        endIndex
      ),
    };
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  const totalHeight = items.length * itemHeight;

  return {
    ...visibleItems,
    totalHeight,
    setScrollTop,
  };
}

// components/VirtualizedList.tsx
import React from 'react';
import { useVirtualization } from '../hooks/useVirtualization';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
}: VirtualizedListProps<T>) {
  const { startIndex, items: visibleItems, totalHeight, setScrollTop } =
    useVirtualization(items, { itemHeight, containerHeight });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🎓 Quality Engineering

### 1. Test-Driven Development (Week 37-38)

#### **TDD Cycle Example**:
```typescript
// Step 1: Write failing test
describe('CartService', () => {
  it('should calculate total price correctly', () => {
    const cartService = new CartService();
    const items = [
      { id: 1, price: 10.99, quantity: 2 },
      { id: 2, price: 5.50, quantity: 1 },
    ];

    const total = cartService.calculateTotal(items);

    expect(total).toBe(27.48);
  });
});

// Step 2: Write minimal code to make test pass
export class CartService {
  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}

// Step 3: Refactor (if needed)
export class CartService {
  calculateTotal(items: CartItem[]): number {
    return Number(
      items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0).toFixed(2)
    );
  }

  calculateItemSubtotal(item: CartItem): number {
    return Number((item.price * item.quantity).toFixed(2));
  }

  getTotalItems(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}

// Add more tests
describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  describe('calculateTotal', () => {
    it('should return 0 for empty cart', () => {
      expect(cartService.calculateTotal([])).toBe(0);
    });

    it('should calculate total for single item', () => {
      const items = [{ id: 1, price: 15.99, quantity: 1 }];
      expect(cartService.calculateTotal(items)).toBe(15.99);
    });

    it('should handle decimal precision correctly', () => {
      const items = [{ id: 1, price: 0.1, quantity: 3 }];
      expect(cartService.calculateTotal(items)).toBe(0.3);
    });
  });

  describe('calculateItemSubtotal', () => {
    it('should calculate subtotal for an item', () => {
      const item = { id: 1, price: 10.99, quantity: 3 };
      expect(cartService.calculateItemSubtotal(item)).toBe(32.97);
    });
  });

  describe('getTotalItems', () => {
    it('should count total items in cart', () => {
      const items = [
        { id: 1, price: 10, quantity: 2 },
        { id: 2, price: 5, quantity: 3 },
      ];
      expect(cartService.getTotalItems(items)).toBe(5);
    });
  });
});
```

### 2. Continuous Integration (Week 39-40)

#### **GitHub Actions Workflow**:
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  DATABASE_URL: 'file:./test.db'
  JWT_SECRET: 'test-secret'

jobs:
  test:
    name: Test & Quality Checks
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run database migrations
        run: npx prisma migrate dev

      - name: Lint code
        run: pnpm nx run-many --target=lint --all

      - name: Type check
        run: pnpm nx run-many --target=type-check --all

      - name: Run unit tests
        run: pnpm nx run-many --target=test --all --coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true

      - name: Build applications
        run: pnpm nx run-many --target=build --all

      - name: Run E2E tests
        run: pnpm nx run-many --target=e2e --all

      - name: Security audit
        run: pnpm audit --audit-level moderate

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/develop'

    steps:
      - name: Deploy to staging
        run: echo "Deploy to staging environment"

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to production
        run: echo "Deploy to production environment"
```

---

## 📈 Project-Based Learning

### Capstone Project: Full-Stack E-commerce Platform

#### **Project Requirements**:
1. **User Authentication System**
2. **Product Management**
3. **Shopping Cart & Checkout**
4. **Order Management**
5. **Admin Dashboard**
6. **Real-time Features**
7. **Comprehensive Testing**
8. **Performance Optimization**

#### **Week-by-Week Implementation Plan**:

**Weeks 41-42: Project Setup & Authentication**
- Set up Nx monorepo
- Implement JWT authentication
- Create user registration/login
- Add role-based access control

**Weeks 43-44: Product Management**
- Design product schema
- Create product CRUD APIs
- Implement product search & filtering
- Add image upload functionality

**Weeks 45-46: Shopping Cart & Checkout**
- Build shopping cart system
- Implement checkout process
- Add payment integration (mock)
- Create order confirmation

**Weeks 47-48: Frontend Development**
- Build responsive UI with Next.js
- Implement state management
- Add real-time updates
- Create admin dashboard

**Weeks 49-50: Testing & Quality Assurance**
- Write comprehensive test suite
- Implement E2E testing
- Add performance monitoring
- Conduct security audit

**Weeks 51-52: Deployment & Final Polish**
- Set up CI/CD pipeline
- Deploy to staging/production
- Performance optimization
- Final documentation

---

## 🎯 Learning Path Summary

### Beginner (Weeks 1-12)
- JavaScript fundamentals
- TypeScript basics
- Node.js & Express
- Basic React concepts

### Intermediate (Weeks 13-24)
- Advanced React & Next.js
- NestJS framework
- Database design with Prisma
- Testing fundamentals

### Advanced (Weeks 25-40)
- Complex testing strategies
- Performance optimization
- Security implementation
- DevOps & CI/CD

### Expert (Weeks 41-52)
- Full project implementation
- Advanced patterns & practices
- Quality engineering
- Production deployment

---

## 📚 Additional Resources

### Books
- "Clean Code" by Robert C. Martin
- "JavaScript: The Good Parts" by Douglas Crockford
- "You Don't Know JS" series by Kyle Simpson
- "Testing JavaScript Applications" by Lucas da Costa

### Online Courses
- TypeScript Handbook (official docs)
- Next.js Learn (official tutorial)
- NestJS Documentation
- Prisma Documentation

### Practice Platforms
- LeetCode for algorithms
- TypeScript Playground
- Codepen for frontend experiments
- GitHub for project hosting

### Communities
- Stack Overflow
- Reddit r/webdev
- Discord communities
- Local meetups

---

## 🎉 Congratulations!

You've completed the Technologies Zero to Hero tutorial! You now have:

✅ **Solid foundation** in JavaScript & TypeScript
✅ **Backend expertise** with Node.js, Express, and NestJS
✅ **Frontend mastery** with React, Next.js, and Tailwind CSS
✅ **Database skills** with Prisma ORM
✅ **Testing knowledge** across all levels
✅ **DevOps understanding** for deployment
✅ **Quality engineering** practices
✅ **Real-world project experience**

### Next Steps:
1. **Build more projects** to reinforce learning
2. **Contribute to open source** projects
3. **Stay updated** with technology trends
4. **Join developer communities**
5. **Share your knowledge** with others

**Remember**: Learning is a continuous journey. Keep practicing, stay curious, and never stop building amazing things! 🚀