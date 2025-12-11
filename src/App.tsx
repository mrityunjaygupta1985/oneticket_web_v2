
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollySection from '../components/ScrollySection';
import MetroMapViewer from '../components/MetroMapViewer';
import { CityMap, Station } from '../types';

gsap.registerPlugin(ScrollTrigger);

// --- HELPER ICONS ---
const IconAutoRickshaw: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 576 512" fill="currentColor" className={className}>
    <path d="M560 320h-16v-64c0-35.3-28.7-64-64-64h-32.6c-9.1-39.7-44.5-69.5-86.8-69.5H160L93.7 30.2C85.4 11.9 66.8 0 46.7 0H32C14.3 0 0 14.3 0 32v64c0 17.7 14.3 32 32 32h14.7l48 106.7c0 2.7 1 5.2 2.6 7.3H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h16.8c12.1 29.8 41.3 50.7 75.2 50.7s63.1-20.9 75.2-50.7h133.5c12.1 29.8 41.3 50.7 75.2 50.7s63.1-20.9 75.2-50.7H544c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32zM124 416c-19.9 0-36-16.1-36-36s16.1-36 36-36 36 16.1 36 36-16.1 36-36 36zm288 0c-19.9 0-36-16.1-36-36s16.1-36 36-36 36 16.1 36 36-16.1 36-36 36zM464 256H336v-64h128v64z"/>
  </svg>
);

// --- SKETCH ILLUSTRATIONS (DOODLES) ---
const SketchMonument = () => (
  <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ overflow: 'hidden' }}>
    {/* Clouds & Sun */}
    <circle cx="320" cy="80" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M40 80 Q 60 60 80 80 T 120 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M250 120 Q 270 100 290 120 T 330 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    
    {/* Birds */}
    <path d="M150 50 Q 160 60 170 50 M 180 40 Q 190 50 200 40" fill="none" stroke="currentColor" strokeWidth="1.5" />

    {/* India Gate Arch (Background) */}
    <path d="M50 600 L 50 250 Q 200 100 350 250 L 350 600" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <rect x="150" y="250" width="100" height="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />

    {/* Taj Mahal Main Structure (Foreground) */}
    <path d="M80 600 L 80 400 Q 80 380 100 380 L 120 380 L 120 350 Q 120 300 200 300 Q 280 300 280 350 L 280 380 L 300 380 Q 320 380 320 400 L 320 600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    
    {/* Dome Detail */}
    <path d="M180 300 L 180 280 Q 200 260 220 280 L 220 300" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M200 300 L 200 600" fill="none" stroke="currentColor" strokeWidth="1" />
    
    {/* Minarets */}
    <path d="M30 600 L 40 350 L 60 350 L 70 600" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M330 600 L 340 350 L 360 350 L 370 600" fill="none" stroke="currentColor" strokeWidth="2" />
    
    {/* Arches */}
    <path d="M160 600 L 160 500 Q 200 450 240 500 L 240 600" fill="none" stroke="currentColor" strokeWidth="2" />
    
    {/* Decorative Plants/Lotus */}
    <path d="M20 550 Q 40 520 60 550 T 100 550" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M300 550 Q 320 520 340 550 T 380 550" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const SketchBus = () => (
  <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ overflow: 'hidden' }}>
    {/* City Skyline Background */}
    <path d="M0 300 L 50 300 L 50 200 L 80 200 L 80 250 L 120 250 L 120 180 L 160 180 L 160 300 L 250 300 L 250 220 L 300 220 L 300 300 L 400 300" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    
    {/* Winding Road with Perspective */}
    <path d="M200 300 Q 100 400 0 600" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M200 300 Q 300 400 400 600" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="200" y1="300" x2="200" y2="600" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" />

    {/* Clouds & Sun */}
    <circle cx="50" cy="80" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="50" y1="40" x2="50" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="50" y1="120" x2="50" y2="140" stroke="currentColor" strokeWidth="2" />
    <line x1="10" y1="80" x2="30" y2="80" stroke="currentColor" strokeWidth="2" />
    <line x1="90" y1="80" x2="70" y2="80" stroke="currentColor" strokeWidth="2" />
    <path d="M250 80 Q 280 60 310 80 T 350 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Trees */}
    <path d="M50 400 L 50 360 M 30 360 Q 50 330 70 360 Q 50 390 30 360" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M350 450 L 350 400 M 320 400 Q 350 360 380 400 Q 350 440 320 400" fill="none" stroke="currentColor" strokeWidth="2" />

    {/* Bus Illustration */}
    <g transform="translate(140, 450)">
        <rect x="0" y="0" width="120" height="80" rx="10" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="0" y1="30" x2="120" y2="30" stroke="currentColor" strokeWidth="2" />
        <rect x="10" y="5" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="70" y="5" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="30" cy="80" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="90" cy="80" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="10" y1="50" x2="30" y2="50" stroke="currentColor" strokeWidth="2" />
        <line x1="40" y1="50" x2="110" y2="50" stroke="currentColor" strokeWidth="2" />
    </g>
    
    {/* Street Lamps */}
    <path d="M30 300 L 30 200 L 50 200" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="205" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const SketchFlight = () => (
  <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ overflow: 'hidden' }}>
    {/* Globe / Grid Background */}
    <circle cx="300" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <path d="M220 100 Q 300 140 380 100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <path d="M220 100 Q 300 60 380 100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <line x1="300" y1="20" x2="300" y2="180" stroke="currentColor" strokeWidth="1" opacity="0.4" />

    {/* Looping Flight Path */}
    <path d="M50 500 C 150 500, 100 200, 200 250 S 350 400, 300 150" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />

    {/* Airplane */}
    <g transform="translate(260, 120) rotate(-45)">
       <path d="M20 70 Q 60 70 100 50 L 140 20 L 150 25 L 120 60 L 160 60 L 170 55 L 170 65 L 160 70 L 40 80 Q 20 82 20 70 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
       <path d="M40 90 Q 80 90 120 90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
    </g>

    {/* Clouds scattered */}
    <path d="M40 150 Q 60 130 80 150 T 120 150" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M300 300 Q 320 280 340 300 T 380 300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M150 400 Q 170 380 190 400 T 230 400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Luggage / Suitcase */}
    <g transform="translate(50, 420) rotate(10)">
        <rect x="0" y="20" width="80" height="100" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M25 20 L 25 0 L 55 0 L 55 20" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="10" cy="110" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="70" cy="110" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="80" x2="80" y2="80" stroke="currentColor" strokeWidth="1" />
        {/* Stickers */}
        <circle cx="30" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="50" y="90" width="20" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>

    {/* Passport Icon */}
    <g transform="translate(250, 450) rotate(-15)">
        <rect x="0" y="0" width="60" height="80" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="15" y="55" width="30" height="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="15" y="65" width="20" height="5" fill="none" stroke="currentColor" strokeWidth="1" />
    </g>
  </svg>
);


// --- CONTENT DATA ---

