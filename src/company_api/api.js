// follow this format to add more companies

const internships = [
    {
      id: 1,
      title: "cyber Security Intern",
      company: "SEED",
      location: "Mile 4 centre bolt",
      type: "Remote",
      postedDate: "2 days ago",
      description: "TechBridge Solutions is looking for a motivated Frontend Developer Intern to join our growing team. You'll work on real-world projects using React, TypeScript, and modern web technologies.",
      requirement: "Knowledge in React, HTML, CSS",
      companyURL: "innovatewithseed.com"
    },
    
  ];
  
  export const fetchInternships = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(internships);
      }, 1000); 
    });
  };





  