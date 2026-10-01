import { useState } from "react";
import AddButton from "../components/AddButton";
import useEdit from "../context/useEdit";
export default function WorkExperienceForm({
  initialData,
  onUpdate,
  onCancel,
}) {
  const { isEditValid } = useEdit();
  const [formData, setFormData] = useState({
    organization: initialData.organization || "",
    roles: initialData.roles || [
      {
        position: "",
        startDate: "",
        endDate: "",
        responsibilities: [],
        isPromoted: false,
      },
    ],
  });

  // -----------------------------
  // Organization
  // -----------------------------

  const handleOrganizationChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      organization: e.target.value,
    }));
  };

  // -----------------------------
  // Roles
  // -----------------------------

  const handleRoleChange = (roleIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.map((role, index) =>
        index === roleIndex
          ? {
              ...role,
              [field]: value,
            }
          : role,
      ),
    }));
  };

  const addRole = () => {
    setFormData((prev) => ({
      ...prev,
      roles: [
        ...prev.roles,
        {
          position: "",
          startDate: "",
          endDate: "",
          responsibilities: [],
          isPromoted: false,
        },
      ],
    }));
  };

  const deleteRole = (roleIndex) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, index) => index !== roleIndex),
    }));
  };

  // -----------------------------
  // Responsibilities
  // -----------------------------

  const handleResponsibilityChange = (
    roleIndex,
    responsibilityIndex,
    value,
  ) => {
    setFormData((prev) => ({
      ...prev,

      roles: prev.roles.map((role, index) => {
        if (index !== roleIndex) {
          return role;
        }

        const updatedResponsibilities = [...role.responsibilities];

        updatedResponsibilities[responsibilityIndex] = value;

        return {
          ...role,
          responsibilities: updatedResponsibilities,
        };
      }),
    }));
  };

  const addResponsibility = (roleIndex) => {
    setFormData((prev) => ({
      ...prev,

      roles: prev.roles.map((role, index) =>
        index === roleIndex
          ? {
              ...role,
              responsibilities: [...role.responsibilities, ""],
            }
          : role,
      ),
    }));
  };

  const deleteResponsibility = (roleIndex, responsibilityIndex) => {
    setFormData((prev) => ({
      ...prev,

      roles: prev.roles.map((role, index) =>
        index === roleIndex
          ? {
              ...role,
              responsibilities: role.responsibilities.filter(
                (_, index) => index !== responsibilityIndex,
              ),
            }
          : role,
      ),
    }));
  };

  // -----------------------------
  // Submit
  // -----------------------------

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="role-edit-form">
      {/* Organization */}

      <div className="form-field">
        <label>Organization</label>

        <input
          type="text"
          name="organization"
          value={formData.organization}
          onChange={handleOrganizationChange}
          placeholder="Enter organization"
        />
      </div>

      {/* Roles */}

      {formData.roles.map((role, roleIndex) => (
        <div className="role-block" key={roleIndex}>
          <div className="role-header">
            <span className="role-title">ROLE {roleIndex + 1}</span>

            {isEditValid && formData.roles.length > 1 && (
              <button
                type="button"
                className="x-delete"
                onClick={() => deleteRole(roleIndex)}
              >
                ×
              </button>
            )}
          </div>

          {/* Position */}

          <div className="form-field">
            <label>Position</label>

            <input
              type="text"
              value={role.position}
              onChange={(e) =>
                handleRoleChange(roleIndex, "position", e.target.value)
              }
              placeholder="Software Engineer II"
            />
          </div>

          {/* Start Date */}

          <div className="form-field">
            <label>Start Date</label>

            <input
              type="text"
              value={role.startDate}
              onChange={(e) =>
                handleRoleChange(roleIndex, "startDate", e.target.value)
              }
              placeholder="Dec 2025"
            />
          </div>

          {/* End Date */}

          <div className="form-field">
            <label>End Date</label>

            <input
              type="text"
              value={role.endDate}
              onChange={(e) =>
                handleRoleChange(roleIndex, "endDate", e.target.value)
              }
              placeholder="Jun 2026"
            />
          </div>

          {/* Responsibilities */}

          <div className="form-field">
            <label>Responsibilities</label>

            {role.responsibilities.map(
              (responsibility, responsibilityIndex) => (
                <div className="responsibility-input" key={responsibilityIndex}>
                  <textarea
                    value={responsibility}
                    onChange={(e) =>
                      handleResponsibilityChange(
                        roleIndex,
                        responsibilityIndex,
                        e.target.value,
                      )
                    }
                    placeholder={`Responsibility ${responsibilityIndex + 1}`}
                  />

                  {isEditValid && (
                    <button
                      type="button"
                      className="x-delete"
                      onClick={() =>
                        deleteResponsibility(roleIndex, responsibilityIndex)
                      }
                    >
                      ×
                    </button>
                  )}
                </div>
              ),
            )}

            {isEditValid && (
              <AddButton onClick={() => addResponsibility(roleIndex)}>
                Add Responsibility
              </AddButton>
            )}
          </div>

          {/* Promoted */}

          <div className="promoted-field">
            <label className="promoted-label">
              <input
                type="checkbox"
                checked={role.isPromoted}
                onChange={(e) =>
                  handleRoleChange(roleIndex, "isPromoted", e.target.checked)
                }
              />
              Promoted
            </label>
          </div>
        </div>
      ))}

      {/* Add Role */}

      <div className="add-role-container">
        {isEditValid && <AddButton onClick={addRole}>Add Role</AddButton>}
      </div>

      {/* Form Actions */}

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="update-button" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
}