const TERMS_OF_SERVICE = `
*Role of SequelString AI*
SequelString AI provides a technology platform that facilitates the purchase of metro tickets. We do not operate the metro services nor do we have control over their operations. Our role is limited to offering an online platform for ticket booking and related services.
The metro ticket booking confirmation provided by SequelString AI is based on information updated by the metro authorities regarding seat availability, schedules, fares, and other travel details.
SequelString AI does not have any influence or control over metro authorities’ policies, operational decisions, or service conditions. All service-related aspects, including metro schedules, station facilities, and passenger regulations, are managed by the respective metro authority.

*Limitation of Liability of SequelString AI*
In its role as a technology platform enabling metro ticket transactions, SequelString AI is not responsible for:
-Delays, cancellations, or rescheduling of metro services.
-The operational conditions of metro services, including station amenities and train facilities.
-Any loss, theft, or damage of passengers' belongings.
-Any issues related to ticket validation or scanning at metro stations.
-Failure of metro authorities to fulfill their obligations or meet service expectations.
-Changes in routes, fares, or schedules decided by the metro authority without prior notice.
SequelString AI shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of metro services. The final responsibility for service delivery and passenger safety lies with the metro authorities.

*Responsibilities of Users*
Users of SequelString AI’s metro ticket services must adhere to the following responsibilities:
-Ensure accuracy of travel details before confirming ticket bookings.
-Carry a valid government-issued identity proof when required by metro authorities.
-Follow the metro authority's rules, guidelines, and safety protocols.
-Reach the metro station on time, as per the scheduled departure.
-Validate and use tickets within the specified validity period.
-Contact metro authorities for any operational concerns or service-related inquiries.

*Cancellation and Refund Policy*
Ticket cancellations and refunds are subject to the policies of the respective metro authority.
SequelString AI follows the refund process determined by the metro authority and does not have the discretion to alter or override their decisions.
-Any refund processing timelines will depend on the metro authority’s policies and banking procedures.
-Payments and Charges
-Ticket prices are set by the metro authority and may include applicable taxes and service fees.
-Payment for metro tickets must be completed through the accepted payment methods on SequelString AI’s platform.
-In case of failed transactions where the amount is deducted but the ticket is not issued, refunds will be processed as per our standard policy in coordination with the payment service provider.

*Data Privacy and Security*
User data collected for ticket bookings will be securely stored and processed in compliance with applicable data protection laws.
SequelString AI does not share user data with unauthorized third parties without user consent, except as required by law.
Users are responsible for maintaining the confidentiality of their account credentials and payment information.
`;

const PRIVACY_POLICY = `
*Introduction*
At SequelString AI, we are committed to maintaining the trust and confidence of our customers and visitors to our website. In this Privacy Policy, we’ve provided detailed information on when and why we collect your personal information, how we use it, the limited conditions under which we may disclose it to others, and how we keep it secure.

*Information Collection*
We collect and process the following information:
-Personal Identifiers: Your name, email address, and phone number.
-Demographic Information: Such as your age, gender, and occupation.
-Location Data: Your geographical location.
-Usage Data: Information on how you interact with our website or product.
-Financial Information: Your payment and billing information.

*Use of Information*
Your information is used for the following purposes:
-Service Provisioning: To provide and improve our services.
-Customer Support: To communicate with you about your use of our services.
-Marketing Activities: Subject to your consent, we may send you promotional emails and newsletters.
-Research and Analytics: To understand how our services are used and how we can improve them.

*Information Sharing and Disclosure*
We may share your information in the following cases:
-With Service Providers: To assist in the delivery of our services.
-For Legal Reasons: When required by law or to respond to legal processes.
-During Business Transfers: As part of a merger or acquisition, your information may be transferred as a business asset.

*User Rights*
You have the right to:
-Access and Update: View and modify your personal data.
-Opt-Out: Withdraw your consent for certain types of data processing.
-Delete: Request the deletion of your account and related data.

*Data Security*
We take the security of your data seriously and use appropriate technical and organizational measures to protect it against unauthorized or unlawful processing and against accidental loss, destruction, or damage.

*International Data Transfers*
We operate globally, which means your information may be processed in countries outside of your residence. We ensure that these transfers are legally compliant and your information is protected.

*Changes to Our Privacy Policy*
We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.

*Contact Us*
If you have any questions about this privacy policy, please contact us at tel: +91-7208135479, +91-8069409439
`;

const ABOUT_CONTENT = `
*SequelString AI*
In June 2018, SequelString AI was founded by Ravish Sahay, promoted and supported by alumnus of Harvard, IIT and IIM. SequelString AI is an automation start-up based in Mumbai, India.
As on date have customers across the industry, using their solution. To name few like Mahindra Home Finance, Cosmo Films, Piramal, E&Y, Luminous, Indus Towers, Times Of India, Mahindra Integrated Business Solutions, Shahi Exports, Oberoi Group, Hero MotoCorp, DB Corp, Aknamed, Brookfield and many more.
SequelString AI is currently building solutions on RPA and Block chain, which is based on Python and extensively using machine learning.

*Why we are the best in Market?*
SequelString AI is having clear vision and Roadmap to create Value under H1- Horizon One ( Exploit) and H2 – Horizon Two (Explore) framework. Under H1 Roadmap venture is focusing on Organisation’s current problem and addressing it through its Integrated Automation Platform.

*Mission*
In partnership with our customers, we strive for excellence by delivering automation through our Scalable Platform, ensuring Compliance, Speed, and Accuracy. Our commitment to innovation and collaboration fosters strong relationships built on trust and mutual success. Together, we navigate challenges and seize opportunities, shaping a future defined by efficiency and empowerment.

*Vision*
Our vision is to be the first choice in leveraging automation to deliver value to both our customers and their customers. Our goal is to automate processes for companies of all sizes and industries in any geographic location. By driving innovation and excellence, we enable companies to streamline operations, improve efficiency and achieve sustainable growth in today's rapidly evolving business environment.

*Value*
Our commitment is to foster a culture of continuous improvement through innovation, backed by integrity, excellence and a primary focus on customer and employee satisfaction. We continually raise standards, embrace change for growth and sustainable success while prioritizing the well-being of both customers and employees.

*Goal*
Our goal is to foster seamless collaboration and integration, leveraging our common strengths to drive success and deliver impactful results. By aligning your efforts around a common vision and purpose, you maximize efficiency, optimize resources, and drive your organization toward sustainable growth and excellence.

*Platform*
Our platform provides AI-driven, SaaS-based, zero-code data extraction, allowing business users to easily configure processes without IT knowledge. An integrated automation framework efficiently optimizes processes. A user-friendly interface democratizes advanced automation tools, allowing businesses to increase productivity and innovation for sustainable growth.
`;

const FEEDBACK_CONTENT = `
*We Value Your Feedback*
At SequelString AI and OneTicket, we strive to provide the best possible experience for our users. Your feedback is crucial in helping us improve our services, features, and overall user experience.

*How to Share Feedback*
We welcome your suggestions, ideas, and comments. You can share your thoughts with us through the following channels:
- Email: Send your feedback to support@oneticket.co.in
- In-App: Use the 'Feedback' section within the mobile application settings.

*What Happens Next?*
Our team reviews every piece of feedback we receive. While we may not be able to respond to each submission individually, please know that your input is directly used to inform our product roadmap and improvements.

*Beta Features*
If you are testing a beta version of our app, please use the dedicated feedback form provided in the testing invitation to report bugs or suggest enhancements.
`;

const COMPLAINT_CONTENT = `
*Grievance Redressal*
We are committed to resolving any issues you may face while using our platform. If you have any complaint regarding a ticket booking, payment issue, or service experience, please follow the steps below.

*Filing a Complaint*
To ensure a swift resolution, please provide the following details when contacting us:
- Transaction ID / Ticket Reference Number
- Date and Time of the incident
- A detailed description of the issue
- Any supporting screenshots or documents

*Contact Channels*
- Email: complaints@oneticket.co.in
- Phone: +91-7208135479 (Mon-Fri, 9 AM - 6 PM IST)

*Resolution Timeline*
We aim to acknowledge all complaints within 24 hours of receipt. Our standard resolution timeline is 3-5 business days, depending on the complexity of the issue and the involvement of third-party metro authorities or payment gateways.

*Escalation*
If you are not satisfied with the initial resolution, you may escalate the matter to our Nodal Officer by mentioning "Escalation" in the subject line of your email.
`;

const GUIDELINES_CONTENT = `
*Community Guidelines*
To ensure a safe, respectful, and efficient environment for all OneTicket users, we request you to adhere to the following guidelines.

*Fair Usage*
- Do not attempt to manipulate the ticketing system or exploit software vulnerabilities.
- Use the app only for personal travel booking purposes unless authorized as a corporate partner.

*Respectful Conduct*
- Treat our support staff and other commuters with respect. Abusive language or harassment will not be tolerated and may result in account suspension.
- Follow all rules and regulations laid down by the respective Metro Rail Authorities while on station premises and inside trains.

*Account Security*
- Do not share your login credentials or OTPs with anyone. OneTicket staff will never ask for your password.
- Report any suspicious activity on your account immediately to our support team.

*Content Standards*
- When submitting reviews or feedback, ensure the content is accurate and free from profanity, hate speech, or irrelevant information.
- We reserve the right to remove content that violates these standards.
`;

