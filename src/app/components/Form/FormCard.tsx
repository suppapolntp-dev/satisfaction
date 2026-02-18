import { BtnCreate } from "../UI/Button";
import { InputField, SelectField } from "./FormInput";

export function UserForm() {
  return (
    <div className="bg-white rounded-4 p-4 border shadow-sm">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-3"
             style={{ width: "48px", height: "48px", color: "#10b981" }}>
          <i className="bi bi-person-plus-fill fs-4"></i>
        </div>
        <div>
          <h3 className="mb-0 fw-bold h6 text-dark">Create New User</h3>
          <p className="mb-0 text-muted small">Specify account details and branch access</p>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        <div className="row g-3">
          <InputField label="User ID" placeholder="Enter username" />
          <InputField label="Password" type="password" placeholder="••••••••" />
          <InputField label="Confirm Password" type="password" placeholder="••••••••" />
        </div>

        <div className="row g-3">
          <SelectField label="Brand">
            <option value="brand1">Brand Name A</option>
          </SelectField>
          <SelectField label="Branch">
            <option value="branch1">Main Branch</option>
          </SelectField>
          <SelectField label="User Group">
            <option value="1">User</option>
            <option value="2">Operation</option>
          </SelectField>
        </div>
      </div>

      {/* Button Section */}
      <div className="mt-4 pt-2 border-top d-flex justify-content-end">
        <BtnCreate />
      </div>
    </div>
  );
}

export function GroupForm() {
  return (
    <div className="bg-white rounded-4 p-4 border shadow-sm">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-3"
             style={{ width: "48px", height: "48px", color: "#10b981" }}>
          <i className="bi bi-collection-fill fs-4"></i>
        </div>
        <div>
          <h3 className="mb-0 fw-bold h6 text-dark">Create New Group</h3>
          <p className="mb-0 text-muted small">Define group roles and branch permissions</p>
        </div>
      </div>

      <div className="row g-3">
        <InputField 
          label="Group Name" 
          placeholder="e.g. Operation, Manager" 
        />
        
        {/* คำอธิบายใช้พื้นที่ที่เหลือ 8 ส่วน (col-md-8) ตามที่คุณต้องการ */}
        <div className="col-md-8 ">
          <InputField 
            label="Description" 
            placeholder="What is this group responsible for?" 
          />
        </div>
      </div>

      <div className="mt-4 pt-2 border-top d-flex justify-content-end">
        <BtnCreate />
      </div>
    </div>
  );
}