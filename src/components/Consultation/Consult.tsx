"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
  Input,
  Button,
  Textarea,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import { 
  FaClock, 
  FaMedal, 
  FaUsers, 
  FaComments,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope 
} from "react-icons/fa";
import Image from 'next/image';

const ConsultationPage = () => {
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const benefits = [
    {
      icon: <FaMedal size={24} />,
      title: "Expert Guidance",
      description: "Get advice from certified Rudraksha experts with years of experience"
    },
    {
      icon: <FaUsers size={24} />,
      title: "Personalized Approach",
      description: "Receive customized suggestions based on your specific needs"
    },
    {
      icon: <FaComments size={24} />,
      title: "Detailed Documentation",
      description: "Get written recommendations and care instructions"
    },
    {
      icon: <FaClock size={24} />,
      title: "Flexible Scheduling",
      description: "Book consultations at your convenience"
    }
  ];

  return (
    <div className="w-full">
      <motion.div 
        className="relative h-[400px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image 
          src="https://images.unsplash.com/photo-1650809652995-85581c240f19?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Consultation banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
          <div className="max-w-2xl ml-12 text-white">
            <motion.h1 
              className="text-5xl font-bold mb-6"
              {...fadeInUp}
            >
              Expert Rudraksha Consultation
            </motion.h1>
            <motion.p 
              className="text-xl"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Begin your spiritual journey with personalized guidance from our experts
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col">
                <p className="text-2xl font-semibold text-black">Book Your Consultation</p>
                <p className="text-small text-gray-500">Fill in your details below</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="First Name"
                  placeholder="Enter your first name"
                  variant="bordered"
                />
                <Input 
                  label="Last Name"
                  placeholder="Enter your last name"
                  variant="bordered"
                />
              </div>
              
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
                startContent={<FaEnvelope className="text-default-400" />}
              />
              
              <Input
                type="tel"
                label="Phone"
                placeholder="Enter your phone number"
                variant="bordered"
                startContent={<FaPhone className="text-default-400" />}
              />
              
              <Input
                type="date"
                label="Select Date"
                placeholder="Choose your preferred date"
                variant="bordered"
                startContent={<FaCalendarAlt className="text-default-400" />}
              />
              
              <Textarea
                label="Your Requirements"
                placeholder="Tell us about your specific requirements..."
                variant="bordered"
                minRows={4}
              />
              
              <Button 
                color="primary" 
                size="lg" 
                className="w-full"
              >
                Schedule Consultation
              </Button>
            </div>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-6">Why Choose Our Consultation?</h2>
            <div className="grid gap-6">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-gray-500">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-black">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about our consultation services</p>
          </motion.div>
          
          <div className="max-w-5xl mx-auto">
            <Accordion 
              className="!text-black [&_button]:text-black [&_p]:text-black"
              itemClasses={{
                title: "text-gray-800",
                content: "text-black"
              }}
            >
              <AccordionItem key="1" title="What is the consultation process like?">
                Our consultation process begins with you filling out the form with your specific requirements and concerns. Our experts will review your information and schedule a personalized session.
              </AccordionItem>
              <AccordionItem key="2" title="How long does a consultation session last?">
                A typical consultation session lasts between 30-45 minutes. This gives us enough time to understand your needs and provide detailed recommendations.
              </AccordionItem>
              <AccordionItem key="3" title="Do you offer online consultations?">
                Yes, we offer both online and in-person consultations. Online consultations are conducted via video call at a time convenient for you.
              </AccordionItem>
              <AccordionItem key="4" title="What should I prepare before the consultation?">
                It&apos;s helpful to have any specific questions or concerns written down, and if you have any existing Rudraksha beads, please have them ready for discussion.
              </AccordionItem>
              <AccordionItem key="5" title="What happens after the consultation?">
                You&apos;ll receive a detailed report with recommendations and next steps, along with care instructions and guidelines for your spiritual practice.
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;