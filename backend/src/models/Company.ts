import mongoose, { Schema, Document } from 'mongoose';
import { TeamMember, Value, Stat, Milestone, ContactData, CompanyInfo, UpcomingSkill, PricingFAQ, CourseBenefit, SuccessStat } from '../types';

// Company Info Schema
const CompanyInfoSchema = new Schema<CompanyInfo & Document>({
  whatsappNumber: { type: String, required: true },
  supportEmail: { type: String, required: true },
  heroRoles: [{ type: String, required: true }],
  carouselRoles: [{ type: String, required: true }],
  marketingStats: [{
    number: { type: String, required: true },
    label: { type: String, required: true }
  }],
  whatsappQuickMessages: [{ type: String, required: true }],
  pricingFaq: [{
    id: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  courseBenefitsComparison: [{
    feature: { type: String, required: true },
    description: { type: String, required: true },
    us: { type: Schema.Types.Mixed, required: true }, // boolean or string
    others: { type: Schema.Types.Mixed, required: true } // boolean or string
  }],
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String }
  }
}, { timestamps: true });

// Team Member Schema
const TeamMemberSchema = new Schema<TeamMember & Document>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  linkedin: { type: String, required: true },
  twitter: { type: String, required: true }
}, { timestamps: true });

// Company Value Schema
const ValueSchema = new Schema<Value & Document>({
  iconPath: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

// About Stats Schema
const StatSchema = new Schema<Stat & Document>({
  number: { type: String, required: true },
  label: { type: String, required: true },
  color: { type: String, required: true }
}, { timestamps: true });

// Company Milestone Schema
const MilestoneSchema = new Schema<Milestone & Document>({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

// Contact Data Schema
const ContactDataSchema = new Schema<ContactData & Document>({
  offices: [{
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    mapUrl: { type: String }
  }],
  responseTime: { type: String, required: true },
  mapEmbedUrl: { type: String, required: true }
}, { timestamps: true });

// Upcoming Skills Schema
const UpcomingSkillSchema = new Schema<UpcomingSkill & Document>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  demand: { type: String, required: true },
  growth: { type: String, required: true },
  icon: { type: String, required: true },
  accent: { type: String, required: true }
}, { timestamps: true });

// Success Stats Schema
const SuccessStatSchema = new Schema<SuccessStat & Document>({
  value: { type: String, required: true },
  label: { type: String, required: true }
}, { timestamps: true });

// Create and export models
export const CompanyInfoModel = mongoose.model<CompanyInfo & Document>('CompanyInfo', CompanyInfoSchema);
export const TeamMemberModel = mongoose.model<TeamMember & Document>('TeamMember', TeamMemberSchema);
export const ValueModel = mongoose.model<Value & Document>('Value', ValueSchema);
export const StatModel = mongoose.model<Stat & Document>('Stat', StatSchema);
export const MilestoneModel = mongoose.model<Milestone & Document>('Milestone', MilestoneSchema);
export const ContactDataModel = mongoose.model<ContactData & Document>('ContactData', ContactDataSchema);
export const UpcomingSkillModel = mongoose.model<UpcomingSkill & Document>('UpcomingSkill', UpcomingSkillSchema);
export const SuccessStatModel = mongoose.model<SuccessStat & Document>('SuccessStat', SuccessStatSchema);
