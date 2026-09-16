import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import HeaderNav from "./Common/HeaderNav";
import HomePage from "./Homemain/Homepage";
import History from "./Aboutus/History";
import Listofprincipal from "./Aboutus/Listofprincipal";
import CoursesOffered from "./Academics/CoursesOffered";
import Nss from "./Cells/Nss";
import Yrc from "./Cells/Yrc";
import Rrc from "./Cells/Rrc";
import Ccc from "./Cells/Ccc";
import Pta from "./Cells/Pta";
import Osa from "./Cells/Osa";
import ContactUs from "./Contact/Contactus";
import ScholarshipNodalOfficers from "./Cells/ScholarshipNodalOfficers";
import NaanMudhalvanScheme from "./Cells/NaanMudhalvanScheme";
import NonTeachingFaculty from "./Administration/NonTeachingFaculty";
import InnovativePractices from "./Aboutus/InnovativePractices";
import StudentSupportProgression from "./Aboutus/StudentSupportProgression";
import TamilDepartment from "./Academics/Department/Arts/TamilDepartment";
import EnglishDepartment from "./Academics/Department/Arts/EnglishDepartment";
import HistoryDepartment from "./Academics/Department/Arts/HistoryDepartment";
import MathematicsDepartment from "./Academics/Department/Science/MathematicsDepartment";
import ComputerScienceDepartment from "./Academics/Department/Science/ComputerScienceDepartment";
import PhysicsDepartment from "./Academics/Department/Science/PhysicsDepartment";
import CommerceDepartment from "./Academics/Department/Commerce/CommerceDepartment";
import BusinessAdministrationDepartment from "./Academics/Department/Buisness/BusinessAdministrationDepartment";
import Login from "./Login";
import Dashboard from "./UploadModules/Dashboard";
import Uploadevent from "./UploadModules/Uploadevent";
import Addstaff from "./UploadModules/Addstaff";
import Uploadcells from "./UploadModules/Uploadcells";
import Uploadcourse from "./UploadModules/Uploadcourse";
import Uploadsyllabus from "./UploadModules/Uploadsyllabus";
import TeachingLearningEvaluation from "./Teaching/TeachingLearningEvaluation";
import Gallery from "./Gallery/Gallery";
import NotificationCircular from "./Examinations/NotificationCircular";
import CourseCompletion from "./Examinations/CourseCompletion";
import Staff from "./Examinations/StaffList";
import Admissiondetails from "./Aboutus/Admissiondetails";
import ForgotPassword from "./Forgotpassword";
import VisionMission from "./Aboutus/VisionMission";
import Event from "./Examinations/Event";
import Circular from "./Examinations/Circular";
import GalleryPage from "./UploadModules/GalleryPage";
import NotificationPage from "./UploadModules/NotificationPage";
import CircularPage from "./UploadModules/CircularPage";
import AcademicYears from "./UploadModules/AcademicYears";
import SubjectAllocationPage from "./UploadModules/SubjectAllocationPage";
import SubjectPage from "./UploadModules/SubjectPage";
import NewCoursePage from "./UploadModules/NewCoursePage";
import DepartmentPage from "./UploadModules/DepartmentPage";
import Addprincipal from "./UploadModules/Addprincipal";
import Commite from "./Cells/Commite";
import Uploadcommite from "./UploadModules/Uploadcommite";
import Alliedphysics from "./Academics/Department/Alliedphysics/Alliedphysics";
import Academiccouncil from "./Administration/Academiccouncil";
import NaanMudhalvan from "./UploadModules/NaanMudhalvan";
import ScholarshipOfficers from "./UploadModules/ScholarshipOfficers";
import AcademicCalendars from "./UploadModules/AcademicCalendars";
import ScholarshipOfficerGroups from "./UploadModules/ScholarshipOfficerGroups";
import AcademicCalendarDetail from "./Academics/Gallery/AcademicCalendarDetail";
import Physicaleducation from "./Academics/Department/Physicaleducation/Physicaleducation";
import ResetPassword from "./Resetpassword";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  // Hide the public site navbar on every dashboard/admin page — those use
  // the LIDER sidebar layout instead.
  const hideHeaderNav = location.pathname.startsWith("/dashboard");

  return (
    <div className="App">
      {!hideHeaderNav && <HeaderNav />}
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Forgotpassword" element={<ForgotPassword />} />
        <Route path="/about/VisionMission" element={<VisionMission />} />
          <Route path="/Resetpassword" element={<ResetPassword />} />
        {/* Admin / Upload Modules — Dashboard is now a persistent shell.
              Everything nested here renders inside its <Outlet />, so the
              sidebar stays on screen no matter which item is clicked. */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="Uploadevent" element={<Uploadevent />} />
          <Route path="Addstaff" element={<Addstaff />} />
          <Route path="Uploadcells" element={<Uploadcells />} />
          <Route path="Uploadcourse" element={<Uploadcourse />} />
          <Route path="Uploadsyllabus" element={<Uploadsyllabus />} />
          <Route path="Uploadgallery" element={<GalleryPage />} />
          <Route path="Uploadnotification" element={<NotificationPage />} />
          <Route path="Uploadcircular" element={<CircularPage />} />
          <Route path="Uploadacademicyear" element={<AcademicYears />} />
          <Route path="Uploadcommite" element={<Uploadcommite />} />
          <Route path="Uploaddepartments" element={<DepartmentPage />} />
          <Route path="NewCoursePage" element={<NewCoursePage />} />
          <Route path="Uploadsubject" element={<SubjectPage />} />
          <Route path="Subjectallocate" element={<SubjectAllocationPage />} />
          <Route path="Addprincipal" element={<Addprincipal />} />
          {/* <Route path="Uploadacademicyear" element={<AcademicYears />} /> */}

          <Route path="NaanMudhalvan" element={<NaanMudhalvan />} />
          <Route
            path="ScholarShipCategory"
            element={<ScholarshipOfficerGroups />}
          />
          <Route path="ScholarShipOfficers" element={<ScholarshipOfficers />} />
          <Route path="AcademicGallery" element={<AcademicCalendars />} />
        </Route>

        <Route
          path="/academics/academic-calendar/:yearId"
          element={<AcademicCalendarDetail />}
        />

        <Route path="/about/history" element={<History />} />
        <Route path="/about/listofprincipal" element={<Listofprincipal />} />
        <Route path="/academics/CoursesOffered" element={<CoursesOffered />} />
        <Route path="/Cells/Nss" element={<Nss />} />
        <Route path="/cells/Yrc" element={<Yrc />} />
        <Route path="/cells/Rrc" element={<Rrc />} />
        <Route path="/cells/Ccc" element={<Ccc />} />
        <Route path="/cells/Pta" element={<Pta />} />
        <Route path="/cells/Osa" element={<Osa />} />
        <Route path="/cells/Commite" element={<Commite />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/Cells/ScholarshipNodalOfficers"
          element={<ScholarshipNodalOfficers />}
        />
        <Route
          path="/administration/Academiccouncil"
          element={<Academiccouncil />}
        />
        <Route
          path="/Cells/NaanMudhalvanScheme"
          element={<NaanMudhalvanScheme />}
        />
        <Route
          path="/administration/non-teaching"
          element={<NonTeachingFaculty />}
        />
        <Route
          path="/about/innovative-practices"
          element={<InnovativePractices />}
        />
        <Route path="/Examinations/Event" element={<Event />} />
        <Route
          path="/about/student-support"
          element={<StudentSupportProgression />}
        />
        <Route
          path="/academics/departments/tamil"
          element={<TamilDepartment />}
        />
        <Route
          path="/academics/departments/english"
          element={<EnglishDepartment />}
        />
        <Route
          path="/academics/departments/history"
          element={<HistoryDepartment />}
        />
        <Route
          path="/academics/departments/Alliedphysics"
          element={<Alliedphysics />}
        />
        <Route
          path="/academics/departments/Physicaleducation"
          element={<Physicaleducation />}
        />
        <Route
          path="/academics/departments/mathematics"
          element={<MathematicsDepartment />}
        />
        <Route
          path="/academics/departments/computer-science"
          element={<ComputerScienceDepartment />}
        />
        <Route
          path="/academics/departments/physics"
          element={<PhysicsDepartment />}
        />
        <Route
          path="/academics/departments/commerce"
          element={<CommerceDepartment />}
        />
        <Route
          path="/academics/departments/bba"
          element={<BusinessAdministrationDepartment />}
        />
        <Route
          path="/academics/teaching-learning"
          element={<TeachingLearningEvaluation />}
        />
        <Route path="/gallery" element={<Gallery />} />
       <Route
  path="/examination/notification-circular"
  element={<NotificationCircular />}
/>
        <Route path="/examinations/circular" element={<Circular />} />
        <Route
          path="/examination/course-completion-analysis"
          element={<CourseCompletion />}
        />
        <Route path="/examination/office-of-the-coe" element={<Staff />} />
        <Route path="/about/admissiondetails" element={<Admissiondetails />} />
        <Route path="/academics/gallery" element={<Gallery />} />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// Create a simple 404 page component
const NotFound = () => (
  <div
    style={{
      padding: "50px",
      textAlign: "center",
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default App;
