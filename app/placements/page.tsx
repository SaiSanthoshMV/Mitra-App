import React from 'react'
import PlacementDetails from './PlacementDetails'
// import PlacementDetails from './PlacementDetails'

function page() {
  return (
    <div>
      <PlacementDetails />
    </div>
  )
}

export default page


/*

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Placement Details</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #ffffff;
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            gap: 12px;
        }

        .logo {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #4ade80, #22c55e);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo::before {
            content: '📊';
            font-size: 20px;
        }

        .title {
            font-size: 32px;
            font-weight: 600;
            color: #ffffff;
        }

        .search-container {
            margin-bottom: 30px;
        }

        .search-box {
            width: 100%;
            max-width: 500px;
            background: #2a2a2a;
            border: 1px solid #404040;
            border-radius: 12px;
            padding: 15px 20px;
            font-size: 16px;
            color: #ffffff;
            transition: all 0.3s ease;
        }

        .search-box:focus {
            outline: none;
            border-color: #4ade80;
            box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
        }

        .search-box::placeholder {
            color: #888;
        }

        .placement-table {
            background: #242424;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .table-header {
            background: linear-gradient(135deg, #2a2a2a, #1f1f1f);
            padding: 20px;
            border-bottom: 1px solid #404040;
        }

        .table-title {
            font-size: 24px;
            font-weight: 600;
            color: #ffffff;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #2a2a2a;
            padding: 15px 20px;
            text-align: left;
            font-weight: 600;
            color: #ffffff;
            border-bottom: 1px solid #404040;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .company-row {
            background: #1f1f1f;
            border-bottom: 1px solid #404040;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }

        .company-row:hover {
            background: #2a2a2a;
            transform: translateX(5px);
        }

        .company-row.expanded {
            background: #2d2d2d;
        }

        .company-row td {
            padding: 18px 20px;
            color: #e5e5e5;
            font-size: 15px;
        }

        .company-name {
            font-weight: 600;
            color: #4ade80;
        }

        .offers-badge {
            background: #22c55e;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }

        .ctc-amount {
            font-weight: 600;
            color: #fbbf24;
        }

        .expand-icon {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            transition: transform 0.3s ease;
            color: #888;
        }

        .company-row.expanded .expand-icon {
            transform: translateY(-50%) rotate(180deg);
        }

        .company-details {
            display: none;
            background: #1a1a1a;
            border-top: 1px solid #404040;
        }

        .company-details.show {
            display: block;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                max-height: 0;
            }
            to {
                opacity: 1;
                max-height: 500px;
            }
        }

        .details-content {
            padding: 25px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
        }

        .detail-section {
            background: #242424;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #4ade80;
        }

        .detail-title {
            font-size: 16px;
            font-weight: 600;
            color: #4ade80;
            margin-bottom: 12px;
        }

        .detail-text {
            color: #d1d5db;
            line-height: 1.6;
            font-size: 14px;
        }

        .skill-tag {
            display: inline-block;
            background: #374151;
            color: #d1d5db;
            padding: 6px 12px;
            border-radius: 6px;
            margin: 4px;
            font-size: 12px;
        }

        .no-results {
            text-align: center;
            padding: 50px 20px;
            color: #888;
            font-size: 18px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            table {
                font-size: 14px;
            }
            
            th, td {
                padding: 12px 15px;
            }
            
            .details-content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo"></div>
            <h1 class="title">Placement Details</h1>
        </div>

        <div class="search-container">
            <input type="text" id="searchInput" class="search-box" placeholder="Search for companies, job roles, or CTC...">
        </div>

        <div class="placement-table">
            <div class="table-header">
                <h2 class="table-title">Campus Placement Records</h2>
            </div>
            
            <table>
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
                <tbody id="tableBody">
                    <!-- Company rows will be populated by JavaScript -->
                </tbody>
            </table>
            <div id="noResults" class="no-results" style="display: none;">
                No companies found matching your search criteria.
            </div>
        </div>
    </div>

    <script>
        const companiesData = [
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

        function renderTable(companies = companiesData) {
            const tableBody = document.getElementById('tableBody');
            const noResults = document.getElementById('noResults');
            
            if (companies.length === 0) {
                tableBody.innerHTML = '';
                noResults.style.display = 'block';
                return;
            }
            
            noResults.style.display = 'none';
            tableBody.innerHTML = '';
            
            companies.forEach(company => {
                const row = document.createElement('tr');
                row.className = 'company-row';
                row.innerHTML = `
                    <td>${company.id}</td>
                    <td class="company-name">${company.name}</td>
                    <td><span class="offers-badge">${company.offers}</span></td>
                    <td>${company.month}</td>
                    <td class="ctc-amount">${company.ctc}</td>
                    <td><span class="expand-icon">▼</span></td>
                `;
                
                const detailsRow = document.createElement('tr');
                detailsRow.innerHTML = `
                    <td colspan="6">
                        <div class="company-details">
                            <div class="details-content">
                                <div class="detail-section">
                                    <div class="detail-title">Company Overview</div>
                                    <div class="detail-text">${company.details.description}</div>
                                </div>
                                <div class="detail-section">
                                    <div class="detail-title">Job Roles</div>
                                    <div class="detail-text">
                                        ${company.details.jobRoles.map(role => `<span class="skill-tag">${role}</span>`).join('')}
                                    </div>
                                </div>
                                <div class="detail-section">
                                    <div class="detail-title">Requirements</div>
                                    <div class="detail-text">
                                        ${company.details.requirements.map(req => `<span class="skill-tag">${req}</span>`).join('')}
                                    </div>
                                </div>
                                <div class="detail-section">
                                    <div class="detail-title">Selection Process</div>
                                    <div class="detail-text">${company.details.process}</div>
                                </div>
                                <div class="detail-section">
                                    <div class="detail-title">Work Location</div>
                                    <div class="detail-text">${company.details.location}</div>
                                </div>
                                <div class="detail-section">
                                    <div class="detail-title">Benefits</div>
                                    <div class="detail-text">${company.details.benefits}</div>
                                </div>
                            </div>
                        </div>
                    </td>
                `;
                
                row.addEventListener('click', () => {
                    const details = detailsRow.querySelector('.company-details');
                    const isExpanded = row.classList.contains('expanded');
                    
                    // Close all other expanded rows
                    document.querySelectorAll('.company-row.expanded').forEach(expandedRow => {
                        if (expandedRow !== row) {
                            expandedRow.classList.remove('expanded');
                            expandedRow.nextElementSibling.querySelector('.company-details').classList.remove('show');
                        }
                    });
                    
                    if (isExpanded) {
                        row.classList.remove('expanded');
                        details.classList.remove('show');
                    } else {
                        row.classList.add('expanded');
                        details.classList.add('show');
                    }
                });
                
                tableBody.appendChild(row);
                tableBody.appendChild(detailsRow);
            });
        }

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredCompanies = companiesData.filter(company => 
                company.name.toLowerCase().includes(searchTerm) ||
                company.month.toLowerCase().includes(searchTerm) ||
                company.ctc.toLowerCase().includes(searchTerm) ||
                company.details.jobRoles.some(role => role.toLowerCase().includes(searchTerm))
            );
            renderTable(filteredCompanies);
        });

        // Initialize table
        renderTable();
    </script>
</body>
</html>

*/