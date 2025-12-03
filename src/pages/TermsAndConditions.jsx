import React from "react";

const TermsAndConditions = () => {
  return (
    <>
    <section style={{marginTop:"100px",}} className="hero-banner position-relative">
          <img src="src/assets/images/background/5.png" alt="Coding workspace" className="hero-image" />
          <div className="hero-content container position-absolute top-50 start-50 translate-middle text-center text-white">
            <h1 className="display-4 fw-bold mb-4 fade-in">Terms & Conditions</h1>
            </div>
        </section>
    <div className="container my-5">
      <p><span class="s2"><b>Terms & Conditions</b> &ndash; The Code Helper</span></p>
      <p><b>Effective Date:</b> Aug 31, 2025</p>
      <p><b>Company Name:</b> The Code Helper</p>
      <p><b>Website:</b> [Insert Website URL]</p>
      <p><b>Contact Email:</b> support@thecodehelper.com</p>

      <h4 class="mt-4 mb-3 text-uppercase">1. Introduction</h4>
      <p>By using The Code Helper platform (&ldquo;Platform&rdquo;), you agree to these Terms and Conditions. If you do not agree, do not use the Platform.</p>
      
      <h4 class="mt-4 mb-3 text-uppercase">2. Platform Role</h4>
      <div class="s6"><span class="s5">&bull; </span>The Code Helper is a <span class="s4">marketplace</span> connecting customers (&ldquo;Customers&rdquo;) with independent freelancers (&ldquo;Freelancers&rdquo;) for project-based work.</div>
      <div class="s6"><span class="s5">&bull; </span>We are <span class="s4">not a party</span> to any contracts or agreements between Customers and Freelancers.</div>
      <div class="s6"><span class="s5">&bull; </span>We do not guarantee the quality, legality, or outcome of Freelancer services or projects.</div>
      
      <h4 class="mt-4 mb-3 text-uppercase">3. Freelancer Status (Global)</h4>
      <div class="s6"><span class="s5">&bull; </span>Freelancers are <span class="s4">independent contractors</span>, not employees, partners, agents, or representatives of The Code Helper, regardless of where they are located.</div>
      <div class="s6"><span class="s5">&bull; </span>The Code Helper does <span class="s4">not provide benefits, insurance, or tax handling</span> for Freelancers.</div>
      <div class="s6"><span class="s5">&bull; </span>Freelancers are responsible for complying with their <span class="s4">own local laws</span> (tax, labor, and business regulations).</div>
      <div class="s6"><span class="s5">&bull; </span>Customers are also responsible for compliance with their local laws when hiring Freelancers globally.</div>
      
      <h4 class="mt-4 mb-3 text-uppercase">4. Pricing and Payments</h4>
      <div class="s6"><span class="s5">&bull; </span>The total cost displayed to the Customer includes:<br /><span class="s4">Freelancer Rate &times; Hours + 25% The Code Helper Commission + Stripe Fees</span>.</div>
      <div class="s6"><span class="s5">&bull; </span>Payments are processed via Stripe and held in escrow until project completion.</div>
      <div class="s6"><span class="s5">&bull; </span>Escrow funds do not accrue interest, and The Code Helper is <span class="s4">not a bank or financial institution</span>.</div>
     
      <h4 class="mt-4 mb-3 text-uppercase">5. Project Completion and Payout</h4>
      <div class="s6"><span class="s5">&bull; </span>Upon project completion, we release payment to the Freelancer equivalent to <span class="s4">Freelancer Rate &times; Hours</span>.</div>
      <div class="s6"><span class="s5">&bull; </span>The 25% commission and Stripe fees are retained and are <span class="s4">non-refundable</span>.</div>
      
      <h4 class="mt-4 mb-3 text-uppercase">6. Refunds and Cancellations</h4>
      <div class="s6"><span class="s5">&bull; </span>If a project is canceled:</div>
      <div class="s8"><span class="s7">o </span>Refunds are issued for unused funds, <span class="s4">minus Stripe fees and a 10% cancellation fee</span>.</div>
      <div class="s6"><span class="s5">&bull; </span>Refund decisions are solely at The Code Helper&rsquo;s discretion.</div>
      
      <h4 class="mt-4 mb-3 text-uppercase">7. User Responsibilities</h4>
      <div class="s6"><span class="s5">&bull; </span>Customers must provide accurate project details and review completed work promptly.</div>
      <div class="s6"><span class="s5">&bull; </span>Freelancers must deliver services as agreed in their proposal.</div>
      <div class="s6"><span class="s5">&bull; </span>All communications should occur <span class="s4">within the Platform&rsquo;s chat</span> for protection in disputes.</div>
      
      <h4 class="mt-4 mb-3 text-uppercase">8. Access to Customer Applications</h4>
      <div class="s6"><span class="s5">&bull; </span>Customers may grant Freelancers access to their systems or environments to complete projects.</div>
      <div class="s6"><span class="s5">&bull; </span>The Code Helper is <span class="s4">not responsible</span> for managing or securing this access.</div>
      <div class="s6"><span class="s5">&bull; </span>Customers are responsible for controlling credentials and revoking access after completion.</div>
      <div class="s6"><span class="s5">&bull; </span>The Code Helper disclaims liability for misuse, breaches, or damages caused by such access.</div>
      
      <h4 class="mt-4 mb-3 text-uppercase">9. Confidentiality</h4>
      <div class="s6"><span class="s5">&bull; </span>Both Customers and Freelancers agree to keep all <span class="s4">non-public information</span> shared during the project confidential.</div>
      <div class="s6"><span class="s5">&bull; </span>Confidential information may not be disclosed to third parties or used for any purpose other than completing the project.</div>
      <div class="s6"><span class="s5">&bull; </span>The Code Helper is not responsible for confidentiality breaches between Customers and Freelancers.</div>
      
      <h4 class="mt-4 mb-3 text-uppercase">10. Account Suspension and Termination</h4>
      <div class="s6"><span class="s5">&bull; </span>The Code Helper may <span class="s4">suspend or terminate accounts</span> at its sole discretion, including for:</div>
      <div class="s8"><span class="s7">o </span>Violations of these Terms</div>
      <div class="s8"><span class="s7">o </span>Fraudulent, abusive, or illegal activity</div>
      <div class="s8"><span class="s7">o </span>Circumvention of platform fees or rules</div>
      <div class="s6"><span class="s5">&bull; </span>Suspension or termination may occur without prior notice, and funds may be withheld during investigation of disputes.</div>
      
      <h4 class="mt-4 mb-3 text-uppercase">11. Changes to Platform and Information</h4>
      <div class="s6"><span class="s5">&bull; </span>We may <span class="s4">modify platform features, fees, or policies</span> at any time without liability.</div>
      <div class="s6"><span class="s5">&bull; </span>Continued use of the Platform constitutes acceptance of updated Terms.</div>
       
      <h4 class="mt-4 mb-3 text-uppercase">12. Third-Party Platforms and Services</h4>
      <div class="s6"><span class="s5">&bull; </span>We use third-party services (e.g., Stripe) for payments and operations.</div>
      <div class="s6"><span class="s5">&bull; </span>We are not responsible for outages, errors, or policies of these services; users must comply with their terms.</div>
       
      <h4 class="mt-4 mb-3 text-uppercase">13. Dispute Resolution</h4>
      <div class="s6"><span class="s5">&bull; </span>Disputes must be reported to The Code Helper <span class="s4">within 7 days</span> of project completion or cancellation.</div>
      <div class="s6"><span class="s5">&bull; </span>We may mediate disputes but are <span class="s4">not obligated</span> to resolve them.</div>
      <div class="s6"><span class="s5">&bull; </span>Our decisions on refunds or payouts are <span class="s4">final</span>.</div>
 
      <h4 class="mt-4 mb-3 text-uppercase">14. Limitation of Liability</h4>
      <div class="s6"><span class="s5">&bull; </span>The Code Helper is not liable for indirect, incidental, or consequential damages, including lost profits.</div>
      <div class="s6"><span class="s5">&bull; </span>Our total liability is limited to <span class="s4">the commission earned</span> on the disputed project.</div>
 
      <h4 class="mt-4 mb-3 text-uppercase">15. Indemnification</h4>
      <div class="s6"><span class="s5">&bull; </span>Users agree to <span class="s4">indemnify and hold harmless The Code Helper</span> from claims, losses, or damages arising from their use of the Platform or violation of these Terms.</div>
 
      <h4 class="mt-4 mb-3 text-uppercase">16. No Employment or Agency</h4>
      <div class="s6"><span class="s5">&bull; </span>Using this Platform does <span class="s4">not create an employment, agency, or partnership relationship</span> between The Code Helper and any Customer or Freelancer.</div>
      <div class="s6"><span class="s5">&bull; </span>Freelancers <span class="s4">cannot represent themselves as employees</span> of The Code Helper in any jurisdiction.</div>
 
      <h4 class="mt-4 mb-3 text-uppercase">17. No Warranty</h4>
      <div class="s6"><span class="s5">&bull; </span>The Platform is provided <span class="s4">&ldquo;as is&rdquo; and &ldquo;as available&rdquo;</span> with no warranties of any kind.</div>
 
      <h4 class="mt-4 mb-3 text-uppercase">18. Governing Law</h4>
      <div class="s6"><span class="s5">&bull; </span>These Terms are governed by the laws of [Insert Country/State], without regard to conflict of law principles.</div>
    </div>
    </>
  );
};

export default TermsAndConditions;
