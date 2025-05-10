import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Briefcase, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UserTypeSelection = () => {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Join FutureProspect as a Student or Company
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Select your user type to get started with the right set of features
            tailored to your needs.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card
              className={`h-full transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${
                selectedType === "student"
                  ? "border-primary shadow-md"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedType("student")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${
                    selectedType === "student"
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <GraduationCap size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Student
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  Create a profile, upload your resume, search for internships based on your 
                  skills and interests, and connect with companies in Bamenda.
                </p>
                <ul className="text-left space-y-3 mb-8 w-full">
                  {["Browse local internships", "AI-powered search guidance", "Track applications", "Get personalized recommendations"].map(
                    (feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    )
                  )}
                </ul>
                <Button asChild className="w-full rounded-full">
                  <Link to="/student-register">Register as Student</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card
              className={`h-full transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${
                selectedType === "company"
                  ? "border-primary shadow-md"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedType("company")}
            >
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${
                    selectedType === "company"
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Briefcase size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm a Company
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  Create your company profile, post internship opportunities, find talented 
                  students, and manage applications all in one platform.
                </p>
                <ul className="text-left space-y-3 mb-8 w-full">
                  {["Post unlimited internships", "Find qualified candidates", "Company profile showcase", "Application management tools"].map(
                    (feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    )
                  )}
                </ul>
                <Button asChild className="w-full rounded-full">
                  <Link to="/company-register">Register as Company</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UserTypeSelection;