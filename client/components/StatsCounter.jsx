import React, { useState, useEffect } from 'react';
import { Building2, Trophy, GraduationCap, TrendingUp as GraphIcon } from 'lucide-react';
import { api } from '../services/api';

const StatsCounter = () => {
    const [counts, setCounts] = useState({ students: 0, partners: 0, rate: 98, domains: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const students = await api.getStudents();
            const partners = await api.getPartners();
            const domains = await api.getDomains();

            setCounts({
                students: students.length,
                partners: partners.length,
                rate: 98,
                domains: domains.length
            });
        };
        fetchStats();
    }, []);

    const Counter = ({ target, suffix = "" }) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
            if (target === 0) return;
            let start = 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }, [target]);
        return <span>{count.toLocaleString()}{suffix}</span>;
    };

    const stats = [
        { label: 'Hiring Partners', count: counts.partners, suffix: '+', icon: Building2, color: 'blue', desc: 'MNCs & Global Tech Firms' },
        { label: 'Deployed Students', count: counts.students, suffix: '+', icon: Trophy, color: 'indigo', desc: 'Successful Career Starts' },
        { label: 'Success Rate', count: counts.rate, suffix: '%', icon: GraphIcon, color: 'emerald', desc: 'Industry Best Placement %' },
        { label: 'Career Domains', count: counts.domains, suffix: '+', icon: GraduationCap, color: 'orange', desc: 'Specialized Tech Tracks' }
    ];

    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    };

    return (
        <section className="py-16 bg-white dark:bg-[#020617] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 reveal active">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="group relative bg-gray-50/50 dark:bg-gray-900/40 p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:bg-white dark:hover:bg-gray-900 transition-all duration-500 overflow-hidden text-center"
                        >
                            <div className="relative z-10 flex flex-col items-center">
                                <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 ${colorMap[stat.color]}`}>
                                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter leading-none">
                                    <Counter target={stat.count} suffix={stat.suffix} />
                                </h3>
                                <p className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2 leading-tight">
                                    {stat.label}
                                </p>
                                <p className="text-[8px] sm:text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-wider leading-none">
                                    {stat.desc}
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;