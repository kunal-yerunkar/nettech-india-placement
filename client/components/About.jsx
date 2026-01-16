import React from 'react';
import { Target, Eye, Shield, Briefcase, Award, Users, GraduationCap, Globe, Wrench } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-900 scroll-mt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header from Front Page */}
        <div className="text-center mb-16 reveal active">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
            NetTech India <span className="text-blue-600">Placement</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-black uppercase tracking-[0.2em] leading-tight">
            BRIDGING THE GAP BETWEEN EDUCATION AND EMPLOYMENT THROUGH INDUSTRY-VERIFIED FRAMEWORKS.
          </p>
        </div>

        {/* Better Image as per instruction */}
        <div className="mb-20 rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-shadow duration-500 reveal active border border-gray-100 dark:border-white/5">
          <img
            src="images\web img\As a Parent Company.jpg"
            alt="NetTech India Team"
            className="w-full h-64 md:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Company Structure */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gray-50 dark:bg-gray-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal active">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center uppercase tracking-tight">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl mr-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              Parent Company
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 font-medium">
              Comprising <strong>NetTech India</strong> and <strong>NetTech India Placement</strong>, we are your one-stop destination for skill development, career coaching, and job placement. Our purpose is to bridge the gap between education and employment through industry-focused training and structured career support.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              We deliver high-quality training and certification programs across IT, software development, networking, cybersecurity, data science, and more.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal active">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center uppercase tracking-tight">
              <div className="p-3 bg-blue-600 rounded-xl mr-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              Daughter Company
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 font-medium">
              <strong>NetTech India Placement</strong> is dedicated to connecting skilled students with top companies across multiple domains. We offer <strong>free placement services</strong> for both IT and non-IT students as well as working professionals seeking career opportunities.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              With a strong network of <strong>4,500+ hiring partners</strong>, we ensure seamless collaboration between skilled candidates and reputable employers.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="p-10 rounded-[2.5rem] bg-[#0f172a] text-white shadow-2xl transform hover:-translate-y-2 hover:shadow-blue-500/20 transition-all duration-300 group reveal active">
            <div className="flex items-center mb-8">
              <div className="p-4 bg-white/5 rounded-2xl mr-5 group-hover:bg-white/10 transition-colors border border-white/5">
                <Eye className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Vision</h3>
            </div>
            <p className="text-blue-100/70 leading-relaxed font-medium">
              To establish a distinguished and industry-aligned placement framework that consistently connects qualified talent with reputable organizations. We are committed to delivering a structured, reliable, and high-quality placement ecosystem that enhances employability, strengthens industry collaboration, and supports long-term career progression.
            </p>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-blue-700 text-white shadow-2xl transform hover:-translate-y-2 hover:shadow-blue-700/30 transition-all duration-300 group reveal active delay-200">
            <div className="flex items-center mb-8">
              <div className="p-4 bg-white/10 rounded-2xl mr-5 group-hover:bg-white/20 transition-colors border border-white/10">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Mission</h3>
            </div>
            <p className="text-blue-50 leading-relaxed font-medium">
              Our mission is to connect skilled talent with the right career opportunities by delivering reliable, industry-focused placement solutions. We are dedicated to identifying, preparing, and aligning candidates with organizational needs through rigorous skill development, expert mentoring, and strong industry networks.
            </p>
          </div>
        </div>

        {/* Core Values Icons */}
        <div className="text-center max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">

            {[
              { icon: Award, title: "Excellence", bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" },
              { icon: GraduationCap, title: "Career-First", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" },
              { icon: Shield, title: "Integrity", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
              { icon: Wrench, title: "Practical", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
              { icon: Globe, title: "Global Impact", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400" }
            ].map((value, i) => (
              <div key={i} className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 group reveal active">
                <div className={`p-5 rounded-2xl ${value.bg} ${value.text} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">{value.title}</h4>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
};

export default About;