const ADDRESSES = [
  {
    city: "Mumbai",
    lines: ["Unit No. 325, 3rd floor", "Nirmal Corporate Center", "Nirmal Lifestyle Mall, LBS Marg", "Sonapur Signal, Mulund West, 400080"]
  },
  {
    city: "Delhi",
    lines: ["382, Ground Floor", "Near Avalon Courtyard Sultanpur", "New Delhi 110030"]
  },
  {
    city: "USA",
    lines: ["12 N route 17 suite 201", "Paramus NJ USA, 07652"]
  }
];

interface Feature {
  title: string;
  desc: string;
  icon: string;
  customIcon?: React.ReactNode;
  color: string;
  shadow: string;
}

const OUR_FEATURES: Feature[] = [
  {
    title: "Cab Services",
    desc: "Integrate cab booking and ride-sharing services directly within the app.",
    icon: "fa-car",
    color: "bg-yellow-500",
    shadow: "shadow-yellow-500/50"
  },
  {
    title: "Auto Rickshaw",
    desc: "Quick and affordable auto rickshaw booking in supported cities.",
    icon: "fa-taxi",
    customIcon: <IconAutoRickshaw className="w-full h-full" />,
    color: "bg-green-500",
    shadow: "shadow-green-500/50"
  },
  {
    title: "Multi-Modal Journey",
    desc: "Plan complete door-to-door journeys combining metro, bus, and cabs.",
    icon: "fa-route",
    color: "bg-purple-500",
    shadow: "shadow-purple-500/50"
  },
  {
    title: "Real-time Tracking",
    desc: "Live GPS tracking for all your booked rides in one dashboard.",
    icon: "fa-location-crosshairs",
    color: "bg-red-500",
    shadow: "shadow-red-500/50"
  }
];

const COMING_SOON_FEATURES = [
  {
    id: 'bus',
    title: "Bus Booking",
    desc: "Book intercity and local bus tickets effortlessly from the same app.",
    icon: "fa-bus",
    bg: "bg-blue-600",
    color: "text-blue-500",
    shadow: "shadow-blue-500/50"
  },
  {
    id: 'monument',
    title: "Monument Booking",
    desc: "Skip the line at India's heritage sites with in-app ticketing.",
    icon: "fa-landmark",
    bg: "bg-orange-500",
    color: "text-orange-500",
    shadow: "shadow-orange-500/50"
  },
  {
    id: 'flight',
    title: "Flight Booking",
    desc: "Domestic and international flight booking with best price guarantee.",
    icon: "fa-plane-departure",
    bg: "bg-cyan-500",
    color: "text-cyan-500",
    shadow: "shadow-cyan-500/50"
  }
];

const SAFETY_FEATURES = [
  {
    title: "Verified Drivers",
    desc: "Every driver undergoes rigorous background checks.",
    icon: "fa-user-shield",
    color: "bg-green-500",
    shadow: "shadow-green-500/50"
  },
  {
    title: "Number Masking",
    desc: "Your phone number stays private. Always.",
    icon: "fa-phone-slash",
    color: "bg-blue-500",
    shadow: "shadow-blue-500/50"
  },
  {
    title: "Share Trip Details",
    desc: "Share your live ride status with loved ones instantly.",
    icon: "fa-share-nodes",
    color: "bg-purple-500",
    shadow: "shadow-purple-500/50"
  },
  {
    title: "Live Tracking & ETA",
    desc: "Real-time GPS tracking with precise arrival times.",
    icon: "fa-location-dot",
    color: "bg-orange-500",
    shadow: "shadow-orange-500/50"
  },
  {
    title: "SOS Button",
    desc: "Emergency assistance is just one tap away.",
    icon: "fa-circle-exclamation",
    color: "bg-red-500",
    shadow: "shadow-red-500/50"
  },
  {
    title: "24x7 Support",
    desc: "Round-the-clock support for any ride-related issues.",
    icon: "fa-headset",
    color: "bg-cyan-500",
    shadow: "shadow-cyan-500/50"
  }
];

