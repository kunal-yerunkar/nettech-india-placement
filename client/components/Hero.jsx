import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950 min-h-screen flex items-center pt-16 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center relative z-10">

        <div className="md:w-1/2 text-center md:text-left py-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 animate-fade-in-up">
            Bridging the Gap Between <span className="text-blue-700 dark:text-blue-400">Education</span> and <span className="text-blue-700 dark:text-blue-400">Employment</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 animate-fade-in-up delay-200">
            NetTech India Placement is your one-stop destination for skill development, career coaching, and guaranteed job placement support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 animate-fade-in-up delay-300">
            <a
              href="https://forms.gle/Qn5vCbw1FsaLizeeA"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800 md:text-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12"></div>
            </a>
            <a
              href="#domains"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 md:text-lg transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md"
            >
              Explore Job Roles
            </a>
          </div>
        </div>

        <div className="md:w-1/2 relative mb-10 md:mb-0 animate-fade-in-up delay-500">
          <div className="relative animate-float">
            <img
              src="images/web img/21976.svg"
              alt="Students collaborating"
              className="rounded-2xl bg-white dark:bg-opacity-95 shadow-2xl w-full object-cover h-80 md:h-[510px]"
            />
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hidden md:block hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">4.5k+</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hiring Partners</p>
                  <p className="font-semibold text-gray-800 dark:text-white">Top Companies</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <a href="#about" className="text-gray-400 dark:text-gray-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300">
          <ChevronDown className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
};

export default Hero;