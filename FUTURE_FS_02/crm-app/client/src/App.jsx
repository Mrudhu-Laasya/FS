import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactForm from "./pages/ContactForm";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadsPage from "./pages/LeadsPage";
import NewLeads from "./pages/NewLeads";
import ContactedLeads from "./pages/ContactedLeads";
import ConvertedLeads from "./pages/ConvertedLeads";
import LostLeads from "./pages/LostLeads";
import LeadDetails from "./pages/LeadDetails";
import Activity from "./pages/Activity";
import FollowUps from "./pages/FollowUps";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ContactForm />} />
          <Route path="/contact" element={<ContactForm />} />

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/leads" element={<LeadsPage />} />

          <Route path="/leads/new" element={<NewLeads />} />

          <Route path="/leads/contacted" element={<ContactedLeads />} />

          <Route path="/leads/converted" element={<ConvertedLeads />} />

          <Route path="/leads/lost" element={<LostLeads />} />

          <Route path="/leads/:id" element={<LeadDetails />} />

          <Route path="/activity" element={<Activity />} />

          <Route path="/follow-ups" element={<FollowUps />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
