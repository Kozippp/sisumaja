"use client";

import { motion } from "framer-motion";
import { Mic, Users, ArrowRight, School, Calendar } from "lucide-react";
import Link from "next/link";
import { Database } from "@/types/database.types";
import { useTranslations } from 'next-intl';

type Project = Database['public']['Tables']['projects']['Row'];

interface TrainingSectionProps {
  trainingProjects?: Project[];
}

export function TrainingSection({ trainingProjects = [] }: TrainingSectionProps) {
  const t = useTranslations('trainingService');
  const hasProjects = trainingProjects.length > 0;

  const SERVICES = [
    {
      title: t('service1Title'),
      description: t('service1Desc'),
      icon: <Users className="w-6 h-6" />,
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
      gradient: "from-yellow-500/20 to-transparent"
    },
    {
      title: t('service2Title'),
      description: t('service2Desc'),
      icon: <Mic className="w-6 h-6" />,
      color: "bg-fuchsia-500",
      textColor: "text-fuchsia-500",
      gradient: "from-fuchsia-500/20 to-transparent"
    },
    {
      title: t('service3Title'),
      description: t('service3Desc'),
      icon: <School className="w-6 h-6" />,
      color: "bg-blue-500",
      textColor: "text-blue-500",
      gradient: "from-blue-500/20 to-transparent"
    }
  ];

  return (
    <section id="training-service" className="py-32 border-b border-white/5 bg-neutral-950 relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

       <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-20">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider mb-6"
             >
                <Users className="w-4 h-4" /> {t('badge')}
             </motion.div>
             
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white tracking-tight"
             >
                {t('title')}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{t('titleHighlight')}</span>
             </motion.h2>
             
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 leading-relaxed"
             >
                {t('subtitle')}
             </motion.p>
          </div>

          {/* 3 Cards Title */}
          <motion.h3 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-2xl md:text-3xl font-bold text-center mb-10"
          >
             {t('howCanWeHelp')}
          </motion.h3>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
             {SERVICES.map((service, idx) => (
                <motion.div 
                   key={idx} 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3 + idx * 0.1 }}
                   className="group relative bg-white/5 border border-white/10 p-8 rounded-3xl overflow-hidden hover:bg-white/10 transition-colors duration-500"
                >
                   <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                   
                   <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl ${service.color}/20 flex items-center justify-center ${service.textColor} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                         {service.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">{service.title}</h3>
                      <p className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">{service.description}</p>
                   </div>
                </motion.div>
             ))}
          </div>

          {/* Case Studies Carousel */}
          {hasProjects && (
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               className="mb-20"
            >
               <div className="flex justify-between items-end mb-8">
                 <h3 className="text-2xl font-bold text-white">{t('portfolioTitle')}</h3>
                 <Link href="/tehtud-tood?filter=training" className="text-sm font-bold uppercase text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                   {t('portfolioViewAll')} <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>

               <div className="relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-6 hide-scrollbar cursor-grab active:cursor-grabbing">
                     {trainingProjects.map((project) => (
                        <Link
                           key={project.id}
                           href={`/tehtud-tood/${project.slug}`}
                           className="snap-center shrink-0 w-[85vw] md:w-[400px] aspect-[16/10] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 relative group/card hover:border-white/30 transition-all duration-300 block"
                        >
                           {project.thumbnail_url ? (
                              <img
                                 src={project.thumbnail_url}
                                 alt={project.title}
                                 className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                              />
                           ) : (
                              <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-gray-600 group-hover/card:scale-105 transition-transform duration-700">
                                 <div className="text-center p-6">
                                    <p className="text-sm font-medium opacity-50 mb-2">Pilt puudub</p>
                                    <div className="w-12 h-1 rounded-full bg-green-500 mx-auto opacity-50" />
                                 </div>
                              </div>
                           )}
                           
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
                              {project.collaboration_completed_at && (
                                 <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(project.collaboration_completed_at).toLocaleDateString('et-EE', { year: 'numeric', month: 'short' })}</span>
                                 </div>
                              )}
                              <h4 className="text-2xl font-bold text-white leading-tight">{project.title}</h4>
                              {project.description && (
                                 <p className="text-gray-300 text-sm mt-2 line-clamp-2">{project.description}</p>
                              )}
                           </div>
                        </Link>
                     ))}
                     
                     <div className="w-6 shrink-0" />
                  </div>
               </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center"
          >
             <Link href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-fuchsia-500 hover:text-white transition-all duration-300">
                {t('ctaButton')} <ArrowRight className="w-4 h-4" />
             </Link>
          </motion.div>
       </div>
    </section>
  );
}
