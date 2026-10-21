import LeadStatusPage from "../components/LeadStatusPage";

const ContactedLeads = () => {
  return (
    <LeadStatusPage
      title="Contacted Leads"
      description="Leads that you have already contacted."
      endpoint="contacted"
    />
  );
};

export default ContactedLeads;