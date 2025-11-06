import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }) => (
  <div className="rounded-2xl border border-gray-300 bg-gray-50/50 backdrop-blur-sm transition-colors focus-within:border-blue-400/70 focus-within:bg-blue-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }) => (
  <div className={`animate-pulse ${delay} flex items-start gap-3 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-gray-600">{testimonial.handle}</p>
      <p className="mt-1 text-gray-800">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage = ({
  title = <span className="font-light text-white tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
  userType = "student" // "student" or "admin"
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen flex flex-col md:flex-row w-full bg-black">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md min-h-[600px] flex flex-col justify-center">
          <div className="flex flex-col gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <img src="/REC.png" alt="REC Logo" className="h-20 w-auto" />
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-white">{userType === 'admin' ? 'Admin Portal Login' : 'Student Portal Login'}</h1>
                <p className="text-gray-400 mt-2">Enter your credentials</p>
              </div>

              <form className="space-y-5" onSubmit={onSignIn}>
                <div>
                  <label className="text-sm font-bold text-gray-300">
                    {userType === 'admin' ? 'Username' : 'Email Address'}
                  </label>
                  <input 
                    name={userType === 'admin' ? 'username' : 'email'} 
                    type={userType === 'admin' ? 'text' : 'email'} 
                    placeholder={userType === 'admin' ? 'Enter your username' : 'Enter your email address'} 
                    className="w-full bg-transparent border border-white/20 text-sm p-4 rounded-2xl focus:outline-none focus:border-purple-400/70 text-white placeholder-gray-400" 
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-300">Password</label>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Enter your password" 
                      className="w-full bg-transparent border border-white/20 text-sm p-4 pr-12 rounded-2xl focus:outline-none focus:border-purple-400/70 text-white placeholder-gray-400" 
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? 
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-white transition-colors" /> : 
                        <Eye className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                      }
                    </button>
                  </div>
                </div>

                <div className="flex justify-end text-sm">
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} 
                    className="hover:underline text-purple-400 transition-colors"
                  >
                    Reset password
                  </a>
                </div>

                <button 
                  type="submit" 
                  className="w-full rounded-2xl bg-purple-600 py-4 font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  Sign In
                </button>
              </form>



              <div className="text-center text-sm text-gray-400 space-y-2 min-h-[60px] flex flex-col justify-center">
                {userType === 'student' ? (
                  <>
                    <p>New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-purple-400 hover:underline transition-colors">Register</a></p>
                    <p><a href="/admin/login" className="text-purple-400 hover:underline transition-colors">Admin Login</a></p>
                  </>
                ) : (
                  <p><a href="/student/login" className="text-purple-400 hover:underline transition-colors">Student Login</a></p>
                )}
              </div>
            </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4">
          <div className="absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
          {testimonials.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="delay-1000" />
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="delay-1200" /></div>}
              {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} delay="delay-1400" /></div>}
            </div>
          )}
        </section>
      )}
    </div>
  );
};