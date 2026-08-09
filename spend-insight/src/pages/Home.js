import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from '../components/ui';
import { PieChart, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-2 py-8 mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20">
            <PieChart className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">SpendInsight</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => loginWithRedirect()}>Log in</Button>
          <Button onClick={() => loginWithRedirect({ screen_hint: 'signup' })}>Sign Up</Button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 mx-auto text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            Intelligent Expense Tracking
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Master Your Money with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
              SpendInsight
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 leading-relaxed">
            Beautifully simple expense tracking for modern individuals.
            Gain deep insights into your spending habits and grow your savings effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg group" onClick={() => loginWithRedirect({ screen_hint: 'signup' })}>
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg" onClick={() => loginWithRedirect()}>
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left">
          <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Analytics</h3>
            <p className="text-muted-foreground">Visualize your spending patterns with interactive charts and deep-dive analytics.</p>
          </div>
          <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
            <p className="text-muted-foreground">Your financial data is encrypted and secure, powered by enterprise-grade Auth0 protection.</p>
          </div>
          <div className="p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Insights</h3>
            <p className="text-muted-foreground">Get real-time updates on your balance and monthly limits to stay on track.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
