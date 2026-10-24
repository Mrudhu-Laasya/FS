import LeadStatusPage from "../components/LeadStatusPage";

const LostLeads = () => {
  return (
    <LeadStatusPage
      title="Lost Leads"
      description="Leads that did not convert into clients."
      endpoint="lost"
    />
  );
};

export default LostLeads;