// --- MUMBAI SCHEMATIC MAP DATA ---
const MUMBAI_METRO_STATIONS: Station[] = [
  // --- LINE 2A (Yellow) Vertical Left (x=25) ---
  { 
    id: 'dahisar', name: 'Dahisar E', x: 25, y: 5.0, lines: ['#FFC20E', '#FF0000'], isInterchange: true, alwaysShowLabel: true, labelPosition: 'top',
    guide: "A dynamic northern Mumbai interchange, linking Line 2A (Yellow) and Line 7 (Red). It’s a bustling hub providing access to the vibrant Dahisar local market, perfect for fresh produce and street food exploration right outside the station.",
    tip: "If you're planning to explore the local Dahisar market or catch buses heading further north, use the specific exits clearly marked towards these destinations."
  },
  { id: 'anand', name: 'Anand Nagar', x: 25, y: 12.0, lines: ['#FFC20E'] },
  { id: 'kandarpada', name: 'Kandarpada', x: 25, y: 19.0, lines: ['#FFC20E'] },
  { id: 'mandapeshwar', name: 'Mandapeshwar', x: 25, y: 26.0, lines: ['#FFC20E'] },
  { id: 'eksar', name: 'Eksar', x: 25, y: 33.0, lines: ['#FFC20E'] },
  { id: 'borivali_w', name: 'Borivali (W)', x: 25, y: 40.0, lines: ['#FFC20E'], alwaysShowLabel: true, labelPosition: 'left' },
  { id: 'pahadi', name: 'Pahadi Eksar', x: 25, y: 47.0, lines: ['#FFC20E'] },
  
  // --- LINE 2A & 7 INTERCHANGE (Dahisar E) ---
  // Already defined above.
  
  // --- LINE 7 (Red) Vertical Right (x=45) ---
  { id: 'ovaripada', name: 'Ovaripada', x: 45, y: 12.0, lines: ['#FF0000'] },
  { id: 'rashtriya', name: 'Rashtriya Udyan', x: 45, y: 19.0, lines: ['#FF0000'] },
  { id: 'devipada', name: 'Devipada', x: 45, y: 26.0, lines: ['#FF0000'] },
  { id: 'magathane', name: 'Magathane', x: 45, y: 33.0, lines: ['#FF0000'] },
  { id: 'poisir', name: 'Poisir', x: 45, y: 40.0, lines: ['#FF0000'] },
  { id: 'akurli', name: 'Akurli', x: 45, y: 47.0, lines: ['#FF0000'] },

  // --- INTERCHANGE: D N Nagar / Andheri West (Line 1 & 2A) ---
  { 
    id: 'dn_nagar', name: 'D N Nagar', x: 25, y: 50.0, lines: ['#FFC20E', '#0072CE'], isInterchange: true, alwaysShowLabel: true, labelPosition: 'left',
    guide: "A pivotal interchange connecting the vibrant Line 1 (Blue) and the developing Line 2A (Yellow). D N Nagar is a gateway to the cosmopolitan Andheri West area, famous for its film studios, shopping malls, and residential complexes.",
    tip: "Use the skywalk for a seamless transfer between lines. It’s also a great starting point for auto-rickshaw rides to nearby Juhu Beach."
  },

  // --- INTERCHANGE: WEH / Gundavali (Line 1 & 7) ---
  { 
    id: 'weh', name: 'WEH / Gundavali', x: 45, y: 50.0, lines: ['#FF0000', '#0072CE'], isInterchange: true, alwaysShowLabel: true, labelPosition: 'right',
    guide: "A major connectivity point where Line 7 (Red) meets Line 1 (Blue) right on the Western Express Highway. This station is crucial for commuters traveling between the northern suburbs and the central business districts.",
    tip: "During peak hours, the interchange can get busy. Follow the color-coded floor markings for quicker navigation to your connecting platform."
  },

  // --- LINE 1 (Blue) Horizontal (y=50) ---
  { id: 'versova', name: 'Versova', x: 10, y: 50.0, lines: ['#0072CE'], alwaysShowLabel: true, labelPosition: 'top' },
  { id: 'azad', name: 'Azad Nagar', x: 17.5, y: 50.0, lines: ['#0072CE'] },
  { id: 'chakala', name: 'Chakala', x: 55, y: 50.0, lines: ['#0072CE'] },
  { id: 'airport', name: 'Airport Road', x: 65, y: 50.0, lines: ['#0072CE'], alwaysShowLabel: true, labelPosition: 'top' },
  { id: 'marol', name: 'Marol Naka', x: 75, y: 50.0, lines: ['#0072CE', '#33A3C9'], isInterchange: true, alwaysShowLabel: true, labelPosition: 'top', guide: "Connection to Line 3 (Aqua)." },
  { id: 'saki', name: 'Saki Naka', x: 85, y: 50.0, lines: ['#0072CE'] },
  { id: 'ghatkopar', name: 'Ghatkopar', x: 95, y: 50.0, lines: ['#0072CE'], alwaysShowLabel: true, labelPosition: 'top' },

  // --- LINE 3 (Aqua) Southward (x=65 to x=42) ---
  // Starts near Marol (simulated connection logic via SVG, physically nearby)
  { id: 'midc', name: 'MIDC', x: 65, y: 38.0, lines: ['#33A3C9'], alwaysShowLabel: true, labelPosition: 'right' },
  { id: 'seepz', name: 'SEEPZ', x: 65, y: 44.0, lines: ['#33A3C9'] },
  // Aarey JVLR is near Line 7, represented conceptually
  { id: 'aarey', name: 'Aarey', x: 60, y: 52.0, lines: ['#33A3C9'] },
  
  // Moving South-West
  { id: 'bk', name: 'BKC', x: 54, y: 58.0, lines: ['#33A3C9'], alwaysShowLabel: true, labelPosition: 'left', guide: "Bandra Kurla Complex - The financial heart." },
  { id: 'vidyanagari', name: 'Vidyanagari', x: 54, y: 62.0, lines: ['#33A3C9'] },
  { id: 'santacruz', name: 'Santacruz', x: 52, y: 64.0, lines: ['#33A3C9'] },
  
  // Further South
  { id: 'csh', name: 'CSMIA T1', x: 50, y: 66.0, lines: ['#33A3C9'], tip: "Direct access to Domestic Terminal 1." },
  { id: 'sahar', name: 'Sahar Rd', x: 48, y: 68.0, lines: ['#33A3C9'] },
  { id: 'csmia2', name: 'CSMIA T2', x: 46, y: 70.0, lines: ['#33A3C9'], tip: "Direct access to International Terminal 2." },
  
  // City Area
  { id: 'dharavi', name: 'Dharavi', x: 44, y: 72.0, lines: ['#33A3C9'] },
  { id: 'dadar', name: 'Dadar', x: 44, y: 84.0, lines: ['#33A3C9'], alwaysShowLabel: true, labelPosition: 'right', guide: "Major railway interchange." },
  { id: 'siddhivinayak', name: 'Siddhivinayak', x: 46, y: 86.0, lines: ['#33A3C9'] },
  { id: 'worli', name: 'Worli', x: 50, y: 88.0, lines: ['#33A3C9'] },
  { id: 'achary', name: 'Acharya Atre', x: 48, y: 90.0, lines: ['#33A3C9'] },
  { id: 'sc', name: 'Science Museum', x: 46, y: 92.0, lines: ['#33A3C9'] },
  { id: 'mahalaxmi', name: 'Mahalaxmi', x: 44, y: 94.0, lines: ['#33A3C9'] },
  { 
    id: 'cuffe', name: 'Cuffe Parade', x: 42, y: 96.0, lines: ['#33A3C9'], alwaysShowLabel: true, labelPosition: 'left',
    guide: "Situated at the southern tip of Mumbai, Cuffe Parade is an affluent residential and commercial precinct known for its high-rise apartments, luxury hotels, and modern amenities.",
    tip: "Enjoy the upscale dining experiences in the luxury hotels or simply take in the serene sea views from this exclusive neighborhood."
  }
];

const MUMBAI_SVG_LAYOUT = (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-80" style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M 25 5 L 25 50" fill="none" stroke="#FFC20E" strokeWidth="1.5" />
    <path d="M 25 5 L 45 5 L 45 50" fill="none" stroke="#DC2626" strokeWidth="1.5" />
    <path d="M 10 50 L 95 50" fill="none" stroke="#0072CE" strokeWidth="1.5" />
    <path d="M 65 38 L 65 50 L 60 52 L 54 58 L 54 62 L 52 64 L 50 66 L 48 68 L 46 70 L 44 72 L 44 84 L 46 86 L 50 88 L 48 90 L 46 92 L 44 94 L 42 96" fill="none" stroke="#33A3C9" strokeWidth="1.5" />
  </svg>
);

const CITY_MAPS: CityMap[] = [
  {
    name: "Mumbai",
    type: 'svg',
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Mumbai_outline_map.png/600px-Mumbai_outline_map.png",
    svgLayout: MUMBAI_SVG_LAYOUT,
    stations: MUMBAI_METRO_STATIONS
  }
];

// --- HELPER COMPONENTS ---

const TextRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;
        if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
          return <h3 key={idx} className="font-bold text-lg mt-4">{trimmed.replace(/\*/g, '')}</h3>;
        }
        if (trimmed.startsWith('-')) {
           return (
             <div key={idx} className="flex gap-3 pl-2">
               <span className="opacity-50">•</span>
               <span>{trimmed.substring(1).trim()}</span>
             </div>
           );
        }
        return <p key={idx} className="opacity-80 leading-relaxed">{trimmed}</p>;
      })}
    </div>
  );
};

// --- CHATBOT WIDGET ---
const ChatBot: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);

    return (
        <div className={`fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4`}>
            {/* Chat Window */}
            <div 
                className={`
                    w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right
                    ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
                    ${isDarkMode ? 'bg-slate-900 border border-slate-700 text-white' : 'bg-white border border-slate-200 text-slate-900'}
                `}
            >
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-bold">OneTicket Support</h3>
                        <div className="text-xs opacity-80 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="h-80 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="self-start bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm shadow-sm">
                        Hi there! 👋 How can we help you with your daily commute today?
                    </div>
                </div>
                <div className="p-3 border-t dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                    <button className="text-blue-500 hover:text-blue-600">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            {/* Prompt and Toggle Container */}
            <div className="flex items-center gap-4">
                {/* "Have a Query" Prompt */}
                {showPrompt && !isOpen && (
                    <div className={`
                        relative px-4 py-2.5 rounded-xl shadow-lg animate-fade-in flex items-center gap-3
                        ${isDarkMode ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900 border border-slate-100'}
                    `}>
                        <span className="text-sm font-bold whitespace-nowrap">Have a Query?</span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowPrompt(false);
                            }}
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-red-500 hover:text-white' : 'bg-slate-100 hover:bg-red-500 hover:text-white'}`}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        {/* Triangle arrow */}
                        <div className={`
                            absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rotate-45 border-t border-r
                            ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}
                        `}></div>
                    </div>
                )}

                {/* Floating Image Icon Button */}
                <button 
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) setShowPrompt(false);
                    }}
                    className="w-20 h-20 hover:scale-110 transition-transform will-change-transform relative group focus:outline-none"
                >
                    <img 
                        src="https://i.postimg.cc/VLRxnxdR/straight-face-teddy-removebg-preview.png" 
                        alt="Chat Support" 
                        className="w-full h-full object-contain drop-shadow-md" 
                    />
                    
                     {/* Close indicator (small badge instead of full overlay) */}
                    {isOpen && (
                         <div className="absolute top-0 right-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center border border-white shadow-md z-10">
                             <i className="fa-solid fa-xmark text-xs"></i>
                         </div>
                    )}
                </button>
            </div>
        </div>
    );
};

