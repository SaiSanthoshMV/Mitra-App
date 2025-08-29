'use client';

import React, { useState, useMemo } from 'react';
import styles from './PlacementDetails.module.css';

interface CompanyDetails {
  description: string;
  jobRoles: string[];
  requirements: string[];
  process: string;
  location: string;
  benefits: string;
}

interface Company {
  id: number;
  name: string;
  offers: number;
  month: string;
  ctc: string;
  details: CompanyDetails;
}

const PlacementDetails: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const companiesData: Company[] = [
    {
      id: 1,
      name: "Google",
      offers: 12,
      month: "September",
      ctc: "₹45 LPA",
      details: {
        description: "Google conducted campus recruitment for software engineering positions across various teams including Search, Cloud, and Android development.",
        jobRoles: ["Software Engineer", "Data Scientist", "Product Manager"],
        requirements: ["Strong programming skills in Java/Python", "Data Structures & Algorithms", "System Design knowledge", "Problem-solving abilities"],
        process: "Online Assessment → Technical Interview (3 rounds) → HR Interview → Offer",
        location: "Bangalore, Hyderabad",
        benefits: "Health insurance, Stock options, Free meals, Learning & development budget"
      }
    },
    {
      id: 2,
      name: "Microsoft",
      offers: 8,
      month: "October",
      ctc: "₹42 LPA",
      details: {
        description: "Microsoft visited for recruiting talented engineers for their Azure cloud platform and Office 365 suite development teams.",
        jobRoles: ["Software Development Engineer", "Cloud Solutions Architect"],
        requirements: ["C# or Java proficiency", "Cloud computing knowledge", "SDLC understanding", "Team collaboration skills"],
        process: "Coding Round → Technical Interview (2 rounds) → Managerial Round → HR Round",
        location: "Hyderabad, Pune",
        benefits: "Comprehensive healthcare, Flexible work arrangements, Professional development"
      }
    },
    {
      id: 3,
      name: "Amazon",
      offers: 15,
      month: "August",
      ctc: "₹38 LPA",
      details: {
        description: "Amazon recruited for multiple divisions including AWS, Prime Video, and e-commerce platform development.",
        jobRoles: ["Software Development Engineer", "DevOps Engineer", "Business Analyst"],
        requirements: ["Object-oriented programming", "Distributed systems knowledge", "Leadership principles alignment", "Customer-obsessed mindset"],
        process: "Online Test → Technical Interview (3 rounds) → Bar Raiser Round → HR Discussion",
        location: "Bangalore, Chennai",
        benefits: "Stock grants, Health coverage, Career advancement opportunities"
      }
    },
    {
      id: 4,
      name: "TCS",
      offers: 45,
      month: "November",
      ctc: "₹7.5 LPA",
      details: {
        description: "Tata Consultancy Services conducted mass recruitment for entry-level positions across various technology domains and client projects.",
        jobRoles: ["System Engineer", "Assistant System Engineer", "Digital Consultant"],
        requirements: ["Basic programming knowledge", "Good communication skills", "Willingness to learn", "Team player attitude"],
        process: "Online Aptitude Test → Technical Interview → HR Interview → Document Verification",
        location: "Multiple locations across India",
        benefits: "Training programs, Health insurance, Performance bonuses, Global exposure"
      }
    },
    {
      id: 5,
      name: "Infosys",
      offers: 38,
      month: "December",
      ctc: "₹9 LPA",
      details: {
        description: "Infosys recruited fresh graduates for their digital transformation projects and emerging technology initiatives.",
        jobRoles: ["Systems Engineer", "Specialist Programmer", "Digital Specialist Engineer"],
        requirements: ["Programming fundamentals", "Database knowledge", "Analytical thinking", "Adaptability to new technologies"],
        process: "Online Assessment → Technical Interview → HR Interview → Medical Check-up",
        location: "Pune, Bangalore, Hyderabad",
        benefits: "Comprehensive training, Healthcare benefits, Employee stock purchase plan"
      }
    },
    {
      id: 6,
      name: "Goldman Sachs",
      offers: 6,
      month: "September",
      ctc: "₹55 LPA",
      details: {
        description: "Goldman Sachs recruited for their technology division focusing on algorithmic trading and risk management systems.",
        jobRoles: ["Technology Analyst", "Quantitative Analyst", "Software Engineer"],
        requirements: ["Strong mathematical background", "C++ or Java expertise", "Financial markets knowledge", "Problem-solving skills"],
        process: "Online Coding Test → Technical Interview (4 rounds) → Behavioral Interview → Final Review",
        location: "Mumbai, Bangalore",
        benefits: "High compensation, Performance bonuses, Global career opportunities, Premium healthcare"
      }
    }
  ];

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companiesData;
    
    return companiesData.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.ctc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.details.jobRoles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, companiesData]);

  const toggleExpanded = (companyId: number) => {
    setExpandedRows(prev => {
      const newSet = new Set<number>();
      if (!prev.has(companyId)) {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const CompanyRow: React.FC<{ company: Company }> = ({ company }) => {
    const isExpanded = expandedRows.has(company.id);

    return (
      <>
        <tr 
          className={`${styles.companyRow} ${isExpanded ? styles.expanded : ''}`}
          onClick={() => toggleExpanded(company.id)}
        >
          <td>{company.id}</td>
          <td className={styles.companyName}>{company.name}</td>
          <td>
            <span className={styles.offersBadge}>{company.offers}</span>
          </td>
          <td>{company.month}</td>
          <td className={styles.ctcAmount}>{company.ctc}</td>
          <td>
            <span className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`}>
              ▼
            </span>
          </td>
        </tr>
        {isExpanded && (
          <tr>
            <td colSpan={6}>
              <div className={`${styles.companyDetails} ${styles.show}`}>
                <div className={styles.detailsContent}>
                  <div className={styles.detailSection}>
                    <div className={styles.detailTitle}>Company Overview</div>
                    <div className={styles.detailText}>{company.details.description}</div>
                  </div>
                  <div className={styles.detailSection}>
                    <div className={styles.detailTitle}>Job Roles</div>
                    <div className={styles.detailText}>
                      {company.details.jobRoles.map((role, index) => (
                        <span key={index} className={styles.skillTag}>{role}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.detailSection}>
                    <div className={styles.detailTitle}>Requirements</div>
                    <div className={styles.detailText}>
                      {company.details.requirements.map((req, index) => (
                        <span key={index} className={styles.skillTag}>{req}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.detailSection}>
                    <div className={styles.detailTitle}>Selection Process</div>
                    <div className={styles.detailText}>{company.details.process}</div>
                  </div>
                  <div className={styles.detailSection}>
                    <div className={styles.detailTitle}>Work Location</div>
                    <div className={styles.detailText}>{company.details.location}</div>
                  </div>
                  <div className={styles.detailSection}>
                    <div className={styles.detailTitle}>Benefits</div>
                    <div className={styles.detailText}>{company.details.benefits}</div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}></div>
        <h1 className={styles.title}>Placement Details</h1>
      </div>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          className={styles.searchBox}
          placeholder="Search for companies, job roles, or CTC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.placementTable}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Campus Placement Records</h2>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Company Name</th>
              <th>Offers</th>
              <th>Month</th>
              <th>CTC</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map(company => (
              <CompanyRow key={company.id} company={company} />
            ))}
          </tbody>
        </table>
        
        {filteredCompanies.length === 0 && (
          <div className={styles.noResults}>
            No companies found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementDetails;