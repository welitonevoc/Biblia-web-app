import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Chrome, Apple, Monitor } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loginWithMicrosoft, loginWithApple } = useAuth();

  const handleLogin = async (provider: 'google' | 'microsoft' | 'apple') => {
    try {
      if (provider === 'google') await loginWithGoogle();
      if (provider === 'microsoft') await loginWithMicrosoft();
      if (provider === 'apple') await loginWithApple();
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-[40px] p-10 shadow-2xl overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent)] opacity-10 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--accent)] opacity-10 blur-3xl rounded-full" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[var(--accent-bg)] rounded-3xl flex items-center justify-center text-[var(--accent)] mx-auto mb-6 shadow-gold">
                <span className="text-2xl font-bold">✨</span>
              </div>
              <h2 className="text-2xl font-black text-[var(--text)] tracking-tight mb-2">Bem-vindo de volta</h2>
              <p className="text-sm text-[var(--text-dim)] italic">Escolha sua forma preferida de acesso</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleLogin('google')}
                className="w-full flex items-center gap-4 p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Chrome size={20} className="text-[#4285F4]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">Continuar com Google</p>
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">Acesso rápido e seguro</p>
                </div>
              </button>

              <button
                onClick={() => handleLogin('microsoft')}
                className="w-full flex items-center gap-4 p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Monitor size={20} className="text-[#00A4EF]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">Continuar com Microsoft</p>
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">Outlook, Hotmail, Live</p>
                </div>
              </button>

              <button
                onClick={() => handleLogin('apple')}
                className="w-full flex items-center gap-4 p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] transition-all group"
              >
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-sm">
                  <Apple size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">Continuar com Apple</p>
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">Acesso via iCloud</p>
                </div>
              </button>
            </div>

            <p className="mt-10 text-[10px] text-center text-[var(--text-dim)] uppercase tracking-widest leading-relaxed">
              Ao continuar, você concorda com nossos <br />
              <span className="text-[var(--accent)] cursor-pointer hover:underline">Termos de Uso</span> e <span className="text-[var(--accent)] cursor-pointer hover:underline">Privacidade</span>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
