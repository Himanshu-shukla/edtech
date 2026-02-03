import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { submitStrategyCall } from "../api";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

/* ---------------- Animation Variants ---------------- */

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easeOut, // ✅ FIXED (type-safe)
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

/* ---------------- Component ---------------- */

export default function ContactModal({
  isOpen,
  onClose,
  title = "Book FREE Strategy Call",
  subtitle = "Connect with our career experts to create your personalized roadmap.",
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitStrategyCall({
        ...formData,
        source: "strategy_call_modal",
      });

      toast.success(result.message);
      setFormData({ name: "", email: "", phone: "" });
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", email: "", phone: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="relative p-6 pb-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-orange-400">
                <Sparkles className="w-3 h-3" />
                Career Growth
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              <p className="text-zinc-400 text-sm">{subtitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                icon={<User className="w-5 h-5" />}
              />

              {/* Email */}
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                icon={<Mail className="w-5 h-5" />}
              />

              {/* Phone */}
              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                icon={<Phone className="w-5 h-5" />}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="bg-zinc-900/50 border-t border-zinc-800 p-4 flex justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                No Spam
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                Fast Response
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                Free & Confidential
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Reusable Input ---------------- */

function InputField({
  label,
  icon,
  ...props
}: {
  label: string;
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-zinc-400 ml-1">
        {label} <span className="text-orange-500">*</span>
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 group-focus-within:text-emerald-500">
          {icon}
        </div>
        <input
          {...props}
          required
          className="w-full bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
        />
      </div>
    </div>
  );
}
