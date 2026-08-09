import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './index';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md transition-all duration-300"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-2 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-full sm:max-w-lg bg-card border border-border/70 rounded-2xl shadow-2xl shadow-black/20 pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                {children}
              </div>
              {footer && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/10">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
