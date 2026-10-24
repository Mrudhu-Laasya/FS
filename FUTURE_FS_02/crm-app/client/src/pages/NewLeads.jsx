import LeadStatusPage from "../components/LeadStatusPage";

const NewLeads = () => {
  return (
    <LeadStatusPage
      title="New Leads"
      description="Leads that are waiting for your first response."
      endpoint="new"
    />
  );
};

export default NewLeads;
