import React, { useState, useEffect } from "react";
import Select from "react-select";
import { apiRequest } from "../utils/api";

const SelectDropdown = ({ name, apiEndpoint, selectedValue, onChange, multiple = false, options = [] }) => {
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [loading, setLoading] = useState(!!apiEndpoint);
  const token = localStorage.getItem("token");
  // console.log("Selected value = ", selectedValue);
  useEffect(() => {
    if (!apiEndpoint) return; // If no API, skip fetching

    const fetchOptions = async () => {
      try {
        const response = await apiRequest("GET", apiEndpoint, {}, {
          Authorization: `Bearer ${token}`,
        });

        if (response.data?.status) {
          const formattedOptions = response.data.data.map((option) => ({
            value: option.id,
            label: option.name,
          }));         
          setDynamicOptions(formattedOptions);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiEndpoint]);

  // Merge static and dynamic options
  const allOptions = [...options, ...dynamicOptions];
  const handleSelectChange = (selected) => {
    if (multiple) {
      onChange({ target: { name, value: selected ? selected.map((s) => s.value) : [] } });
    } else {
      onChange({ target: { name, value: selected ? selected.value : "" } });
    }    
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Select
          name={name}
          options={allOptions}
          value={            
            multiple
              ? allOptions.filter((opt) => Array.isArray(selectedValue) && selectedValue.includes(opt.value))
              : allOptions.find((opt) => opt.value === selectedValue) || null
          }
          onChange={handleSelectChange}
          isMulti={multiple}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      )}
    </div>
  );
};

export default SelectDropdown;
