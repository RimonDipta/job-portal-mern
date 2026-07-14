import User from '../models/User.js';
import Job from '../models/Job.js';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount > 0) {
      console.log('Database already has data. Skipping seeding.');
      return;
    }

    console.log('Seeding mock data for development environment...');

    // Create a recruiter user
    const hashedRecruiterPassword = await bcrypt.hash('recruiter123', 10);
    const recruiter = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@techcorp.com',
      password: hashedRecruiterPassword,
      role: 'recruiter',
      profile: {
        bio: 'Talent Acquisition Lead at TechCorp. Looking for passionate innovators.',
        skills: ['Recruitment', 'Strategic Sourcing', 'Interviewing']
      }
    });

    // Create a candidate user
    const hashedCandidatePassword = await bcrypt.hash('candidate123', 10);
    await User.create({
      name: 'John Doe',
      email: 'candidate@gmail.com',
      password: hashedCandidatePassword,
      role: 'candidate',
      profile: {
        bio: 'Passionate MERN Stack developer with experience in React and Node.js.',
        skills: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS']
      }
    });

    // Create jobs
    const mockJobs = [
      {
        title: 'Frontend Developer',
        description: 'We are seeking a Frontend Developer proficient in React.js and Tailwind CSS. You will build user-facing components, collaborate with product managers, and optimize application speeds.',
        requirements: ['React.js', 'Tailwind CSS', 'Zustand State Store', 'Javascript ES6', 'Responsive Web Design'],
        salary: '$85,000 - $105,000',
        location: 'San Francisco, CA (Remote)',
        jobType: 'Full-time',
        position: 3,
        company: 'TechCorp',
        created_by: recruiter._id
      },
      {
        title: 'Backend Engineer (Node.js)',
        description: 'Join our backend engineering team and help us build scalable API services using Express, Node.js, and MongoDB. You will design database schemas and secure JWT authentications.',
        requirements: ['Node.js', 'Express.js', 'MongoDB / Mongoose', 'REST API Design', 'JWT Security Concepts'],
        salary: '$95,000 - $125,000',
        location: 'New York, NY (Hybrid)',
        jobType: 'Full-time',
        position: 2,
        company: 'CloudSystems',
        created_by: recruiter._id
      },
      {
        title: 'Full Stack Engineer',
        description: 'Seeking a versatile Full Stack Developer to oversee web operations end-to-end. You will work on frontend React components and backend databases.',
        requirements: ['React.js', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Redux Toolkit'],
        salary: '$110,000 - $140,000',
        location: 'Austin, TX',
        jobType: 'Full-time',
        position: 1,
        company: 'InnoVate Corp',
        created_by: recruiter._id
      },
      {
        title: 'UI/UX Design Intern',
        description: 'Perfect role for aspiring product designers. Learn to design high-fidelity Figma mockups, run usability tests, and partner with backend developers.',
        requirements: ['Figma', 'Interactive Prototyping', 'Wireframing', 'Responsive UI layout', 'Familiarity with HTML/CSS'],
        salary: '$25 - $35 / hour',
        location: 'Remote',
        jobType: 'Internship',
        position: 4,
        company: 'CreativeLabs',
        created_by: recruiter._id
      },
      {
        title: 'Product Operations Manager',
        description: 'Coordinate development sprints, plan software roadmap deadlines, and synchronize customer requirements with coding outputs.',
        requirements: ['Product Operations', 'Agile / Scrum', 'Jira & Confluence', 'KPI Tracking', 'Excellent communication'],
        salary: '$100,000 - $130,000',
        location: 'Chicago, IL',
        jobType: 'Full-time',
        position: 1,
        company: 'TechCorp',
        created_by: recruiter._id
      }
    ];

    await Job.insertMany(mockJobs);
    console.log('Seeded database successfully. 5 jobs, 1 Recruiter, 1 Candidate created.');
  } catch (error) {
    console.error('Error during database seeding:', error.message);
  }
};
