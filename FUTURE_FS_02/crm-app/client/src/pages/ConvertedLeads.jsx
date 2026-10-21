import LeadStatusPage from "../components/LeadStatusPage";

const ConvertedLeads = () => {
  return (
    <LeadStatusPage
      title="Converted Leads"
      description="Leads that have successfully become clients."
      endpoint="converted"
    />
  );
};

export default ConvertedLeads;