// --- ANIMATION COMPONENTS ---
const SectionBackground: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
       {/* Drifting Blobs */}
       <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob ${isDarkMode ? 'bg-purple-900' : 'bg-purple-300'}`}></div>
       <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-300'}`}></div>
       <div className={`absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-4000 ${isDarkMode ? 'bg-pink-900' : 'bg-pink-300'}`}></div>
    </div>
  );
};

// --- NEW HERO ANIMATION: GEOMETRIC NETWORK ---
const HeroGeometricNetwork: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const color = isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'; 
    const accent = isDarkMode ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.15)'; 

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
            <svg className="w-[150vmax] h-[150vmax] md:w-[80vmax] md:h-[80vmax] animate-spin-slow" viewBox="0 0 500 500" style={{ animationDuration: '60s' }}>
                {/* Ring 1 - Outer Dashed */}
                <circle cx="250" cy="250" r="240" fill="none" stroke={color} strokeWidth="1" strokeDasharray="20 20" />
                
                {/* Ring 2 - Mid Solid Accent */}
                <circle cx="250" cy="250" r="180" fill="none" stroke={accent} strokeWidth="1" />
                
                {/* Ring 3 - Inner Dashed */}
                <circle cx="250" cy="250" r="120" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 8" />
                
                {/* Decorative Nodes on Ring 2 */}
                <circle cx="250" cy="70" r="3" fill={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                <circle cx="430" cy="250" r="3" fill={isDarkMode ? '#A78BFA' : '#8B5CF6'} />
                <circle cx="250" cy="430" r="3" fill={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                <circle cx="70" cy="250" r="3" fill={isDarkMode ? '#A78BFA' : '#8B5CF6'} />
            </svg>
            
            {/* Counter Rotating Ring */}
             <svg className="absolute w-[120vmax] h-[120vmax] md:w-[60vmax] md:h-[60vmax] animate-spin-slow-reverse" viewBox="0 0 500 500" style={{ animationDuration: '40s' }}>
                 <circle cx="250" cy="250" r="200" fill="none" stroke={color} strokeWidth="1" strokeDasharray="40 40" />
            </svg>
        </div>
    );
};

const HeroAuroraAnimation: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
       {/* Animated Orbs - Smoother, ambient backdrop */}
       <div className="absolute inset-0 opacity-30">
           <div 
             className={`absolute -top-[20%] left-[10%] w-[80vw] h-[80vw] rounded-full blur-[120px] animate-pulse ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-400/20'}`}
             style={{ animationDuration: '8s' }}
           ></div>
           
           <div 
             className={`absolute top-[10%] right-[0%] w-[70vw] h-[70vw] rounded-full blur-[120px] animate-pulse ${isDarkMode ? 'bg-purple-600/20' : 'bg-purple-400/20'}`}
             style={{ animationDuration: '10s', animationDelay: '1s' }}
           ></div>

           <div 
             className={`absolute -bottom-[30%] left-[30%] w-[60vw] h-[60vw] rounded-full blur-[120px] animate-pulse ${isDarkMode ? 'bg-cyan-600/20' : 'bg-cyan-400/20'}`}
             style={{ animationDuration: '12s', animationDelay: '2s' }}
           ></div>
       </div>
    </div>
  );
};

