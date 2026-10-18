// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./routers/ProtectedRoute.jsx";
// import AuthPage from "./pages/AuthPage";
// import Navbar from "./Component/navbar.jsx";

// import Home from "./Component/Home";
// import Assessment from "./Component/Assessment";
// import Musculoskeletal from "./Component/Musculoskeletal";
// import Obesity from "./Component/Obesity";
// import Pilates from "./Component/Pilates";
// import TreatmentPlan from "./Component/TreatmentPlan";
// import Client from "./Component/Client";
// import Reports from "./Component/Reports";
// import Bill from "./Component/Bill";
// import Expenses from "./Component/Expenses";
// import Inventory from "./Component/Inventory";
// import Salary from "./Component/Salary";
// import Rent from "./Component/Rent";
// import Total from "./Component/Total";
// import Attendence from "./Component/Attendence";
// import PatientDetails from "./Component/PatientDetails.jsx";
// import EmployeeDetails from "./Component/EmployeeDetails.jsx";
// import { useState } from "react";
// import AllEnquiry from "./Component/AllEnquiry.jsx";
// import AllEmployee from "./Component/AllEmployee.jsx";
// import ProtectedRouteAdmin from "./routers/ProtectedRouteAdmin.jsx";
// import CreateBill from "./Component/CreateBill.jsx";
// import PatientAttendancePage from "./Component/PatientAttendancePage.jsx";
// import Enquiry from "./Component/Enquiry.jsx";
// import Newbill from "./Component/Newbill.jsx"
// function App() {
//   const [role, setRole] = useState("employee");
//   return (
//     <Router>
//       <Navbar />

//       <Routes>

    

//         {/* PROTECTED */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Home role={role} />
//             </ProtectedRoute>
//           }
//         />



        
//         <Route
//           path="/allEnquiry"
//           element={
//             <ProtectedRoute>
//               <AllEnquiry />
//             </ProtectedRoute>
//           }
          
//         />

// <Route
//           path="/Newbill"
//           element={
//             <ProtectedRoute>
//               <Newbill/>
//             </ProtectedRoute>
//           }
          
//         />
//                 <Route
//           path="/Enquiry"
//           element={
//             <ProtectedRoute>
//               <Enquiry />
//             </ProtectedRoute>
//           }
          
//         />
//         <Route
//           path="/allEmployee"
//           element={
//             <ProtectedRoute>
//               <ProtectedRouteAdmin>
//                 <AllEmployee />
//               </ProtectedRouteAdmin>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/assessment"
//           element={
//             <ProtectedRoute>
//               <Assessment />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/musculoskeletal"
//           element={
//             <ProtectedRoute>
//               <Musculoskeletal />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/obesity"
//           element={
//             <ProtectedRoute>
//               <Obesity />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/pilates"
//           element={
//             <ProtectedRoute>
//               <Pilates />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/treatmentPlan"
//           element={
//             <ProtectedRoute>
//               <TreatmentPlan />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/client"
//           element={
//             <ProtectedRoute>
//               <Client />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/reports"
//           element={
//             <ProtectedRoute>
//               <Reports />
//             </ProtectedRoute>
//           }
//         >
//           <Route
//             index
//             element={
//               <div className="text-gray-500 text-lg">
//                 Select a report to view details
//               </div>
//             }
//           />
//           <Route
//             path="bill"
//             element={
//               <ProtectedRoute>
//                 <Bill />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="expenses"
//             element={
//               <ProtectedRoute>
//                 <Expenses />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="inventory"
//             element={
//               <ProtectedRoute>
//                 <Inventory />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="salary"
//             element={
//               <ProtectedRoute>
//                 <Salary />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="rent"
//             element={
//               <ProtectedRoute>
//                 <Rent />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="daily-attendance"
//             element={
//               <ProtectedRoute>
//                 <PatientAttendancePage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="total"
//             element={
//               <ProtectedRoute>
//                 <Total />
//               </ProtectedRoute>
//             }
//           />
//         </Route>
//         <Route
//           path="/attendence"
//           element={
//             <ProtectedRoute>
//               <Attendence />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/PatientDetails/:id"
//           element={
//             <ProtectedRoute>
//               <PatientDetails />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/createBill"
//           element={
//             <ProtectedRoute>
//               <CreateBill />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/EmployeeDetails/:id"
//           element={
//             <ProtectedRoute>
//               <EmployeeDetails role={role} />
//             </ProtectedRoute>
//           }
//         />
// </Routes>
//     </Router>
//   );
// }

