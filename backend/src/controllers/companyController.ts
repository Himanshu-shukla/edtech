import { Request, Response } from 'express';
import { 
  CompanyInfoModel, 
  TeamMemberModel, 
  ValueModel, 
  StatModel, 
  MilestoneModel, 
  ContactDataModel, 
  UpcomingSkillModel,
  HighlightedCountriesModel
} from '../models';

// Get company information
export const getCompanyInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const companyInfo = await CompanyInfoModel.findOne();
    if (!companyInfo) {
      res.status(404).json({ error: 'Company information not found' });
      return;
    }
    res.json(companyInfo);
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get team members
export const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const teamMembers = await TeamMemberModel.find();
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get company values
export const getCompanyValues = async (req: Request, res: Response): Promise<void> => {
  try {
    const values = await ValueModel.find();
    res.json(values);
  } catch (error) {
    console.error('Error fetching company values:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get about stats
export const getAboutStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await StatModel.find();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching about stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get company milestones
export const getCompanyMilestones = async (req: Request, res: Response): Promise<void> => {
  try {
    const milestones = await MilestoneModel.find().sort({ year: 1 });
    res.json(milestones);
  } catch (error) {
    console.error('Error fetching company milestones:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get contact data
export const getContactData = async (req: Request, res: Response): Promise<void> => {
  try {
    const contactData = await ContactDataModel.findOne();
    if (!contactData) {
      res.status(404).json({ error: 'Contact data not found' });
      return;
    }
    res.json(contactData);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get upcoming skills
export const getUpcomingSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await UpcomingSkillModel.find();
    res.json(skills);
  } catch (error) {
    console.error('Error fetching upcoming skills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get highlighted countries
export const getHighlightedCountries = async (req: Request, res: Response): Promise<void> => {
  try {
    const highlightedCountries = await HighlightedCountriesModel.findOne();
    if (!highlightedCountries) {
      res.status(404).json({ error: 'Highlighted countries not found' });
      return;
    }
    res.json(highlightedCountries.countries);
  } catch (error) {
    console.error('Error fetching highlighted countries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get complete about data (combined endpoint)
export const getAboutData = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      companyInfo,
      teamMembers,
      values,
      stats,
      milestones,
      contactData,
      skills,
      highlightedCountries
    ] = await Promise.all([
      CompanyInfoModel.findOne(),
      TeamMemberModel.find(),
      ValueModel.find(),
      StatModel.find(),
      MilestoneModel.find().sort({ year: 1 }),
      ContactDataModel.findOne(),
      UpcomingSkillModel.find(),
      HighlightedCountriesModel.findOne()
    ]);

    res.json({
      companyInfo,
      teamMembers,
      companyValues: values,
      aboutStats: stats,
      companyMilestones: milestones,
      contactData,
      upcomingSkills: skills,
      highlightedCountries: highlightedCountries?.countries || []
    });
  } catch (error) {
    console.error('Error fetching about data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
