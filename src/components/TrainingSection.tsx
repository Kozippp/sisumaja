"use client";

import { motion } from "framer-motion";
import { Mic, Users, Presentation, ArrowRight, Star, Sparkles, School } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SERVICES = [
  {
    title: "Õhtujuhtimine",
    description: "Loome tervikliku atmosfääri ja hoiame sündmuse rütmi.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-blue-500",
    textColor: "text-blue-500",
    gradient: "from-blue-500/20 to-transparent"
  },
  {
    title: "Esinemised",
    description: "Jagame meeleolukate esinemistega oma teadmisi ja kogemusi. Näiteks ettevõtlusest, sisuloomest või investeerimisest.",
    icon: <Mic className="w-6 h-6" />,
    color: "bg-fuchsia-500",
    textColor: "text-fuchsia-500",
    gradient: "from-fuchsia-500/20 to-transparent"
  },
  {
    title: "Koolitused",
    description: "Jagame ettevõtetele oma teadmisi sotsiaalmeedia, sisuloome ning turunduse vallas.",
    icon: <School className="w-6 h-6" />,
    color: "bg-green-500",
    textColor: "text-green-500",
    gradient: "from-green-500/20 to-transparent"
  }
];

// Placeholder for case studies - user should replace these
const CASE_STUDIES = [
  {
    id: 1,
    title: "Eesti Ettevõtlusgala 2024",
    category: "Õhtujuhtimine",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Noorte Investeerimiskonverents",
    category: "Esinemine",
    color: "bg-fuchsia-500"
  },
  {
    id: 3,
    title: "Swedbanki sotsiaalmeedia koolitus",
    category: "Koolitus",
    color: "bg-green-500"
  },
  {
    id: 4,
    title: "sTARTUp Day",
    category: "Esinemine",
    color: "bg-purple-500"
  },
   {
    id: 5,
    title: "Suvepäevade õhtujuhtimine",
    category: "Õhtujuhtimine",
    color: "bg-yellow-500"
  }
];

export function TrainingSection() {
  return (
    <section id="training-service" className="py-32 border-b border-white/5 bg-neutral-950 relative overflow-hidden">
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

       <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-20">
             {/* Badge */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider mb-6"
             >
                <Users className="w-4 h-4" /> Esinemised & Koolitused
             </motion.div>
             
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white tracking-tight"
             >
                Jagame oma teadmisi<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">laval ja koolitusruumis.</span>
             </motion.h2>
             
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 leading-relaxed"
             >
                Me aitame tuua sinu üritusele särtsu, juhtides meeleolukalt õhtut või jagades praktilisi teadmisi teemadel, milles ise igapäevaselt tegutseme. Oleme partneriks nii sündmuste korraldajatele, kes otsivad karismaatilist duot esinema, kui ka ettevõtetele, kes soovivad oma meeskonda meie eskpertiisivallas arendada.
             </motion.p>
          </div>

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
                   {/* Hover Gradient */}
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

          {/* Carousel Section */}
          <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="mb-20"
          >
             {/* Horizontal Scroll Container with modern styling */}
             <div className="relative group">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-6 hide-scrollbar cursor-grab active:cursor-grabbing">
                   {CASE_STUDIES.map((study, i) => (
                      <div 
                         key={study.id} 
                         className="snap-center shrink-0 w-[85vw] md:w-[400px] aspect-[16/10] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 relative group/card hover:border-white/30 transition-all duration-300"
                      >
                         {/* Placeholder Image Div */}
                         <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-gray-600 group-hover/card:scale-105 transition-transform duration-700">
                            <div className="text-center p-6">
                               <p className="text-sm font-medium opacity-50 mb-2">Pilt puudub</p>
                               <div className={`w-12 h-1 rounded-full ${study.color} mx-auto opacity-50`} />
                            </div>
                         </div>
                         
                         {/* Overlay Content */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-3 w-fit ${study.color} bg-opacity-80 backdrop-blur-sm`}>
                               {study.category}
                            </span>
                            <h4 className="text-2xl font-bold text-white leading-tight">{study.title}</h4>
                         </div>
                      </div>
                   ))}
                   
                   {/* End spacer */}
                   <div className="w-6 shrink-0" />
                </div>
             </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center"
          >
             <Link href="#contact" className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 shadow-xl hover:shadow-green-500/20">
                Kutsu meid esinema 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </motion.div>
       </div>
    </section>
  );
}