// export default App;




import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import ProtectedRoute from "./routers/ProtectedRoute.jsx";
import ProtectedRouteAdmin from "./routers/ProtectedRouteAdmin.jsx";

import AuthPage from "./pages/AuthPage";
import Navbar from "./Component/navbar.jsx";

import Home from "./Component/Home";
import Assessment from "./Component/Assessment";
import Musculoskeletal from "./Component/Musculoskeletal";
import Obesity from "./Component/Obesity";
import Pilates from "./Component/Pilates";
import TreatmentPlan from "./Component/TreatmentPlan";
import Client from "./Component/Client";
import Reports from "./Component/Reports";
import Bill from "./Component/Bill";
import Expenses from "./Component/Expenses";
import Inventory from "./Component/Inventory";
import Salary from "./Component/Salary";
import Rent from "./Component/Rent";
import Total from "./Component/Total";
import Attendence from "./Component/Attendence";
import PatientDetails from "./Component/PatientDetails.jsx";
import EmployeeDetails from "./Component/EmployeeDetails.jsx";
import AllEnquiry from "./Component/AllEnquiry.jsx";
import AllEmployee from "./Component/AllEmployee.jsx";
import CreateBill from "./Component/CreateBill.jsx";
import PatientAttendancePage from "./Component/PatientAttendancePage.jsx";
import Enquiry from "./Component/Enquiry.jsx";
import Newbill from "./Component/Newbill.jsx";

function App() {
  const [role, setRole] = useState("employee");

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Authentication page */}
        <Route
  path="/auth"
  element={<AuthPage setRole={setRole} />}
/>

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home role={role} />
            </ProtectedRoute>
          }
        />

        {/* Enquiries */}
        <Route
          path="/allEnquiry"
          element={
            <ProtectedRoute>
              <AllEnquiry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Newbill"
          element={
            <ProtectedRoute>
              <Newbill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Enquiry"
          element={
            <ProtectedRoute>
              <Enquiry />
            </ProtectedRoute>
          }
        />

        {/* Employee management - admin only */}
        <Route
          path="/allEmployee"
          element={
            <ProtectedRoute>
              <ProtectedRouteAdmin>
                <AllEmployee />
              </ProtectedRouteAdmin>
            </ProtectedRoute>
          }
        />

        {/* Assessment */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/musculoskeletal"
          element={
            <ProtectedRoute>
              <Musculoskeletal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/obesity"
          element={
            <ProtectedRoute>
              <Obesity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pilates"
          element={
            <ProtectedRoute>
              <Pilates />
            </ProtectedRoute>
          }
        />

        {/* Treatment and client management */}
        <Route
          path="/treatmentPlan"
          element={
            <ProtectedRoute>
              <TreatmentPlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <Client />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <div className="text-gray-500 text-lg">
                Select a report to view details
              </div>
            }
          />

          <Route
            path="bill"
            element={
              <ProtectedRoute>
                <Bill />
              </ProtectedRoute>
            }
          />

          <Route
            path="expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />

          <Route
            path="inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />

          <Route
            path="salary"
            element={
              <ProtectedRoute>
                <Salary />
              </ProtectedRoute>
            }
          />

          <Route
            path="rent"
            element={
              <ProtectedRoute>
                <Rent />
              </ProtectedRoute>
            }
          />

          <Route
            path="daily-attendance"
            element={
              <ProtectedRoute>
                <PatientAttendancePage />
              </ProtectedRoute>
            }
          />




          <Route
            path="total"
            element={
              <ProtectedRoute>
                <Total />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Attendance */}
        <Route
          path="/attendence"
          element={
            <ProtectedRoute>
              <Attendence />
            </ProtectedRoute>
          }
        />

        {/* Patient details */}
        <Route
          path="/PatientDetails/:id"
          element={
            <ProtectedRoute>
              <PatientDetails />
            </ProtectedRoute>
          }
        />

        {/* Billing */}
        <Route
          path="/createBill"
          element={
            <ProtectedRoute>
              <CreateBill />
            </ProtectedRoute>
          }
        />

        {/* Employee details */}
        <Route
          path="/EmployeeDetails/:id"
          element={
            <ProtectedRoute>
              <EmployeeDetails role={role} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

