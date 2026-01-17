'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Users, Award, Play, Star, Cpu, Database, GitBranch, Zap, Settings, Brain, CheckCircle, Mail } from 'lucide-react';
import Image from 'next/image';
import { VIDEO_CONFIG } from '@/config/video';

interface HeroSectionProps {
  onApplyNow: () => void;
  onWatchDemo?: () => void;
}

export default function HeroSection({ onApplyNow, onWatchDemo }: HeroSectionProps) {
  return (
    <section className="pt-28 relative bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50 text-gray-900 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-gray-50"></div>
        <div className="absolute inset-0 overflow-hidden opacity-30 hidden md:block">
          {/* Top Left Process Flow */}
          <div className="absolute top-20 left-16">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="text-xs text-green-600 font-mono font-semibold">TRIGGER</div>
              </div>
              <div className="flex items-center space-x-3 ml-2">
                <div className="w-3 h-3 bg-blue-500 rounded animate-pulse delay-100"></div>
                <div className="text-xs text-blue-600 font-mono font-semibold">AI PROCESS</div>
              </div>
              <div className="flex items-center space-x-3 ml-4">
                <div className="w-3 h-3 bg-purple-500 rounded animate-pulse delay-200"></div>
                <div className="text-xs text-purple-600 font-mono font-semibold">DECISION</div>
              </div>
              <div className="flex items-center space-x-3 ml-6">
                <div className="w-3 h-3 bg-yellow-500 rounded animate-pulse delay-300"></div>
                <div className="text-xs text-yellow-600 font-mono font-semibold">ACTION</div>
              </div>
            </div>
          </div>

          {/* Top Right Flow Chart */}
          <div className="absolute top-32 right-20">
            <svg width="120" height="80" className="stroke-purple-500">
              <path fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" d="M10,40 L30,40 L30,20 L50,20 L50,40 L70,40 L70,60 L90,60" className="animate-pulse"></path>
              <circle cx="10" cy="40" r="4" fill="#10B981" className="animate-pulse"></circle>
              <circle cx="50" cy="20" r="4" fill="#3B82F6" className="animate-pulse delay-100"></circle>
              <circle cx="70" cy="40" r="4" fill="#8B5CF6" className="animate-pulse delay-200"></circle>
              <circle cx="90" cy="60" r="4" fill="#F59E0B" className="animate-pulse delay-300"></circle>
              <text x="12" y="35" fill="#10B981" fontSize="6" className="font-mono">INPUT</text>
              <text x="52" y="15" fill="#3B82F6" fontSize="6" className="font-mono">AI</text>
              <text x="72" y="35" fill="#8B5CF6" fontSize="6" className="font-mono">LOGIC</text>
              <text x="92" y="55" fill="#F59E0B" fontSize="6" className="font-mono">OUT</text>
            </svg>
          </div>

          {/* Bottom Left Spinning Agent */}
          <div className="absolute bottom-32 left-24">
            <div className="relative">
              <svg width="90" height="90" className="animate-spin" style={{animationDuration: '20s'}}>
                <circle cx="45" cy="45" r="40" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="15 5"></circle>
                <circle cx="45" cy="45" r="28" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="10 5"></circle>
                <circle cx="45" cy="45" r="16" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="8 3"></circle>
                <circle cx="45" cy="45" r="6" fill="#EF4444"></circle>
              </svg>
              <div className="absolute top-2 left-2 text-xs text-purple-600 font-mono animate-pulse">AGENT</div>
              <div className="absolute bottom-2 right-2 text-xs text-blue-600 font-mono animate-pulse delay-500">THINK</div>
            </div>
          </div>

          {/* Middle Left Logic Flow */}
          <div className="absolute top-1/2 left-12">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-6 bg-green-500 rounded flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="w-1 h-0.5 bg-gray-400"></div>
                <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center animate-pulse delay-100">
                  <div className="text-xs text-white font-bold">AI</div>
                </div>
                <div className="w-1 h-0.5 bg-gray-400"></div>
                <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center animate-pulse delay-200">
                  <div className="w-2 h-2 bg-white rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center animate-pulse delay-150">
                  <div className="text-xs text-black font-bold">IF</div>
                </div>
                <div className="w-1 h-0.5 bg-gray-400"></div>
                <div className="w-8 h-6 bg-red-500 rounded flex items-center justify-center animate-pulse delay-250">
                  <div className="w-3 h-3 bg-white rounded"></div>
                </div>
                <div className="w-1 h-0.5 bg-gray-400"></div>
                <div className="w-12 h-6 bg-pink-500 rounded flex items-center justify-center animate-pulse delay-350">
                  <div className="text-xs text-white font-bold">DO</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Agent Network */}
          <div className="absolute bottom-20 right-16">
            <div className="relative">
              <div className="w-10 h-10 bg-purple-600 rounded-lg animate-bounce flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute top-2 left-12 w-8 h-8 bg-blue-600 rounded-lg animate-bounce delay-100 flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-2 left-6 w-6 h-6 bg-green-600 rounded-lg animate-bounce delay-200 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <div className="absolute top-10 left-3 w-7 h-7 bg-yellow-600 rounded-lg animate-bounce delay-300 flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <svg className="absolute inset-0 w-20 h-16 pointer-events-none">
                <line x1="10" y1="10" x2="16" y2="8" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse"></line>
                <line x1="10" y1="10" x2="14" y2="4" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse delay-100"></line>
                <line x1="10" y1="10" x2="8" y2="16" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse delay-200"></line>
              </svg>
            </div>
          </div>

          {/* Top Right Spinning Gear */}
          <div className="absolute top-3/4 right-1/3">
            <div className="relative">
              <Settings className="w-12 h-12 text-purple-500 animate-spin" style={{animationDuration: '12s'}} />
              <div className="absolute top-14 left-2 text-xs text-purple-600 font-mono animate-pulse">AUTO</div>
            </div>
          </div>

          {/* Top Right Data Flow */}
          <div className="absolute top-16 right-1/3">
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping delay-100"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping delay-200"></div>
                <div className="text-xs text-green-600 font-mono font-semibold">DATA FLOW</div>
              </div>
            </div>
          </div>

          {/* Bottom Left Vector DB */}
          <div className="absolute bottom-16 left-1/3">
            <div className="relative">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded animate-pulse">
                <div className="absolute inset-1 space-y-0.5">
                  <div className="h-0.5 bg-white/70 rounded"></div>
                  <div className="h-0.5 bg-white/70 rounded w-3/4"></div>
                  <div className="h-0.5 bg-white/70 rounded w-1/2"></div>
                </div>
              </div>
              <div className="absolute -bottom-4 left-0 text-xs text-blue-600 font-mono font-semibold">VECTOR DB</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12 pt-2 pb-8">
        <div className="text-center">
                    {/* Attention Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="block bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-4 shadow-lg border border-orange-400/50 max-w-fit mx-auto"
          >
            <span className="text-yellow-100">⚠️ ATTENTION:</span> Non-IT Professionals, Freshers, Graduates, Job Professionals
          </motion.div>

          <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-purple-600/30 backdrop-blur-lg text-gray-900 px-8 py-4 rounded-2xl text-base font-bold mb-6 border-2 border-purple-400/50 shadow-lg shadow-purple-500/25">
            <div className="flex items-center bg-white rounded-lg px-3 py-1 mr-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🤖</span>
                <span className="text-gray-700 font-semibold text-sm">AI BUILDER</span>
              </div>
            </div>
            <span className="text-purple-700">CERTIFICATION PROGRAM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight  max-w-3xl mx-auto">
            <span className="inline-block animate-pulse text-gray-900">10x</span>{' '}
            <span className="text-gray-900">Your Career with</span>{' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent font-extrabold">Agentic AI</span>{' '}
            <span className="text-gray-900">in just 4 Months</span>
          </h1>

          <div className="mb-8 max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed">
              <span className="text-yellow-600 font-semibold">From AI Outsider to AI Expert</span> in 4 months.{' '}
              <span className="text-purple-600 font-semibold">Build, Deploy & Sell AI Automation Systems</span> that work while you sleep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/30 backdrop-blur-lg rounded-2xl p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
              <div className="relative text-center">
                <div className="mb-3">
                  <Award className="w-8 h-8 mx-auto text-purple-600" />
                </div>
                <div className="text-xs font-semibold text-purple-600 mb-1 uppercase tracking-wider">50+ Case Studies</div>
                <div className="text-gray-900 font-bold text-sm">AI Automation</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-lg rounded-2xl p-5 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
              <div className="relative text-center">
                <div className="mb-3">
                  <Users className="w-8 h-8 mx-auto text-blue-600" />
                </div>
                <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">4 Month Cohort</div>
                <div className="text-gray-900 font-bold text-sm">1-1 Mentorship</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/30 backdrop-blur-lg rounded-2xl p-5 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105">
              <div className="relative text-center">
                <div className="mb-3">
                  <Cpu className="w-8 h-8 mx-auto text-green-600" />
                </div>
                <div className="text-xs font-semibold text-green-600 mb-1 uppercase tracking-wider">Hand-On Learning</div>
                <div className="text-gray-900 font-bold text-sm">Real World AI Workflows</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 backdrop-blur-lg rounded-2xl p-5 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105">
              <div className="relative text-center">
                <div className="mb-3">
                  <Users className="w-8 h-8 mx-auto text-yellow-600" />
                </div>
                <div className="text-xs font-semibold text-yellow-600 mb-1 uppercase tracking-wider">1-1 LIVE</div>
                <div className="text-gray-900 font-bold text-sm">Doubt Sessions</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 mt-6">
            <button 
              onClick={onApplyNow}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 px-10 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-base text-center whitespace-nowrap inline-block" 
              style={{minWidth: 'max-content'}}
            >
              Book FREE Strategy Call
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">This program is rated as <span className="text-yellow-600 font-bold">excellent</span> by 95% of AI builders</p>
          </div>

        </div>
      </div>
    </section>
  );
}