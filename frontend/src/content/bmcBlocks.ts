import { BMCBlockMeta, BMCBlockId } from '../types/bmc';

export const bmcBlocksMeta: BMCBlockMeta[] = [
  {
    id: 'customerSegments',
    title: 'Customer Segments',
    gridArea: 'customer-segments',
    color: '#FFE5B4',
    description: 'Define the different groups of people or organizations your business aims to reach and serve. Customer segments are the heart of your business model - they determine who you create value for.',
    placeholder: 'Describe your target customer segments in detail...',
    guidanceQuestions: [
      'Who are your most important customers?',
      'What are their key characteristics, needs, and behaviors?',
      'Are you serving a mass market, niche market, segmented, diversified, or multi-sided platform?',
      'What problems are they trying to solve?',
      'What jobs are they trying to get done?'
    ],
    examples: [
      'B2B SaaS: Small to medium businesses (10-50 employees) in the retail sector, lacking technical expertise, needing inventory management solutions',
      'E-commerce: Budget-conscious millennials (25-35 years old) interested in sustainable fashion, primarily shopping on mobile devices',
      'Healthcare: Urban professionals aged 30-50 with chronic health conditions, seeking convenient telemedicine services'
    ]
  },
  {
    id: 'valuePropositions',
    title: 'Value Propositions',
    gridArea: 'value-propositions',
    color: '#FFD700',
    description: 'Describe the bundle of products and services that create value for your customer segments. What makes your offering unique? Why would customers choose you over alternatives?',
    placeholder: 'Describe the unique value you offer to customers...',
    guidanceQuestions: [
      'What value do you deliver to each customer segment?',
      'Which customer problems are you helping to solve?',
      'Which customer needs are you satisfying?',
      'What bundles of products/services are you offering to each segment?',
      'What makes your offering different from competitors?'
    ],
    examples: [
      'Real-time inventory tracking with AI-powered demand forecasting, reducing stockouts by 40% with zero technical setup required',
      'Curated sustainable fashion marketplace with carbon-neutral shipping and transparent supply chain tracking',
      '24/7 access to board-certified doctors via video chat with prescriptions delivered within 2 hours'
    ]
  },
  {
    id: 'channels',
    title: 'Channels',
    gridArea: 'channels',
    color: '#FFE5B4',
    description: 'Describe how your company communicates with and reaches its customer segments to deliver your value proposition. Channels include communication, distribution, and sales channels.',
    placeholder: 'List and describe your channels for reaching customers...',
    guidanceQuestions: [
      'Through which channels do your customers want to be reached?',
      'How are you reaching them now? Which channels work best?',
      'How are your channels integrated? Which are most cost-efficient?',
      'How do you raise awareness about your products/services?',
      'How do you help customers evaluate your value proposition?'
    ],
    examples: [
      'Direct sales team for enterprise clients, self-service website for SMBs, partner integrations with accounting software',
      'Instagram and TikTok for awareness, mobile app for purchases, email marketing for retention, influencer partnerships',
      'Healthcare provider referrals, Google search ads, mobile app (iOS/Android), insurance company partnerships'
    ]
  },
  {
    id: 'customerRelationships',
    title: 'Customer Relationships',
    gridArea: 'customer-relationships',
    color: '#FFE5B4',
    description: 'Describe the types of relationships you establish with specific customer segments. Think about how you acquire, retain, and grow your customer base.',
    placeholder: 'Describe how you interact with and support customers...',
    guidanceQuestions: [
      'What type of relationship does each customer segment expect?',
      'Which ones have you established? How costly are they?',
      'How are they integrated with the rest of your business model?',
      'Are you focused on customer acquisition, retention, or upselling?',
      'Is the relationship personal, automated, self-service, or community-driven?'
    ],
    examples: [
      'Dedicated account manager for enterprise clients, chatbot support for SMBs, online knowledge base and community forum',
      'Personalized styling recommendations via AI, loyalty rewards program, Instagram community engagement, monthly subscription model',
      'Personal assistance via video consultations, automated appointment reminders, patient health tracking app, 24/7 AI symptom checker'
    ]
  },
  {
    id: 'revenueStreams',
    title: 'Revenue Streams',
    gridArea: 'revenue-streams',
    color: '#90EE90',
    description: 'Describe how your company generates cash from each customer segment. For what value are customers really willing to pay? How would they prefer to pay?',
    placeholder: 'Detail your revenue sources and pricing models...',
    guidanceQuestions: [
      'For what value are your customers really willing to pay?',
      'For what do they currently pay? How are they currently paying?',
      'How would they prefer to pay?',
      'What is your pricing mechanism (fixed, dynamic, volume-based)?',
      'What is the revenue type (asset sale, usage fee, subscription, licensing, advertising)?'
    ],
    examples: [
      'Monthly subscription: $49 (Starter), $149 (Professional), $499 (Enterprise). Annual contracts with 20% discount. Implementation fee: $500-$5000 based on company size',
      'Commission on each sale (15%), premium seller subscriptions ($29/month), featured listings ($50/product/month), affiliate partnerships (5%)',
      'Per-consultation fee ($40), monthly subscription ($29 for unlimited messaging), insurance reimbursements, employer wellness programs (B2B contracts)'
    ]
  },
  {
    id: 'keyResources',
    title: 'Key Resources',
    gridArea: 'key-resources',
    color: '#FFB6C1',
    description: 'Describe the most important assets required to make your business model work. These can be physical, intellectual, human, or financial resources.',
    placeholder: 'List the critical resources your business needs...',
    guidanceQuestions: [
      'What key resources do your value propositions require?',
      'What resources do your distribution channels, customer relationships, and revenue streams require?',
      'What resources are physical, intellectual, human, or financial?',
      'What resources do you own vs. lease vs. acquire from partners?',
      'What makes these resources difficult to replicate?'
    ],
    examples: [
      'Cloud infrastructure (AWS), proprietary AI algorithms, 15-person engineering team, $2M in funding, partnerships with retail POS systems',
      'Verified sustainable brand network (500+ brands), mobile app platform, content creators community, warehouse and logistics network',
      'Network of 2,000+ licensed physicians, HIPAA-compliant telemedicine platform, pharmacy partnerships, medical AI diagnostic tools, $5M insurance reserve'
    ]
  },
  {
    id: 'keyActivities',
    title: 'Key Activities',
    gridArea: 'key-activities',
    color: '#FFB6C1',
    description: 'Describe the most important things your company must do to make the business model work. These are the crucial actions required to operate successfully.',
    placeholder: 'Outline the essential activities for your business...',
    guidanceQuestions: [
      'What key activities do your value propositions require?',
      'What activities do your distribution channels, customer relationships, and revenue streams require?',
      'Are they production, problem-solving, or platform/network activities?',
      'What activities are you performing in-house vs. outsourcing?',
      'What activities differentiate you from competitors?'
    ],
    examples: [
      'Software development and AI model training, customer onboarding and training, API integrations with partner systems, 24/7 technical support, data security and compliance',
      'Supplier vetting and sustainability audits, inventory management, marketing content creation, logistics coordination, customer service',
      'Doctor recruitment and credentialing, platform maintenance and updates, patient intake and triage, prescription fulfillment coordination, regulatory compliance monitoring'
    ]
  },
  {
    id: 'keyPartnerships',
    title: 'Key Partnerships',
    gridArea: 'key-partnerships',
    color: '#FFB6C1',
    description: 'Describe the network of suppliers and partners that make your business model work. Who are your key partners and suppliers? What motivates these partnerships?',
    placeholder: 'Identify your strategic partners and suppliers...',
    guidanceQuestions: [
      'Who are your key partners and suppliers?',
      'What key resources are you acquiring from partners?',
      'What key activities do partners perform?',
      'Are these optimization partnerships, reduction of risk, or acquisition of resources?',
      'What makes these partnerships strategic vs. transactional?'
    ],
    examples: [
      'QuickBooks and Xero (accounting integration partners), ShopifyPOS and Square (POS integrations), AWS (cloud infrastructure), retail industry consultants, reseller partners',
      'Sustainable clothing manufacturers (Bangladesh, Portugal), shipping carriers with carbon offset programs, payment processors (Stripe), Instagram and TikTok (advertising platforms)',
      'State medical boards (licensing), pharmacy chains (prescription fulfillment), insurance companies (reimbursements), medical device manufacturers, electronic health record systems'
    ]
  },
  {
    id: 'costStructure',
    title: 'Cost Structure',
    gridArea: 'cost-structure',
    color: '#FFB6C1',
    description: 'Describe all costs incurred to operate your business model. What are the most important costs? Which key resources and activities are most expensive?',
    placeholder: 'Break down your major cost categories...',
    guidanceQuestions: [
      'What are the most important costs inherent in your business model?',
      'Which key resources are most expensive?',
      'Which key activities are most expensive?',
      'Is your business cost-driven (focus on minimizing costs) or value-driven (focus on value creation)?',
      'What are your fixed vs. variable costs?'
    ],
    examples: [
      'Engineering salaries (40%), AWS infrastructure (20%), sales & marketing (25%), customer support (10%), office & administrative (5%). Mostly fixed costs, scales with customer count',
      'Product procurement (35%), shipping & logistics (20%), marketing & advertising (30%), platform development (10%), customer service (5%). High variable costs tied to sales volume',
      'Physician compensation (50%), technology & platform (20%), insurance & legal compliance (15%), marketing (10%), administrative (5%). Mix of fixed and per-consultation variable costs'
    ]
  }
];

// Helper function to get block metadata by ID
export const getBlockMeta = (blockId: BMCBlockId): BMCBlockMeta | undefined => {
  return bmcBlocksMeta.find(block => block.id === blockId);
};

// Get all block IDs in canvas display order
export const getBlockOrder = (): BMCBlockId[] => [
  'keyPartnerships',
  'keyActivities',
  'valuePropositions',
  'customerRelationships',
  'customerSegments',
  'keyResources',
  'channels',
  'costStructure',
  'revenueStreams'
];