// --- SCROLL DRIVEN COMING SOON ---
const ComingSoonScrollSequence: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeCard, setActiveCard] = useState<string | null>(null);
    
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            
            // Only trigger pinning on desktop
            mm.add("(min-width: 768px)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=600", // Reduced scroll distance for faster animation
                        pin: true,
                        scrub: 1,
                    }
                });

                // 1. Initial Pause
                tl.to({}, { duration: 1 });

                // 2. Reveal Monument Card
                tl.fromTo('.cs-card-monument', 
                   { y: '300%', x: '0%', rotate: 0, opacity: 1 }, // Starts off-screen (300%) but visible (opacity 1) so it can slide in
                   { y: '15%', x: '0%', rotate: -8, opacity: 1, duration: 1, ease: 'power1.inOut' } 
                )
                
                // 3. Pause
                .to({}, { duration: 1 }) 
                
                // 4. Reveal Flight Card
                .fromTo('.cs-card-flight',
                   { y: '300%', x: '0%', rotate: 0, opacity: 1 }, // Starts off-screen (300%) but visible
                   { y: '32%', x: '0%', rotate: 8, opacity: 1, duration: 1, ease: 'power1.inOut' }
                )
                
                // 5. Final Pause (Hold the state)
                .to({}, { duration: 2 });
            });
            
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Helper functions for dynamic styling
    const getCardStyle = (cardName: string, activeColorBg: string) => {
        const isActive = activeCard === cardName;
        const isBus = cardName === 'bus';
        const isMonument = cardName === 'monument';
        
        let classes = `cs-card-${cardName} absolute w-[80vw] max-w-[300px] h-[420px] rounded-[2.5rem] p-6 shadow-2xl top-12 transition-all duration-300 cursor-pointer overflow-hidden `;
        
        // Z-Index matching the animation stack
        if (isBus) classes += 'z-10 ';
        else if (isMonument) classes += 'z-20 ';
        else classes += 'z-30 ';

        // Color Logic
        if (isActive) {
            classes += `${activeColorBg} text-white scale-105 `;
        } else {
            classes += isDarkMode 
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 ' 
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300 ';
        }
        
        return classes;
    };

    const getIconBoxStyle = (isActive: boolean) => {
        if (isActive) return "bg-white/20 backdrop-blur-md border-white/20 text-white";
        return isDarkMode 
            ? "bg-slate-700 border-slate-600 text-slate-300" 
            : "bg-white border-slate-300 text-slate-500";
    };

    const getArrowStyle = (isActive: boolean) => {
        if (isActive) return "bg-white text-slate-900 shadow-lg";
        return isDarkMode
            ? "bg-slate-700 text-slate-300 shadow-none"
            : "bg-slate-300 text-slate-600 shadow-none";
    };

    return (
        <div ref={containerRef} className="min-h-screen w-full flex items-center justify-center relative overflow-hidden py-12">
            <SectionBackground isDarkMode={isDarkMode} />
            
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center h-full gap-12 lg:gap-20">
                 {/* Left: Text Content */}
                 <div className="w-full md:w-1/2 flex flex-col justify-center mb-12 md:mb-0">
                    <h2 className="text-5xl md:text-8xl font-display font-bold leading-tight mb-6">
                        Coming Soon
                        <svg className="block w-48 h-4 mt-2 text-purple-400 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 25 10 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                        </svg>
                    </h2>
                    <p className="text-xl opacity-60 max-w-lg mb-8">
                        We are building a comprehensive mobility ecosystem. As you scroll, discover what's next for OneTicket.
                    </p>
                    <div className="space-y-4">
                        {COMING_SOON_FEATURES.map((feature, idx) => (
                            <div 
                                key={idx} 
                                className="flex items-center gap-4 group opacity-50 hover:opacity-100 transition-opacity cursor-pointer" 
                                onMouseEnter={() => setActiveCard(feature.id)}
                                onMouseLeave={() => setActiveCard(null)}
                            >
                                <span className="text-sm font-bold opacity-50">0{idx + 1}</span>
                                <h4 className={`text-xl font-bold transition-colors ${activeCard === feature.id ? 'text-blue-500' : ''}`}>{feature.title}</h4>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Right: Card Stack Animation Area */}
                 <div className="w-full md:w-1/2 h-[600px] md:h-[700px] relative perspective-1000 flex items-start justify-center pt-12">
                    
                    {/* CARD 1: BUS */}
                    <div 
                        className={getCardStyle('bus', 'bg-blue-600')}
                        onMouseEnter={() => setActiveCard('bus')}
                        onMouseLeave={() => setActiveCard(null)}
                    >
                        <div className="h-full flex flex-col justify-between relative z-10">
                            <div className="flex justify-between items-start">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border transition-colors ${getIconBoxStyle(activeCard === 'bus')}`}>
                                    <i className="fa-solid fa-bus"></i>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${getArrowStyle(activeCard === 'bus')}`}>
                                    <i className={`fa-solid fa-arrow-right -rotate-45 transition-transform duration-300 ${activeCard === 'bus' ? 'rotate-0' : ''}`}></i>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-3xl font-display font-bold leading-tight mb-4">Bus Booking</h3>
                                <div className={`w-full h-px mb-4 transition-colors ${activeCard === 'bus' ? 'bg-white/30' : 'bg-current opacity-10'}`}></div>
                                <p className="text-sm font-medium opacity-90 leading-relaxed">Book intercity and local bus tickets effortlessly.</p>
                            </div>
                        </div>
                        {/* Sketch Illustration */}
                        <div className={`absolute inset-0 w-full h-full opacity-20 pointer-events-none transition-transform duration-500 ${activeCard === 'bus' ? 'scale-110' : 'scale-100'}`}>
                           <SketchBus />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-[2.5rem] transition-opacity duration-300 ${activeCard === 'bus' ? 'opacity-100' : 'opacity-0'}`}></div>
                    </div>

                    {/* CARD 2: MONUMENT - Initially hidden offscreen to prevent FOUC/Preload visibility */}
                    <div 
                        className={`${getCardStyle('monument', 'bg-orange-500')} translate-y-[300%] opacity-0`}
                        onMouseEnter={() => setActiveCard('monument')}
                        onMouseLeave={() => setActiveCard(null)}
                    >
                        <div className="h-full flex flex-col justify-between relative z-10">
                            <div className="flex justify-between items-start">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border transition-colors ${getIconBoxStyle(activeCard === 'monument')}`}>
                                    <i className="fa-solid fa-landmark"></i>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${getArrowStyle(activeCard === 'monument')}`}>
                                    <i className={`fa-solid fa-arrow-right -rotate-45 transition-transform duration-300 ${activeCard === 'monument' ? 'rotate-0' : ''}`}></i>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-3xl font-display font-bold leading-tight mb-4">Monument Booking</h3>
                                <div className={`w-full h-px mb-4 transition-colors ${activeCard === 'monument' ? 'bg-white/30' : 'bg-current opacity-10'}`}></div>
                                <p className="text-sm font-medium opacity-90 leading-relaxed">Skip the line at India's heritage sites.</p>
                            </div>
                        </div>
                        {/* Sketch Illustration */}
                         <div className={`absolute inset-0 w-full h-full opacity-20 pointer-events-none transition-transform duration-500 ${activeCard === 'monument' ? 'scale-110' : 'scale-100'}`}>
                           <SketchMonument />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-[2.5rem] transition-opacity duration-300 ${activeCard === 'monument' ? 'opacity-100' : 'opacity-0'}`}></div>
                    </div>

                    {/* CARD 3: FLIGHT - Initially hidden offscreen to prevent FOUC/Preload visibility */}
                    <div 
                        className={`${getCardStyle('flight', 'bg-cyan-500')} translate-y-[300%] opacity-0`}
                        onMouseEnter={() => setActiveCard('flight')}
                        onMouseLeave={() => setActiveCard(null)}
                    >
                        <div className="h-full flex flex-col justify-between relative z-10">
                            <div className="flex justify-between items-start">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border transition-colors ${getIconBoxStyle(activeCard === 'flight')}`}>
                                    <i className="fa-solid fa-plane-departure"></i>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${getArrowStyle(activeCard === 'flight')}`}>
                                    <i className={`fa-solid fa-arrow-right -rotate-45 transition-transform duration-300 ${activeCard === 'flight' ? 'rotate-0' : ''}`}></i>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-3xl font-display font-bold leading-tight mb-4">Flight Booking</h3>
                                <div className={`w-full h-px mb-4 transition-colors ${activeCard === 'flight' ? 'bg-white/30' : 'bg-current opacity-10'}`}></div>
                                <p className="text-sm font-medium opacity-90 leading-relaxed">Domestic and international booking.</p>
                            </div>
                        </div>
                        {/* Sketch Illustration */}
                        <div className={`absolute inset-0 w-full h-full opacity-20 pointer-events-none transition-transform duration-500 ${activeCard === 'flight' ? 'scale-110' : 'scale-100'}`}>
                           <SketchFlight />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-[2.5rem] transition-opacity duration-300 ${activeCard === 'flight' ? 'opacity-100' : 'opacity-0'}`}></div>
                    </div>

                 </div>
            </div>
        </div>
    );
};

// --- CUSTOM HOOK FOR SCROLL ---
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
};


// --- APP COMPONENT ---

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMap, setActiveMap] = useState<CityMap | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [selectedCityLabel, setSelectedCityLabel] = useState('MUM');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  
  const scrollY = useScrollPosition();
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Dynamic Header Position Logic
  const notificationHeight = 50; 
  const headerBaseTop = 0; 
  
  const headerTop = showNotification 
    ? Math.max(headerBaseTop, notificationHeight - scrollY + headerBaseTop) 
    : headerBaseTop;

  // Content map for modals
  const modalContent: Record<string, { title: string, content: string }> = {
    'terms': { title: 'Terms of Service', content: TERMS_OF_SERVICE },
    'privacy': { title: 'Privacy Policy', content: PRIVACY_POLICY },
    'about': { title: 'About Us', content: ABOUT_CONTENT },
    'feedback': { title: 'Feedback', content: FEEDBACK_CONTENT },
    'complaints': { title: 'Complaints', content: COMPLAINT_CONTENT },
    'guidelines': { title: 'Guidelines', content: GUIDELINES_CONTENT },
    'city_coming_soon': { title: 'Coming Soon', content: 'This city map is currently under development. Stay tuned!' }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCityLabel(city);
    setIsCityDropdownOpen(false);
    if (city === 'MUM') {
      setActiveMap(CITY_MAPS[0]);
    } else {
      setActiveModal('city_coming_soon');
    }
  };

  // Mobile Menu Modal Component
  const MobileMenu = () => (
    <div 
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-[60] backdrop-blur-xl transition-all duration-300 flex items-center justify-center p-6 animate-fade-in ${isDarkMode ? 'bg-black/90 text-white' : 'bg-white/90 text-slate-900'}`}
    >
        <button 
          onClick={() => setIsMenuOpen(false)} 
          className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-900'}`}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex flex-col gap-6 text-center w-full max-w-sm"
        >
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">Menu</h2>
            <button onClick={() => { setActiveModal('terms'); setIsMenuOpen(false); }} className="text-2xl font-display font-bold hover:text-blue-500 transition-colors">Terms of Service</button>
            <button onClick={() => { setActiveModal('privacy'); setIsMenuOpen(false); }} className="text-2xl font-display font-bold hover:text-blue-500 transition-colors">Privacy Policy</button>
            <button onClick={() => { setActiveModal('feedback'); setIsMenuOpen(false); }} className="text-2xl font-display font-bold hover:text-blue-500 transition-colors">Give a Feedback</button>
            <button onClick={() => { setActiveModal('about'); setIsMenuOpen(false); }} className="text-2xl font-display font-bold hover:text-blue-500 transition-colors">About Us</button>
            <div className="w-full h-px bg-current opacity-10 my-4"></div>
            <button onClick={() => { setActiveModal('complaints'); setIsMenuOpen(false); }} className="text-lg opacity-70 hover:opacity-100 hover:text-blue-500 transition-colors">Have a Complaint?</button>
        </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* GLOBAL STYLES & ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-spin-slow { animation: spin 60s linear infinite; }
        .animate-spin-slow-reverse { animation: spin 40s linear infinite reverse; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Perspective utilities for card stack */
        .perspective-1000 { perspective: 1000px; }
      `}} />

      {/* GLOBAL FIXED BACKGROUND: GRID ONLY, NO NOISE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Consistent Light Grid */}
          <div className="absolute inset-0 opacity-20"
            style={{
                backgroundImage: `
                  linear-gradient(to right, ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 1px, transparent 1px),
                  linear-gradient(to bottom, ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px'
            }}
          ></div>
      </div>

      {/* Top Banner (Notification) */}
      {showNotification && (
        <div className="bg-slate-900 text-white px-4 py-3 text-center text-sm font-medium relative z-50 flex justify-center items-center gap-4 border-b border-white/5 h-[50px]">
           <div className="flex-1 flex justify-center gap-2">
             <span>Auto and Cabs are Live Now in Bengaluru!!</span>
             <a href="#" className="underline decoration-blue-500 hover:text-blue-400">Read More →</a>
           </div>
           <button 
             onClick={() => setShowNotification(false)}
             className="opacity-60 hover:opacity-100 p-1"
             aria-label="Close notification"
           >
             <i className="fa-solid fa-xmark text-base"></i>
           </button>
        </div>
      )}

      {/* HEADER */}
      <header 
        className="fixed left-0 right-0 z-40 px-4 py-2 flex justify-between items-start bg-transparent pointer-events-none transition-all duration-300 ease-out"
        style={{ top: `${headerTop}px` }}
      >
        <div className="pointer-events-auto">
           <div className="h-24 md:h-36 transition-all">
             <img src="https://i.postimg.cc/sD1KXVYg/logoimage-set-up-removebg-preview.png" alt="OneTicket" className="h-full w-auto" />
           </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-3 relative mt-4">
           <div className="relative">
              <button 
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-black text-[10px] leading-tight transition-all shadow-md hover:scale-110 ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-900 hover:bg-slate-100'}`}
              >
                <span>{selectedCityLabel}</span>
              </button>
              
              {isCityDropdownOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-32 rounded-2xl shadow-xl overflow-hidden py-2 animate-fade-in z-50 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
                      <button onClick={() => handleCitySelect('MUM')} className="w-full text-left px-4 py-2 font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex justify-between items-center text-sm">
                          MUM {selectedCityLabel === 'MUM' && <i className="fa-solid fa-check text-blue-500 text-xs"></i>}
                      </button>
                      <button onClick={() => handleCitySelect('DEL')} className="w-full text-left px-4 py-2 font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex justify-between items-center text-sm">
                          DEL {selectedCityLabel === 'DEL' && <i className="fa-solid fa-check text-blue-500 text-xs"></i>}
                      </button>
                      <button onClick={() => handleCitySelect('BLR')} className="w-full text-left px-4 py-2 font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex justify-between items-center text-sm">
                          BLR {selectedCityLabel === 'BLR' && <i className="fa-solid fa-check text-blue-500 text-xs"></i>}
                      </button>
                  </div>
              )}
           </div>

           <button 
             onClick={toggleTheme}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-md hover:bg-slate-100'}`}
           >
             <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
           </button>
           <button 
             onClick={() => setIsMenuOpen(true)}
             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-900 shadow-md hover:bg-slate-100'}`}
           >
             <i className="fa-solid fa-bars text-lg"></i>
           </button>
        </div>
      </header>

      <main>
        {/* HERO SECTION - Sticky for Curtain Effect */}
        <section className="sticky top-0 h-screen flex flex-col items-center justify-center relative pb-32 overflow-hidden z-0" style={{ transform: `scale(${Math.max(0.9, 1 - scrollY * 0.0005)})`, opacity: Math.max(0, 1 - scrollY * 0.002) }}>
          
          <HeroAuroraAnimation isDarkMode={isDarkMode} />
          <HeroGeometricNetwork isDarkMode={isDarkMode} />
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-block mb-8 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm animate-fade-in-up">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live in Mumbai, Delhi, Bengaluru
              </span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tight mb-4 leading-tight pb-2 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Urban Travel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 pb-2 pr-2 inline-block">Simplified.</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-bold tracking-wide opacity-80 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
               Powered by <span className="text-blue-600 font-bold">SequelString AI</span> & Enabled by <span className="text-blue-600 font-bold">ONDC</span>
            </p>
          </div>
        </section>

        {/* CONTENT WRAPPER - Relative z-10 to slide over hero */}
        <div className={`relative z-10 transition-colors duration-500 shadow-[0_-50px_100px_rgba(0,0,0,0.1)] rounded-t-[3rem] md:rounded-t-[4rem] ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
          
          <ScrollySection isDarkMode={isDarkMode} />

          {/* SAFETY FEATURES SECTION */}
          <div className={`relative py-24 mt-12 overflow-hidden`}>
            <SectionBackground isDarkMode={isDarkMode} />
            
            <div className="relative z-10 max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-7xl font-display font-bold mb-6">
                  Safety isn't optional. <br/> <span className="text-blue-500">It's standard.</span>
                </h2>
                <p className="text-xl opacity-60 max-w-2xl mx-auto">
                  Whether you take a cab or an auto, we ensure every ride is tracked, verified, and secure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {SAFETY_FEATURES.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className={`group p-8 flex flex-col justify-between rounded-[2.5rem] border transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 shadow-lg hover:shadow-2xl backdrop-blur-md relative overflow-hidden ${isDarkMode ? `bg-slate-900/60 border-slate-700 hover:${feature.shadow}` : `bg-white/60 border-slate-200 hover:${feature.shadow}`}`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl ${feature.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] shadow-md`}>
                        <i className={`fa-solid ${feature.icon}`}></i>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50/80 px-2 py-1 rounded-lg border border-blue-100">Secure</span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-3xl font-black mb-3 leading-tight">{feature.title}</h3>
                      <p className="opacity-70 text-lg leading-relaxed">{feature.desc}</p>
                    </div>
                    
                    {/* Decor Icon in corner */}
                    <div className={`absolute -right-4 -bottom-4 text-9xl opacity-[0.05] -rotate-12 pointer-events-none transition-transform group-hover:scale-110 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                         <i className={`fa-solid ${feature.icon}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* BENTO GRID SECTION */}
          <div className="max-w-7xl mx-auto px-6 mt-12 pb-16 relative">
            <h2 className="text-5xl md:text-8xl font-display font-bold text-center mb-16 relative z-10">
              Built for the <br />
              <span className="text-slate-400 opacity-50">daily commute.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className={`col-span-1 md:col-span-2 p-10 rounded-[2.5rem] border flex flex-col justify-between group overflow-hidden relative min-h-[400px] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                {/* Subtle Grid Bg */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                <div className="relative z-10">
                  <h3 className="text-4xl font-black mb-4 tracking-tight">Precision Timing</h3>
                  <p className="opacity-70 max-w-md mb-6 leading-relaxed text-lg">
                    We sync directly with the metro dispatch APIs. If the train is delayed at Rajiv Chowk by 30 seconds, you'll know instantly.
                  </p>
                  <div className="flex gap-2">
                    <span className={`px-4 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Real-time</span>
                    <span className={`px-4 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>GPS Sync</span>
                  </div>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-[80px] group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors duration-500"></div>
              </div>

              <div className={`col-span-1 md:col-span-1 p-10 rounded-[2.5rem] border flex flex-col items-center justify-center text-center group min-h-[400px] relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(45deg, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10">
                   <div className="text-7xl font-display font-black text-green-500 mb-4 group-hover:scale-110 transition-transform">₹12k</div>
                   <div className="opacity-60 font-bold text-xl">Avg. Savings / Year</div>
                </div>
              </div>

              <div className={`col-span-1 md:col-span-1 p-10 rounded-[2.5rem] border relative overflow-hidden group flex flex-col min-h-[400px] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-orange-500/30 flex-shrink-0">
                          <i className="fa-solid fa-map"></i>
                        </div>
                        <h3 className="text-3xl font-black leading-none">Network Map</h3>
                    </div>
                    
                    <div className="space-y-6 flex-1">
                        <div>
                            <div className="text-sm font-black opacity-90 mb-2 tracking-tight">MUMBAI</div>
                            <div className="flex flex-wrap gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    <span className="w-2 h-2 rounded-full bg-red-600"></span> Red
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Blue
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Aqua
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Yellow
                                </span>
                            </div>
                        </div>
                        
                        <div className={`pt-4 border-t border-dashed ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                            <div className="text-sm font-black opacity-90 mb-2 tracking-tight">DELHI NCR</div>
                            <span className={`inline-block px-2 py-1 rounded border text-[10px] font-bold uppercase ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                                All Lines Operational
                            </span>
                        </div>

                        <div className={`pt-4 border-t border-dashed ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                            <div className="text-sm font-black opacity-90 mb-2 tracking-tight">BENGALURU</div>
                            <div className="flex flex-wrap gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    <span className="w-2 h-2 rounded-full bg-purple-600"></span> Purple
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Green
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Yellow
                                </span>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>

              <div className={`col-span-1 md:col-span-2 p-10 rounded-[2.5rem] border flex flex-col justify-center relative overflow-hidden group min-h-[400px] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="relative z-10 max-w-lg">
                    <h3 className="text-4xl font-black mb-4 tracking-tight">Offline Maps</h3>
                    <p className="opacity-70 leading-relaxed text-lg">
                      No signal in the tunnel? Your ticket and saved route maps still work perfectly.
                    </p>
                </div>
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-[15rem] opacity-[0.05] pointer-events-none text-slate-500 group-hover:scale-110 transition-transform duration-700">
                    <i className="fa-regular fa-map"></i>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES GRID */}
          <div className="relative py-16 overflow-hidden">
            <SectionBackground isDarkMode={isDarkMode} />
            <div className="relative z-10 max-w-7xl mx-auto px-6">
              
              <div className="mb-32">
                <h3 className="text-center text-5xl md:text-8xl font-display font-black mb-16">
                  More than just <br/>
                  <span className="text-blue-500">a metro app.</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {OUR_FEATURES.map((feature, i) => (
                    <div key={i} className={`group p-8 min-h-[280px] flex flex-col justify-between rounded-[2.5rem] border transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 shadow-lg hover:shadow-2xl backdrop-blur-sm relative overflow-hidden ${isDarkMode ? `bg-slate-900/60 border-slate-800 hover:${feature.shadow}` : `bg-white/60 border-slate-200 hover:${feature.shadow}`}`}>
                        {/* Background Decor */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl ${feature.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] shadow-lg`}>
                            {feature.customIcon ? (
                                <div className="w-8 h-8">{feature.customIcon}</div>
                            ) : (
                                <i className={`fa-solid ${feature.icon}`}></i>
                            )}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-50/80 px-2 py-1 rounded border border-green-100">Live</span>
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-2xl font-black mb-2">{feature.title}</h4>
                          <p className="opacity-70 leading-relaxed text-sm">{feature.desc}</p>
                        </div>
                        
                        {/* Big Decor Icon */}
                        <div className={`absolute -right-4 -bottom-4 text-8xl opacity-[0.04] -rotate-12 pointer-events-none transition-transform group-hover:scale-110 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                           {feature.customIcon ? (
                               <div className="w-[1em] h-[1em]">{feature.customIcon}</div>
                           ) : (
                               <i className={`fa-solid ${feature.icon}`}></i>
                           )}
                        </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* COMING SOON - SCROLL DRIVEN SEQUENCE */}
          <ComingSoonScrollSequence isDarkMode={isDarkMode} />

          {/* DOWNLOAD SECTION */}
          <div className={`pt-12 pb-4 relative overflow-hidden transition-colors duration-500`}>
             <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                <h2 className="text-6xl md:text-7xl font-display font-bold mb-12 tracking-tight">Next stop: Your phone.</h2>
                
                <div className="w-80 h-80 mb-12 p-4 bg-white rounded-3xl shadow-xl flex items-center justify-center">
                    <img src="https://i.postimg.cc/ydVyzB1t/qr.jpg" alt="Download App QR" className="w-full h-full object-contain" />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                    <a href="https://apps.apple.com/in/app/oneticketindia/id6745471446" target="_blank" rel="noopener noreferrer" className={`px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-4 transition-all min-w-[220px] shadow-xl hover:shadow-2xl hover:scale-105 ${isDarkMode ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}>
                        <i className="fa-brands fa-apple text-4xl"></i>
                        <div className="text-left leading-none">
                            <div className="text-xs uppercase opacity-80 font-medium mb-1">Download on the</div>
                            <div className="text-2xl tracking-tight">App Store</div>
                        </div>
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=com.oneticket&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className={`px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-4 transition-all min-w-[220px] shadow-xl hover:shadow-2xl hover:scale-105 ${isDarkMode ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-[#1a1a1a] text-white hover:bg-black'}`}>
                        <i className="fa-brands fa-google-play text-3xl"></i>
                        <div className="text-left leading-none">
                            <div className="text-xs uppercase opacity-80 font-medium mb-1">GET IT ON</div>
                            <div className="text-2xl tracking-tight">Google Play</div>
                        </div>
                    </a>
                </div>

                <div className={`w-full h-px max-w-sm mb-12 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                <div className="text-center mb-6">
                    <p className="opacity-60 text-lg mb-2">Need help with a ticket?</p>
                    <a href="mailto:support@oneticket.co.in" className="text-xl font-bold hover:text-blue-600 transition-colors">support@oneticket.co.in</a>
                </div>

                <div className="flex gap-8 text-2xl opacity-40 hover:opacity-100 transition-opacity mb-2">
                    <a href="https://www.instagram.com/oneticket.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#E1306C] transition-colors"><i className="fa-brands fa-instagram"></i></a>
                    <a href="https://x.com/OneTicketIndia" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors"><i className="fa-brands fa-x-twitter"></i></a>
                    <a href="https://www.linkedin.com/company/oneticket-india" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077B5] transition-colors"><i className="fa-brands fa-linkedin"></i></a>
                    <a href="https://www.youtube.com/@oneticket_india" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF0000] transition-colors"><i className="fa-brands fa-youtube"></i></a>
                </div>
             </div>
          </div>

          {/* FOOTER - Moved Inside Content Wrapper for Background Consistency */}
          <footer className={`relative pt-2 pb-24 overflow-hidden`}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
               <h1 className={`text-[13vw] font-display font-bold whitespace-nowrap ${isDarkMode ? 'text-slate-800' : 'text-slate-200'}`}>OneTicket</h1>
            </div>

            <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm opacity-60 max-w-4xl w-full">
                {ADDRESSES.map((addr, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <strong className="block mb-2 text-base font-bold opacity-100">{addr.city}</strong>
                        {addr.lines.map((line, l) => <div key={l}>{line}</div>)}
                    </div>
                ))}
              </div>
            </div>
          </footer>

        </div>
      </main>
      
      {/* CHATBOT */}
      <ChatBot isDarkMode={isDarkMode} />

      {/* MODALS */}
      {activeMap && (
        <MetroMapViewer 
          cityMap={activeMap} 
          onClose={() => setActiveMap(null)}
          isDarkMode={isDarkMode}
        />
      )}

      {isMenuOpen && <MobileMenu />}

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className={`w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
              <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold">{modalContent[activeModal]?.title}</h3>
                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="p-8 overflow-y-auto">
                 {activeModal === 'city_coming_soon' ? (
                   <div className="flex flex-col items-center text-center py-12">
                     <i className="fa-solid fa-person-digging text-6xl text-slate-300 mb-6"></i>
                     <h2 className="text-3xl font-display font-bold mb-4">Coming Soon!</h2>
                     <p className="text-lg opacity-70 max-w-md">
                       We are working hard to bring the {selectedCityLabel === 'DEL' ? 'Delhi' : 'Bengaluru'} map to you. Check back later for updates!
                     </p>
                   </div>
                 ) : (
                   <TextRenderer content={modalContent[activeModal]?.content || ''} />
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;
