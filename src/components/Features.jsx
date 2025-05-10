import { motion } from "framer-motion";
import { MapPin, MessageSquare, Search, Upload, Users, Building } from "lucide-react";

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Smart Search",
    description:
      "Find internships that match your skills, interests, and desired location within Bamenda."
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: "Location Mapping",
    description:
      "View companies on an interactive map to find internships within your preferred location."
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "AI Chatbot Assistant",
    description:
      "Get guidance, answers to your questions, and personalized recommendations from our AI assistant."
  },
  {
    icon: <Upload className="h-8 w-8 text-primary" />,
    title: "Resume Management",
    description:
      "Upload and manage your resume, making it easy to apply to multiple internships with one click."
  },
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: "Company Profiles",
    description:
      "Detailed company profiles with information about their culture, specialties, and available positions."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Community Support",
    description:
      "Connect with fellow students, share experiences, and get advice from those who've been there."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-medium rounded-full text-sm mb-4">
            Key Features
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Find Your Perfect Internship
          </h2>
          <p className="text-lg text-gray-600">
            Our platform offers innovative features to connect students with the right companies 
            and make the internship search process smoother than ever.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm p-8 transition-all duration-300 hover:shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 p-3 rounded-lg bg-primary/5 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;