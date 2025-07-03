export const mockMembers = [
  {
    id: '1',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    scenario: 'renewal_needed',
    eligibility: {
      status: 'renewal_needed',
      renewalDate: '2024-02-15',
      requiredDocuments: ['income_verification', 'address_proof']
    },
    contact: {
      language: 'Spanish',
      preferredContactMethod: 'SMS'
    },
    workRequirement: {
      required: false,
      hoursReported: 0
    }
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Johnson',
    scenario: 'work_compliance',
    eligibility: {
      status: 'active',
      renewalDate: '2024-06-30',
      requiredDocuments: []
    },
    contact: {
      language: 'English',
      preferredContactMethod: 'Email'
    },
    workRequirement: {
      required: true,
      hoursReported: 45
    }
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Chen',
    scenario: 'documents_missing',
    eligibility: {
      status: 'active',
      renewalDate: '2024-08-20',
      requiredDocuments: ['medical_records', 'income_verification', 'identity_proof']
    },
    contact: {
      language: 'English',
      preferredContactMethod: 'Email'
    },
    workRequirement: {
      required: false,
      hoursReported: 0
    }
  },
  {
    id: '4',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    scenario: 'multilingual',
    eligibility: {
      status: 'active',
      renewalDate: '2024-05-10',
      requiredDocuments: []
    },
    contact: {
      language: 'Arabic',
      preferredContactMethod: 'Phone'
    },
    workRequirement: {
      required: true,
      hoursReported: 85
    }
  },
  {
    id: '5',
    firstName: 'Jennifer',
    lastName: 'Smith',
    scenario: 'compliant',
    eligibility: {
      status: 'active',
      renewalDate: '2024-12-01',
      requiredDocuments: []
    },
    contact: {
      language: 'English',
      preferredContactMethod: 'Email'
    },
    workRequirement: {
      required: false,
      hoursReported: 0
    }
  }
];