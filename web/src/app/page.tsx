import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-700 border border-blue-200/50 backdrop-blur-sm shadow-lg">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quality Engineering Excellence
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
              <span className="block text-slate-900">Welcome to</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-pulse">
                Quality Platform
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 max-w-4xl mx-auto text-xl sm:text-2xl text-slate-600 leading-relaxed font-light">
              Experience a complete e-commerce platform built with modern engineering practices, 
              comprehensive testing, and quality-first development approach.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                href="/products" 
                className="group relative inline-flex items-center px-10 py-5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:shadow-blue-500/25 hover:scale-105 hover:-translate-y-1"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <svg className="w-6 h-6 mr-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 13h6m-3-3v6" />
                </svg>
                <span className="relative z-10">Browse Products</span>
              </Link>
              <Link 
                href="/register" 
                className="group relative inline-flex items-center px-10 py-5 overflow-hidden rounded-2xl bg-white text-lg font-bold text-slate-700 shadow-2xl border-2 border-slate-200 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 hover:border-blue-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <svg className="w-6 h-6 mr-3 relative z-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="relative z-10">Get Started</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex justify-center items-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Production Ready</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Fully Tested</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover the comprehensive tools and capabilities that make our platform perfect for modern e-commerce
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Product Catalog Card */}
            <div className="group relative">
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    Product Catalog
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Browse our collection of sample products with advanced filtering, search capabilities, and intuitive navigation
                  </p>
                </div>
              </div>
            </div>

            {/* Shopping Cart Card */}
            <div className="group relative">
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-200">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                    Shopping Cart
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Full shopping cart functionality with persistent sessions, real-time updates, and support for both guest and authenticated users
                  </p>
                </div>
              </div>
            </div>

            {/* Order Management Card */}
            <div className="group relative">
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-purple-200">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/5 to-pink-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">
                    Order Management
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Complete order processing system with status tracking, inventory management, and comprehensive admin dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* API Documentation Section */}
          <div className="mt-24 text-center">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl shadow-xl">
              <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white font-semibold mr-2">API Documentation:</span>
              <a
                href="http://localhost:3001/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4"
              >
                Interactive Swagger Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}