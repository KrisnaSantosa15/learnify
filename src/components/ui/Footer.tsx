"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#0a101c] pt-20 pb-8 overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-10" 
          style={{ 
            background: 'radial-gradient(circle at center, #ff5e7d 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        ></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full opacity-10" 
          style={{ 
            background: 'radial-gradient(circle at center, #28c7f9 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          {/* Logo & description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Learnify<span className="text-white">.</span>
              </span>
            </Link>
            <p className="mt-5 text-[#a8b1c2]">
              A modern educational platform where learning feels like gaming. Master programming skills with achievements, track progress, and compete with friends.
            </p>
            <div className="mt-6 flex space-x-5">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-[#151f38] text-[#a8b1c2] hover:text-white hover:bg-[#28c7f9]/20 hover:border-[#28c7f9]/50 flex items-center justify-center border border-white/5 transition-colors" 
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-[#151f38] text-[#a8b1c2] hover:text-white hover:bg-[#ff5e7d]/20 hover:border-[#ff5e7d]/50 flex items-center justify-center border border-white/5 transition-colors" 
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-[#151f38] text-[#a8b1c2] hover:text-white hover:bg-[#8e5ff5]/20 hover:border-[#8e5ff5]/50 flex items-center justify-center border border-white/5 transition-colors" 
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-[#151f38] text-[#a8b1c2] hover:text-white hover:bg-[#58c896]/20 hover:border-[#58c896]/50 flex items-center justify-center border border-white/5 transition-colors" 
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Link sections */}
          <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/features" className="text-[#a8b1c2] hover:text-[#28c7f9] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#28c7f9]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-[#a8b1c2] hover:text-[#28c7f9] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#28c7f9]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-[#a8b1c2] hover:text-[#28c7f9] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#28c7f9]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-[#a8b1c2] hover:text-[#28c7f9] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#28c7f9]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-[#a8b1c2] hover:text-[#28c7f9] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#28c7f9]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="text-[#a8b1c2] hover:text-[#ff5e7d] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#ff5e7d]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-[#a8b1c2] hover:text-[#ff5e7d] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#ff5e7d]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-[#a8b1c2] hover:text-[#ff5e7d] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#ff5e7d]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-[#a8b1c2] hover:text-[#ff5e7d] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#ff5e7d]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-[#a8b1c2] hover:text-[#ff5e7d] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#ff5e7d]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/resources" className="text-[#a8b1c2] hover:text-[#58c896] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#58c896]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-[#a8b1c2] hover:text-[#58c896] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#58c896]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-[#a8b1c2] hover:text-[#58c896] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#58c896]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-[#a8b1c2] hover:text-[#58c896] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#58c896]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-[#a8b1c2] hover:text-[#58c896] transition-colors flex items-center">
                    <svg className="h-1.5 w-1.5 mr-2 text-[#58c896]" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Newsletter subscription box */}
            <div className="bg-gradient-to-r from-[#151f38] to-[#131d33] p-6 rounded-xl border border-white/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="h-12 w-12 rounded-xl bg-[#8e5ff5]/20 flex items-center justify-center mr-4 flex-shrink-0 mb-4 sm:mb-0">
                  <svg className="h-6 w-6 text-[#8e5ff5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="w-full">
                  <h3 className="text-white font-bold text-lg mb-2">Stay in the loop</h3>
                  <p className="text-[#a8b1c2] mb-4">Get weekly updates on new courses, features, and programming tips.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-lg bg-[#0c1526] text-white border border-white/10 focus:outline-none focus:border-[#8e5ff5]/50 placeholder-[#6a7a95]"
                    />
                    <button className="px-6 py-3 bg-[#8e5ff5] rounded-lg text-white font-medium whitespace-nowrap transition-all duration-300 relative overflow-hidden group">
                      <span className="relative z-10">Subscribe</span>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#8e5ff5] to-[#5930e5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="absolute inset-0 w-full h-full group-hover:shadow-[0_0_15px_rgba(142,95,245,0.5)] transition-all duration-300"></span>
                    </button>
                  </div>
                  <p className="text-[#6a7a95] text-xs mt-3">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Features and copyright section */}
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-3 gap-4 mb-8 mx-auto md:mx-0">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-xl bg-[#28c7f9]/10 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-[#28c7f9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <p className="text-[#a8b1c2] text-sm font-medium text-center">Available Worldwide</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-xl bg-[#ff5e7d]/10 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-[#ff5e7d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-[#a8b1c2] text-sm font-medium text-center">Secure Payments</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-xl bg-[#58c896]/10 flex items-center justify-center mb-2">
                    <svg className="h-6 w-6 text-[#58c896]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-[#a8b1c2] text-sm font-medium text-center">24/7 Support</p>
                </div>
              </div>
              
              {/* Copyright and links */}
              <div className="text-[#6a7a95] text-sm text-center md:text-right">
                <p className="mb-3">© {new Date().getFullYear()} Learnify. All rights reserved.</p>
                <div className="flex justify-center md:justify-end gap-6">
                  <Link href="/privacy" className="hover:text-[#28c7f9] transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-[#28c7f9] transition-colors">Terms of Service</Link>
                  <Link href="/cookies" className="hover:text-[#28c7f9] transition-colors">Cookie Settings</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}